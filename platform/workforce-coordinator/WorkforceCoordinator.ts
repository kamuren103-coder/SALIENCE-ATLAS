import { Capability, AgentRegistry, EnterpriseAgent } from '../../apps/backend/platform/agent-os/AgentOS';
import { AgentReputationSystem } from '../agent-reputation/AgentReputation';

export interface WorkforceTask {
  id: string;
  name: string;
  requiredCapability: Capability;
  priority: 'low' | 'medium' | 'high' | 'critical';
  context: Record<string, any>;
  tenantId: string;
}

export interface WorkforceAssignment {
  taskId: string;
  assignedAgentId: string;
  allocatedAt: string;
  status: 'assigned' | 'completed' | 'failed';
}

export class WorkforceCoordinator {
  private static instance: WorkforceCoordinator;
  private assignments: WorkforceAssignment[] = [];
  private taskQueue: WorkforceTask[] = [];

  private constructor() {}

  public static getInstance(): WorkforceCoordinator {
    if (!WorkforceCoordinator.instance) {
      WorkforceCoordinator.instance = new WorkforceCoordinator();
    }
    return WorkforceCoordinator.instance;
  }

  /**
   * Enqueues an active high-frequency task request from a tenant pipeline
   */
  public enqueueTask(task: WorkforceTask): void {
    this.taskQueue.push(task);
    this.rebalanceAndAssignWork();
  }

  /**
   * Runs load-balancing, priority matching, and reputation weight optimization to match task to optimal agent
   */
  public rebalanceAndAssignWork(): void {
    if (this.taskQueue.length === 0) return;

    // Filter tasks by priority order (critical > high > medium > low)
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    this.taskQueue.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    const activeRegistry = AgentRegistry.getInstance();

    while (this.taskQueue.length > 0) {
      const task = this.taskQueue[0];
      const eligibleAgents = activeRegistry.getAgentsByCapability(task.requiredCapability);

      if (eligibleAgents.length === 0) {
        console.warn(`Workforce warning: No agents currently registered possess [${task.requiredCapability}] capability.`);
        break; // Can not route this task category, wait for plugin installation
      }

      // Filter for idle or low CPU/memory workloads (Load Balancing)
      const availableAgents = eligibleAgents.filter(a => a.status === 'idle');
      const targetList = availableAgents.length > 0 ? availableAgents : eligibleAgents;

      // Select agent factoring overall Reputation Scorecards (Priority Routing / Skill Matching)
      const topAgentId = AgentReputationSystem.getInstance().getTopPerformingAgentForCapability(
        targetList.map(a => a.id)
      );

      if (!topAgentId) break;

      // Pop task and bind assignment
      this.taskQueue.shift();
      this.assignments.push({
        taskId: task.id,
        assignedAgentId: topAgentId,
        allocatedAt: new Date().toISOString(),
        status: 'assigned'
      });

      // Update Agent status dynamically in memory
      const agent = activeRegistry.getAgent(topAgentId);
      if (agent) {
        agent.status = 'busy';
      }
    }
  }

  public getAssignments(): WorkforceAssignment[] {
    return this.assignments;
  }

  public getTaskQueue() {
    return this.taskQueue;
  }
}
