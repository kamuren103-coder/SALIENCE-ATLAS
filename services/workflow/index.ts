import type { MissionState, WorkflowState } from '../../packages/domain';
import { generateId } from '../../src/core/shared/crypto';

export interface WorkflowRouteRequest {
  assetId: string;
  defectType: string;
  severity: 'MONITOR' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskLevel: 'MONITOR' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  owner?: string;
  slaHours?: number;
}

export interface WorkflowRouteResult {
  workflow: WorkflowState;
  decision: 'AUTO_APPROVED' | 'REVIEW_REQUIRED' | 'ESCALATED';
  recommendation: string;
  generatedAt: string;
}

export const workflowService = {
  name: 'workflow',
  phase: 'PHASE_5',
  purpose: 'Routes defects to human review, approval, and maintenance work orders while tracking SLA state.'
};

export class WorkflowRoutingService {
  static route(request: WorkflowRouteRequest): WorkflowRouteResult {
    const severityOrder = { MONITOR: 1, LOW: 2, MEDIUM: 3, HIGH: 4, CRITICAL: 5 };
    const riskOrder = { MONITOR: 1, LOW: 2, MEDIUM: 3, HIGH: 4, CRITICAL: 5 };
    const severityScore = severityOrder[request.severity] ?? 3;
    const riskScore = riskOrder[request.riskLevel] ?? 3;
    const decision = severityScore >= 4 || riskScore >= 4 ? 'REVIEW_REQUIRED' : severityScore >= 5 || riskScore >= 5 ? 'ESCALATED' : 'AUTO_APPROVED';

    const currentStage: MissionState = decision === 'ESCALATED' ? 'APPROVAL_REQUIRED' : decision === 'REVIEW_REQUIRED' ? 'ENGINEERING_REVIEW' : 'ACTION_RECOMMENDED';
    const workflow: WorkflowState = {
      id: generateId('wf'),
      targetAssetId: request.assetId,
      currentStage,
      owner: request.owner ?? 'maintenance-engineer',
      dueAt: new Date(Date.now() + (request.slaHours ?? 24) * 60 * 60 * 1000).toISOString(),
      status: decision === 'AUTO_APPROVED' ? 'IN_PROGRESS' : 'OPEN',
      slaHours: request.slaHours ?? 24
    };

    const recommendation = decision === 'ESCALATED'
      ? 'Escalate to safety-qualified control room and engineering approval before any intervention or switching operation.'
      : decision === 'REVIEW_REQUIRED'
        ? 'Dispatch to engineering review queue and await explicit human approval before actioning the defect.'
        : 'Proceed with maintenance planning and standard engineering approval flow.';

    return {
      workflow,
      decision,
      recommendation,
      generatedAt: new Date().toISOString()
    };
  }
}

export default WorkflowRoutingService;
