import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Cpu, ScrollText, HardDrive, 
  RefreshCw, Eye, AlertTriangle, CheckCircle2, 
  Search, BookOpen, Clock, ChevronRight, Lock, 
  AlertCircle, FileText, Sparkles, Sliders, Info, 
  Check, Trash2, Upload, FileCheck, X, HelpCircle, 
  Save, Plus, ChevronDown, ChevronUp, History,
  Database, Fingerprint, Scale, Binary, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ManagedDocument, AgentStatus, EvaluationFinding, 
  ProcurementEvent, ProcurementRule 
} from '../../../../types/evaluation';

// Sub-components
import { IntakeLayer } from './IntakeLayer';
import { AgentStatusPanel } from './AgentStatusPanel';
import { ActivityStream } from './ActivityStream';
import { ReasoningPanel } from './ReasoningPanel';
import { EvidenceGraph } from './EvidenceGraph';
import { RuleEngineView } from './RuleEngineView';
import { ProcurementTimeline } from './ProcurementTimeline';
import { AuditLogView } from './AuditLogView';
import { MultiStagePipeline } from './MultiStagePipeline';
import { AgentRegistry } from './AgentRegistry';
import { ExecutiveMonitoring } from './ExecutiveMonitoring';
import { RiskIntelligence } from './RiskIntelligence';
import { ExplainableScorecard } from './ExplainableScorecard';
import DecisionIntelligenceWorkspace from '../../../intelligence/DecisionIntelligenceWorkspace';

