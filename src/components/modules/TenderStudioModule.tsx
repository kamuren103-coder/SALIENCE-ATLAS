import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Filter, 
  Scale, 
  UserCheck, 
  Building2,
  TrendingUp,
  Download,
  Eye,
  Check,
  X
} from 'lucide-react';

interface TenderItem {
  id: string;
  referenceNo: string;
  title: string;
  category: string;
  budgetKesM: number;
  bidsSubmitted: number;
  stage: 'TECHNICAL_EVALUATION' | 'FINANCIAL_EVALUATION' | 'STATUTORY_REVIEW' | 'AWARD_RECOMMENDED';
  ppadaStatus: 'COMPLIANT' | 'FLAGGED' | 'UNDER_REVIEW';
  topBidder: string;
  scorePct: number;
  closingDate: string;
}

const TENDERS: TenderItem[] = [
  {
    id: 't-01',
    referenceNo: 'KETRACO/PT/024/2026',
    title: 'Supply and Delivery of 250MVA 400/220kV Auto-Transformers for Suswa Substation',
    category: 'HV Substation Spares',
    budgetKesM: 1450,
    bidsSubmitted: 6,
    stage: 'TECHNICAL_EVALUATION',
    ppadaStatus: 'COMPLIANT',
    topBidder: 'TBEA Energy International Co., Ltd.',
    scorePct: 94.2,
    closingDate: '2026-09-18',
  },
  {
    id: 't-02',
    referenceNo: 'KETRACO/PT/031/2026',
    title: 'Design, Supply & Erection of 132kV Double Circuit Transmission Line (Narok-Bomet)',
    category: 'Transmission Lines',
    budgetKesM: 3200,
    bidsSubmitted: 9,
    stage: 'FINANCIAL_EVALUATION',
    ppadaStatus: 'FLAGGED',
    topBidder: 'Kalpataru Power Transmission Ltd',
    scorePct: 88.7,
    closingDate: '2026-09-22',
  },
  {
    id: 't-03',
    referenceNo: 'KETRACO/PT/045/2026',
    title: 'Deployment of Autonomous BVLOS Drone Inspection Fleet and AI Defect Analysis',
    category: 'Grid Technology',
    budgetKesM: 480,
    bidsSubmitted: 4,
    stage: 'STATUTORY_REVIEW',
    ppadaStatus: 'COMPLIANT',
    topBidder: 'Aerotas Africa Geospatial Consortium',
    scorePct: 96.0,
    closingDate: '2026-10-05',
  },
  {
    id: 't-04',
    referenceNo: 'KETRACO/PT/052/2026',
    title: 'Optical Ground Wire (OPGW) Retrofit for 220kV Mombasa-Nairobi Transmission Link',
    category: 'Telecom & Protection',
    budgetKesM: 890,
    bidsSubmitted: 5,
    stage: 'AWARD_RECOMMENDED',
    ppadaStatus: 'COMPLIANT',
    topBidder: 'Prysmian Cables & Systems FZE',
    scorePct: 91.5,
    closingDate: '2026-08-30',
  },
];

export const TenderStudioModule: React.FC = () => {
  const [selectedTender, setSelectedTender] = useState<TenderItem>(TENDERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<string>('ALL');

  const filtered = TENDERS.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.referenceNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === 'ALL' || t.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & KPI metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">ACTIVE TENDERS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">24</div>
          <div className="text-[11px] text-cyan-400 mt-1">Total CapEx: KES 18.4B</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">PPADA 2015 COMPLIANCE</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">98.5%</div>
          <div className="text-[11px] text-slate-400 mt-1">0 Section 66 Disqualifications</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">COLLUSION CHECKS</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">1 Flag</div>
          <div className="text-[11px] text-amber-300/80 mt-1">CR12 Shared Director Detected</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">AVG EVALUATION CYCLE</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">14.2 Days</div>
          <div className="text-[11px] text-emerald-400 mt-1">-38% vs 2025 benchmark</div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tender Registry */}
        <div className="lg:col-span-2 bg-[#101827] border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-slate-100 text-sm">Procurement Tender Workspace</h2>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tenders..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#070b14] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <select
                value={filterStage}
                onChange={e => setFilterStage(e.target.value)}
                className="bg-[#070b14] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Stages</option>
                <option value="TECHNICAL_EVALUATION">Technical</option>
                <option value="FINANCIAL_EVALUATION">Financial</option>
                <option value="STATUTORY_REVIEW">Statutory</option>
                <option value="AWARD_RECOMMENDED">Awarded</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[520px]">
            {filtered.map(tender => {
              const isSelected = selectedTender.id === tender.id;
              return (
                <div
                  key={tender.id}
                  onClick={() => setSelectedTender(tender)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-slate-800/40 ${
                    isSelected ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
                        <span>{tender.referenceNo}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{tender.category}</span>
                      </div>
                      <h3 className="text-sm font-medium text-slate-100 mt-1 line-clamp-1">
                        {tender.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                        <span>Budget: <strong className="text-slate-200 font-mono">KES {tender.budgetKesM}M</strong></span>
                        <span>Bids: <strong className="text-slate-200 font-mono">{tender.bidsSubmitted}</strong></span>
                        <span>Closing: <span className="font-mono text-slate-300">{tender.closingDate}</span></span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                        tender.ppadaStatus === 'COMPLIANT' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {tender.ppadaStatus}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Top Score: <span className="text-cyan-400 font-semibold">{tender.scorePct}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Tender Statutory Dossier */}
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono text-slate-400">STATUTORY DOSSIER</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                PPADA SEC. 80-86
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="text-xs text-slate-500 font-mono">{selectedTender.referenceNo}</div>
                <h4 className="text-sm font-semibold text-slate-100 mt-0.5">{selectedTender.title}</h4>
              </div>

              <div className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Leading Evaluated Bidder:</span>
                  <span className="text-slate-200 font-medium">{selectedTender.topBidder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Technical Qualification:</span>
                  <span className="text-emerald-400 font-mono font-semibold">{selectedTender.scorePct}% (PASSED)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tender Security Bond:</span>
                  <span className="text-slate-200 font-mono">KES 14.5M (KCB Bank Kenya)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tax Compliance Certificate:</span>
                  <span className="text-emerald-400 font-medium">Valid (KRA Verified)</span>
                </div>
              </div>

              {/* Legal Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400">MANDATORY STATUTORY CHECKS</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-300">AGPO Citizen Contractor Margin (15%)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-300">CR12 Beneficial Ownership Registry</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/80">
                    <span className="text-slate-300">Anti-Bribery & Ethics Affidavit</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex gap-2">
            <button
              type="button"
              className="flex-1 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Sign Off Evaluation
            </button>
            <button
              type="button"
              className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Audit Pack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
