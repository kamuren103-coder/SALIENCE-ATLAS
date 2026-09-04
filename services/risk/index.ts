import type {
  ConditionAssessment,
  RiskAssessment,
  RiskLevel,
  SeverityLevel
} from '../../packages/domain';

export interface RiskAssessmentRequest {
  assetId: string;
  defectType?: string;
  severity?: SeverityLevel;
  confidence?: number;
  degradation?: number;
  probabilityOfFailure?: number;
  consequenceOfFailure?: number;
  exposure?: number;
  historicalDegradation?: number;
}

export interface RiskAssessmentEnvelope {
  condition: ConditionAssessment;
  risk: RiskAssessment;
  priority: 'ROUTINE' | 'SCHEDULED' | 'HIGH_PRIORITY' | 'EMERGENCY';
  recommendation: string;
  generatedAt: string;
}

export const riskService = {
  name: 'risk',
  phase: 'PHASE_5',
  purpose: 'Calculates explainable condition and risk scores using governance-driven configuration.'
};

export class RiskAssessmentService {
  static assess(request: RiskAssessmentRequest): RiskAssessmentEnvelope {
    const severityWeight = {
      MONITOR: 0.1,
      LOW: 0.2,
      MEDIUM: 0.45,
      HIGH: 0.7,
      CRITICAL: 0.9
    };

    const degradation = Math.max(0, Math.min(100, Number(request.degradation ?? 45)));
    const confidence = Math.max(0, Math.min(1, Number(request.confidence ?? 0.75)));
    const severityScore = severityWeight[request.severity ?? 'MEDIUM'] ?? 0.45;
    const probabilityOfFailure = Math.max(0, Math.min(100, Number(request.probabilityOfFailure ?? (confidence * 100 * 0.8 + degradation * 0.3))));
    const consequenceOfFailure = Math.max(0, Math.min(100, Number(request.consequenceOfFailure ?? 70)));
    const exposure = Math.max(0, Math.min(100, Number(request.exposure ?? 60)));
    const historicalDegradation = Math.max(0, Math.min(100, Number(request.historicalDegradation ?? degradation * 0.9)));

    const structural = Math.round(Math.min(100, 35 + degradation * 0.35 + severityScore * 30));
    const electrical = Math.round(Math.min(100, 20 + probabilityOfFailure * 0.42 + (request.defectType?.toLowerCase().includes('conductor') ? 15 : 0)));
    const mechanical = Math.round(Math.min(100, 25 + degradation * 0.25 + severityScore * 25));
    const environmental = Math.round(Math.min(100, 15 + exposure * 0.34));
    const vegetation = Math.round(Math.min(100, 10 + (request.defectType?.toLowerCase().includes('vegetation') ? 40 : 0)));
    const corrosion = Math.round(Math.min(100, 12 + (request.defectType?.toLowerCase().includes('corrosion') ? 45 : 0) + severityScore * 20));

    const conditionScore = Math.round(
      (structural * 0.24 + electrical * 0.23 + mechanical * 0.18 + environmental * 0.14 + vegetation * 0.1 + corrosion * 0.11)
    );

    const level: RiskLevel = conditionScore >= 80 ? 'CRITICAL' : conditionScore >= 65 ? 'HIGH' : conditionScore >= 45 ? 'MEDIUM' : 'LOW';
    const degradationRate = Math.max(0, Math.min(100, degradation * (1 + confidence * 0.25)));

    const condition: ConditionAssessment = {
      assetId: request.assetId,
      assessedAt: new Date().toISOString(),
      score: conditionScore,
      primaryDrivers: [
        { label: 'Defect severity', delta: severityScore * 100, remark: `Severity is ${request.severity ?? 'MEDIUM'} and materially influences the integrity score.` },
        { label: 'Degradation trend', delta: degradation, remark: `Observed degradation is ${degradation}% and increasing with historical evidence.` },
        { label: 'Failure probability', delta: probabilityOfFailure, remark: `Probability of failure is estimated at ${probabilityOfFailure.toFixed(0)}%.` }
      ],
      structural,
      electrical,
      mechanical,
      environmental,
      vegetation,
      corrosion,
      historicalDegradation: historicalDegradation
    };

    const risk: RiskAssessment = {
      assetId: request.assetId,
      level,
      explanation: [
        `Asset condition score is ${conditionScore}/100 based on defect severity, historical degradation, and structural exposure.`,
        `Failure probability is ${probabilityOfFailure.toFixed(0)}% with consequence of failure at ${consequenceOfFailure.toFixed(0)}%.`,
        `Exposure is ${exposure.toFixed(0)}% and the defect class is ${request.defectType ?? 'general integrity issue'}.`
      ],
      probabilityOfFailure: Number(probabilityOfFailure.toFixed(2)),
      consequenceOfFailure: Number(consequenceOfFailure.toFixed(2)),
      exposure: Number(exposure.toFixed(2)),
      degradationRate: Number(degradationRate.toFixed(2)),
      calculatedAt: new Date().toISOString()
    };

    const priority = risk.level === 'CRITICAL' ? 'EMERGENCY' : risk.level === 'HIGH' ? 'HIGH_PRIORITY' : conditionScore >= 55 ? 'SCHEDULED' : 'ROUTINE';
    const recommendation = risk.level === 'CRITICAL'
      ? 'Escalate for immediate engineering review and safety-critical inspection before any intervention or switching operation.'
      : risk.level === 'HIGH'
        ? 'Schedule engineering review and maintenance planning within the next operational window, with explicit human approval before field action.'
        : 'Continue with planned inspection and maintenance review while tracking the asset for trend degradation.';

    return {
      condition,
      risk,
      priority,
      recommendation,
      generatedAt: new Date().toISOString()
    };
  }
}

export default RiskAssessmentService;
