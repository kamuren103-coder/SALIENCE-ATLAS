import React, { useState, useEffect } from 'react';
import { Search, Zap, Plane, GitBranch, Truck, Coins, ShieldAlert, Cpu, X, ArrowRight } from 'lucide-react';
import { ModuleId } from '../../types';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: ModuleId) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions: Array<{
    id: ModuleId;
    title: string;
    category: string;
    description: string;
    icon: any;
  }> = [
    {
      id: 'command-center',
      title: 'Open Grid Command Center',
      category: 'Command',
      description: 'Review real-time 400kV/220kV load flows and substation telemetry',
      icon: Zap,
    },
    {
      id: 'grid-corridors',
      title: 'Inspect Transmission Corridors',
      category: 'Corridors',
      description: 'Suswa-Isinya, Olkaria-Dandora, Loiyangalani-Suswa line telemetry',
      icon: Zap,
    },
    {
      id: 'drone-intelligence',
      title: 'Launch Autonomous Drone Inspection',
      category: 'Drones',
      description: 'Analyze thermal infrared hotspots and corona discharge anomalies',
      icon: Plane,
    },
    {
      id: 'logistics-command',
      title: 'Track Transformer Convoys & Spares',
      category: 'Logistics',
      description: 'Mombasa Port clearance status and highway transit ETA',
      icon: Truck,
    },
    {
      id: 'twin',
      title: 'SCM Digital Twin Simulation Sandbox',
      category: 'Digital Twin',
      description: 'Simulate Mombasa port crane failures and transmission line trips',
      icon: GitBranch,
    },
    {
      id: 'tender',
      title: 'Tender Intelligence & PPADA Evaluation',
      category: 'Tenders',
      description: 'Audit high-voltage cable tenders and vendor qualification',
      icon: GitBranch,
    },
    {
      id: 'inventory',
      title: 'Strategic Depot Inventory & Spares',
      category: 'Depots',
      description: 'Monitor substation spares across Nairobi, Rabai, and Olkaria',
      icon: Truck,
    },
    {
      id: 'project',
      title: 'Project Supply Nexus & BOM Staging',
      category: 'Projects',
      description: 'Bill of materials readiness for 400kV Olkaria-Lessos line',
      icon: Zap,
    },
    {
      id: 'supplier',
      title: 'Supplier Network & Reliability Scorecards',
      category: 'Suppliers',
      description: 'Pre-qualified vendor SLAs, on-time deliveries, and defect ratings',
      icon: ShieldAlert,
    },
    {
      id: 'sourcing',
      title: 'Strategic Sourcing & Spend Analytics',
      category: 'Sourcing',
      description: 'Bulk framework contracts and commodity price hedging',
      icon: Coins,
    },
    {
      id: 'intelligence',
      title: 'Decision Intelligence Watch Center',
      category: 'Intelligence',
      description: 'Triage multi-source risk signals and open incident cases',
      icon: Cpu,
    },
    {
      id: 'procurement-graph',
      title: 'Entity Relationship Knowledge Graph',
      category: 'Graph',
      description: 'Trace CR12 beneficial directorships and detect cartel collusion',
      icon: GitBranch,
    },
    {
      id: 'acin',
      title: 'Contract Intelligence Network (ACIN)',
      category: 'Contracts',
      description: 'Digital obligation twins and liquidated damages tracking',
      icon: ShieldAlert,
    },
    {
      id: 'executive',
      title: 'Executive Board Governance Briefing',
      category: 'Executive',
      description: 'Strategic CapEx absorption and transmission reliability review',
      icon: Coins,
    },
    {
      id: 'finance-intelligence',
      title: 'Analyze CapEx & Multi-Donor Funding',
      category: 'Finance',
      description: 'World Bank, AfDB, and JICA loan disbursement rates',
      icon: Coins,
    },
    {
      id: 'risk-compliance',
      title: 'Audit Statutory PPADA Compliance',
      category: 'Risk',
      description: 'Verify KRA Tax, CR12 registers, and AGPO preferences',
      icon: ShieldAlert,
    },
    {
      id: 'decision',
      title: 'Decision & Audit Hub (Statutory Sign-Offs)',
      category: 'Approvals',
      description: 'Accounting officer sign-offs and cryptographic trust ledger',
      icon: ShieldAlert,
    },
    {
      id: 'agents',
      title: 'Autonomous Agent Platform & Swarm',
      category: 'Agents',
      description: 'Orchestrate federated agent runtimes and consensus loops',
      icon: Cpu,
    },
    {
      id: 'ai-operations',
      title: 'AI Operations Center Telemetry',
      category: 'AI Engine',
      description: 'Audit model latencies, token consumption, and gateway failovers',
      icon: Cpu,
    },
    {
      id: 'ai-runtime',
      title: 'AI Runtime Platform & Model Gateway',
      category: 'Inference',
      description: 'Multi-model inference quotas, local Ollama, and safety shields',
      icon: Cpu,
    },
    {
      id: 'admin',
      title: 'Administration OS & Multi-Tenant RBAC',
      category: 'Admin',
      description: 'Operator clearances, MFA enforcement, and access audits',
      icon: ShieldAlert,
    },
  ];

  const filtered = actions.filter(
    a =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.description.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, corridor, or module name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 font-mono">
              No matching commands or entities found for "{query}"
            </div>
          ) : (
            filtered.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => {
                    onNavigate(action.id as ModuleId);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-800/80 border border-transparent hover:border-cyan-500/20 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-slate-800 group-hover:bg-cyan-950/60 border border-slate-700 group-hover:border-cyan-500/30 flex items-center justify-center text-slate-300 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-200">
                        {action.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {action.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {action.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40 text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>Navigate: ↑↓ • Select: Enter</span>
          <span>Close: ESC</span>
        </div>
      </div>
    </div>
  );
};
