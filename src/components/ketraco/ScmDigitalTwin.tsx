import React, { useState } from 'react';
import { 
  Cpu, GitFork, AlertCircle, RefreshCw, BarChart2, ShieldAlert, 
  Settings, CheckCircle, Info, Radio, Zap, Sparkles, Database, Activity
} from 'lucide-react';
import { AtlasMissionBrief } from '../ui/atlas/AtlasMissionBrief';
import { AtlasAgentPulse, DEFAULT_ENTERPRISE_AGENTS } from '../ui/atlas/AtlasAgentPulse';

interface Scenario {
  name: string;
  resilienceImpact: number;
  description: string;
  affectedEntity: string;
}

interface ScmDigitalTwinProps {
  onAskCopilot?: (prompt: string) => void;
}

export default function ScmDigitalTwin({ onAskCopilot }: ScmDigitalTwinProps) {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null);
  const [resilienceScore, setResilienceScore] = useState(82);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    'Digital Twin telemetry aligned with live Suswa-Olkaria grid.',
    'Inventory checks at Mariakani warehouse verified standing in nominal buffers.'
  ]);

  const scenarios: Record<string, Scenario> = {
    cableDelay: {
      name: '20% Cable Shipment Ocean Delay',
      resilienceImpact: -14,
      description: 'Simulates a port container delay for primary conductor steel cables from Shanghai.',
      affectedEntity: 'Shipment'
    },
    transformerFailure: {
      name: 'EHV Transformer Insulation Failure',
      resilienceImpact: -25,
      description: 'Stress-tests the critical path if the primary 220kV transformer fails field deployment checks.',
      affectedEntity: 'Inventory'
    },
    customHold: {
      name: 'Mombasa Port Customs Hold',
      resilienceImpact: -8,
      description: 'Simulates extended custom inspections & withholding of insulation brackets at terminal.',
      affectedEntity: 'Supplier'
    },
    budgetShortfall: {
      name: '15% Contingency Budget Allocation Shortfall',
      resilienceImpact: -11,
      description: 'Stress-tests financial liabilities across project milestones when contingency bounds shrink.',
      affectedEntity: 'Contract'
    }
  };

  const handleRunScenario = (key: string) => {
    const sc = scenarios[key];
    if (activeSimulation === key) {
      // Release
      setActiveSimulation(null);
      setResilienceScore(82);
      setSimulationLogs(prev => [
        `[NOMINAL RESET] Released simulation: ${sc.name}. System reverted to baseline.`,
        ...prev
      ]);
    } else {
      setActiveSimulation(key);
      const newScore = 82 + sc.resilienceImpact;
      setResilienceScore(newScore);
      setSimulationLogs(prev => [
        `[SIMULATION ALERT] Executed stress test: ${sc.name}.`,
        `[WARNING] ${sc.description}`,
        `[IMPACT] Resilience index reduced to ${newScore}%. Affected node: ${sc.affectedEntity}.`,
        ...prev
      ]);
    }
  };

  const getEntityStyles = (entityName: string) => {
    if (!activeSimulation) {
      return 'bg-slate-900/80 border-slate-800 text-slate-100';
    }
    const sc = scenarios[activeSimulation];
    if (sc.affectedEntity === entityName) {
      return 'bg-red-950/60 border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse';
    }
    return 'bg-slate-900/30 border-slate-800/40 text-slate-500';
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4" id="scm-digital-twin">
      
      {/* Mission Brief — digital twin operating statement */}
      <AtlasMissionBrief
        moduleLabel="Digital Twin"
        mission="Every critical asset mirrored, modeled and stress-tested before it fails."
        description="Model and stress-test continuous delays, failure occurrences, and logistics bottlenecks across the enterprise dependency chain."
        metrics={[
          { label: 'Resilience Score', value: resilienceScore, unit: '%', icon: ShieldAlert, tone: resilienceScore >= 80 ? 'healthy' : resilienceScore >= 65 ? 'risk' : 'critical' as any },
          { label: 'Stress Tests', value: 4, icon: Cpu, tone: 'info' },
          { label: 'Entities Modeled', value: 5, icon: GitFork, tone: 'healthy' },
          { label: 'Simulation Mode', value: activeSimulation ? 'STRESS' : 'NOMINAL', icon: Activity, tone: activeSimulation ? 'risk' : 'info' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6">
        
        {/* Interactive Relation Map View (8 columns) */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-slate-800/40 flex flex-col justify-between min-h-[460px] relative">
          <div className="absolute top-4 left-4 flex gap-1.5 items-center">
            <GitFork className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] tracking-wider font-mono text-slate-400 uppercase">Interactive Asset Entity Map</span>
          </div>

          {/* SVG Connector Lines and Nodes representing actual dependencies: Project -> Contract -> Supplier -> Shipment -> Inventory */}
          <div className="flex-1 flex flex-col justify-center items-center py-10 relative">
            <div className="grid grid-cols-5 gap-4 items-center w-full max-w-2xl relative z-10">
              
              {/* Node 1: Project */}
              <div className={`p-4 rounded-xl border text-center transition-all ${getEntityStyles('Project')}`}>
                <span className="text-[10px] font-mono font-medium block text-indigo-400">1. PROJECT</span>
                <span className="text-xs font-bold block mt-1">Suswa-Olkaria</span>
                <p className="text-[9px] text-slate-500 mt-1">EHV Line Exp</p>
              </div>

              {/* Node 2: Contract */}
              <div className={`p-4 rounded-xl border text-center transition-all ${getEntityStyles('Contract')}`}>
                <span className="text-[10px] font-mono font-medium block text-indigo-400">2. CONTRACT</span>
                <span className="text-xs font-bold block mt-1">LOT-4 Turnkey</span>
                <p className="text-[9px] text-slate-500 mt-1">Penalty Clauses</p>
              </div>

              {/* Node 3: Supplier */}
              <div className={`p-4 rounded-xl border text-center transition-all ${getEntityStyles('Supplier')}`}>
                <span className="text-[10px] font-mono font-medium block text-indigo-400">3. SUPPLIER</span>
                <span className="text-xs font-bold block mt-1">Shanghai Cable</span>
                <p className="text-[9px] text-slate-500 mt-1">Delays SLA</p>
              </div>

              {/* Node 4: Shipment */}
              <div className={`p-4 rounded-xl border text-center transition-all ${getEntityStyles('Shipment')}`}>
                <span className="text-[10px] font-mono font-medium block text-indigo-400">4. SHIPMENT</span>
                <span className="text-xs font-bold block mt-1">Conductor Cables</span>
                <p className="text-[9px] text-slate-500 mt-1">Mombasa port</p>
              </div>

              {/* Node 5: Inventory */}
              <div className={`p-4 rounded-xl border text-center transition-all ${getEntityStyles('Inventory')}`}>
                <span className="text-[10px] font-mono font-medium block text-indigo-400">5. INVENTORY</span>
                <span className="text-xs font-bold block mt-1">Transformer Lot</span>
                <p className="text-[9px] text-slate-500 mt-1">Isinya depo</p>
              </div>

            </div>

            {/* Visual SVG connecting arrows behind nodes */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
              <svg className="w-full h-10 px-8" stroke="rgba(139,92,246,0.18)" fill="none" strokeWidth="2">
                <path d="M 0,20 L 700,20" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>

          {/* Flow Direction Indicator */}
          <div className="bg-slate-950/40 px-4 py-2.5 rounded-xl border border-slate-800/40 text-center">
            <span className="text-[10px] font-mono font-medium text-slate-400">
              KETRACO Dependency Path Flow : Project &rarr; Contract &rarr; Supplier &rarr; Shipment &rarr; Inventory
            </span>
          </div>

        </div>

        {/* Actionable Scenario Controllers (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Failure presets selection */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/40 space-y-3 flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Stress Test Scenarios</h3>
            
            <div className="space-y-3">
              {Object.entries(scenarios).map(([key, sc]) => {
                const isSelected = activeSimulation === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleRunScenario(key)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-red-950/40 border-red-500/70 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                        : 'bg-slate-950/60 border-slate-800/60 hover:border-slate-700/60'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-xs font-bold ${isSelected ? 'text-red-400' : 'text-slate-200'}`}>{sc.name}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-red-300 font-bold' : 'text-slate-500'}`}>Impact: {sc.resilienceImpact}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{sc.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Simulation outputs logs console */}
          <div className="bg-slate-950/70 border border-slate-800 p-4.5 rounded-2xl h-[230px] flex flex-col justify-between font-mono text-[10px]">
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 mb-2">
              <span className="text-indigo-400 font-semibold uppercase tracking-wider">Sim Console Log</span>
              <span className="text-slate-600">STRETCH_TEST_ACTIVE</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-slate-400 mb-2">
              {simulationLogs.map((log, idx) => (
                <div key={idx} className="leading-normal">
                  <span className="text-slate-600 font-bold mr-1">&gt;</span>
                  {log}
                </div>
              ))}
            </div>
            <div>
              <button
                onClick={() => {
                  const currentSc = activeSimulation ? scenarios[activeSimulation].name : "Baseline Operational Flow (Nominal Score: 82%)";
                  const scDesc = activeSimulation ? scenarios[activeSimulation].description : "All KETRACO SCM lines holding correct buffers without failures.";
                  onAskCopilot?.(`Run a neural impact study of SCM stress active state: "${currentSc}". Details: "${scDesc}". What are the cascade vulnerabilities across Project, Contract, Supplier, Shipment, and Inventory nodes?`);
                }}
                className="w-full py-2 bg-indigo-900/40 hover:bg-indigo-900/60 border border-indigo-550/20 text-cyan-300 rounded-xl flex items-center justify-center gap-1.5 font-bold cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> SCM AI Simulation Audit
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Contextual Intelligence rail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 px-6">
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => onAskCopilot?.(`Run a neural impact study of SCM stress active state: "${activeSimulation ? scenarios[activeSimulation].name : 'Baseline Operational Flow'}". What are the cascade vulnerabilities across Project, Contract, Supplier, Shipment, and Inventory nodes?`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/20 rounded-xl text-[10px] font-mono font-medium text-cyan-300 transition-all cursor-pointer shadow-lg shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 pointer-events-none" /> SCM AI Overview
          </button>
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1 rounded-xl">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">Live Simulator Link</span>
          </div>
        </div>
        <AtlasAgentPulse agents={DEFAULT_ENTERPRISE_AGENTS} expanded={agentsOpen} onToggle={() => setAgentsOpen(o => !o)} />
      </div>

    </div>
  );
}
