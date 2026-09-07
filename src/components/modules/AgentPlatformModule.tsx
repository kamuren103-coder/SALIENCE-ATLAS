import React from 'react';
import { 
  Bot, 
  Cpu, 
  Activity, 
  CheckCircle, 
  Radio, 
  Zap, 
  Play, 
  RotateCw,
  GitMerge
} from 'lucide-react';

export const AgentPlatformModule: React.FC = () => {
  const agents = [
    {
      id: 'agent-grid-scada-01',
      name: 'Grid Telemetry & Frequency Sentinel',
      domain: 'National SCADA Telemetry',
      status: 'ACTIVE',
      cycles: '142,890',
      latency: '18ms',
      lastAction: 'Substation Busbar Impedance Scan (Suswa 400kV)',
    },
    {
      id: 'agent-drone-vision-02',
      name: 'BVLOS Thermal Hotspot Analyzer',
      domain: 'Computer Vision & Infrared',
      status: 'ACTIVE',
      cycles: '64,120',
      latency: '42ms',
      lastAction: 'Corona Discharge Filter Applied (Olkaria-Lessos Tower #184)',
    },
    {
      id: 'agent-ppada-auditor-03',
      name: 'PPADA 2015 Statutory Governance Agent',
      domain: 'Legal & Procurement Ethics',
      status: 'ACTIVE',
      cycles: '28,450',
      latency: '24ms',
      lastAction: 'CR12 Beneficial Directorship Cross-Verification',
    },
    {
      id: 'agent-logistics-convoy-04',
      name: 'Heavy-Haul Route Clearance Agent',
      domain: 'Transport Logistics',
      status: 'ACTIVE',
      cycles: '19,830',
      latency: '35ms',
      lastAction: 'Weighbridge Gross Tonnage Certificate Ingestion',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">FEDERATED AGENTS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">4 Active Swarms</div>
          <div className="text-[11px] text-cyan-400 mt-1">Autonomous reasoning runtime</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">TOTAL INFERENCE CYCLES</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">255,290</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Zero deadlocks recorded</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">P95 INFERENCE LATENCY</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">28.4 ms</div>
          <div className="text-[11px] text-cyan-400 mt-1">Sub-second swarm consensus</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">STATUTORY BOUNDARY CHECKS</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">100% Guarded</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero unauthorized actions</div>
        </div>
      </div>

      {/* Agents Mesh */}
      <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2 className="font-semibold text-slate-100 text-sm">Agent SDK Runtime & Autonomous Swarm Mesh</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SWARM CONSENSUS ONLINE
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map(agent => (
            <div key={agent.id} className="p-4 rounded-xl bg-[#070b14] border border-slate-800/90 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-100 text-sm">{agent.name}</h3>
                  <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{agent.id}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  {agent.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px]">CYCLES:</span>
                  <div className="text-slate-100 font-bold">{agent.cycles}</div>
                </div>
                <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 text-[10px]">P95 LATENCY:</span>
                  <div className="text-cyan-400 font-bold">{agent.latency}</div>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded border border-slate-800/80">
                <span className="text-slate-500 font-mono text-[10px]">CURRENT ACTION: </span>
                {agent.lastAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
