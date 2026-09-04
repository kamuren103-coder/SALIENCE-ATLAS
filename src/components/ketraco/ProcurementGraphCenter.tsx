import React, { useState, useEffect } from 'react';
import RelationshipExplorer from '../graph/RelationshipExplorer';
import SupplierTwin from '../twin/SupplierTwin';
import TenderTwin from '../twin/TenderTwin';
import OrganizationTwin from '../twin/OrganizationTwin';
import { fetchFullGraph, fetchSupplierTwin, fetchTenderTwin, fetchOrganizationTwin } from '../../utils/graph-service';
import { GraphNode, GraphEdge, DigitalTwin } from '../../types/evaluation';
import { Network, UserCheck, FileText, Search, ShieldAlert, GitBranch, Landmark, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AtlasMissionBrief } from '../ui/atlas/AtlasMissionBrief';
import { AtlasAgentPulse, DEFAULT_ENTERPRISE_AGENTS } from '../ui/atlas/AtlasAgentPulse';

const ProcurementGraphCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explorer' | 'supplier' | 'tender' | 'organization'>('explorer');
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({ nodes: [], edges: [] });
  const [selectedSupplier, setSelectedSupplier] = useState<string>('supplier-shanghai');
  const [selectedTender, setSelectedTender] = useState<string>('tender-2026-08');
  const [selectedOrg, setSelectedOrg] = useState<string>('ent-ketraco');
  const [supplierTwin, setSupplierTwin] = useState<DigitalTwin | null>(null);
  const [tenderTwin, setTenderTwin] = useState<DigitalTwin | null>(null);
  const [orgTwin, setOrgTwin] = useState<DigitalTwin | null>(null);
  const [loading, setLoading] = useState(true);
  const [agentsOpen, setAgentsOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const graph = await fetchFullGraph();
      setGraphData(graph);
      
      const sTwin = await fetchSupplierTwin(selectedSupplier);
      setSupplierTwin(sTwin);
      
      const tTwin = await fetchTenderTwin(selectedTender);
      setTenderTwin(tTwin);

      const oTwin = await fetchOrganizationTwin(selectedOrg);
      setOrgTwin(oTwin);
    } catch (err) {
      console.error('Failed to load graph data:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'explorer', label: 'Relationship Explorer', icon: Network },
    { id: 'supplier', label: 'Supplier Digital Twin', icon: UserCheck },
    { id: 'tender', label: 'Tender Digital Twin', icon: FileText },
    { id: 'organization', label: 'Organization Twin', icon: Landmark }
  ];

  return (
    <div className="flex flex-col h-full bg-[#05070D] space-y-3 overflow-hidden" id="procurement-graph-center">
      {/* Mission Brief — knowledge graph operating statement */}
      <AtlasMissionBrief
        moduleLabel="Knowledge Graph"
        mission="Enterprise relationships mapped, traversed and reasoned over."
        description="Enterprise Procurement Relationship Intelligence Layer — suppliers, tenders, organizations and assets as one connected web."
        metrics={[
          { label: 'Nodes', value: graphData.nodes.length, icon: Network, tone: 'info' },
          { label: 'Edges', value: graphData.edges.length, icon: GitBranch, tone: 'healthy' },
          { label: 'Active Conflicts', value: 2, icon: ShieldAlert, tone: 'risk' },
          { label: 'Graph Engine', value: 'SYNCED', icon: Activity, tone: 'healthy' },
        ]}
      />

      <div className="px-5">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#0B1220] border border-slate-800/70 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#101827] text-cyan-300 shadow-sm border border-cyan-500/20' 
                  : 'text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative px-5">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#05070D]/60 backdrop-blur-sm rounded-2xl border border-slate-800/60 z-10"
            >
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400 font-medium">Reconstructing Procurement Graph...</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full overflow-y-auto"
            >
              {activeTab === 'explorer' && (
                <RelationshipExplorer initialNodes={graphData.nodes} initialEdges={graphData.edges} />
              )}
              {activeTab === 'supplier' && supplierTwin && (
                <SupplierTwin twin={supplierTwin} />
              )}
              {activeTab === 'tender' && tenderTwin && (
                <TenderTwin twin={tenderTwin} />
              )}
              {activeTab === 'organization' && orgTwin && (
                <OrganizationTwin twin={orgTwin} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Footer Info */}
      <div className="flex items-center justify-between px-5 pb-2">
        <div className="flex items-center gap-6 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            Nodes: {graphData.nodes.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Edges: {graphData.edges.length}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Active Conflicts: 2
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-colors">
            <ShieldAlert size={14} />
            Run Collusion Intelligence Scan
          </button>
        </div>
      </div>

      {/* Contextual Intelligence rail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 px-5 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-500">
          <div className="flex items-baseline gap-1">Integrated across</div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B1220] hover:bg-[#101827] border border-slate-800/70 rounded-xl text-cyan-300 transition-all cursor-pointer">
            <Search size={12} /> Traverse Entity Graph
          </button>
        </div>
        <AtlasAgentPulse agents={DEFAULT_ENTERPRISE_AGENTS} expanded={agentsOpen} onToggle={() => setAgentsOpen(o => !o)} />
      </div>
    </div>
  );
};

export default ProcurementGraphCenter;
