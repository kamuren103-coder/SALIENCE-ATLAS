import type { ExecutivePortfolioBrief } from '../../packages/domain';

export interface ExecutiveBriefRequest {
  portfolioId?: string;
  reportingWindow?: string;
  networkHealthScore?: number;
  riskExposureScore?: number;
  priorityAssets?: string[];
  criticalActions?: string[];
  boardActions?: string[];
}

export interface ExecutiveBriefResult {
  portfolioId: string;
  reportingWindow: string;
  networkHealthScore: number;
  riskExposureScore: number;
  priorityAssets: string[];
  criticalActions: string[];
  recommendedBoardActions: string[];
  status: 'STABLE' | 'WATCH' | 'HIGH_RISK';
  generatedAt: string;
}

export const executiveService = {
  name: 'executive-intelligence',
  phase: 'PHASE_9',
  purpose: 'Translates asset, risk, and field evidence into leadership briefings and governance decisions.'
};

export class ExecutiveIntelligenceService {
  static buildBrief(request: ExecutiveBriefRequest = {}): ExecutiveBriefResult {
    const networkHealthScore = Math.max(0, Math.min(100, Number(request.networkHealthScore ?? 82)));
    const riskExposureScore = Math.max(0, Math.min(100, Number(request.riskExposureScore ?? 38)));
    const status = riskExposureScore >= 70 ? 'HIGH_RISK' : riskExposureScore >= 45 ? 'WATCH' : 'STABLE';

    const portfolioId = request.portfolioId ?? 'KETRACO-TRANSMISSION-PORTFOLIO';
    const reportingWindow = request.reportingWindow ?? 'WEEKLY';
    const priorityAssets = request.priorityAssets && request.priorityAssets.length > 0
      ? request.priorityAssets
      : ['asset-tower-01', 'asset-line-07', 'asset-substation-03'];
    const criticalActions = request.criticalActions && request.criticalActions.length > 0
      ? request.criticalActions
      : [
          'Prioritize high-risk asset interventions within the next operational window.',
          'Reconfirm field verification for deferred maintenance before restoring standard inspection cadence.'
        ];
    const recommendedBoardActions = request.boardActions && request.boardActions.length > 0
      ? request.boardActions
      : [
          'Approve targeted capex and maintenance escalation for the highest-risk corridor clusters.',
          'Review governance actions to ensure inspection closure rigor remains in force.'
        ];

    const brief: ExecutivePortfolioBrief = {
      portfolioId,
      reportingWindow,
      networkHealthScore,
      riskExposureScore,
      priorityAssets,
      criticalActions,
      recommendedBoardActions,
      generatedAt: new Date().toISOString()
    };

    return {
      portfolioId: brief.portfolioId,
      reportingWindow: brief.reportingWindow,
      networkHealthScore: brief.networkHealthScore,
      riskExposureScore: brief.riskExposureScore,
      priorityAssets: brief.priorityAssets,
      criticalActions: brief.criticalActions,
      recommendedBoardActions: brief.recommendedBoardActions,
      status,
      generatedAt: brief.generatedAt
    };
  }
}

export default ExecutiveIntelligenceService;
