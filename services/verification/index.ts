import type { SeverityLevel } from '../../packages/domain';
import { generateId } from '../../src/core/shared/crypto';

export type VerificationStatus = 'PASS' | 'FAIL' | 'MONITOR' | 'ESCALATED';
export type ClosureStatus = 'CLOSED' | 'MONITOR' | 'ESCALATED';

export interface FieldVerificationRequest {
  assetId: string;
  workOrderId: string;
  defectType: string;
  severity: SeverityLevel;
  evidenceQualityScore: number;
  fieldConditionScore: number;
  maintenanceCompleted?: boolean;
  reinspectionNeeded?: boolean;
  confidence?: number;
  notes?: string;
}

export interface FieldVerificationAssessment {
  verificationId: string;
  assetId: string;
  workOrderId: string;
  status: VerificationStatus;
  confidence: number;
  requiredFollowUp: boolean;
  closureRecommendation: 'CLOSE' | 'MONITOR' | 'ESCALATE';
  summary: string[];
  generatedAt: string;
}

export interface WorkOrderClosureRequest {
  workOrderId: string;
  assetId: string;
  defectType: string;
  resolved: boolean;
  verificationStatus: VerificationStatus;
  closureComment?: string;
  evidenceSummary?: string[];
  assignedEngineer?: string;
  qualityScore?: number;
}

export interface WorkOrderClosureResult {
  workOrderId: string;
  assetId: string;
  status: ClosureStatus;
  resolutionSummary: string;
  evidenceSummary: string[];
  humanApprovalRequired: boolean;
  closureAt: string;
}

export const fieldVerificationService = {
  name: 'field-verification',
  phase: 'PHASE_7',
  purpose: 'Validates field work, confirms defect resolution, and gates work-order closure with discipline.'
};

export class FieldVerificationService {
  static assess(request: FieldVerificationRequest): FieldVerificationAssessment {
    const evidenceQuality = Math.max(0, Math.min(100, Number(request.evidenceQualityScore ?? 78)));
    const fieldCondition = Math.max(0, Math.min(100, Number(request.fieldConditionScore ?? 72)));
    const confidence = Math.max(0, Math.min(100, Number(request.confidence ?? 80)));
    const severityWeight = { MONITOR: 0.1, LOW: 0.25, MEDIUM: 0.5, HIGH: 0.75, CRITICAL: 0.9 };
    const weightedScore = Math.round((evidenceQuality * 0.4) + (fieldCondition * 0.35) + (confidence * 0.25));
    const severityFactor = severityWeight[request.severity] ?? 0.5;

    let status: VerificationStatus = 'PASS';
    let closureRecommendation: 'CLOSE' | 'MONITOR' | 'ESCALATE' = 'CLOSE';
    let requiredFollowUp = false;

    if (request.reinspectionNeeded || evidenceQuality < 60 || fieldCondition < 50 || (!request.maintenanceCompleted && severityFactor >= 0.75)) {
      status = 'MONITOR';
      closureRecommendation = 'MONITOR';
      requiredFollowUp = true;
    }

    if (request.severity === 'CRITICAL' && !(request.maintenanceCompleted && evidenceQuality >= 75)) {
      status = 'ESCALATED';
      closureRecommendation = 'ESCALATE';
      requiredFollowUp = true;
    }

    if (request.severity === 'HIGH' && weightedScore < 70) {
      status = 'FAIL';
      closureRecommendation = 'ESCALATE';
      requiredFollowUp = true;
    }

    if (status === 'PASS' && (fieldCondition >= 80 && evidenceQuality >= 75)) {
      closureRecommendation = 'CLOSE';
      requiredFollowUp = false;
    }

    return {
      verificationId: generateId('verify'),
      assetId: request.assetId,
      workOrderId: request.workOrderId,
      status,
      confidence: Number((confidence * (severityFactor + 0.2)).toFixed(1)),
      requiredFollowUp,
      closureRecommendation,
      summary: [
        `${request.defectType} verification scored ${weightedScore}/100 with ${evidenceQuality}% evidence quality.`,
        `Field condition is ${fieldCondition}% and maintenance completion is ${request.maintenanceCompleted ? 'confirmed' : 'not yet confirmed'}.`,
        request.notes ? `Field note: ${request.notes}` : 'No additional field note recorded.'
      ],
      generatedAt: new Date().toISOString()
    };
  }

  static closeWorkOrder(request: WorkOrderClosureRequest): WorkOrderClosureResult {
    const qualityScore = Math.max(0, Math.min(100, Number(request.qualityScore ?? 80)));
    const resolved = Boolean(request.resolved) && request.verificationStatus !== 'FAIL' && qualityScore >= 70;
    const status: ClosureStatus = request.verificationStatus === 'ESCALATED' ? 'ESCALATED' : resolved ? 'CLOSED' : 'MONITOR';
    const humanApprovalRequired = status !== 'CLOSED' || (request.defectType.toLowerCase().includes('insulator') || request.defectType.toLowerCase().includes('conductor'));

    return {
      workOrderId: request.workOrderId,
      assetId: request.assetId,
      status,
      resolutionSummary: resolved
        ? `Work order is closed after field verification confirmed the defect has been resolved and evidence remains consistent.`
        : `Work order remains open because field evidence indicates follow-up verification or reinspection is required before closure.`,
      evidenceSummary: request.evidenceSummary && request.evidenceSummary.length > 0
        ? request.evidenceSummary
        : [
            `Field engineer: ${request.assignedEngineer ?? 'unassigned'}`,
            `Verification outcome: ${request.verificationStatus}`,
            `Evidence quality score: ${qualityScore}/100`
          ],
      humanApprovalRequired,
      closureAt: new Date().toISOString()
    };
  }
}

export default FieldVerificationService;
