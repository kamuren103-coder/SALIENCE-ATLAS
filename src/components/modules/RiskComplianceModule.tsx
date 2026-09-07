import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileSpreadsheet, 
  Lock, 
  Scale, 
  FileCheck,
  Building2
} from 'lucide-react';

export const RiskComplianceModule: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">STATUTORY AUDIT LEDGER</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">2,840 Records</div>
          <div className="text-[11px] text-cyan-400 mt-1">Immutable SHA-256 Hashes</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">PPADA 2015 COMPLIANCE</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">100%</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Full Section 66-140 Coverage</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">CONFLICT TRIGGERS</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">1 Active Alert</div>
          <div className="text-[11px] text-amber-300/80 mt-1">CR12 Beneficial Directorship link</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">AUDITOR GENERAL CERTIFICATION</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">Unqualified</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero material findings</div>
        </div>
      </div>

      {/* Main Checklist & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#101827] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-slate-100 text-sm">PPADA 2015 Statutory Compliance Matrix</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">● FULL AUDIT PASS</span>
          </div>

          <div className="space-y-3">
            {[
              { section: 'Section 66', title: 'Collusion & Directorship Cross-Holding Verification', status: 'PASS', details: 'Automated BRS/CR12 traversal performed on all 24 active tender bidder pools.' },
              { section: 'Section 71', title: 'Tender Security & Performance Bond Validity', status: 'PASS', details: 'Direct API handshake with Central Bank of Kenya licensed commercial banks.' },
              { section: 'Section 80', title: 'Evaluation Criteria Non-Deviation Enforcement', status: 'PASS', details: 'Technical scoring matrix strictly bound to advertised tender specifications.' },
              { section: 'Section 139', title: 'Contract Variation & Price Escalation Limits (15% Cap)', status: 'PASS', details: 'All milestone payments validated against original contract sums.' },
            ].map((rule, idx) => (
              <div key={idx} className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                      {rule.section}
                    </span>
                    <span className="text-xs font-medium text-slate-100">{rule.title}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">{rule.status}</span>
                </div>
                <p className="text-xs text-slate-400 pl-1">{rule.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Evidence Export */}
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono text-slate-400">IMMUTABLE LEDGER</span>
              <span className="text-xs font-mono text-cyan-400">SHA-256</span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800 space-y-1">
                <div className="text-slate-400 font-mono text-[10px]">LATEST AUDIT BLOCK HASH</div>
                <div className="font-mono text-cyan-400 text-[11px] break-all">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800 space-y-1">
                <div className="text-slate-400">Signed By:</div>
                <div className="text-slate-200 font-medium">Head of Internal Audit & Ethics</div>
                <div className="text-slate-500 font-mono text-[10px]">Timestamp: 2026-09-07 05:00:00 EAT</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <FileCheck className="w-3.5 h-3.5" />
              Export Statutory Audit Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
