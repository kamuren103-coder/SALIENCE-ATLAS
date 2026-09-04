import type {
  AssetHistorySnapshot,
  HistoricalLearningInsight
} from '../../packages/domain';
import { generateId } from '../../src/core/shared/crypto';

export interface HistoricalLearningRequest {
  assetId: string;
  defectType: string;
  issueCount?: number;
  maintenanceEvents?: number;
  lastInspectionAt?: string;
  lastRepairAt?: string;
  reliabilityScore?: number;
  degradationTrend?: 'IMPROVING' | 'STABLE' | 'WORSENING';
  evidenceSummary?: string[];
}

export interface HistoricalLearningResult {
  assetId: string;
  defectType: string;
  assetHistory: AssetHistorySnapshot;
  learningInsight: HistoricalLearningInsight;
  generatedAt: string;
}

export const learningService = {
  name: 'learning',
  phase: 'PHASE_8',
  purpose: 'Captures asset history and converts maintenance outcomes into recommended learning for future inspections.'
};

export class HistoricalLearningService {
  static buildAssetHistory(request: HistoricalLearningRequest): HistoricalLearningResult {
    const issueCount = Math.max(0, Number(request.issueCount ?? 2));
    const maintenanceEvents = Math.max(0, Number(request.maintenanceEvents ?? 1));
    const reliabilityScore = Math.max(0, Math.min(100, Number(request.reliabilityScore ?? 78)));
    const trend = request.degradationTrend ?? (reliabilityScore >= 80 ? 'IMPROVING' : reliabilityScore >= 60 ? 'STABLE' : 'WORSENING');

    const history: AssetHistorySnapshot = {
      assetId: request.assetId,
      defectType: request.defectType,
      lastInspectionAt: request.lastInspectionAt ?? new Date().toISOString(),
      lastRepairAt: request.lastRepairAt ?? (maintenanceEvents > 0 ? new Date().toISOString() : undefined),
      degradationTrend: trend,
      issueCount,
      maintenanceEvents,
      reliabilityScore,
      recommendation: trend === 'WORSENING'
        ? 'Increase inspection cadence and review structural or conductor condition before escalation.'
        : trend === 'STABLE'
          ? 'Continue routine monitoring and validate defect performance against the next maintenance cycle.'
          : 'Maintain current repair program; no immediate intervention is required beyond the standard inspection window.'
    };

    const evidenceSummary = request.evidenceSummary && request.evidenceSummary.length > 0
      ? request.evidenceSummary
      : [
          `Asset ${request.assetId} shows ${issueCount} defect observations in the current learning record.`,
          `Maintenance interventions logged: ${maintenanceEvents}.`,
          `Reliability score remains at ${reliabilityScore}/100.`
        ];

    const learningInsight: HistoricalLearningInsight = {
      id: generateId('learn'),
      assetId: request.assetId,
      defectType: request.defectType,
      trend,
      confidence: Math.min(99, 60 + reliabilityScore * 0.3 + issueCount * 2),
      evidenceSummary,
      recommendation: history.recommendation,
      generatedAt: new Date().toISOString()
    };

    return {
      assetId: request.assetId,
      defectType: request.defectType,
      assetHistory: history,
      learningInsight,
      generatedAt: new Date().toISOString()
    };
  }
}

export default HistoricalLearningService;
