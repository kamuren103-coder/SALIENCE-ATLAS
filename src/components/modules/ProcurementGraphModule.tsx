import React, { useState } from 'react';
import { 
  GitFork, 
  Search, 
  Share2, 
  AlertTriangle, 
  Building2, 
  User, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle,
  Network
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: 'SUPPLIER' | 'DIRECTOR' | 'TENDER' | 'CONTRACT';
  riskScore: number;
  connections: string[];
  flaggedReason?: string;
}

const GRAPH_NODES: GraphNode[] = [
  {
    id: 'n-01',
    label: 'TBEA Energy International Co., Ltd.',
    type: 'SUPPLIER',
    riskScore: 12,
    connections: ['t-01', 'd-01'],
  },
  {
    id: 'n-02',
    label: 'Kalpataru Power Transmission Ltd',
    type: 'SUPPLIER',
    riskScore: 68,
    connections: ['t-02', 'd-02', 'd-03'],
    flaggedReason: 'Director shares beneficial interest in competing bidder',
  },
  {
    id: 'n-03',
    label: 'Suswa 400/220kV Transformer Lot 1',
    type: 'TENDER',
    riskScore: 8,
    connections: ['n-01', 'c-01'],
  },
  {
    id: 'n-04',
    label: 'Narok-Bomet 132kV Line Package',
    type: 'TENDER',
    riskScore: 74,
    connections: ['n-02'],
    flaggedReason: 'CR12 Cross-directorship conflict with KETRACO/PT/031/2026',
  },
  {
    id: 'n-05',
    label: 'Eng. Ramesh Patel (Director)',
    type: 'DIRECTOR',
    riskScore: 72,
    connections: ['n-02', 'n-06'],
    flaggedReason: 'Appears as Director on 2 competing bidder registries',
  },
  {
    id: 'n-06',
    label: 'Trans-Rift Infrastructure JV',
    type: 'SUPPLIER',
    riskScore: 70,
    connections: ['n-05', 'n-04'],
    flaggedReason: 'Collusion link established via shared beneficial ownership',
  },
];

export const ProcurementGraphModule: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(GRAPH_NODES[1]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredNodes = GRAPH_NODES.filter(node => {
    return filterType === 'ALL' || node.type === filterType;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">KNOWLEDGE GRAPH ENTITIES</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">1,420</div>
          <div className="text-[11px] text-cyan-400 mt-1">Suppliers, Directors & Contracts</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">RELATIONSHIP EDGES</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">4,812</div>
          <div className="text-[11px] text-slate-400 mt-1">CR12 and BRS verified links</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">COLLUSION CLUSTERS</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">1 Active</div>
          <div className="text-[11px] text-amber-300/80 mt-1">Cross-bidding cluster detected</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">GRAPH TRAVERSAL TIME</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">42ms</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">P95 Subgraph resolution</div>
        </div>
      </div>

      {/* Main Graph Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Canvas / Node explorer */}
        <div className="lg:col-span-2 bg-[#101827] border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-slate-100 text-sm">Entity Twin & Anti-Collusion Graph</h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="bg-[#070b14] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Entity Types</option>
                <option value="SUPPLIER">Suppliers / Vendors</option>
                <option value="DIRECTOR">Beneficial Directors</option>
                <option value="TENDER">Tenders</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-[#070b14]/80 flex-1 min-h-[380px] flex flex-col justify-center">
            {/* Visual network cluster representation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredNodes.map(node => {
                const isSelected = selectedNode.id === node.id;
                const isHighRisk = node.riskScore > 50;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10'
                        : isHighRisk
                        ? 'border-rose-500/40 bg-rose-500/5 hover:border-rose-400'
                        : 'border-slate-800 bg-[#101827] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        node.type === 'SUPPLIER'
                          ? 'bg-blue-500/20 text-blue-300'
                          : node.type === 'DIRECTOR'
                          ? 'bg-violet-500/20 text-violet-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {node.type}
                      </span>
                      <span className={`text-[11px] font-mono font-bold ${
                        isHighRisk ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        Risk: {node.riskScore}%
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-100 mt-2 line-clamp-2">
                      {node.label}
                    </h4>

                    {node.flaggedReason && (
                      <div className="flex items-center gap-1.5 text-[10px] text-rose-300 mt-2">
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span className="truncate">{node.flaggedReason}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Node Details */}
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono text-slate-400">NODE INSPECTOR</span>
              <span className="text-xs font-mono text-cyan-400">{selectedNode.type}</span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">{selectedNode.label}</h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5">ID: {selectedNode.id}</div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#070b14] border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Assessment:</span>
                  <span className={`font-mono font-bold ${
                    selectedNode.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {selectedNode.riskScore}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Direct Edges:</span>
                  <span className="text-slate-200 font-mono">{selectedNode.connections.length} nodes connected</span>
                </div>
              </div>

              {selectedNode.flaggedReason && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    Statutory Collusion Flag
                  </div>
                  <p className="text-[11px] text-rose-200/90 leading-relaxed">
                    {selectedNode.flaggedReason}. Cross-referenced against Kenya Business Registration Service (BRS) CR12 filings.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              Trace Ownership Graph (CR12)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
