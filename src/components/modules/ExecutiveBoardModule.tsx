import React from 'react';
import { 
  Award, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Building2, 
  FileText, 
  CheckCircle2, 
  BarChart3,
  Download
} from 'lucide-react';

export const ExecutiveBoardModule: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">TOTAL GRID CAPEX PORTFOLIO</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">KES 142.8B</div>
          <div className="text-[11px] text-cyan-400 mt-1">48 Ongoing Capital Projects</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">NATIONAL TRANSMISSION AVAILABILITY</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">99.18%</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">SAIFI / SAIDI well within ERC bounds</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">STATUTORY AUDIT SCORE</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">98.9%</div>
          <div className="text-[11px] text-cyan-400 mt-1">PPRA / OAG Clean Audit Rating</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">DONOR DISBURSEMENT RATE</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">86.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">World Bank, AfDB, JICA, KfW</div>
        </div>
      </div>

      {/* Board Briefing & Key Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#101827] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-slate-100 text-sm">Executive Board SCM & Capital Governance Briefing</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Q3 FY26 BRIEF</span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100 text-xs">Strategic Capital Absorption</span>
                <span className="text-emerald-400 font-mono text-xs font-bold">KES 32.4B Disbursed</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transmission infrastructure projects achieved an 86.4% disbursement efficiency. Key milestone payments for the Olkaria-Lessos and Mariakani substation works were certified following zero statutory audit objections.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100 text-xs">Autonomous Drone AI ROI</span>
                <span className="text-cyan-400 font-mono text-xs font-bold">+340% Inspection Yield</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                BVLOS autonomous drone patrols across 14 high-voltage corridors caught 38 incipient thermal busbar defects before flashover occurred, averting an estimated KES 420M in unserved power penalties and transformer replacement costs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100 text-xs">PPADA Section 66 Compliance Enforcement</span>
                <span className="text-emerald-400 font-mono text-xs font-bold">100% Digital Traceability</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated CR12 knowledge graph traversal successfully detected and disqualified 1 cartel collusion cluster attempting cross-bid rigging on the Narok-Bomet transmission line package, safeguarding KES 180M in public value.
              </p>
            </div>
          </div>
        </div>

        {/* Board Action Items & Signature Panel */}
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono text-slate-400">BOARD ACTION ITEMS</span>
              <span className="text-xs font-mono text-cyan-400">CONFIDENTIAL</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800 space-y-1 text-xs">
                <div className="font-semibold text-slate-200">1. Suswa Transformer Contract Sign-off</div>
                <div className="text-[11px] text-slate-400">Awaiting Board Procurement Committee sign-off (KES 1.45B).</div>
              </div>
              <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800 space-y-1 text-xs">
                <div className="font-semibold text-slate-200">2. Emergency Spares Reserve Replenishment</div>
                <div className="text-[11px] text-slate-400">Approval for KES 850M switchgear reserve allocation.</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              Download Board Executive Pack (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
