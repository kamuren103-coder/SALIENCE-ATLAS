import React, { useState } from 'react';
import { 
  Boxes, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Search, 
  MapPin, 
  ArrowDownRight, 
  ArrowUpRight, 
  Package, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Transformers' | 'Switchgear' | 'Conductors' | 'Protection & Control';
  depot: 'Nairobi Central' | 'Rabai Coastal' | 'Olkaria Geothermal' | 'Lessos Western';
  quantityOnHand: number;
  minThreshold: number;
  unit: string;
  leadTimeDays: number;
  health: 'HEALTHY' | 'LOW' | 'CRITICAL';
  unitCostKes: number;
}

const INVENTORY_DATA: InventoryItem[] = [
  {
    id: 'inv-01',
    sku: 'TX-400KV-BSH-01',
    name: '400kV Porcelain High-Voltage Bushing Set',
    category: 'Transformers',
    depot: 'Nairobi Central',
    quantityOnHand: 4,
    minThreshold: 6,
    unit: 'Sets',
    leadTimeDays: 90,
    health: 'LOW',
    unitCostKes: 8500000,
  },
  {
    id: 'inv-02',
    sku: 'CB-220KV-SF6-04',
    name: '220kV SF6 Live Tank Circuit Breaker Pole Unit',
    category: 'Switchgear',
    depot: 'Rabai Coastal',
    quantityOnHand: 8,
    minThreshold: 4,
    unit: 'Units',
    leadTimeDays: 120,
    health: 'HEALTHY',
    unitCostKes: 14200000,
  },
  {
    id: 'inv-03',
    sku: 'CD-ACSR-ZEBRA-09',
    name: 'ACSR Zebra 400mm² Overhead Conductor Drum',
    category: 'Conductors',
    depot: 'Olkaria Geothermal',
    quantityOnHand: 22,
    minThreshold: 15,
    unit: 'Drums (2km)',
    leadTimeDays: 45,
    health: 'HEALTHY',
    unitCostKes: 3400000,
  },
  {
    id: 'inv-04',
    sku: 'PT-SEL-421-RELAY',
    name: 'SEL-421 High-Speed Transmission Line Protection Relay',
    category: 'Protection & Control',
    depot: 'Lessos Western',
    quantityOnHand: 2,
    minThreshold: 5,
    unit: 'Units',
    leadTimeDays: 30,
    health: 'CRITICAL',
    unitCostKes: 1850000,
  },
  {
    id: 'inv-05',
    sku: 'OPGW-48F-FIBER',
    name: '48-Fiber Optical Ground Wire (OPGW) Cable Drum',
    category: 'Conductors',
    depot: 'Nairobi Central',
    quantityOnHand: 14,
    minThreshold: 10,
    unit: 'Drums',
    leadTimeDays: 60,
    health: 'HEALTHY',
    unitCostKes: 4100000,
  },
];

export const InventoryHubModule: React.FC = () => {
  const [selectedDepot, setSelectedDepot] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = INVENTORY_DATA.filter(item => {
    const matchesDepot = selectedDepot === 'ALL' || item.depot === selectedDepot;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepot && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Inventory Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">TOTAL SPARES VALUATION</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">KES 4.82B</div>
          <div className="text-[11px] text-cyan-400 mt-1">4 National Strategic Depots</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">CRITICAL STOCKOUT RISK</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">2 SKUs</div>
          <div className="text-[11px] text-rose-300/80 mt-1">Below safety stock threshold</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">GRID RESTORATION BUFFER</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">99.2%</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Emergency N-1 spares ready</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">DEADSTOCK INDEX</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">1.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">Well below 5% statutory limit</div>
        </div>
      </div>

      {/* Main Table & Depot Filter */}
      <div className="bg-[#101827] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-cyan-400" />
            <h2 className="font-semibold text-slate-100 text-sm">Strategic Transmission Grid Spares Ledger</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search SKU or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#070b14] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <select
              value={selectedDepot}
              onChange={e => setSelectedDepot(e.target.value)}
              className="bg-[#070b14] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Strategic Depots</option>
              <option value="Nairobi Central">Nairobi Central</option>
              <option value="Rabai Coastal">Rabai Coastal</option>
              <option value="Olkaria Geothermal">Olkaria Geothermal</option>
              <option value="Lessos Western">Lessos Western</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#070b14] text-slate-400 font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">SKU / ITEM</th>
                <th className="px-4 py-3">CATEGORY</th>
                <th className="px-4 py-3">DEPOT LOCATION</th>
                <th className="px-4 py-3">ON HAND / MIN</th>
                <th className="px-4 py-3">LEAD TIME</th>
                <th className="px-4 py-3">UNIT VALUATION</th>
                <th className="px-4 py-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-100">{item.name}</div>
                    <div className="text-[10px] font-mono text-cyan-400">{item.sku}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{item.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.depot}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <span className={`font-semibold ${
                      item.quantityOnHand < item.minThreshold ? 'text-rose-400' : 'text-slate-100'
                    }`}>
                      {item.quantityOnHand}
                    </span>
                    <span className="text-slate-500"> / {item.minThreshold} {item.unit}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-400">
                    {item.leadTimeDays} Days
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-300">
                    KES {(item.unitCostKes / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                      item.health === 'HEALTHY'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : item.health === 'LOW'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {item.health}
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
