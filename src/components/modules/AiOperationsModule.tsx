import React from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  FileCode, 
  Network,
  Radio
} from 'lucide-react';
import { AutonomousAgent } from '../../types';

export const AiOperationsModule: React.FC = () => {
  const agents: AutonomousAgent[] = [
    {
      id: 'agent-kra',
      name: 'KRA Statutory Tax Agent',
      domain: 'Tax Compliance (PPADA Sec 71)',
      status: 'ACTIVE',
      confidence: 0.99,
      cyclesCompleted: 1420,
      currentTask: 'Validating cryptographic TCC PIN tokens against iTax SOAP endpoint'
    },
    {
      id: 'agent-cr12',
      name: 'CR12 Beneficial Ownership Agent',
      domain: 'Corporate Governance & BRS',
      status: 'ACTIVE',
      confidence: 0.97,
      cyclesCompleted: 1104,
      currentTask: 'Running entity resolution to detect cross-bidder directorships'
    },
    {
      id: 'agent-forgery',
      name: 'Forgery & Document Tamper Agent',
      domain: 'Forensic Computer Vision',
      status: 'ACTIVE',
      confidence: 0.98,
      cyclesCompleted: 890,
      currentTask: 'Scanning PDF bank guarantee vector stamps and micro-print fonts'
    },
    {
      id: 'agent-grid-twin',
      name: 'Grid Digital Twin Reasoning Agent',
      domain: 'SCADA Topology Simulation',
      status: 'ACTIVE',
      confidence: 0.99,
      cyclesCompleted: 2480,
      currentTask: 'Computing optimal power flow under simulated N-1 corridor trips'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Federation KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE AUTONOMOUS AGENTS</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">8 Swarm Nodes</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">100% Health & Zero Drift</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CONSENSUS CONVERGENCE</span>
            <Network className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-300">98.4%</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Multi-model voting threshold</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ZERO TRUST AUDIT TRAIL</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">SHA-256</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Every agent decision cryptographically hashed</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AVERAGE LATENCY</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">182 ms</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">Edge accelerated neural pipeline</div>
        </div>
      </div>

      {/* Agents Swarm Table */}
      <div className="atlas-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Multi-Agent Swarm Orchestration & Deliberation Registry</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specialized neural agents inspecting documents, power flows, and contracts autonomously.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Federation Engine: v5.1.0
          </span>
        </div>

        <div className="space-y-3">
          {agents.map(a => (
            <div
              key={a.id}
              className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-2"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{a.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/20">
                      {a.domain}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Radio className="w-2.5 h-2.5 animate-pulse" />
                      <span>{a.status}</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    Current Task: {a.currentTask}
                  </div>
                </div>

                <div className="text-left md:text-right font-mono shrink-0">
                  <div className="text-xs text-emerald-400 font-semibold">
                    Confidence: {(a.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Cycles: {a.cyclesCompleted}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
