import React, { useState, useEffect } from 'react';
import { GlobalHeader } from './components/shell/GlobalHeader';
import { GlobalSidebar } from './components/shell/GlobalSidebar';
import { MinimalPageHero } from './components/shell/MinimalPageHero';
import { TransparentFooter } from './components/shell/TransparentFooter';
import { CommandPaletteModal } from './components/shell/CommandPaletteModal';
import { CopilotDrawer } from './components/shell/CopilotDrawer';

import { CommandCenterModule } from './components/modules/CommandCenterModule';
import { DroneIntelligenceModule } from './components/modules/DroneIntelligenceModule';
import { LogisticsCommandModule } from './components/modules/LogisticsCommandModule';
import { ProcurementDigitalTwinModule } from './components/modules/ProcurementDigitalTwinModule';
import { FinanceIntelligenceModule } from './components/modules/FinanceIntelligenceModule';
import { AiOperationsModule } from './components/modules/AiOperationsModule';

import { TenderStudioModule } from './components/modules/TenderStudioModule';
import { InventoryHubModule } from './components/modules/InventoryHubModule';
import { ProcurementGraphModule } from './components/modules/ProcurementGraphModule';
import { DecisionIntelligenceModule } from './components/modules/DecisionIntelligenceModule';
import { ScmDigitalTwinModule } from './components/modules/ScmDigitalTwinModule';
import { ProjectSupplyModule } from './components/modules/ProjectSupplyModule';
import { SupplierNetworkModule } from './components/modules/SupplierNetworkModule';
import { StrategicSourcingModule } from './components/modules/StrategicSourcingModule';
import { ContractIntelligenceModule } from './components/modules/ContractIntelligenceModule';
import { ExecutiveBoardModule } from './components/modules/ExecutiveBoardModule';
import { RiskComplianceModule } from './components/modules/RiskComplianceModule';
import { DecisionAuditModule } from './components/modules/DecisionAuditModule';
import { AgentPlatformModule } from './components/modules/AgentPlatformModule';
import { AiRuntimeModule } from './components/modules/AiRuntimeModule';
import { AdminOsModule } from './components/modules/AdminOsModule';

import { Tenant, UserProfile, ModuleId, TelemetryState } from './types';

const AVAILABLE_TENANTS: Tenant[] = [
  {
    id: 'ketraco',
    name: 'Kenya Electricity Transmission Co. (KETRACO)',
    code: 'KETRACO',
    badgeColor: 'cyan',
    clearanceLevel: 'LEVEL 04 (DIRECTOR)',
    modules: [
      'command-center',
      'grid-corridors',
      'drone-intelligence',
      'procurement-twin',
      'logistics-command',
      'finance-intelligence',
      'ai-operations',
      'risk-compliance',
    ],
  },
  {
    id: 'kengen',
    name: 'Kenya Electricity Generating Co. (KenGen)',
    code: 'KENGEN',
    badgeColor: 'emerald',
    clearanceLevel: 'LEVEL 03 (DISPATCH)',
    modules: ['command-center', 'grid-corridors', 'finance-intelligence'],
  },
  {
    id: 'kplc',
    name: 'Kenya Power & Lighting Co. (KPLC)',
    code: 'KPLC',
    badgeColor: 'amber',
    clearanceLevel: 'LEVEL 02 (DISTRIBUTION)',
    modules: ['command-center', 'logistics-command'],
  },
];

const DEFAULT_USER: UserProfile = {
  id: 'user_kamau_01',
  name: 'John Kamau',
  email: 'kamau@ketraco.co.ke',
  role: 'SCM Intelligence Officer',
  accessLevel: 'LEVEL 04',
  clearance: 'Enterprise Clear',
  tenantId: 'ketraco',
};

export default function App() {
  const [currentTenant, setCurrentTenant] = useState<Tenant>(AVAILABLE_TENANTS[0]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USER);
  const [activeModule, setActiveModule] = useState<ModuleId>('command-center');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<TelemetryState | null>(null);

  // Poll real backend telemetry
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/scm/telemetry');
        if (res.ok) {
          const data = await res.json();
          setTelemetry(data);
        }
      } catch (err) {
        console.warn('Backend telemetry fallback to nominal state.');
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 30000);
    return () => clearInterval(interval);
  }, []);

  // Global Keyboard shortcuts: ⌘K or Ctrl+K opens Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === '/' && !isCommandPaletteOpen) {
        const target = e.target as HTMLElement;
        if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  // Render the selected module component
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'overview':
      case 'command-center':
      case 'grid-corridors':
        return <CommandCenterModule />;
      case 'drone-intelligence':
        return <DroneIntelligenceModule />;
      case 'logistics':
      case 'logistics-command':
        return <LogisticsCommandModule />;
      case 'twin':
        return <ScmDigitalTwinModule />;
      case 'tender':
        return <TenderStudioModule />;
      case 'procurement-twin':
        return <ProcurementDigitalTwinModule />;
      case 'inventory':
        return <InventoryHubModule />;
      case 'project':
        return <ProjectSupplyModule />;
      case 'supplier':
        return <SupplierNetworkModule />;
      case 'sourcing':
        return <StrategicSourcingModule />;
      case 'intelligence':
        return <DecisionIntelligenceModule />;
      case 'procurement-graph':
        return <ProcurementGraphModule />;
      case 'acin':
        return <ContractIntelligenceModule />;
      case 'executive':
        return <ExecutiveBoardModule />;
      case 'finance':
      case 'finance-intelligence':
        return <FinanceIntelligenceModule />;
      case 'risk':
      case 'risk-compliance':
        return <RiskComplianceModule />;
      case 'decision':
        return <DecisionAuditModule />;
      case 'agents':
        return <AgentPlatformModule />;
      case 'ai-ops':
      case 'ai-operations':
        return <AiOperationsModule />;
      case 'ai-runtime':
        return <AiRuntimeModule />;
      case 'admin':
        return <AdminOsModule />;
      default:
        return <CommandCenterModule />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Global Shell Header */}
      <GlobalHeader
        currentTenant={currentTenant}
        onSelectTenant={setCurrentTenant}
        availableTenants={AVAILABLE_TENANTS}
        currentUser={currentUser}
        telemetry={telemetry}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onToggleCopilot={() => setIsCopilotOpen(prev => !prev)}
      />

      {/* 2. Middle Layer: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        <GlobalSidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        />

        <main className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-[#0b1120] to-[#070b14]">
          <MinimalPageHero
            activeModule={activeModule}
            currentTenant={currentTenant}
          />

          <div className="flex-1">
            {renderActiveModule()}
          </div>

          {/* 3. Global Transparent Footer */}
          <TransparentFooter
            currentTenant={currentTenant}
            telemetry={telemetry}
          />
        </main>
      </div>

      {/* 4. Command Palette Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setActiveModule}
      />

      {/* 5. AI Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentTenant={currentTenant}
      />
    </div>
  );
}
