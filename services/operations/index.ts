export type GridStateLevel = 'NORMAL' | 'STABLE' | 'WATCH' | 'STRESSED' | 'CRITICAL' | 'EMERGENCY';
export type DecisionPriority = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';

export interface GridDemandSnapshot {
  demandMw: number;
  generationMw: number;
  reserveMw: number;
  reserveMarginPct: number;
  frequencyHz: number;
  transmissionAvailabilityPct: number;
  congestedCorridorsCount: number;
  activeIncidentsCount: number;
  dataConfidencePct: number;
}

export interface GridStateRequest extends GridDemandSnapshot {
  incidentCount?: number;
  criticalAlarms?: number;
  n1Status?: 'COMPLIANT' | 'VIOLATION_WATCH' | 'CRITICAL_VIOLATION';
}

export interface GridStateResult {
  state: GridStateLevel;
  stressScore: number;
  stabilityIndex: number;
  primaryStressRegion: string;
  recommendedFocus: string;
  topDrivers: Array<{
    id: string;
    category: string;
    metric: string;
    currentValue: string | number;
    severity: 'NORMAL' | 'WATCH' | 'HIGH' | 'CRITICAL';
    contributionPct: number;
    explanation: string;
  }>;
  calculatedAt: string;
  systemDemandMW: number;
  totalGenerationMW: number;
  spinningReserveMW: number;
  reserveMarginPct: number;
  gridFrequencyHz: number;
  transmissionAvailabilityPct: number;
  congestedCorridorsCount: number;
  activeIncidentsCount: number;
  criticalAssetsAtRiskCount: number;
  n1ComplianceStatus: 'COMPLIANT' | 'VIOLATION_WATCH' | 'CRITICAL_VIOLATION';
  overallGridRiskScore: number;
  dataConfidencePct: number;
}

export interface PriorityItemInput {
  id: string;
  title: string;
  category: 'INCIDENT' | 'ALARM' | 'ASSET' | 'CORRIDOR' | 'CONTINGENCY' | 'MAINTENANCE' | 'RISK' | 'FORECAST' | 'DATA_QUALITY';
  impact: number;
  urgency: number;
  probability: number;
  criticality: number;
  confidence: number;
  assetIds?: string[];
  corridorIds?: string[];
}

export interface PriorityQueueResult {
  id: string;
  priority: DecisionPriority;
  score: number;
  title: string;
  category: PriorityItemInput['category'];
  recommendedAction: string;
  evidenceSummary: string[];
  affectedAssetIds: string[];
  affectedCorridorIds: string[];
}

export interface CorrelationInput {
  assetId: string;
  corridorId?: string;
  incidentId?: string;
  defectId?: string;
  mediaId?: string;
  workOrderId?: string;
}

export interface CorrelationResult {
  assetId: string;
  corridorId?: string;
  incidentId?: string;
  confidence: number;
  summary: string[];
  correlatedEntities: string[];
}

export interface DecisionBriefInput {
  incidentId: string;
  state: GridStateLevel;
  priority: DecisionPriority;
  summary: string;
  recommendedAction: string;
}

export interface DecisionBriefResult {
  incidentId: string;
  state: GridStateLevel;
  priority: DecisionPriority;
  summary: string;
  recommendedAction: string;
  humanApprovalRequired: boolean;
  generatedAt: string;
}

export const operationalDecisionService = {
  name: 'operational-decision',
  phase: 'PHASE_6',
  purpose: 'Provides the national operating picture, priority engine, and decision brief contract for command-center operators.'
};

