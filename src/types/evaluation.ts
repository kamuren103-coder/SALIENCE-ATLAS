export type AgentStatusType = 'IDLE' | 'ACTIVE' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CONSENSUS_REACHED';

export interface AgentStatus {
  id: string;
  name: string;
  status: AgentStatusType;
  progress: number;
  version: string;
  owner: string;
  legalAuthority: string;
  dependencies: string[];
  health: number;
  confidence?: number;
  riskScore?: number;
}

export interface EvaluationFinding {
  ruleId: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'REQUIRES_REVIEW';
  confidence: number;
  reasoningChain: string[];
  details?: Record<string, any>;
}

export interface ConsensusResult {
  verdict: 'PASSED' | 'FAILED' | 'REVIEW_REQUIRED';
  overallConfidence: number;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  minorityOpinions: string[];
  conflictingFindings: string[];
  consensusScore: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  status: string;
  details?: Record<string, any>;
}

export interface ProcurementEvent {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'ALERT';
}

export type DocumentClassification =
  | 'TAX_COMPLIANCE'
  | 'BUSINESS_REGISTRATION'
  | 'FINANCIAL_STATEMENT'
  | 'TECHNICAL_PROPOSAL'
  | 'AGPO_CERTIFICATE'
  | 'BANK_GUARANTEE'
  | 'UNKNOWN';

export type EvaluationStage =
  | 'INTAKE'
  | 'CLASSIFICATION'
  | 'OCR'
  | 'METADATA'
  | 'LEGAL_VALIDATION'
  | 'MANDATORY'
  | 'TECHNICAL'
  | 'FINANCIAL'
  | 'RISK_ASSESSMENT'
  | 'CROSS_VALIDATION'
  | 'RECOMMENDATION'
  | 'OFFICER_APPROVAL';

export interface ManagedDocument {
  id: string;
  name: string;
  size: number;
  uploader: string;
  classification?: DocumentClassification;
  uploadedAt: string;
  status: 'INGESTED' | 'PROCESSING' | 'EVALUATED' | 'FAILED';
  extractedText?: string;
  metadata?: Record<string, any>;
}

export interface ProcurementCase {
  id: string;
  type: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_INVESTIGATION' | 'RESOLVED' | 'DISMISSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedOfficer: string;
  timeline: Array<{
    timestamp: string;
    event: string;
    officer: string;
  }>;
  evidence: string[];
  linkedEntities: string[];
}

export interface GraphProvenance {
  sourceRecordId?: string;
  verificationStatus?: string;
  confidence?: number;
  [key: string]: any;
}

export type GraphRelationshipClass = 'DIRECT' | 'INDIRECT' | 'INFERRED' | 'DERIVED';

export interface GraphNode {
  id: string;
  type: string;
  label: string;
  category?: string;
  attributes?: Record<string, unknown>;
  properties?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  confidence?: number;
  relationshipClass?: GraphRelationshipClass;
  properties?: Record<string, any>;
  provenance?: GraphProvenance;
}

export interface DigitalTwin {
  id: string;
  type: 'SUPPLIER' | 'TENDER' | 'PROJECT' | 'ASSET';
  nodes: GraphNode[];
  edges: GraphEdge[];
  lastUpdated: string;
  riskScore: number;
  complianceStatus: string;
}

export interface ProcurementRule {
  id: string;
  legalSource: string;
  section: string;
  description: string;
  severity: 'MANDATORY' | 'TECHNICAL' | 'FINANCIAL' | 'DISCRETIONARY';
  agentOwnerId: string;
  evidenceRequirements: string[];
  effectiveDate: string;
  version: string;
}

export interface ProcurementHistory {
  id: string;
  entityId: string;
  version: number;
  timestamp: string;
  changes: any;
  officerSignature: string;
}

export interface PredictiveInsight {
  type: 'DELAY' | 'COST_ESCALATION' | 'DISRUPTION' | 'COMPLIANCE_RISK';
  probability: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expectedValue: string;
  evidence: string[];
  historicalBasis: string;
}

export interface DecisionRecommendation {
  id: string;
  evaluationId: string;
  decision: 'AWARD' | 'REJECT' | 'ESCALATE';
  confidence: number;
  evidence: string[];
  statutoryBasis?: string[];
  riskAssessment?: string[];
}
