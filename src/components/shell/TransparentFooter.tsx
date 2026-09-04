import React from 'react';
import { useTenant } from '../../context/TenantContext';

interface TransparentFooterProps {
  systemHealth: {
    status?: string;
    database?: string;
    gemini_configured?: boolean;
    version?: string;
    uptime?: number;
  };
}

export default function TransparentFooter({ systemHealth }: TransparentFooterProps) {
  const { currentTenant } = useTenant();

  const systemNominal =
    !systemHealth.status || systemHealth.status.toLowerCase() === 'online' || systemHealth.status === 'healthy';
  const aiOnline = !!systemHealth.gemini_configured;
  const environment = systemHealth.status === 'offline' ? 'LOCAL' : 'LIVE';
  const version = '5.1.0';

  return (
    <footer
      className="atlas-shell-footer shrink-0 select-none"
      role="contentinfo"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 md:px-6 py-2 text-[9px] font-mono uppercase tracking-wider text-slate-500">
        <div className="flex items-center gap-4 min-w-0">
          <span className="text-slate-400 font-bold whitespace-nowrap">ATLAS v{version}</span>
          <span className="hidden sm:inline whitespace-nowrap">● {environment}</span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className={`w-1 h-1 rounded-full ${systemNominal ? 'bg-emerald-400' : 'bg-amber-400'}`} /> SYSTEM{' '}
            {systemNominal ? 'NOMINAL' : 'DEGRADED'}
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className={`w-1 h-1 rounded-full ${aiOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} /> AI{' '}
            {aiOnline ? 'ONLINE' : 'STANDBY'}
          </span>
          {systemHealth.database && (
            <span className="hidden md:inline whitespace-nowrap">DB {systemHealth.database}</span>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3 whitespace-nowrap">
          <span>{currentTenant.name} TENANT</span>
        </div>
      </div>
    </footer>
  );
}
