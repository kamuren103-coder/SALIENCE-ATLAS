import React, { useState } from 'react';
import { 
  GitBranch, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Building2, 
  Search,
  ExternalLink
} from 'lucide-react';
import { ProcurementTender } from '../../types';

export const ProcurementDigitalTwinModule: React.FC = () => {
  const [selectedTender, setSelectedTender] = useState<string>('TND-2026-NVS');

  const tenders: ProcurementTender[] = [
    {
      id: 'TND-2026-NVS',
      title: 'Naivasha 400kV Substation High-Voltage Underground Cable Extension',
      tenderNumber: 'KTR/PROC/TND/2026/088',
      budgetKes: 650000000,
      biddersCount: 6,
      stage: 'TECHNICAL_EVALUATION',
      complianceScore: 94,
      status: 'EVALUATING',
      riskRating: 'LOW'
    },
    {
      id: 'TND-2026-SUS',
      title: 'Suswa Phase II Converter Valve Thyristor Spares & Maintenance',
      tenderNumber: 'KTR/PROC/TND/2026/042',
      budgetKes: 1200000000,
      biddersCount: 4,
      stage: 'FINANCIAL_OPENING',
      complianceScore: 98,
      status: 'ACTIVE',
      riskRating: 'LOW'
    },
    {
      id: 'TND-2026-MSA',
      title: 'Mombasa – Rabai 220kV Insulator String Replacement & Anti-Corrosion',
      tenderNumber: 'KTR/PROC/TND/2026/104',
      budgetKes: 380000000,
      biddersCount: 8,
      stage: 'MANDATORY_STATUTORY_CHECK',
      complianceScore: 76,
      status: 'FLAGGED',
      riskRating: 'HIGH'
    }
  ];

  const current = tenders.find(t => t.id === selectedTender) || tenders[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE GRID TENDERS</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">KES 2.23B</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">3 major transmission packages</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PPADA 2015 COMPLIANCE</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-300">100% Verified</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">Statutory legal gatekeeper active</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AGPO PARTICIPATION</span>
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">32.4%</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Above 30% statutory mandate</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>COLLUSION RISK ALERTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-300">1 Flagged</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Shared CR12 director detected</div>
        </div>
      </div>

      {/* Main Procurement Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenders Selector (1 Col) */}
        <div className="atlas-card p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>Grid Tender Packages</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select tender to inspect digital twin evaluation graph.
            </p>
          </div>

          <div className="space-y-3">
            {tenders.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTender(t.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                  selectedTender === t.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-100'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold">{t.tenderNumber}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      t.riskRating === 'LOW'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {t.riskRating} RISK
                  </span>
                </div>
                <div className="text-xs text-slate-200 mt-1 font-medium line-clamp-2">
                  {t.title}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-2 flex items-center justify-between">
                  <span>Budget: KES {(t.budgetKes / 1000000).toFixed(0)}M</span>
                  <span>{t.biddersCount} Bidders</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Digital Twin Evaluation Ledger (2 Cols) */}
        <div className="lg:col-span-2 atlas-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>PPADA Statutory Evaluation Twin — {current.id}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {current.tenderNumber} • Stage: {current.stage}
              </p>
            </div>
            <div className="font-mono text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Score: {current.complianceScore}%</span>
            </div>
          </div>

          {/* Statutory Rule Verification Breakdown */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">1. PPADA 2015 Section 71(1)(b) — Tax Compliance</span>
                <span className="text-emerald-400 font-bold">COMPLIANT</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Automated API validation against KRA iTax registry completed for all 6 submitted PINs. Current valid TCC tokens verified with digital signatures.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">2. PPADA 2015 Section 71(1)(a) — CR12 Business Registration</span>
                <span className="text-emerald-400 font-bold">COMPLIANT</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Business registration and director shareholding verified against Business Registration Service (BRS). Entity resolution confirmed independent beneficial ownership.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 font-semibold">3. PPADR 2020 Reg 101 — Financial & Bank Guarantee Verification</span>
                <span className="text-emerald-400 font-bold">COMPLIANT</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tender security bond verified directly with Tier-1 Commercial Bank SWIFT message authentication. Minimum turnover threshold (KES 1.2B) satisfied.
              </p>
            </div>

            {current.riskRating === 'HIGH' && (
              <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 space-y-2 text-xs">
                <div className="font-semibold flex items-center gap-1.5 text-amber-200 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>POTENTIAL COLLUSION GRAPH ALERT</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  Bidder #3 (Coast High Voltage Ltd) and Bidder #7 (Kilifi Transformers Ltd) share a common corporate secretary and bank branch in Mombasa. Escalated to Accounting Officer per PPADA Sec 70.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
