import React from 'react';
import { 
  Cpu, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Server, 
  Zap, 
  Database,
  BarChart2
} from 'lucide-react';

export const AiRuntimeModule: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">INFERENCE GATEWAY</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">Multi-Model</div>
          <div className="text-[11px] text-cyan-400 mt-1">Cloud + Air-Gapped Local</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">TOKEN CONSUMPTION</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">4.2M Tokens</div>
          <div className="text-[11px] text-emerald-400 mt-1">KES 14,200 total cost</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">SAFETY SHIELD PASS</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">99.98%</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero prompt leakage</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">GATEWAY UPTIME</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">99.99%</div>
          <div className="text-[11px] text-slate-400 mt-1">Redundant fallback circuit</div>
        </div>
      </div>

      {/* Model Providers */}
      <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h2 className="font-semibold text-slate-100 text-sm">Enterprise AI Governance & Inference Gateway</h2>
          </div>
          <span className="text-xs font-mono text-cyan-400">ACTIVE PROVIDER MESH</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Gemini 2.5 Flash',
              type: 'Cloud High-Throughput Reasoning',
              status: 'PRIMARY_REASONER',
              latency: '320ms',
              load: '64%',
            },
            {
              name: 'Ollama Llama-3-70B Air-Gapped',
              type: 'Local On-Premises Confidential Grid',
              status: 'FALLBACK_READY',
              latency: '840ms',
              load: '22%',
            },
            {
              name: 'YOLOv11-Thermal Fine-Tuned',
              type: 'BVLOS Drone Edge Vision',
              status: 'EDGE_ONLINE',
              latency: '14ms',
              load: '81%',
            },
          ].map((provider, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-slate-100">{provider.name}</h3>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400">{provider.type}</p>
              <div className="pt-2 border-t border-slate-800/80 flex justify-between text-xs font-mono text-slate-300">
                <span>Latency: <strong className="text-cyan-400">{provider.latency}</strong></span>
                <span>Load: <strong className="text-emerald-400">{provider.load}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