export class OperationalDecisionService {
  static evaluateGridState(input: GridStateRequest): GridStateResult {
    const reserveMarginPct = Number((input.reserveMw / Math.max(1, input.generationMw)) * 100 || 0);
    const stressScore = Math.min(100, Math.round(
      (Math.abs(input.frequencyHz - 50) / 0.5) * 18 +
      (Math.max(0, (100 - input.transmissionAvailabilityPct)) / 5) * 8 +
      (Math.max(0, input.congestedCorridorsCount) * 12) +
      (Math.max(0, input.activeIncidentsCount ?? 0) * 8) +
      (Math.max(0, (input.criticalAlarms ?? 0) * 12)) +
      Math.max(0, (50 - reserveMarginPct) * 1.2)
    ));

    let state: GridStateLevel = 'NORMAL';
    if (stressScore >= 85) state = 'EMERGENCY';
    else if (stressScore >= 68) state = 'CRITICAL';
    else if (stressScore >= 48) state = 'STRESSED';
    else if (stressScore >= 30) state = 'WATCH';
    else if (stressScore >= 15) state = 'STABLE';

    const stabilityIndex = Math.max(0, 100 - stressScore);
    const n1ComplianceStatus = input.n1Status ?? 'COMPLIANT';
    const primaryStressRegion = input.congestedCorridorsCount > 0 ? 'Nairobi–Rift Valley Interconnector' : 'System-wide balancing';

    return {
      state,
      stressScore,
      stabilityIndex,
      primaryStressRegion,
      recommendedFocus: state === 'EMERGENCY' ? 'Immediate incident response and energy balancing' : state === 'CRITICAL' ? 'Critical contingency planning and rapid dispatch response' : 'Maintain monitoring with planned operator review',
      topDrivers: [
        {
          id: 'frequency',
          category: 'FREQUENCY',
          metric: 'Grid frequency',
          currentValue: Number(input.frequencyHz.toFixed(3)),
          severity: Math.abs(input.frequencyHz - 50) > 0.08 ? 'WATCH' : 'NORMAL',
          contributionPct: 24,
          explanation: 'System frequency is deviating from the nominal 50Hz target.'
        },
        {
          id: 'reserve',
          category: 'RESERVE',
          metric: 'Spinning reserve',
          currentValue: `${input.reserveMw} MW`,
          severity: reserveMarginPct < 8 ? 'HIGH' : 'NORMAL',
          contributionPct: 21,
          explanation: 'Spinning reserve is tight relative to current demand.'
        },
        {
          id: 'availability',
          category: 'OUTAGES',
          metric: 'Transmission availability',
          currentValue: `${input.transmissionAvailabilityPct}%`,
          severity: input.transmissionAvailabilityPct < 95 ? 'WATCH' : 'NORMAL',
          contributionPct: 18,
          explanation: 'Transmission availability is tracking below the preferred operating threshold.'
        }
      ],
      calculatedAt: new Date().toISOString(),
      systemDemandMW: input.demandMw,
      totalGenerationMW: input.generationMw,
      spinningReserveMW: input.reserveMw,
      reserveMarginPct: Number(reserveMarginPct.toFixed(2)),
      gridFrequencyHz: Number(input.frequencyHz.toFixed(3)),
      transmissionAvailabilityPct: Number(input.transmissionAvailabilityPct.toFixed(2)),
      congestedCorridorsCount: input.congestedCorridorsCount,
      activeIncidentsCount: input.activeIncidentsCount ?? input.incidentCount ?? 0,
      criticalAssetsAtRiskCount: Math.max(0, Math.min(20, Math.round((stressScore / 100) * 8))),
      n1ComplianceStatus: n1ComplianceStatus,
      overallGridRiskScore: Math.min(100, Math.round(stressScore * 0.9)),
      dataConfidencePct: Math.max(0, Math.min(100, input.dataConfidencePct))
    };
  }

  static computePriorityQueue(items: PriorityItemInput[]): PriorityQueueResult[] {
    return items
      .map((item) => {
        const compositeScore = (item.impact * 0.3) + (item.urgency * 0.25) + (item.probability * 0.2) + (item.criticality * 0.15) + (item.confidence * 0.1);
        const priority: DecisionPriority = compositeScore >= 85 ? 'P0' : compositeScore >= 70 ? 'P1' : compositeScore >= 55 ? 'P2' : compositeScore >= 35 ? 'P3' : 'P4';
        const recommendedAction = priority === 'P0'
          ? 'Immediate operator intervention and incident command escalation.'
          : priority === 'P1'
            ? 'Escalate to engineering watch and issue tactical mitigation.'
            : priority === 'P2'
              ? 'Assign to active operations queue with scheduled review.'
              : 'Monitor and continue routine review.';

        return {
          id: item.id,
          priority,
          score: Number(compositeScore.toFixed(1)),
          title: item.title,
          category: item.category,
          recommendedAction,
          evidenceSummary: [
            `${item.impact}% impact score`,
            `${item.urgency}% urgency score`,
            `${item.confidence}% confidence score`
          ],
          affectedAssetIds: item.assetIds ?? [],
          affectedCorridorIds: item.corridorIds ?? []
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  static correlate(input: CorrelationInput): CorrelationResult {
    const entities = [input.assetId, input.corridorId, input.incidentId, input.defectId, input.mediaId, input.workOrderId].filter(Boolean) as string[];
    const confidence = Math.min(99, 65 + entities.length * 7);
    return {
      assetId: input.assetId,
      corridorId: input.corridorId,
      incidentId: input.incidentId,
      confidence,
      summary: [
        'Asset, corridor, and incident metadata correlate through telemetry and operation timelines.',
        'Defect and evidence nodes remain linked through immutable event provenance.',
        'Human review is required before any safety-critical switching or field intervention.'
      ],
      correlatedEntities: entities
    };
  }

  static generateDecisionBrief(input: DecisionBriefInput): DecisionBriefResult {
    return {
      incidentId: input.incidentId,
      state: input.state,
      priority: input.priority,
      summary: input.summary,
      recommendedAction: input.recommendedAction,
      humanApprovalRequired: ['P0', 'P1', 'CRITICAL', 'EMERGENCY'].includes(input.priority as string) || ['CRITICAL', 'EMERGENCY'].includes(input.state),
      generatedAt: new Date().toISOString()
    };
  }
}

export default OperationalDecisionService;
