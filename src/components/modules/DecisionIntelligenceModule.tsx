import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  FileSearch, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  TrendingUp,
  FolderOpen
} from 'lucide-react';

interface CaseItem {
  id: string;
  title: string;
  category: 'GRID_DISRUPTION' | 'PROCUREMENT_FRAUD' | 'LOGISTICS_DELAY' | 'THERMAL_DEFECT';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'OPEN_INVESTIGATION' | 'MITIGATION_PENDING' | 'RESOLVED';
  detectedAt: string;
  summary: string;
  leadInvestigator: string;
}

const CASES_DATA: CaseItem[] = [
  {
    id: 'CASE-2026-089',
    title: 'Anomalous Thermal Hotspot at Suswa 400kV Busbar Joint #4',
    category: 'THERMAL_DEFECT',
    severity: 'CRITICAL',
    status: 'OPEN_INVESTIGATION',
    detectedAt: '2026-09-07 05:22 EAT',
    summary: 'Infrared radiometry registered 84.6°C (38°C above ambient baseline). Emergency switching protocol recommended to prevent catastrophic busbar fault.',
    leadInvestigator: 'Chief Grid Reliability Engineer',
  },
  {
    id: 'CASE-2026-084',
    title: 'Cr12 Directorship Convergence in Bomet 132kV Line Tender',
    category: 'PROCUREMENT_FRAUD',
    severity: 'HIGH',
    status: 'MITIGATION_PENDING',
    detectedAt: '2026-09-06 14:10 EAT',
    summary: 'Two independent bidders share common beneficial ownership via corporate holding registered in Mauritius. Non-compliant with PPADA Section 66.',
    leadInvestigator: 'Legal & Statutory Ethics Counsel',
  },
  {
    id: 'CASE-2026-079',
    title: 'Mariakani Weighbridge Permit Delay for 250MVA Transformer Convoy',
    category: 'LOGISTICS_DELAY',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    detectedAt: '2026-09-05 09:30 EAT',
    summary: 'Axle weight certificate cleared with KeNHA highway authorities. Special police escort deployed for night haulage to Suswa.',
    leadInvestigator: 'Heavy Transport Logistics Command',
  },
];

export const DecisionIntelligenceModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'WATCH_CENTER' | 'CASE_MANAGEMENT'>('WATCH_CENTER');
  const [selectedCase, setSelectedCase] = useState<CaseItem>(CASES_DATA[0]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Sub-tab navigation */}
      <div className="flex border-b border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('WATCH_CENTER')}
          className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
            activeTab === 'WATCH_CENTER'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Predictive Watch Center
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('CASE_MANAGEMENT')}
          className={`px-4 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
            activeTab === 'CASE_MANAGEMENT'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Active Investigations & Cases ({CASES_DATA.length})
        </button>
      </div>

      {/* Top Banner KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">ACTIVE DETECTIONS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">18 Signals</div>
          <div className="text-[11px] text-cyan-400 mt-1">Real-time SCADA + Drone Streams</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">CRITICAL ANOMALIES</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">1 Critical</div>
          <div className="text-[11px] text-rose-300/80 mt-1">Immediate dispatch required</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">MEAN TIME TO TRIAGE</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">3.8 Min</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Automated AI Root Cause</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">STATUTORY RESOLUTION RATE</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">96.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">PPADA compliance certified</div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#101827] border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-slate-100 text-sm">Real-Time Risk Signal Queue</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 animate-pulse">● LIVE TELEMETRY</span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {CASES_DATA.map(caseItem => {
                const isSelected = selectedCase.id === caseItem.id;
                return (
                  <div
                    key={caseItem.id}
                    onClick={() => setSelectedCase(caseItem)}
                    className={`p-4 transition-colors cursor-pointer hover:bg-slate-800/40 ${
                      isSelected ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="text-cyan-400 font-semibold">{caseItem.id}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">{caseItem.category.replace('_', ' ')}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-500">{caseItem.detectedAt}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-100 mt-1">
                          {caseItem.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {caseItem.summary}
                        </p>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                        caseItem.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : caseItem.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}>
                        {caseItem.severity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Active Case Dossier */}
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono text-slate-400">INTELLIGENCE DOSSIER</span>
              <span className="text-xs font-mono text-cyan-400">{selectedCase.id}</span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedCase.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {selectedCase.severity} LEVEL INCIDENT
                </span>
                <h4 className="text-sm font-semibold text-slate-100 mt-2">{selectedCase.title}</h4>
              </div>

              <div className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Investigator:</span>
                  <span className="text-slate-200 font-medium">{selectedCase.leadInvestigator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Case Status:</span>
                  <span className="text-cyan-400 font-mono font-semibold">{selectedCase.status.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-slate-300 font-mono">{selectedCase.detectedAt}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono text-slate-400">EVIDENCE ANALYSIS</div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {selectedCase.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex gap-2">
            <button
              type="button"
              className="flex-1 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Authorize Action
            </button>
            <button
              type="button"
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
            >
              Escalate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
