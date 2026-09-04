import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Power, Layers, ChevronLeft, X } from 'lucide-react';
import { useShell } from './ShellContext';
import type { ShellNavItem } from './types';
import { motionTokens } from '../../design-system/tokens';

interface GlobalSidebarProps {
  items: ShellNavItem[];
  activeModule: string;
  onNavigate: (id: string) => void;
  onShutdown: (msg: string) => void;
}

const GROUP_ORDER: string[] = ['COMMAND', 'INTELLIGENCE', 'OPERATIONS', 'FINANCE & RISK', 'AI', 'DATA & PLATFORM', 'SYSTEM'];

const GROUP_LABEL: Record<string, string> = {
  COMMAND: 'COMMAND',
  INTELLIGENCE: 'INTELLIGENCE',
  OPERATIONS: 'OPERATIONS',
  'FINANCE & RISK': 'FINANCE & RISK',
  AI: 'AI',
  'DATA & PLATFORM': 'DATA & PLATFORM',
  SYSTEM: 'SYSTEM',
};

// Assign every existing module to a group (ALL routes preserved, only regrouped).
const ITEM_GROUP: Record<string, string> = {
  overview: 'COMMAND',
  'drone-intelligence': 'INTELLIGENCE',
  logistics: 'INTELLIGENCE',
  procurement_graph: 'INTELLIGENCE',
  intelligence: 'INTELLIGENCE',
  twin: 'INTELLIGENCE',
  tender: 'OPERATIONS',
  project: 'OPERATIONS',
  inventory: 'OPERATIONS',
  supplier: 'OPERATIONS',
  sourcing: 'OPERATIONS',
  acin: 'OPERATIONS',
  executive: 'OPERATIONS',
  risk: 'FINANCE & RISK',
  decision: 'FINANCE & RISK',
  agents: 'AI',
  'ai-ops': 'AI',
  'ai-runtime': 'AI',
  admin: 'SYSTEM',
};

export default function GlobalSidebar({ items, activeModule, onNavigate, onShutdown }: GlobalSidebarProps) {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen, breakpoint } = useShell();

  const grouped = GROUP_ORDER
    .map(group => ({
      group,
      entries: items.filter(item => (ITEM_GROUP[item.id] || 'OPERATIONS') === group),
    }))
    .filter(g => g.entries.length > 0);

  const navigate = (id: string) => {
    onNavigate(id);
    if (breakpoint !== 'desktop') setMobileOpen(false);
  };

  const sidebarInner = (isCollapsed: boolean, isMobile: boolean) => (
    <div className="flex flex-col justify-between h-full">
      <div className="space-y-4 min-h-0 overflow-y-auto pr-0.5">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} ${isMobile ? 'justify-between' : ''}`}>
          {!isMobile && !isCollapsed && (
            <span className="atlas-shell-focus flex items-center gap-1 text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold px-1">
              <Layers className="w-3 h-3" /> Navigation
            </span>
          )}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="atlas-shell-focus p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="atlas-shell-focus p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer ml-auto"
              aria-label="Close navigation drawer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {grouped.map((g, gi) => (
          <div key={g.group} className="space-y-0.5">
            {!isCollapsed && (
              <span className="text-[9px] font-mono text-cyan-400/80 font-bold uppercase tracking-widest block pl-2 mb-1">
                {GROUP_LABEL[g.group]}
              </span>
            )}
            <div className="space-y-0.5">
              {g.entries.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`atlas-shell-focus w-full text-left p-2 rounded-lg border flex items-center gap-2.5 transition-all cursor-pointer group/item ${
                      isActive
                        ? 'atlas-shell-nav-active text-[#00D9FF]'
                        : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/40'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    title={item.label}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    {!isCollapsed && (
                      <span className="text-xs font-medium truncate select-none">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-900/80 mt-3 shrink-0">
        <button
          onClick={() => onShutdown('Active SCM terminal connection paused. All automated routing processes remain active in background mode.')}
          className="atlas-shell-focus w-full p-2 rounded-lg text-pink-400/80 hover:text-pink-300 hover:bg-pink-950/20 border border-pink-500/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          title="Shut Down Terminal"
        >
          <Power className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="text-[10px] font-mono uppercase tracking-wider select-none">Shut Down Terminal</span>}
        </button>
      </div>
    </div>
  );

  const isMobileView = breakpoint === 'mobile';
  const isCollapsedView = breakpoint === 'desktop' ? collapsed : false;

  return (
    <>
      {/* Mobile overlay drawer */}
      <AnimatePresence>
        {isMobileView && mobileOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={motionTokens.transition.fast}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={motionTokens.transition.normal}
              className="atlas-shell-sidebar fixed top-0 left-0 bottom-0 z-50 w-60 p-3"
              role="navigation"
              aria-label="Primary"
            >
              {sidebarInner(false, true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop / tablet rail */}
      {breakpoint !== 'mobile' && (
        <nav
          className={`atlas-shell-sidebar shrink-0 hidden md:flex flex-col p-3 transition-[width] duration-200 ${isCollapsedView ? 'w-[60px]' : 'w-[240px]'}`}
          role="navigation"
          aria-label="Primary"
        >
          {sidebarInner(isCollapsedView, false)}
        </nav>
      )}
    </>
  );
}