export default function EnterpriseEvaluationEngine() {
  const [documents, setDocuments] = useState<ManagedDocument[]>([]);
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [activity, setActivity] = useState<ProcurementEvent[]>([]);
  const [findings, setFindings] = useState<EvaluationFinding[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [showReasoning, setShowReasoning] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflow' | 'agents' | 'rules' | 'audit' | 'timeline' | 'monitoring' | 'risk' | 'scorecard' | 'decision'>('workflow');

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, agentsRes, activityRes] = await Promise.all([
          fetch('/api/v2/evaluation/documents').then(r => r.json()),
          fetch('/api/v2/evaluation/agents').then(r => r.json()),
          fetch('/api/v2/evaluation/activity').then(r => r.json())
        ]);
        setDocuments(docsRes);
        setAgents(agentsRes);
        setActivity(activityRes);

        // Fetch findings if doc selected
        if (selectedDocId) {
           const fRes = await fetch(`/api/v2/evaluation/findings?docId=${selectedDocId}`);
           const fData = await fRes.json();
           setFindings(fData);
        }
      } catch (err) {
        console.error('Failed to fetch evaluation data', err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const renderContent = () => {
    switch (activeTab) {
      case 'workflow':
        return (
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {selectedDoc ? (
              <>
                <MultiStagePipeline currentStage={selectedDoc.stage} />
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-white tracking-tight">{selectedDoc.name}</h2>
                      <span className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">
                        {selectedDoc.classification}
                      </span>
                    </div>
                    <p className="text-sm text-white/40 mt-1">UUID: {selectedDoc.id} • HASH: {selectedDoc.hash.substring(0, 16)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowReasoning(!showReasoning)}
                      className="px-4 py-2 bg-indigo-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-indigo-400 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <Binary className="w-4 h-4" />
                      VIEW REASONING
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <AgentStatusPanel agents={agents} docId={selectedDoc.id} />
                  <ActivityStream activity={activity} />
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <EvidenceGraph docId={selectedDoc.id} />
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                <Database className="w-16 h-16 stroke-1 mb-4" />
                <h3 className="text-xl font-bold text-white">Salience Atlas Evaluation Core</h3>
                <p className="text-sm max-w-xs mt-2">Select a document from the queue to initialize the agentic evaluation engine.</p>
              </div>
            )}
          </div>
        );
      case 'agents':
        return <div className="flex-1 p-8 overflow-hidden"><AgentRegistry agents={agents} /></div>;
      case 'rules':
        return <div className="flex-1 p-8 overflow-hidden"><RuleEngineView /></div>;
      case 'audit':
        return <div className="flex-1 p-8 overflow-hidden"><AuditLogView /></div>;
      case 'timeline':
        return <div className="flex-1 p-8 overflow-y-auto"><ProcurementTimeline /></div>;
      case 'monitoring':
        return <div className="flex-1 p-8 overflow-y-auto"><ExecutiveMonitoring /></div>;
      case 'risk':
        return <div className="flex-1 p-8 overflow-hidden"><RiskIntelligence /></div>;
      case 'scorecard':
        return <div className="flex-1 p-8 overflow-hidden"><ExplainableScorecard /></div>;
      case 'decision':
        return (
          <div className="flex-1 p-8 overflow-y-auto">
            {selectedDoc ? (
              <DecisionIntelligenceWorkspace 
                evaluationId={selectedDoc.id} 
                findings={findings} 
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                <ShieldCheck className="w-16 h-16 stroke-1 mb-4" />
                <h3 className="text-xl font-bold text-white">Decision Intelligence Workspace</h3>
                <p className="text-sm max-w-xs mt-2">Select a document to generate an enterprise-scale procurement recommendation.</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#06080f] text-slate-300 overflow-hidden font-sans select-none">
      {/* Top Governance Bar */}
      <header className="h-14 border-b border-white/5 bg-[#0a0c14] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Scale className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-none">SALIENCE ATLAS</h1>
              <p className="text-[10px] text-white/40 font-mono mt-1 uppercase tracking-widest">Enterprise Evaluation Engine</p>
            </div>
          </div>
          <div className="h-6 w-px bg-white/5 mx-2" />
          <nav className="flex items-center gap-1">
            {['workflow', 'agents', 'monitoring', 'risk', 'scorecard', 'decision', 'rules', 'audit', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-md uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-white/5 text-indigo-400 border border-white/10' 
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-tighter">PPADA Compliance Monitor: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30 font-mono">NODE: SALIENCE_PRIMARY_01</span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white/40" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Document Queue & Intake */}
        <aside className="w-80 border-r border-white/5 bg-[#080a11] flex flex-col shrink-0">
          <IntakeLayer onUploadComplete={() => {}} />
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Document Queue</h3>
              <span className="text-[10px] font-mono text-white/20">{documents.length} ITEMS</span>
            </div>
            
            <div className="space-y-2">
              {documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    selectedDocId === doc.id 
                      ? 'bg-indigo-500/10 border-indigo-500/30' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <FileText className={`w-4 h-4 ${selectedDocId === doc.id ? 'text-indigo-400' : 'text-white/40'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white/80 truncate leading-tight">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono text-white/30 uppercase">{doc.classification}</span>
                        <span className="text-[9px] font-mono text-indigo-400/60 font-bold">{Math.round(doc.confidence * 100)}% CONF</span>
                      </div>
                    </div>
                  </div>
                  {doc.stage === 'INTAKE' && (
                    <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="h-full bg-indigo-500/50"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Canvas */}
        <section className="flex-1 flex flex-col bg-[#06080f] overflow-hidden relative">
          {renderContent()}
        </section>

        {/* Right Intelligence Rail */}
        <ReasoningPanel 
          isOpen={showReasoning} 
          onClose={() => setShowReasoning(false)} 
          selectedDoc={selectedDoc}
        />
      </main>

      {/* Footer Metrics */}
      <footer className="h-8 border-t border-white/5 bg-[#0a0c14] flex items-center justify-between px-6 shrink-0 font-mono text-[9px] uppercase tracking-widest text-white/30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>AI ENGINE ONLINE</span>
          </div>
          <span>UPTIME: 99.98%</span>
          <span>LATENCY: 42ms</span>
        </div>
        <div className="flex items-center gap-4">
          <span>PPADA_v2015.4_STABLE</span>
          <span className="text-white/10">|</span>
          <span>© 2026 SALIENCE ATLAS PLATFORM</span>
        </div>
      </footer>
    </div>
  );
}
