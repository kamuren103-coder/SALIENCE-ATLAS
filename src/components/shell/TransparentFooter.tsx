import React from 'react';
import { Database, ShieldCheck, Sparkles, Activity, Server } from 'lucide-react';
import { Tenant, TelemetryState } from '../../types';

interface TransparentFooterProps {
  currentTenant: Tenant;
  telemetry: TelemetryState | null;
}

export const TransparentFooter: React.FC<TransparentFooterProps> = ({
  currentTenant,
  telemetry,
}) => {
  return (
    <footer
      role="contentinfo"
      className="atlas-shell-footer h-10 px-4 lg:px-6 shrink-0 flex items-center justify-between text-[11px] font-mono text-slate-400 z-20"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="text-slate-500">PLATFORM:</span>
          <span>SALIENCE ATLAS v5.1.0</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>STATUS: {telemetry?.status || 'HEALTHY'}</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <Database className="w-3 h-3 text-cyan-400" />
          <span>SQLITE CORE: CONNECTED</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
          <Server className="w-3 h-3 text-slate-500" />
          <span>PORT: 3000 (0.0.0.0)</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CLEARANCE: {currentTenant.clearanceLevel}</span>
        </div>
        <div className="text-slate-500 hidden sm:inline">
          TENANT: <span className="text-slate-300 uppercase">{currentTenant.name}</span>
        </div>
      </div>
    </footer>
  );
};
