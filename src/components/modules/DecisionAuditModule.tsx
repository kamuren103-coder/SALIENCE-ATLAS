import React from 'react';
import { 
  CheckSquare, 
  Clock, 
  FileText, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle,
  FileCheck2
} from 'lucide-react';

export const DecisionAuditModule: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">PENDING SIGN-OFFS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">3 Decisions</div>
          <div className="text-[11px] text-cyan-400 mt-1">Within statutory deadlines</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">TRUST LEDGER BLOCKS</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">12,480</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Cryptographically chained</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">MULTI-PARTY CONSENSUS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">100%</div>
          <div className="text-[11px] text-slate-400 mt-1">Accounting Officer + Head of SCM</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">AVERAGE APPROVAL CYCLE</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">18 Hours</div>
          <div className="text-[11px] text-slate-400 mt-1">-65% vs paper routing</div>
        </div>
      </div>

      {/* Decision Approvals List */}
      <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-400" />
            <h2 className="font-semibold text-slate-100 text-sm">Statutory Tender Approvals & Cryptographic Trust Ledger</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">PPADA SECTION 84 CERTIFICATION</span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {[
            {
              ref: 'DEC-2026-042',
              tender: 'Supply of 250MVA Auto-Transformers for Suswa Substation',
              committee: 'Tender Evaluation Committee (TEC)',
              signatories: 'Chief Engineer (Substations) • Finance Manager • Legal Counsel',
              status: 'READY_FOR_ACCOUNTING_OFFICER',
              sumKesM: 1450,
            },
            {
              ref: 'DEC-2026-041',
              tender: 'Emergency Spares for Lessos-Turkwel 132kV Protection Upgrade',
              committee: 'Inspection & Acceptance Committee (IAC)',
              signatories: 'Principal Protection Engineer • Depot Manager',
              status: 'APPROVED_AND_LEDGERED',
              sumKesM: 85,
            },
            {
              ref: 'DEC-2026-040',
              tender: 'BVLOS Autonomous Drone Corridor Flight Permit Renewal',
              committee: 'Aviation & Grid Security Council',
              signatories: 'Head of Security • KCAA Liaison Officer',
              status: 'APPROVED_AND_LEDGERED',
              sumKesM: 42,
            },
          ].map((dec, idx) => (
            <div key={idx} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span>{dec.ref}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">{dec.committee}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100 mt-1">{dec.tender}</h3>
                <div className="text-xs text-slate-400 mt-1">
                  Signatories: <span className="text-slate-300">{dec.signatories}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-200 font-bold">
                  KES {dec.sumKesM}M
                </span>
                <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                  dec.status === 'APPROVED_AND_LEDGERED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {dec.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
