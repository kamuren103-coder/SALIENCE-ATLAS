import React, { useState } from 'react';
import { 
  FolderKanban, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Hammer, 
  MapPin,
  TrendingUp
} from 'lucide-react';

interface ProjectBOM {
  id: string;
  projectName: string;
  fundingDonor: string;
  voltage: string;
  totalBudgetKesM: number;
  physicalCompletionPct: number;
  materialReadinessPct: number;
  status: 'ON_TRACK' | 'MATERIAL_DELAY' | 'ROW_BLOCKED';
  keyComponents: Array<{ name: string; required: number; delivered: number; unit: string }>;
}

const PROJECTS_DATA: ProjectBOM[] = [
  {
    id: 'PRJ-400-OLK-LES',
    projectName: '400kV Olkaria - Lessos Double Circuit Transmission Link',
    fundingDonor: 'JICA / Government of Kenya',
    voltage: '400 kV',
    totalBudgetKesM: 9800,
    physicalCompletionPct: 82.4,
    materialReadinessPct: 91.0,
    status: 'ON_TRACK',
    keyComponents: [
      { name: 'Self-Supporting Lattice Steel Towers', required: 640, delivered: 610, unit: 'Towers' },
      { name: 'Zebra ACSR Phase Conductors', required: 1200, delivered: 1150, unit: 'km' },
      { name: '400kV Substation Terminal Bays', required: 4, delivered: 4, unit: 'Bays' },
    ],
  },
  {
    id: 'PRJ-220-GAR-BUR',
    projectName: '220kV Garsen - Bura Coastal Grid Reinforcement',
    fundingDonor: 'African Development Bank (AfDB)',
    voltage: '220 kV',
    totalBudgetKesM: 4200,
    physicalCompletionPct: 58.0,
    materialReadinessPct: 62.5,
    status: 'MATERIAL_DELAY',
    keyComponents: [
      { name: '220kV Suspension Tower Steel', required: 290, delivered: 180, unit: 'Towers' },
      { name: 'Composite Long-Rod Insulators', required: 3200, delivered: 1900, unit: 'Units' },
      { name: '48-Core Optical Ground Wire (OPGW)', required: 140, delivered: 90, unit: 'km' },
    ],
  },
  {
    id: 'PRJ-132-TUR-ORT',
    projectName: '132kV Turkwel - Ortum - Kitale Transmission Upgrade',
    fundingDonor: 'World Bank (IDA)',
    voltage: '132 kV',
    totalBudgetKesM: 3100,
    physicalCompletionPct: 71.5,
    materialReadinessPct: 88.0,
    status: 'ON_TRACK',
    keyComponents: [
      { name: 'Tubular Steel Monopoles', required: 310, delivered: 285, unit: 'Poles' },
      { name: 'Wolf ACSR Conductors', required: 540, delivered: 510, unit: 'km' },
      { name: 'Substation Protection Panels', required: 8, delivered: 8, unit: 'Panels' },
    ],
  },
];

export const ProjectSupplyModule: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectBOM>(PROJECTS_DATA[0]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* KPI Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">ACTIVE GRID PROJECTS</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">16 Active</div>
          <div className="text-[11px] text-cyan-400 mt-1">CapEx: KES 84.6B</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">MATERIAL READINESS INDEX</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">87.2%</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">BOM components staged in depots</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">SUPPLY CHAIN BOTTLENECKS</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">2 Corridors</div>
          <div className="text-[11px] text-amber-300/80 mt-1">Weighbridge & customs holds</div>
        </div>
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-4">
          <div className="text-xs font-mono text-slate-400">AVG COMMISSIONING SCHEDULE</div>
          <div className="text-2xl font-bold text-slate-100 mt-1">On Target</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero donor milestone penalties</div>
        </div>
      </div>

      {/* Main Project List & BOM Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="lg:col-span-2 bg-[#101827] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-cyan-400" />
              <h2 className="font-semibold text-slate-100 text-sm">National Transmission Line Projects</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">BOM READINESS</span>
          </div>

          <div className="divide-y divide-slate-800/60 flex-1">
            {PROJECTS_DATA.map(project => {
              const isSelected = selectedProject.id === project.id;
              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-slate-800/40 ${
                    isSelected ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
                        <span>{project.id}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{project.voltage}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{project.fundingDonor}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-100 mt-1">{project.projectName}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                        <span>Budget: <strong className="text-slate-200 font-mono">KES {project.totalBudgetKesM}M</strong></span>
                        <span>Physical: <strong className="text-cyan-400 font-mono">{project.physicalCompletionPct}%</strong></span>
                        <span>BOM Ready: <strong className="text-emerald-400 font-mono">{project.materialReadinessPct}%</strong></span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                      project.status === 'ON_TRACK'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Project BOM Inspection */}
        <div className="bg-[#101827] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-xs font-mono text-slate-400">BILL OF MATERIALS (BOM)</span>
              <span className="text-xs font-mono text-cyan-400">{selectedProject.voltage}</span>
            </div>

            <div className="mt-4 space-y-4">
              <h3 className="text-sm font-semibold text-slate-100">{selectedProject.projectName}</h3>

              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400">CRITICAL COMPONENT STAGING</div>
                {selectedProject.keyComponents.map((comp, idx) => {
                  const pct = Math.round((comp.delivered / comp.required) * 100);
                  return (
                    <div key={idx} className="p-3 rounded-lg bg-[#070b14] border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-200 font-medium">{comp.name}</span>
                        <span className="font-mono text-cyan-400 font-semibold">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-cyan-400 h-1.5"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {comp.delivered} / {comp.required} {comp.unit} staged in depot
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              type="button"
              className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Hammer className="w-3.5 h-3.5" />
              Dispatch Material Work Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
