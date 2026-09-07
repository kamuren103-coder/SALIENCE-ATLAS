import React from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  Plane, 
  Cpu, 
  GitBranch, 
  Truck, 
  Coins, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight,
  Boxes,
  Layers,
  FileText,
  FolderKanban,
  Building2,
  TrendingUp,
  FileCheck2,
  Award,
  CheckSquare,
  Bot,
  Server,
  Users,
  Network,
  Activity
} from 'lucide-react';
import { ModuleId } from '../../types';

interface GlobalSidebarProps {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavSection {
  title: string;
  items: Array<{
    id: ModuleId;
    label: string;
    icon: React.ElementType;
    badge?: string;
    aliases?: ModuleId[];
  }>;
}

export const GlobalSidebar: React.FC<GlobalSidebarProps> = ({
  activeModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navSections: NavSection[] = [
    {
      title: 'OPERATIONS & GRID',
      items: [
        { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, aliases: ['overview'] },
        { id: 'grid-corridors', label: 'HV Grid Corridors', icon: Zap, badge: '14 Live' },
        { id: 'drone-intelligence', label: 'Drone Intelligence AI', icon: Plane, badge: 'BVLOS' },
        { id: 'logistics-command', label: 'Logistics Command', icon: Truck, badge: 'Convoys', aliases: ['logistics'] },
      ],
    },
    {
      title: 'SCM & DIGITAL TWIN',
      items: [
        { id: 'twin', label: 'SCM Digital Twin', icon: Layers },
        { id: 'tender', label: 'Tender Intelligence', icon: FileText, aliases: ['procurement-twin'] },
        { id: 'inventory', label: 'Strategic Spares Inventory', icon: Boxes },
        { id: 'project', label: 'Project Supply Nexus', icon: FolderKanban },
        { id: 'supplier', label: 'Supplier Network', icon: Building2 },
        { id: 'sourcing', label: 'Strategic Sourcing', icon: TrendingUp },
      ],
    },
    {
      title: 'INTELLIGENCE & GRAPH',
      items: [
        { id: 'intelligence', label: 'Decision Intelligence', icon: Activity },
        { id: 'procurement-graph', label: 'Knowledge Graph', icon: Network },
        { id: 'acin', label: 'Contract Intelligence (ACIN)', icon: FileCheck2 },
      ],
    },
    {
      title: 'GOVERNANCE & FINANCE',
      items: [
        { id: 'executive', label: 'Executive Board', icon: Award },
        { id: 'finance-intelligence', label: 'Finance Intelligence', icon: Coins, aliases: ['finance'] },
        { id: 'risk-compliance', label: 'Risk & PPADA Compliance', icon: ShieldAlert, aliases: ['risk'] },
        { id: 'decision', label: 'Decision & Audit Ledger', icon: CheckSquare },
      ],
    },
    {
      title: 'AI RUNTIME & OS',
      items: [
        { id: 'agents', label: 'Autonomous Agent Platform', icon: Bot },
        { id: 'ai-operations', label: 'AI Operations Center', icon: Cpu, aliases: ['ai-ops'] },
        { id: 'ai-runtime', label: 'AI Runtime Platform', icon: Server },
        { id: 'admin', label: 'Administration OS', icon: Users },
      ],
    },
  ];

  return (
    <aside
      className={`atlas-shell-sidebar shrink-0 flex flex-col justify-between transition-all duration-300 z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Nav Rail */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id || (item.aliases && item.aliases.includes(activeModule));
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectModule(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'atlas-shell-nav-active font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    {!isCollapsed && (
                      <div className="flex-1 flex items-center justify-between text-left truncate">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/20 font-mono shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Terminal Controls */}
      <div className="p-2 border-t border-slate-800/80 space-y-1 bg-slate-950/40">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors font-mono"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>

        {!isCollapsed && (
          <div className="px-3 py-2 rounded bg-slate-900/60 border border-slate-800/60 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>TERMINAL ID: ATLAS-01</span>
            <span className="text-emerald-400 font-semibold">ONLINE</span>
          </div>
        )}
      </div>
    </aside>
  );
};

