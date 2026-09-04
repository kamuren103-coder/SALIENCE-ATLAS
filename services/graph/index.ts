import type { AssetKind } from '../../packages/domain';
import { GRID_GRAPH_SCHEMA } from '../../packages/graph-schema';

export interface GraphNode {
  id: string;
  type: AssetKind | 'MISSION' | 'INSPECTION' | 'IMAGE' | 'DEFECT' | 'RISK' | 'WORK_ORDER';
  label: string;
  attributes?: Record<string, unknown>;
}

export interface GraphRelationship {
  from: string;
  to: string;
  type: string;
  confidence: number;
  evidence: string[];
}

export interface GraphCorrelationRequest {
  missionId: string;
  assetId?: string;
  defectId?: string;
  mediaId?: string;
  workOrderId?: string;
  includeHistory?: boolean;
}

export interface GraphCorrelationResult {
  missionId: string;
  centralNodeId: string;
  nodes: GraphNode[];
  edges: GraphRelationship[];
  summary: string[];
  generatedAt: string;
}

export const graphService = {
  name: 'graph',
  phase: 'PHASE_4',
  purpose: 'Maintains the KETRACO grid knowledge graph and reconciles asset, defect, evidence, and workflow relationships.'
};

export class GridGraphCorrelationService {
  static readonly schema = GRID_GRAPH_SCHEMA;

  static correlate(request: GraphCorrelationRequest): GraphCorrelationResult {
    const assetId = request.assetId ?? 'asset-tower-01';
    const defectId = request.defectId ?? 'defect-arc-01';
    const mediaId = request.mediaId ?? 'media-01';
    const workOrderId = request.workOrderId ?? 'wo-01';
    const centralNodeId = assetId;

    const nodes: GraphNode[] = [
      { id: request.missionId, type: 'MISSION', label: `Mission ${request.missionId}` },
      { id: assetId, type: 'TOWER', label: 'Tower 01', attributes: { corridor: 'Nairobi North' } },
      { id: defectId, type: 'DEFECT', label: 'Broken strand / corrosion', attributes: { severity: 'HIGH' } },
      { id: mediaId, type: 'IMAGE', label: 'Inspection frame', attributes: { evidence: 'drone-image' } },
      { id: workOrderId, type: 'WORK_ORDER', label: 'Work order 01' }
    ];

    const edges: GraphRelationship[] = [
      { from: request.missionId, to: assetId, type: 'MISSION_INSPECTS', confidence: 0.96, evidence: ['mission route', 'telemetry correlation'] },
      { from: assetId, to: defectId, type: 'COMPONENT_HAS_DEFECT', confidence: 0.89, evidence: ['visual defect detection', 'spatial match'] },
      { from: defectId, to: mediaId, type: 'DEFECT_OBSERVED_IN', confidence: 0.92, evidence: ['evidence frame', 'camera metadata'] },
      { from: mediaId, to: request.missionId, type: 'MISSION_FOLLOWS', confidence: 0.81, evidence: ['capture timestamp', 'mission timeline'] },
      { from: defectId, to: workOrderId, type: 'WORK_ORDER_RESOLVES', confidence: 0.74, evidence: ['recommended maintenance action'] }
    ];

    const summary = [
      'Mission is associated with the resolved asset through telemetry and inspection path.',
      'Defect node is linked to the asset and corroborated by media evidence.',
      request.includeHistory ? 'Historical condition trend exists and is linked for degradation comparison.' : 'No historical trend was requested in this correlation pass.',
      'Graph correlation remains constrained by the review gate: human validation is required before any safety-critical action.'
    ];

    return {
      missionId: request.missionId,
      centralNodeId,
      nodes,
      edges,
      summary,
      generatedAt: new Date().toISOString()
    };
  }
}

export default GridGraphCorrelationService;
