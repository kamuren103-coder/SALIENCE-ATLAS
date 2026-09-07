import React from 'react';
import { ChevronRight, Radio } from 'lucide-react';
import { ModuleId, Tenant } from '../../types';

interface MinimalPageHeroProps {
  activeModule: ModuleId;
  currentTenant: Tenant;
}

const MODULE_TITLES: Record<ModuleId, { title: string; subtitle: string }> = {
  'overview': {
    title: 'KETRACO National Grid Command Center',
    subtitle: 'Real-time SCADA/EMS telemetry, 400kV/220kV load flows, and digital twin contingency dispatch.'
  },
  'command-center': {
    title: 'KETRACO National Grid Command Center',
    subtitle: 'Real-time SCADA/EMS telemetry, 400kV/220kV load flows, and digital twin contingency dispatch.'
  },
  'grid-corridors': {
    title: 'High-Voltage Transmission Corridors',
    subtitle: 'Multi-circuit impedance monitoring, power transfer limits, and transmission asset telemetry.'
  },
  'drone-intelligence': {
    title: 'Autonomous Drone Grid Inspection AI',
    subtitle: 'Thermal infrared anomaly triage, corona discharge detection, and LiDAR vegetation encroachment.'
  },
  'logistics': {
    title: 'Logistics Command & Heavy-Haul Convoys',
    subtitle: 'Mombasa port clearance, heavy-haul corridor permits, and critical substation spares delivery.'
  },
  'logistics-command': {
    title: 'Logistics Command & Heavy-Haul Convoys',
    subtitle: 'Mombasa port clearance, heavy-haul corridor permits, and critical substation spares delivery.'
  },
  'twin': {
    title: 'SCM Digital Twin & Disruption Simulator',
    subtitle: 'Grid stress testing, port and transport failure sandbox, and automated mitigation playbooks.'
  },
  'procurement-twin': {
    title: 'Procurement Digital Twin & Tender Intelligence',
    subtitle: 'PPADA 2015 statutory rule engine, bidder collusion detection graphs, and award recommendation.'
  },
  'tender': {
    title: 'Tender Intelligence & Bid Evaluation Studio',
    subtitle: 'PPADA statutory compliance scoring, CR12 ownership verification, and bid evaluation matrices.'
  },
  'inventory': {
    title: 'Strategic Transmission Spares & Depot Inventory',
    subtitle: 'Depot stock visibility across Nairobi, Rabai, Olkaria, Lessos, and Turkwel.'
  },
  'project': {
    title: 'Project Supply Nexus & BOM Staging',
    subtitle: 'Material readiness, BOM delivery status, and construction milestones for 400kV/220kV corridors.'
  },
  'supplier': {
    title: 'Supplier Network & Reliability Scorecards',
    subtitle: 'Pre-qualified vendor directory, delivery SLAs, defect rates, and AGPO compliance tracking.'
  },
  'sourcing': {
    title: 'Strategic Sourcing & Spend Analytics',
    subtitle: 'Spend category optimization, bulk equipment framework contracts, and commodity price hedging.'
  },
  'intelligence': {
    title: 'Decision Intelligence & Predictive Watch Center',
    subtitle: 'Real-time multi-source risk signal triaging, anomaly correlation, and incident investigation dossiers.'
  },
  'procurement-graph': {
    title: 'Entity Relationship Knowledge Graph',
    subtitle: 'CR12 corporate ownership graphs, cross-bidder collusion detection, and conflict of interest analysis.'
  },
  'acin': {
    title: 'Autonomous Contract Intelligence Network (ACIN)',
    subtitle: 'Digital contract obligation twins, milestone deliverables, and statutory liquidated damages tracking.'
  },
  'executive': {
    title: 'Executive Board Briefing & Governance Summary',
    subtitle: 'Strategic CapEx absorption, donor disbursements, transmission availability, and board sign-offs.'
  },
  'finance': {
    title: 'Grid Capital, Multi-Donor Projects & Disbursements',
    subtitle: 'World Bank, AfDB, and JICA funding allocation, currency hedged commitments, and CapEx burn rates.'
  },
  'finance-intelligence': {
    title: 'Grid Capital, Multi-Donor Projects & Disbursements',
    subtitle: 'World Bank, AfDB, and JICA funding allocation, currency hedged commitments, and CapEx burn rates.'
  },
  'risk': {
    title: 'Statutory Risk, Legal Directives & Integrity Ledger',
    subtitle: 'Public Procurement and Asset Disposal Act (PPADA) legal validation and immutable audit ledger.'
  },
  'risk-compliance': {
    title: 'Statutory Risk, Legal Directives & Integrity Ledger',
    subtitle: 'Public Procurement and Asset Disposal Act (PPADA) legal validation and immutable audit ledger.'
  },
  'decision': {
    title: 'Decision & Audit Hub (PPADA Statutory Sign-Offs)',
    subtitle: 'Multi-signatory approval workflows, statutory sign-off certificates, and immutable trust ledger.'
  },
  'agents': {
    title: 'Autonomous Agent Platform & Swarm Orchestration',
    subtitle: 'Federated autonomous agent SDK runtime, distributed consensus mesh, and task dispatching.'
  },
  'ai-ops': {
    title: 'AI Operations Center & Model Telemetry',
    subtitle: 'Multi-agent system health, inference throughput, cost metrics, and provider failover.'
  },
  'ai-operations': {
    title: 'AI Operations Center & Model Telemetry',
    subtitle: 'Multi-agent system health, inference throughput, cost metrics, and provider failover.'
  },
  'ai-runtime': {
    title: 'AI Runtime Platform & Enterprise Inference Gateway',
    subtitle: 'Multi-model routing, token quotas, confidential air-gapped compute, and safety filters.'
  },
  'admin': {
    title: 'Administration OS & Multi-Tenant RBAC',
    subtitle: 'Tenant isolation, role-based security clearances, MFA enforcement, and system audit logs.'
  }
};

export const MinimalPageHero: React.FC<MinimalPageHeroProps> = ({
  activeModule,
  currentTenant,
}) => {
  const current = MODULE_TITLES[activeModule] || {
    title: 'Enterprise Intelligence Platform',
    subtitle: 'Operational systems telemetry and predictive analytics.'
  };

  return (
    <div className="px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-2 shrink-0">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span>ATLAS</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-cyan-400 font-semibold">{currentTenant.name}</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-300 capitalize">{activeModule.replace('-', ' ')}</span>
        </div>
        <h1 className="text-sm md:text-base font-semibold text-slate-100 mt-0.5 tracking-tight">
          {current.title}
        </h1>
      </div>

      <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] text-slate-400">
        <p className="max-w-md text-right text-slate-400 text-xs truncate">
          {current.subtitle}
        </p>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-cyan-300">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>LIVE FEED</span>
        </div>
      </div>
    </div>
  );
};
