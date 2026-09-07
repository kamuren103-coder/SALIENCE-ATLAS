import React from 'react';
import { 
  Coins, 
  TrendingUp, 
  PieChart, 
  Building, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { BudgetProject } from '../../types';

export const FinanceIntelligenceModule: React.FC = () => {
  const projects: BudgetProject[] = [
    {
      id: 'PRJ-WB-01',
      projectName: 'Kenya Electricity Transmission System Improvement (KETRIP)',
      donor: 'World Bank (IDA Credit)',
      allocatedKesM: 28400,
      utilizedKesM: 21600,
      disbursementRatePct: 76,
      riskFlag: false
    },
    {
      id: 'PRJ-AFDB-02',
      projectName: 'Kenya – Tanzania 400kV Power Interconnection Project',
      donor: 'African Development Bank (AfDB)',
      allocatedKesM: 14200,
      utilizedKesM: 13100,
      disbursementRatePct: 92,
      riskFlag: false
    },
    {
      id: 'PRJ-JICA-03',
      projectName: 'Olkaria – Lessos – Kisumu 220kV Transmission Ring',
      donor: 'JICA (Japan)',
      allocatedKesM: 18900,
      utilizedKesM: 16800,
      disbursementRatePct: 89,
      riskFlag: false
    },
    {
      id: 'PRJ-GOK-04',
      projectName: 'National Last-Mile Substation Intertie Program (GoK Counterpart)',
      donor: 'Government of Kenya Exchequer',
      allocatedKesM: 8500,
      utilizedKesM: 5200,
      disbursementRatePct: 61,
      riskFlag: true
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Funding Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL TRANSMISSION CAPEX</span>
            <Coins className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">KES 70.0B</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">Multilateral development loan portfolio</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>OVERALL DISBURSEMENT</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-300">81.0%</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">KES 56.7B cumulative drawdowns</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>FX HEDGE RATIO (USD/KES)</span>
            <PieChart className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">94.2%</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Central Bank sovereign FX shield</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AUDIT COMPLIANCE SCORE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">Unqualified</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">Office of the Auditor General cleared</div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="atlas-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Multi-Donor Transmission Projects & Budget Absorption</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracking allocations, contractor milestone drawdowns, and donor disbursement covenants.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            FY 2025/2026
          </span>
        </div>

        <div className="space-y-3">
          {projects.map(p => (
            <div
              key={p.id}
              className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-2"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-cyan-400">{p.id}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {p.donor}
                    </span>
                    {p.riskFlag && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Counterpart Delay</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1">
                    {p.projectName}
                  </div>
                </div>

                <div className="text-left md:text-right font-mono shrink-0">
                  <div className="text-xs text-slate-200 font-semibold">
                    KES {(p.utilizedKesM / 1000).toFixed(1)}B / {(p.allocatedKesM / 1000).toFixed(1)}B
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Disbursement: {p.disbursementRatePct}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${p.disbursementRatePct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
