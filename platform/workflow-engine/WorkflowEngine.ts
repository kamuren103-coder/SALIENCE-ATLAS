import { ObservabilityEngine } from '../observability/Observability';
import { EventFabricEngine } from '../event-fabric/EventFabric';
import { generateShortId } from '../../src/core/shared/crypto';
import { WorkflowStore } from '../persistence';

export interface WorkflowDefinition {
  id: string;
  name: string;
  tenantId: string;
  steps: Array<{
    id: string;
    name: string;
    handler: (context: Record<string, any>) => Promise<any>;
    compensation?: (context: Record<string, any>) => Promise<any>;
    requiresApproval?: boolean;
    retryCount?: number;
  }>;
}

export interface WorkflowInstance {
  id: string;
  definitionId: string;
  tenantId: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'rolled_back';
  currentStepId: string;
  context: Record<string, any>;
  checkpoints: Array<{
    stepId: string;
    timestamp: string;
    output: any;
  }>;
  errors: string[];
}

export class WorkflowOrchestrationEngine {
  private static instance: WorkflowOrchestrationEngine;
  private definitions = new Map<string, WorkflowDefinition>();
  private activeInstances = new Map<string, WorkflowInstance>();

  private constructor() {}

  public static getInstance(): WorkflowOrchestrationEngine {
    if (!WorkflowOrchestrationEngine.instance) {
      WorkflowOrchestrationEngine.instance = new WorkflowOrchestrationEngine();
    }
    return WorkflowOrchestrationEngine.instance;
  }

  public registerDefinition(def: WorkflowDefinition): void {
    this.definitions.set(def.id, def);
    // Persist workflow definition (serialize steps without handler functions)
    WorkflowStore.saveDefinition({
      definitionId: def.id,
      name: def.name,
      nodes: def.steps.map(s => ({ id: s.id, name: s.name, requiresApproval: s.requiresApproval })),
      tenantId: def.tenantId,
    }).catch(err => console.error('[WorkflowEngine] Failed to persist definition:', err.message));
  }

  /**
   * Instantiates and triggers the sequential execution pipeline
   */
  public async startWorkflow(definitionId: string, tenantId: string, initialContext: Record<string, any>): Promise<string> {
    const definition = this.definitions.get(definitionId);
    if (!definition) {
      throw new Error(`Workflow definition [${definitionId}] not registered on Platform.`);
    }

    const instanceId = generateShortId('wfl');
    const instance: WorkflowInstance = {
      id: instanceId,
      definitionId,
      tenantId,
      status: 'idle',
      currentStepId: '',
      context: { ...initialContext },
      checkpoints: [],
      errors: []
    };

    this.activeInstances.set(instanceId, instance);

    // Persist workflow instance to database
    WorkflowStore.saveInstance({
      instanceId,
      definitionId,
      tenantId,
      status: 'idle',
      context: instance.context,
    }).catch(err => console.error('[WorkflowEngine] Failed to persist instance:', err.message));

    // Run async execution
    setImmediate(async () => {
      await this.executeWorkflowInstance(instanceId);
    });

    return instanceId;
  }

