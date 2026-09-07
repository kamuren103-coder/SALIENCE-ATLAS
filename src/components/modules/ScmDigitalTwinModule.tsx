import React, { useState } from 'react';
import { 
  Layers, 
  Play, 
  RotateCcw, 
  AlertOctagon, 
  TrendingDown, 
  CheckCircle, 
  Zap, 
  Truck, 
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  severity: 'HIGH' | 'CRITICAL' | 'MODERATE';
  gridImpactMw: number;
  financialImpactKesM: number;
  affectedCorridor: string;
  recommendedMitigation: string;
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: 'sim-01',
    name: 'Mombasa Port Berth 16 Gantry Crane Breakdown',
    description: 'Critical bottleneck holding 250MVA Suswa Auto-transformer consignment. Port dwell time increases from 4 days to 19 days.',
    severity: 'HIGH',
    gridImpactMw: 320,
    financialImpactKesM: 68,
    affectedCorridor: 'Suswa 400kV Substation Bay 2',
    recommendedMitigation: 'Reroute vessel to Mombasa Bulk Berth 5; deploy mobile harbor heavy-lift crane under KeNHA fast-track permit.',
  },
  {
    id: 'sim-02',
    name: 'N-1 Trip on 400kV Olkaria-Duka Double Circuit',
    description: 'Simulated tower collapse due to riverbank flash flood during Rift Valley rains. 680MW geothermal evacuation interrupted.',
    severity: 'CRITICAL',
    gridImpactMw: 680,
    financialImpactKesM: 145,
    affectedCorridor: 'Olkaria-Lessos 400kV Transmission Link',
    recommendedMitigation: 'Initiate automatic fast-valving at Olkaria I AU & ramp up Seven Forks hydro reserve within 12 seconds.',
  },
  {
    id: 'sim-03',
    name: 'Global Copper Conductor Price Spike (+24%)',
    description: 'Macro-economic raw material supply shock impacting Narok-Bomet and Garsen-Bura line EPC contracts.',
    severity: 'MODERATE',
    gridImpactMw: 0,
    financialImpactKesM: 310,
    affectedCorridor: 'Rural Electrification Expansion Projects',
    recommendedMitigation: 'Exercise fixed-price hedging clause under PPADA contract model Section 139; invoke donor contingency buffer.',
  },
];

export const ScmDigitalTwinModule: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(SCENARIOS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(100);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationProgress(0);
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSimulating(false);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">DIGITAL TWIN FIDELITY</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">99.4%</div>
          <div className="text-[11px] text-slate-400 mt-1">Synchronized with SCADA EMS</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">MONITORED GRID ASSETS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">8,450 km</div>
          <div className="text-[11px] text-cyan-400 mt-1">68 High-Voltage Substations</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">N-1 STABILITY MARGIN</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">420 MW</div>
          <div className="text-[11px] text-emerald-400 mt-1">Dynamic spinning reserve</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">SIMULATION ENGINE</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">Active</div>
          <div className="text-[11px] text-slate-400 mt-1">Monte Carlo + Neural Physics</div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenarios List */}
        <div className="lg:col-span-2 bg-[#101827] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-slate-100 text-sm">Contingency Sandbox & Failure Modes</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">SELECT SCENARIO</span>
          </div>

          <div className="divide-y divide-slate-800/60 flex-1">
            {SCENARIOS.map(sc => {
              const isSelected = selectedScenario.id === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-slate-800/40 ${
                    isSelected ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="text-cyan-400 font-semibold">{sc.id}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{sc.affectedCorridor}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-100 mt-1">{sc.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sc.description}</p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                      sc.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : sc.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}>
                      {sc.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Scenario Evaluation */}
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono text-slate-400">DISRUPTION IMPACT ENGINE</span>
              <span className="text-xs font-mono text-cyan-400">{selectedScenario.id}</span>
            </div>

            <div className="mt-4 space-y-4">
              <h3 className="text-sm font-semibold text-slate-100">{selectedScenario.name}</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400">GRID LOAD AT RISK</div>
                  <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">
                    {selectedScenario.gridImpactMw} MW
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#070b14] border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400">FINANCIAL EXPOSURE</div>
                  <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                    KES {selectedScenario.financialImpactKesM}M
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-mono text-slate-400">AUTOMATED MITIGATION PLAYBOOK</div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-xs text-slate-200 leading-relaxed">
                  {selectedScenario.recommendedMitigation}
                </div>
              </div>

              {isSimulating && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-cyan-400">
                    <span>Running Physics Solver...</span>
                    <span>{simulationProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-1.5 transition-all duration-200"
                      style={{ width: `${simulationProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isSimulating ? 'Simulating Dynamic Stress...' : 'Execute Contingency Simulation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
