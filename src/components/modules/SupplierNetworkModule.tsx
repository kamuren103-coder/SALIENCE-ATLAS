import React, { useState } from 'react';
import { 
  Building2, 
  Star, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Award, 
  Clock,
  TrendingUp
} from 'lucide-react';

interface SupplierItem {
  id: string;
  name: string;
  country: string;
  category: string;
  activeContractsKesM: number;
  deliveryPerformancePct: number;
  qualityDefectRatePct: number;
  ratingTier: 'TIER_1' | 'TIER_2' | 'WATCHLIST';
  ppadaCertified: boolean;
}

const SUPPLIERS_DATA: SupplierItem[] = [
  {
    id: 'sup-01',
    name: 'TBEA Energy International Co., Ltd.',
    country: 'China',
    category: 'Power Transformers (250MVA+)',
    activeContractsKesM: 3200,
    deliveryPerformancePct: 98.2,
    qualityDefectRatePct: 0.1,
    ratingTier: 'TIER_1',
    ppadaCertified: true,
  },
  {
    id: 'sup-02',
    name: 'Kalpataru Power Transmission Ltd',
    country: 'India',
    category: 'EPC Overhead Transmission Lines',
    activeContractsKesM: 5400,
    deliveryPerformancePct: 89.4,
    qualityDefectRatePct: 1.2,
    ratingTier: 'TIER_2',
    ppadaCertified: true,
  },
  {
    id: 'sup-03',
    name: 'Prysmian Cables & Systems FZE',
    country: 'Italy / UAE',
    category: 'HV Underground & Subsea Cables',
    activeContractsKesM: 1850,
    deliveryPerformancePct: 96.8,
    qualityDefectRatePct: 0.2,
    ratingTier: 'TIER_1',
    ppadaCertified: true,
  },
  {
    id: 'sup-04',
    name: 'Trans-Rift Infrastructure JV',
    country: 'Kenya',
    category: 'Substation Civil & Foundation Works',
    activeContractsKesM: 920,
    deliveryPerformancePct: 74.0,
    qualityDefectRatePct: 3.8,
    ratingTier: 'WATCHLIST',
    ppadaCertified: false,
  },
];

export const SupplierNetworkModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = SUPPLIERS_DATA.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Row KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">QUALIFIED VENDORS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">148</div>
          <div className="text-[11px] text-cyan-400 mt-1">Pre-qualified under PPADA 2015</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">ON-TIME DELIVERY (OTD)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">94.6%</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Substation & line spares</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">WATCHLIST RISK</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">3 Vendors</div>
          <div className="text-[11px] text-rose-300/80 mt-1">Performance SLA breaches</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">LOCAL AGPO CONTENT</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">32.8%</div>
          <div className="text-[11px] text-slate-400 mt-1">Exceeds 30% statutory minimum</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#101827] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h2 className="font-semibold text-slate-100 text-sm">Pre-Qualified Vendor Network & Reliability Scorecards</h2>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendor or category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#070b14] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#070b14] text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">SUPPLIER / ENTITY</th>
                <th className="px-4 py-3">CORE DOMAIN</th>
                <th className="px-4 py-3">ACTIVE CONTRACTS</th>
                <th className="px-4 py-3">ON-TIME DELIVERY</th>
                <th className="px-4 py-3">DEFECT RATE</th>
                <th className="px-4 py-3">PPADA STATUS</th>
                <th className="px-4 py-3">RATING TIER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map(supplier => (
                <tr key={supplier.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-100">{supplier.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{supplier.country} • {supplier.id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{supplier.category}</td>
                  <td className="px-4 py-3 font-mono text-cyan-400 font-semibold">
                    KES {supplier.activeContractsKesM}M
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <span className={supplier.deliveryPerformancePct >= 90 ? 'text-emerald-400' : 'text-amber-400'}>
                      {supplier.deliveryPerformancePct}%
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400">
                    {supplier.qualityDefectRatePct}%
                  </td>
                  <td className="px-4 py-3">
                    {supplier.ppadaCertified ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-medium">
                        CERTIFIED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono font-medium">
                        RESTRICTED
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      supplier.ratingTier === 'TIER_1'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : supplier.ratingTier === 'TIER_2'
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {supplier.ratingTier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