  /**
   * Safe execution thread with error recovery, compensation, and checkpoint loops
   */
  private async executeWorkflowInstance(instanceId: string): Promise<void> {
    const instance = this.activeInstances.get(instanceId);
    if (!instance) return;

    const def = this.definitions.get(instance.definitionId)!;
    instance.status = 'running';

    const traceId = ObservabilityEngine.generateTraceId();

    await EventFabricEngine.getInstance().publish(
      'WorkflowStateChanged',
      'WorkflowEngine',
      instance.tenantId,
      { instanceId, status: 'running' },
      traceId
    );

    // Identify where we should restart/continue from (supports crashing restart checkpoints)
    const startIndex = def.steps.findIndex(s => s.id === instance.currentStepId);
    const resumeIndex = startIndex === -1 ? 0 : startIndex;

    for (let i = resumeIndex; i < def.steps.length; i++) {
      const step = def.steps[i];
      instance.currentStepId = step.id;

      // 1. Human Approval Checkpoint Gate (Requirement 7)
      if (step.requiresApproval) {
        instance.status = 'paused';
        await EventFabricEngine.getInstance().publish(
          'WorkflowStateChanged',
          'WorkflowEngine',
          instance.tenantId,
          { instanceId, stepId: step.id, status: 'paused_requires_approval' },
          traceId
        );
        return; // Halt and wait for external gate approval
      }

      // 2. Loop Handlers
      let retriesLeft = step.retryCount || 1;
      let stepSuccess = false;
      let lastError = '';

      while (retriesLeft > 0 && !stepSuccess) {
        try {
          const stepOutput = await ObservabilityEngine.traceAction(
            `WORKFLOW_STEP_${step.id.toUpperCase()}`,
            'WorkflowEngine',
            { instanceId, stepId: step.id },
            async () => {
              return await step.handler(instance.context);
            },
            traceId
          );

          // Save checkpoint state (survives memory crash standard serialization)
          instance.checkpoints.push({
            stepId: step.id,
            timestamp: new Date().toISOString(),
            output: stepOutput
          });

          // Update general context
          instance.context = {
            ...instance.context,
            ...stepOutput
          };

          stepSuccess = true;
        } catch (err: any) {
          retriesLeft--;
          lastError = err.message || String(err);
          console.warn(`Step ${step.id} execution failed. Retries remaining: ${retriesLeft}`);
          if (retriesLeft === 0) {
            instance.errors.push(`Step [${step.id}] critically failed after all retries: ${lastError}`);
          }
        }
      }

      // If Step critically failed and cannot progress, trigger transaction compensation triggers
      if (!stepSuccess) {
        await this.rollbackWorkflow(instanceId, i, traceId);
        return;
      }
    }

    instance.status = 'completed';
    // Persist status update
    WorkflowStore.saveInstance({
      instanceId,
      definitionId: instance.definitionId,
      tenantId: instance.tenantId,
      status: 'completed',
      context: instance.context,
      stepStates: { currentStepId: instance.currentStepId, checkpoints: instance.checkpoints.length },
    }).catch(err => console.error('[WorkflowEngine] Failed to persist completion:', err.message));
    await EventFabricEngine.getInstance().publish(
      'WorkflowStateChanged',
      'WorkflowEngine',
      instance.tenantId,
      { instanceId, status: 'completed' },
      traceId
    );
  }

  /**
   * External Human approval completion trigger to proceed
   */
  public async resumeWithApproval(instanceId: string, stepId: string, approved: boolean): Promise<void> {
    const instance = this.activeInstances.get(instanceId);
    if (!instance) throw new Error(`Workflow Instance [${instanceId}] not found.`);

    if (!approved) {
      instance.status = 'failed';
      instance.errors.push(`Human-in-the-loop Governance Gate refused approval for step [${stepId}].`);
      return;
    }

    const def = this.definitions.get(instance.definitionId)!;
    const stepIdx = def.steps.findIndex(s => s.id === stepId);
    
    // Jump to the next step
    if (stepIdx !== -1 && stepIdx < def.steps.length - 1) {
      instance.currentStepId = def.steps[stepIdx + 1].id;
    } else {
      instance.currentStepId = ''; // Last step completed
    }

    setImmediate(async () => {
      await this.executeWorkflowInstance(instanceId);
    });
  }

  /**
   * Compensation execution path to clean up half-done SCM actions
   */
  private async rollbackWorkflow(instanceId: string, failedIndex: number, traceId: string): Promise<void> {
    const instance = this.activeInstances.get(instanceId)!;
    const def = this.definitions.get(instance.definitionId)!;

    instance.status = 'failed';

    for (let i = failedIndex; i >= 0; i--) {
      const step = def.steps[i];
      if (step.compensation) {
        try {
          await ObservabilityEngine.traceAction(
            `WORKFLOW_ROLLBACK_COMPENSATE_${step.id.toUpperCase()}`,
            'WorkflowEngine',
            { instanceId, stepId: step.id },
            async () => {
              return await step.compensation!(instance.context);
            },
            traceId
          );
        } catch (compErr: any) {
          console.error(`Compensation trigger failed during rollback at step [${step.id}]:`, compErr);
        }
      }
    }

    instance.status = 'rolled_back';
    // Persist status update
    WorkflowStore.saveInstance({
      instanceId,
      definitionId: instance.definitionId,
      tenantId: instance.tenantId,
      status: 'rolled_back',
      context: instance.context,
    }).catch(err => console.error('[WorkflowEngine] Failed to persist rollback:', err.message));
    await EventFabricEngine.getInstance().publish(
      'WorkflowStateChanged',
      'WorkflowEngine',
      instance.tenantId,
      { instanceId, status: 'rolled_back' },
      traceId
    );
  }

  public getInstance(id: string): WorkflowInstance | undefined {
    return this.activeInstances.get(id);
  }

  public getAllInstances(): WorkflowInstance[] {
    return Array.from(this.activeInstances.values());
  }
}
