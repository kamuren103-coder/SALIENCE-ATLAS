import React, { useState } from 'react';
import { 
  Zap, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  ArrowUpRight, 
  Radio, 
  ShieldAlert,
  Server,
  Play,
  RotateCcw
} from 'lucide-react';
import { GridCorridor } from '../../types';

export const CommandCenterModule: React.FC = () => {
  const [frequency, setFrequency] = useState(50.02);
  const [totalLoad, setTotalLoad] = useState(2184);
  const [simulatingContingency, setSimulatingContingency] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);

  const [corridors, setCorridors] = useState<GridCorridor[]>([
    {
      id: 'COR-01',
      name: 'Suswa – Isinya 400kV Double Circuit',
      voltage: '400 kV',
      lengthKm: 102,
      currentLoadMw: 640,
      capacityMw: 1000,
      status: 'OPTIMAL',
      substations: ['Suswa Main (400/220kV)', 'Isinya Substation'],
      anomaliesDetected: 1
    },
    {
      id: 'COR-02',
      name: 'Loiyangalani – Suswa 400kV Wind Transmission',
      voltage: '400 kV',
      lengthKm: 428,
      currentLoadMw: 310,
      capacityMw: 600,
      status: 'OPTIMAL',
      substations: ['Lake Turkana Wind Substation', 'Suswa Substation'],
      anomaliesDetected: 0
    },
    {
      id: 'COR-03',
      name: 'Olkaria II – Dandora 220kV Geothermal Feed',
      voltage: '220 kV',
      lengthKm: 98,
      currentLoadMw: 245,
      capacityMw: 350,
      status: 'OPTIMAL',
      substations: ['Olkaria Geothermal Hub', 'Dandora 220kV Substation'],
      anomaliesDetected: 0
    },
    {
      id: 'COR-04',
      name: 'Ethiopia – Kenya 500kV HVDC Interconnector',
      voltage: '500 kV HVDC',
      lengthKm: 612,
      currentLoadMw: 390,
      capacityMw: 2000,
      status: 'OPTIMAL',
      substations: ['Wolayta Sodo (Ethiopia)', 'Suswa Converter Station'],
      anomaliesDetected: 0
    },
    {
      id: 'COR-05',
      name: 'Mombasa – Nairobi 400kV Coast Reinforcement',
      voltage: '400 kV',
      lengthKm: 482,
      currentLoadMw: 420,
      capacityMw: 1200,
      status: 'DEGRADED',
      substations: ['Mariakani (400kV)', 'Embakasi 220kV Substation'],
      anomaliesDetected: 2
    }
  ]);

  const handleRunContingency = () => {
    setSimulatingContingency(true);
    setTimeout(() => {
      setSimulatingContingency(false);
      setSimResult(
        'N-1 Contingency Simulation Verified: Loss of Suswa-Isinya Circuit 1 safely absorbs onto Circuit 2 at 78% thermal rating. Automated fast-governor response from Olkaria IV delivers +45 MW within 1.2s. Grid frequency stabilized at 49.94 Hz.'
      );
    }, 1200);
  };

  const handleResetSim = () => {
    setSimResult(null);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top SCADA KPI Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL NATIONAL DEMAND</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">{totalLoad}</span>
            <span className="text-xs text-slate-400 font-mono">MW</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span>▲ +2.4% vs morning baseline</span>
          </div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SYSTEM FREQUENCY</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{frequency}</span>
            <span className="text-xs text-slate-400 font-mono">Hz</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            Standard band: 49.80 – 50.20 Hz
          </div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>RENEWABLE PENETRATION</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-300">91.4%</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            Geothermal 44% • Hydro 32% • Wind 15%
          </div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>N-1 CONTINGENCY BUFFER</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">+420</span>
            <span className="text-xs text-slate-400 font-mono">MW Spinning</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">
            Nominal reserve online
          </div>
        </div>
      </div>

      {/* Main Grid: Transmission Corridors + Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Corridors Table (2 Columns) */}
        <div className="lg:col-span-2 atlas-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Active 400kV / 220kV Transmission Corridors</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time active power flow (MW), thermal limit utilization, and telemetry health.
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              5/5 Telemetry OK
            </span>
          </div>

          <div className="space-y-3">
            {corridors.map(c => {
              const utilPct = Math.round((c.currentLoadMw / c.capacityMw) * 100);
              return (
                <div
                  key={c.id}
                  className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-200 text-xs">{c.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                          {c.voltage}
                        </span>
                        {c.anomaliesDetected > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{c.anomaliesDetected} Defect</span>
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        Substations: {c.substations.join(' ➔ ')}
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0 font-mono">
                      <div className="text-xs text-slate-200 font-semibold">
                        {c.currentLoadMw} / {c.capacityMw} MW
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {utilPct}% Thermal Limit
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2.5 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        utilPct > 80 ? 'bg-amber-400' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contingency Simulator Panel (1 Column) */}
        <div className="atlas-card p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>What-If Contingency</span>
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                AI Engine
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Simulate high-voltage transmission trip contingencies (N-1) across Kenya's national grid backbone to test automated reserve dispatch.
            </p>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-300 font-medium">Contingency Case 01:</div>
              <div className="text-amber-300 text-[11px]">
                Immediate trip of 400kV Suswa-Isinya Line 1 during peak solar cutoff.
              </div>
              <div className="text-slate-400 text-[11px]">
                Tested dynamic response: Fast AGC redispatch + Suswa Converter HVDC throttle.
              </div>
            </div>

            {simResult && (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono animate-in fade-in">
                <div className="font-semibold flex items-center gap-1.5 mb-1 text-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SIMULATION STABLE</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {simResult}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunContingency}
              disabled={simulatingContingency}
              className="flex-1 py-2.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-cyan-900/40"
            >
              {simulatingContingency ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Running Load Flow…</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute N-1 Simulation</span>
                </>
              )}
            </button>
            {simResult && (
              <button
                type="button"
                onClick={handleResetSim}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
