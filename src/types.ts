export type ModuleId =
  | 'overview'
  | 'command-center'
  | 'grid-corridors'
  | 'drone-intelligence'
  | 'logistics'
  | 'logistics-command'
  | 'procurement-graph'
  | 'intelligence'
  | 'twin'
  | 'tender'
  | 'procurement-twin'
  | 'project'
  | 'inventory'
  | 'supplier'
  | 'sourcing'
  | 'acin'
  | 'executive'
  | 'risk'
  | 'risk-compliance'
  | 'decision'
  | 'finance'
  | 'finance-intelligence'
  | 'agents'
  | 'ai-ops'
  | 'ai-operations'
  | 'ai-runtime'
  | 'admin';

export interface Tenant {
  id: string;
  name: string;
  code: string;
  badgeColor: string;
  clearanceLevel: string;
  modules: ModuleId[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  accessLevel: string;
  clearance: string;
  tenantId: string;
}

export interface TelemetryState {
  status: string;
  activeCorridors: number;
  inspectionsPending: number;
  gridLoadMw: number;
  renewableSharePct: number;
  activeAlertsCount: number;
  criticalDefects: number;
  timestamp: string;
}

export interface GridCorridor {
  id: string;
  name: string;
  voltage: string;
  lengthKm: number;
  currentLoadMw: number;
  capacityMw: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'ALERT';
  substations: string[];
  anomaliesDetected: number;
}

export interface DroneMission {
  id: string;
  corridorId: string;
  droneModel: string;
  batteryPct: number;
  altitudeM: number;
  status: 'IN_FLIGHT' | 'COMPLETED' | 'STANDBY' | 'ANALYZING';
  findingsCount: number;
  thermalHotspots: number;
  coronaDischarge: boolean;
  vegetationRisk: 'NONE' | 'LOW' | 'HIGH';
}

export interface ProcurementTender {
  id: string;
  title: string;
  tenderNumber: string;
  budgetKes: number;
  biddersCount: number;
  stage: string;
  complianceScore: number;
  status: 'ACTIVE' | 'EVALUATING' | 'AWARDED' | 'FLAGGED';
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface LogisticsConsignment {
  id: string;
  trackingNumber: string;
  description: string;
  origin: string;
  destination: string;
  eta: string;
  status: 'IN_TRANSIT' | 'CUSTOMS_HOLD' | 'DELIVERED' | 'DISPATCHED';
  criticality: 'CRITICAL' | 'NORMAL' | 'HIGH';
  carrier: string;
}

export interface BudgetProject {
  id: string;
  projectName: string;
  donor: string;
  allocatedKesM: number;
  utilizedKesM: number;
  disbursementRatePct: number;
  riskFlag: boolean;
}

export interface AutonomousAgent {
  id: string;
  name: string;
  domain: string;
  status: 'ACTIVE' | 'PROCESSING' | 'IDLE' | 'ALERT';
  confidence: number;
  cyclesCompleted: number;
  currentTask: string;
}
