import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Command, 
  Sparkles, 
  Bell, 
  CheckCircle2, 
  ChevronDown, 
  ShieldCheck, 
  LogOut, 
  Radio, 
  Bot,
  Activity
} from 'lucide-react';
import { Tenant, UserProfile, TelemetryState } from '../../types';

interface GlobalHeaderProps {
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  availableTenants: Tenant[];
  currentUser: UserProfile;
  telemetry: TelemetryState | null;
  onOpenCommandPalette: () => void;
  onToggleCopilot: () => void;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  currentTenant,
  onSelectTenant,
  availableTenants,
  currentUser,
  telemetry,
  onOpenCommandPalette,
  onToggleCopilot,
}) => {
  const [isTenantOpen, setIsTenantOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 atlas-shell-header px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
      {/* Left: Brand + Tenant Identity */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-wider uppercase text-slate-100 font-mono">
                Salience Atlas
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                v5.1.0
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>National Grid Command</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-medium">{currentTenant.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-xl hidden md:block">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full h-9 px-3.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-slate-200 transition-all flex items-center justify-between text-xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            <span>Search corridor, substation, tender, or dispatch drone…</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700 font-mono">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right: Operational Status + Controls + Tenant + User */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* System & AI Status Telemetry */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800/80 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SYSTEM NOMINAL</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Sparkles className="w-3 h-3" />
            <span>ATLAS AI ONLINE</span>
          </div>
        </div>

        {/* Copilot Assistant Launcher */}
        <button
          type="button"
          onClick={onToggleCopilot}
          className="h-8 px-2.5 rounded-md bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1.5 text-xs font-mono"
          title="Open AI Operations Copilot"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Copilot</span>
        </button>

        {/* Notifications / Grid Alerts */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsAlertsOpen(!isAlertsOpen)}
            className="w-8 h-8 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 flex items-center justify-center relative transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full ring-2 ring-slate-900" />
          </button>

          {isAlertsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg bg-slate-900 border border-slate-800 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                  Live Dispatch Alerts
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  2 Pending
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center justify-between font-mono text-[11px] text-amber-300">
                    <span>SUSWA-ISINYA 400kV</span>
                    <span>14m ago</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Drone #12 detected insulator flashover risk at Tower 184. Auto-contingency ready.
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center justify-between font-mono text-[11px] text-cyan-300">
                    <span>MOMBASA PORT CLEARANCE</span>
                    <span>42m ago</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Conveyor transformer unit cleared customs. SCM convoy en route to Mariakani.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tenant Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTenantOpen(!isTenantOpen)}
            className="h-8 px-2.5 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="truncate max-w-[80px] sm:max-w-none">{currentTenant.code}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isTenantOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-lg bg-slate-900 border border-slate-800 shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
                Switch Grid Tenant
              </div>
              {availableTenants.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onSelectTenant(t);
                    setIsTenantOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    currentTenant.id === t.id
                      ? 'bg-cyan-950/40 text-cyan-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div>{t.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{t.clearanceLevel}</div>
                  </div>
                  {currentTenant.id === t.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Identity & Clearance */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="h-8 pl-2 pr-2.5 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 flex items-center gap-2 transition-colors"
          >
            <div className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px] font-bold font-mono">
              {currentUser.name.slice(0, 1)}
            </div>
            <span className="hidden lg:inline text-xs font-medium text-slate-200">
              {currentUser.name}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isUserOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg bg-slate-900 border border-slate-800 shadow-xl p-3 z-50">
              <div className="pb-2 mb-2 border-b border-slate-800">
                <div className="font-medium text-slate-200 text-xs">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{currentUser.role} • {currentUser.clearance}</span>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="px-2 py-1.5 rounded text-slate-400 font-mono text-[10px] bg-slate-950/60">
                  Zero Trust Identity: LEVEL 04 Clearance Verified
                </div>
                <button
                  type="button"
                  onClick={() => setIsUserOpen(false)}
                  className="w-full text-left px-2 py-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span>Telemetry Audit Trail</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
