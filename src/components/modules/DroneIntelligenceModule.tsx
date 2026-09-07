import React, { useState } from 'react';
import { 
  Plane, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Layers, 
  Radio, 
  Compass,
  BatteryCharging,
  Video,
  Navigation
} from 'lucide-react';
import { DroneMission } from '../../types';

export const DroneIntelligenceModule: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<string>('MSN-409');

  const missions: DroneMission[] = [
    {
      id: 'MSN-409',
      corridorId: 'Suswa – Isinya 400kV',
      droneModel: 'Matrice 350 RTK (Grid AI Edition)',
      batteryPct: 78,
      altitudeM: 64,
      status: 'IN_FLIGHT',
      findingsCount: 3,
      thermalHotspots: 1,
      coronaDischarge: true,
      vegetationRisk: 'LOW'
    },
    {
      id: 'MSN-410',
      corridorId: 'Olkaria II – Dandora 220kV',
      droneModel: 'WingtraOne GEN II LiDAR',
      batteryPct: 92,
      altitudeM: 85,
      status: 'IN_FLIGHT',
      findingsCount: 0,
      thermalHotspots: 0,
      coronaDischarge: false,
      vegetationRisk: 'NONE'
    },
    {
      id: 'MSN-408',
      corridorId: 'Loiyangalani – Suswa 400kV',
      droneModel: 'Autel EVO Max 4T',
      batteryPct: 41,
      altitudeM: 52,
      status: 'ANALYZING',
      findingsCount: 2,
      thermalHotspots: 2,
      coronaDischarge: false,
      vegetationRisk: 'HIGH'
    }
  ];

  const current = missions.find(m => m.id === selectedMission) || missions[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE DRONE SQUADRONS</span>
            <Plane className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">3 Flights</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">Autonomous BVLOS clearance</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>THERMAL HOTSPOTS</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-300">3 Triaged</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">ΔT &gt; 18°C over ambient</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CORONA DISCHARGES</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-300">1 UV Anomaly</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Insulator string Tower 184</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AI COMPUTER VISION ACCURACY</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">99.2%</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">Defect classification confidence</div>
        </div>
      </div>

      {/* Main Inspection Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Mission Feed & Thermal Anomaly Analysis (2 Cols) */}
        <div className="lg:col-span-2 atlas-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <span>Mission Telemetry & Optical/IR Viewport — {current.id}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {current.corridorId} • Platform: {current.droneModel}
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>{current.status}</span>
              </span>
            </div>
          </div>

          {/* Simulated Thermal / Optical Viewport Canvas */}
          <div className="relative aspect-video rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4 font-mono">
            {/* HUD Overlay Top */}
            <div className="flex items-center justify-between text-[11px] text-cyan-400 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5" />
                  {current.batteryPct}%
                </span>
                <span>ALT: {current.altitudeM} m AGL</span>
                <span>SPEED: 8.4 m/s</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span>GPS: 0°58'42.1"S 36°21'08.4"E</span>
                <span className="text-emerald-400">RTK FIX</span>
              </div>
            </div>

            {/* Visual HUD Crosshair & Anomaly Box */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="border border-dashed border-cyan-500/40 w-48 h-48 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              </div>

              {current.coronaDischarge && (
                <div className="absolute top-8 right-12 p-2 rounded bg-purple-950/80 border border-purple-500 text-[11px] text-purple-200 animate-pulse">
                  <div className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>UV CORONA DETECTED</span>
                  </div>
                  <div>Tower 184 Phase-B Clamp</div>
                  <div className="text-[10px] text-purple-300">Discharge intensity: 84 pC</div>
                </div>
              )}

              {current.thermalHotspots > 0 && (
                <div className="absolute bottom-10 left-12 p-2 rounded bg-amber-950/80 border border-amber-500 text-[11px] text-amber-200">
                  <div className="font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>THERMAL ANOMALY</span>
                  </div>
                  <div>T_max: 68.4°C (Ambient 24.2°C)</div>
                  <div className="text-[10px] text-amber-300">Severity: Level 2 Maintenance</div>
                </div>
              )}
            </div>

            {/* HUD Overlay Bottom */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800 backdrop-blur-sm">
              <span>GIMBAL PITCH: -32° • YAW: 114°</span>
              <span className="text-cyan-400">EDGE AI: YOLOV11-GRID RUNNING (14ms)</span>
            </div>
          </div>
        </div>

        {/* Missions Squadron List & Dispatch (1 Col) */}
        <div className="atlas-card p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Inspection Missions</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an active flight to inspect payload sensor streams.
            </p>
          </div>

          <div className="space-y-2.5">
            {missions.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMission(m.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedMission === m.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-100'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold">{m.id}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {m.status}
                  </span>
                </div>
                <div className="text-xs text-slate-200 mt-1 font-medium truncate">
                  {m.corridorId}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center justify-between">
                  <span>Battery: {m.batteryPct}%</span>
                  <span className={m.findingsCount > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                    {m.findingsCount} Findings
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono space-y-1 text-slate-400">
            <div className="text-slate-200 font-semibold">Autonomous Patrol Protocol:</div>
            <div>• KCAA Exemption Order #2026/04 active.</div>
            <div>• Auto-dispatch upon lightning arrestor trips.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
