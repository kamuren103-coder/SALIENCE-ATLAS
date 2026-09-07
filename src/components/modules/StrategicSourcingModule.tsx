import React from 'react';
import { 
  TrendingUp, 
  PieChart, 
  Coins, 
  Tag, 
  Scale, 
  ArrowUpRight, 
  CheckCircle,
  FileCheck
} from 'lucide-react';

export const StrategicSourcingModule: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">ANNUAL SOURCING SPEND</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">KES 38.2B</div>
          <div className="text-[11px] text-cyan-400 mt-1">Substations, Lines & Spares</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">NEGOTIATED SAVINGS</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">KES 2.45B</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">6.4% below budget ceilings</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">BULK FRAMEWORK CONTRACTS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">12 Active</div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-year equipment pricing</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">CURRENCY HEDGED RATIO</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">84.0%</div>
          <div className="text-[11px] text-slate-400 mt-1">USD / EUR / KES exposures</div>
        </div>
      </div>

      {/* Spend Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#101827] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-slate-100 text-sm">Strategic Spend Categories & Sourcing Optimization</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">FY 2026/2027</span>
          </div>

          <div className="space-y-3">
            {[
              { category: 'Heavy Power Transformers & Reactors (400kV/220kV)', spendKesM: 14200, savingsKesM: 980, pct: 37 },
              { category: 'Overhead Conductors, OPGW & Insulator Strings', spendKesM: 11400, savingsKesM: 740, pct: 30 },
              { category: 'GIS / AIS Switchgear & Substation Automation', spendKesM: 7800, savingsKesM: 490, pct: 20 },
              { category: 'Autonomous Drone Grid Monitoring & Survey Fleets', spendKesM: 2600, savingsKesM: 180, pct: 7 },
              { category: 'Emergency Response Tower Kits & Restoration', spendKesM: 2200, savingsKesM: 60, pct: 6 },
            ].map((cat, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-200">{cat.category}</span>
                  <span className="font-mono text-cyan-400 font-bold">KES {cat.spendKesM}M</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-400 h-1.5" style={{ width: `${cat.pct}%` }} />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Share of CapEx: {cat.pct}%</span>
                  <span className="text-emerald-400">Savings achieved: KES {cat.savingsKesM}M</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sourcing Intelligence & Playbook */}
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono text-slate-400">SOURCING ADVISORY</span>
              <span className="text-xs font-mono text-cyan-400">AI OPTIMIZATION</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Consolidated Bulk Buying Opportunity
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aggregating Suswa and Rabai 250MVA auto-transformer tenders into a single multi-lot framework reduces manufacturer unit production costs by 8.5%.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Raw Conductor Hedging
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  London Metal Exchange (LME) aluminum futures indicate a 6-month low. Locking in ACSR conductor pricing today secures KES 210M in cost avoidance.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            Generate Sourcing Strategy Memo
          </button>
        </div>
      </div>
    </div>
  );
};
