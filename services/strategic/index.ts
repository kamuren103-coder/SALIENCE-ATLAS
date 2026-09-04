import type { StrategicPortfolioPlan } from '../../packages/domain';
import { generateId } from '../../src/core/shared/crypto';

export interface StrategicPlanRequest {
  portfolioId?: string;
  networkHealthScore?: number;
  riskExposureScore?: number;
  priorityProjects?: string[];
  mitigationActions?: string[];
  budgetBase?: number;
}

export interface StrategicPlanResult {
  planId: string;
  portfolioId: string;
  investmentPriority: 'LOW' | 'MEDIUM' | 'HIGH';
  maintenanceRegime: 'ROUTINE' | 'ENHANCED' | 'CRITICAL';
  budgetRecommendation: number;
  priorityProjects: string[];
  mitigationActions: string[];
  generatedAt: string;
}

export const strategicService = {
  name: 'strategic-portfolio',
  phase: 'PHASE_10',
  purpose: 'Converts operational evidence and asset risk into portfolio-level investment and maintenance planning.'
};

export class StrategicPortfolioService {
  static buildPlan(request: StrategicPlanRequest = {}): StrategicPlanResult {
    const networkHealthScore = Math.max(0, Math.min(100, Number(request.networkHealthScore ?? 83)));
    const riskExposureScore = Math.max(0, Math.min(100, Number(request.riskExposureScore ?? 42)));
    const budgetBase = Math.max(0, Number(request.budgetBase ?? 12000000));

    let investmentPriority: StrategicPlanResult['investmentPriority'] = 'LOW';
    let maintenanceRegime: StrategicPlanResult['maintenanceRegime'] = 'ROUTINE';

    if (riskExposureScore >= 70 || networkHealthScore < 60) {
      investmentPriority = 'HIGH';
      maintenanceRegime = 'CRITICAL';
    } else if (riskExposureScore >= 45 || networkHealthScore < 75) {
      investmentPriority = 'MEDIUM';
      maintenanceRegime = 'ENHANCED';
    }

    const priorityProjects = request.priorityProjects && request.priorityProjects.length > 0
      ? request.priorityProjects
      : ['asset-tower-01 reinforcement', 'line-07 conductor condition upgrade', 'ssp-03 insulation modernization'];
    const mitigationActions = request.mitigationActions && request.mitigationActions.length > 0
      ? request.mitigationActions
      : [
          'Accelerate replacement for the highest-risk corridor infrastructure.',
          'Increase inspection frequency for recurring defect classes.',
          'Budget for deferred maintenance and targeted asset-critical interventions.'
        ];

    const plan: StrategicPortfolioPlan = {
      planId: generateId('plan'),
      portfolioId: request.portfolioId ?? 'KETRACO-TRANSMISSION-PORTFOLIO',
      investmentPriority,
      maintenanceRegime,
      budgetRecommendation: Math.round(budgetBase * (investmentPriority === 'HIGH' ? 1.35 : investmentPriority === 'MEDIUM' ? 1.12 : 0.9)),
      priorityProjects,
      mitigationActions,
      generatedAt: new Date().toISOString()
    };

    return {
      planId: plan.planId,
      portfolioId: plan.portfolioId,
      investmentPriority: plan.investmentPriority,
      maintenanceRegime: plan.maintenanceRegime,
      budgetRecommendation: plan.budgetRecommendation,
      priorityProjects: plan.priorityProjects,
      mitigationActions: plan.mitigationActions,
      generatedAt: plan.generatedAt
    };
  }
}

export default StrategicPortfolioService;
