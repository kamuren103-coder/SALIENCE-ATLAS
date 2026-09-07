import React, { useState } from 'react';
import { 
  FileCheck2, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Search, 
  Scale, 
  Calendar, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ContractObligation {
  id: string;
  contractRef: string;
  title: string;
  contractor: string;
  valueKesM: number;
  activeObligations: number;
  disputeRisk: 'LOW' | 'MEDIUM' | 'ELEVATED';
  statutoryLdStatus: 'NOMINAL' | 'LD_APPLIED' | 'WARN_NOTICE';
  currentMilestone: string;
  dueDate: string;
}

const CONTRACTS: ContractObligation[] = [
  {
    id: 'cnt-01',
    contractRef: 'KETRACO/CNT/400KV/2024-08',
    title: 'EPC Contract for 400kV Olkaria - Lessos Double Circuit Transmission Line',
    contractor: 'Kalpataru Power Transmission Ltd',
    valueKesM: 9800,
    activeObligations: 14,
    disputeRisk: 'LOW',
    statutoryLdStatus: 'NOMINAL',
    currentMilestone: 'Substation Bay Civil Handover & Pre-commissioning',
    dueDate: '2026-11-30',
  },
  {
    id: 'cnt-02',
    contractRef: 'KETRACO/CNT/TRX/2025-12',
    title: 'Manufacturing & Delivery of 250MVA Auto-Transformers for Suswa Substation',
    contractor: 'TBEA Energy International Co., Ltd.',
    valueKesM: 3200,
    activeObligations: 8,
    disputeRisk: 'MEDIUM',
    statutoryLdStatus: 'WARN_NOTICE',
    currentMilestone: 'Factory Acceptance Testing (FAT) in TBEA Plant',
    dueDate: '2026-09-28',
  },
  {
    id: 'cnt-03',
    contractRef: 'KETRACO/CNT/SUB/2025-03',
    title: 'Civil & Foundation Works for Rabai 220kV Substation Expansion',
    contractor: 'Trans-Rift Infrastructure JV',
    valueKesM: 920,
    activeObligations: 6,
    disputeRisk: 'ELEVATED',
    statutoryLdStatus: 'LD_APPLIED',
    currentMilestone: 'Switchyard Control Room Roofing & Drainage',
    dueDate: '2026-08-15',
  },
];

export const ContractIntelligenceModule: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<ContractObligation>(CONTRACTS[0]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">ACTIVE OBLIGATION TWINS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">42 Contracts</div>
          <div className="text-[11px] text-cyan-400 mt-1">CapEx: KES 112.4B</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">CONTRACTUAL MILESTONE HEALTH</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">92.8%</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Within scheduled grace windows</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">LIQUIDATED DAMAGES (LDs)</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">KES 14.2M</div>
          <div className="text-[11px] text-amber-300/80 mt-1">Enforced under PPADA Sec 140</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">DISPUTE ESCALATION RISK</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">1 Case</div>
          <div className="text-[11px] text-cyan-400 mt-1">Dispute Adjudication Board active</div>
        </div>
      </div>

      {/* Contract Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#101827] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-slate-100 text-sm">Autonomous Contract Intelligence Network (ACIN)</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">OBLIGATION LEDGER</span>
          </div>

          <div className="divide-y divide-slate-800/60 flex-1">
            {CONTRACTS.map(contract => {
              const isSelected = selectedContract.id === contract.id;
              return (
                <div
                  key={contract.id}
                  onClick={() => setSelectedContract(contract)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-slate-800/40 ${
                    isSelected ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
                        <span>{contract.contractRef}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{contract.contractor}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-100 mt-1">{contract.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                        <span>Value: <strong className="text-slate-200 font-mono">KES {contract.valueKesM}M</strong></span>
                        <span>Milestone: <span className="text-slate-300">{contract.currentMilestone}</span></span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        contract.disputeRisk === 'LOW'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : contract.disputeRisk === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {contract.disputeRisk} RISK
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Due: {contract.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Contract Details */}
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono text-slate-400">OBLIGATION AUDITOR</span>
              <span className="text-xs font-mono text-cyan-400">PPADA SEC 139</span>
            </div>

            <div className="mt-4 space-y-4">
              <h3 className="text-sm font-semibold text-slate-100">{selectedContract.title}</h3>

              <div className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Contractor:</span>
                  <span className="text-slate-200 font-medium">{selectedContract.contractor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contract Sum:</span>
                  <span className="text-cyan-400 font-mono font-semibold">KES {selectedContract.valueKesM}M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Legal Obligations:</span>
                  <span className="text-slate-200 font-mono">{selectedContract.activeObligations} Clauses Monitored</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Statutory LD Position:</span>
                  <span className="text-amber-400 font-mono font-medium">{selectedContract.statutoryLdStatus}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono text-slate-400">ACTIVE CRITICAL MILESTONE</div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
                  <div className="font-semibold text-slate-100">{selectedContract.currentMilestone}</div>
                  <div className="text-[11px] text-cyan-400 mt-1">Mandatory Deadline: {selectedContract.dueDate}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              Verify Contract Milestone Sign-Off
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
