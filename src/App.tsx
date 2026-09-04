import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Bot, Search, Bell, Layers, Cpu, Compass, MessageSquare, 
  SearchCode, Play, Network, FileArchive, GitCommit, BarChart3, 
  Eye, ShieldCheck, Settings, Power, User, HelpCircle, AlertCircle,
  X, CheckCircle, Flame, Sparkles, Sliders, Boxes, Anchor, FileText, Scale, FileCheck,
  Lock, Fingerprint, RefreshCw, Activity, Wallet, GitBranch, Shield, Workflow, CheckCircle2
} from 'lucide-react';

import { checkSystemHealth } from './utils/ai';

// SCM Modular Components imports
import OverviewController from './components/ketraco/OverviewController';
import DroneIntelligenceModule from './components/ketraco/DroneIntelligenceModule';
import TenderStudio from './components/ketraco/TenderStudio';
import ScmDigitalTwin from './components/ketraco/ScmDigitalTwin';
import ScmCopilot from './components/ketraco/ScmCopilot';
import DecisionApprovalCenter from './components/ketraco/DecisionApprovalCenter';
import ScmContractIntelligence from './components/ketraco/ScmContractIntelligence';
import { 
  ProjectSupplyNexus, 
  SupplierIntelligence, 
  // LogisticsCommand - replaced with new LogisticsView
  RiskComplianceCenter, 
  StrategicSourcing, 
  ExecutiveIntelligence, 
  AdministrationOS 
} from './components/ketraco/ScmModules';
import { LogisticsView } from './components/logistics';
import InventoryHub from './components/ketraco/InventoryHub';
import AiOperationsCenter from './components/ketraco/AiOperationsCenter';
import ProcurementGraphCenter from './components/ketraco/ProcurementGraphCenter';
import ProcurementWatchCenter from './components/intelligence/ProcurementWatchCenter';
import CaseManagementSystem from './components/intelligence/CaseManagementSystem';
import FinanceModule from './components/ketraco/finance/FinanceModule';
import AtlasModuleWorkspace from './components/platform/AtlasModuleWorkspace';

import AgentPlatform from './components/intelligence/AgentPlatform';
import AIRuntimeDashboard from './components/ai-runtime/AIRuntimeDashboard';
import AtlasAgentOS from './components/platform/AtlasAgentOS';
import ExecutiveDemoMode, { type DemoScene } from './components/platform/ExecutiveDemoMode';

import { TenantProvider, useTenant } from './context/TenantContext';
import { TenantBadge, PermissionBadge } from './components/ui/EnterpriseComponents';

import { ShellProvider } from './components/shell/ShellContext';
import GlobalHeader from './components/shell/GlobalHeader';
import GlobalSidebar from './components/shell/GlobalSidebar';
import MinimalPageHero from './components/shell/MinimalPageHero';
import TransparentFooter from './components/shell/TransparentFooter';

// Intelligence Topology Canvas — purposeful, slow-moving network
// Represents enterprise connections: nodes pulse with cyan/purple signal,
// edges form and dissolve to suggest live data flows. No mouse interaction.
function AmbientParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Enterprise topology nodes — slow, drifting intelligence signals
    const nodeCount = 30;
    interface TopoNode {
      x: number; y: number; vx: number; vy: number;
      r: number; phase: number; type: 'cyan' | 'violet';
    }
    const nodes: TopoNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.8 + 0.8,
        phase: Math.random() * Math.PI * 2,
        type: i % 3 === 0 ? 'violet' : 'cyan',
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.0003;

      // Subtle fixed grid — barely visible reference structure
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.018)';
      ctx.lineWidth = 1;
      const step = 80;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Flowing signal wave — horizontal data stream
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.015)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 8) {
        const y = Math.sin(x * 0.002 + time) * 50 + height * 0.45;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Second wave — violet data path
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.012)';
      ctx.beginPath();
      for (let x = 0; x < width; x += 8) {
        const y = Math.sin(x * 0.0015 + time * 0.7 + 2) * 40 + height * 0.55;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Update and draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const pulse = Math.sin(time * 2 + n.phase) * 0.3 + 0.7;
        const alpha = 0.15 * pulse;
        const color = n.type === 'violet'
          ? `rgba(139, 92, 246, ${alpha})`
          : `rgba(0, 217, 255, ${alpha})`;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw connections — dissolve based on distance
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 140;
          if (dist < maxDist) {
            const edgeAlpha = 0.04 * (1 - dist / maxDist);
            ctx.strokeStyle = a.type === 'violet' || b.type === 'violet'
              ? `rgba(139, 92, 246, ${edgeAlpha})`
              : `rgba(0, 217, 255, ${edgeAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 block w-full h-full opacity-60" />;
}

function AppInner() {
  const { currentTenant, availableTenants, switchTenant, userProfile, setUserProfile } = useTenant();

  // Zero Trust Access States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('atlas_access_token'));
  const [loginEmail, setLoginEmail] = useState('kamau@ketraco.co.ke');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginTenantId, setLoginTenantId] = useState('ketraco');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Global window.fetch interceptor to seamlessly inject JWT tokens
  useEffect(() => {
    const originalFetch = window.fetch;
    
    const interceptedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const token = localStorage.getItem('atlas_access_token');
      const newInit = init ? { ...init } : {};
      
      // Only intercept /api requests to add authorization header
      if (token && typeof input === 'string' && input.startsWith('/api')) {
        let headers: any = {};
        if (newInit.headers) {
          if (newInit.headers instanceof Headers) {
            headers = new Headers(newInit.headers);
            headers.set('Authorization', `Bearer ${token}`);
            newInit.headers = headers;
          } else if (Array.isArray(newInit.headers)) {
            headers = [...newInit.headers];
            if (!headers.some((h: any) => h[0].toLowerCase() === 'authorization')) {
              headers.push(['Authorization', `Bearer ${token}`]);
            }
            newInit.headers = headers;
          } else {
            headers = { ...newInit.headers };
            if (!headers['Authorization'] && !headers['authorization']) {
              headers['Authorization'] = `Bearer ${token}`;
            }
            newInit.headers = headers;
          }
        } else {
          headers['Authorization'] = `Bearer ${token}`;
          newInit.headers = headers;
        }
      }
      return originalFetch(input, newInit);
    };

    try {
      // Try to define it via property descriptor which is more robust than direct assignment
      Object.defineProperty(window, 'fetch', {
        value: interceptedFetch,
        configurable: true,
        writable: true
      });
    } catch (e) {
      console.warn('[SECURITY] Could not intercept global fetch. Security headers must be handled manually.', e);
    }

    return () => {
      try {
        Object.defineProperty(window, 'fetch', {
          value: originalFetch,
          configurable: true,
          writable: true
        });
      } catch (e) {
        // Fallback to direct assignment if defineProperty fails on cleanup
        (window as any).fetch = originalFetch;
      }
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          tenantId: loginTenantId
        })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('atlas_access_token', data.accessToken);
        localStorage.setItem('atlas_refresh_token', data.refreshToken);
        localStorage.setItem('atlas_user', JSON.stringify(data.user));
        
        // Sync with tenant context user profile
        setUserProfile({
          name: data.user.name,
          role: data.user.role,
          accessLevel: data.user.accessLevel,
          clearance: data.user.clearance
        });
        
        switchTenant(data.user.tenantId);
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setLoginError('Security Gateway offline. Unable to reach identity service.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('atlas_access_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ tenantId: currentTenant.id })
        });
      }
    } catch (err) {
      console.warn('Silent logout warning:', err);
    } finally {
      localStorage.removeItem('atlas_access_token');
      localStorage.removeItem('atlas_refresh_token');
      localStorage.removeItem('atlas_user');
      setIsAuthenticated(false);
    }
  };

  // Cinematic Introduction states
  const [introStep, setIntroStep] = useState(1);
  const [isIntroCompleted, setIsIntroCompleted] = useState(false);
  const STARTUP_SEQUENCE_MS = 12000;

  // KETRACO SCM Navigation State
  const [activeModule, setActiveModule] = useState<'overview' | 'drone-intelligence' | 'tender' | 'project' | 'inventory' | 'supplier' | 'logistics' | 'risk' | 'twin' | 'sourcing' | 'executive' | 'admin' | 'agents' | 'decision' | 'ai-ops' | 'acin' | 'ai-runtime' | 'procurement-graph' | 'intelligence' | 'finance' | 'atlas-demo'>(() => {
    if (typeof window === 'undefined') return 'overview';
    const route = window.location.pathname.replace(/\/+$/, '') || '/';
    if (route === '/drone-intelligence' || route.startsWith('/drone-intelligence/')) return 'drone-intelligence';
    if (route === '/overview') return 'overview';
    if (route === '/atlas-demo') return 'atlas-demo';
    return 'overview';
  });
  const [intelligenceTab, setIntelligenceTab] = useState('Watch Center');
  const [activeWorkspace, setActiveWorkspace] = useState('NEXUS_SCM_MAIN');

  // Interactive panels toggles
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [paletteSearch, setPaletteSearch] = useState('');
  
  // Real health telemetry state from backend
  const [systemHealth, setSystemHealth] = useState({
    status: 'authenticating',
    database: 'syncing...',
    gemini_configured: false,
    version: '1.0_KETRACO'
  });

  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);
  const [copilotOverridePrompt, setCopilotOverridePrompt] = useState<string | null>(null);

  // Executive Demo Mode state
  const [demoMode, setDemoMode] = useState(false);

  const DEMO_SCENES: DemoScene[] = [
    { id: 's1', title: 'One Enterprise Intelligence Platform', subtitle: 'Salience Atlas sees your enterprise as a living system — data, relationships, assets and agents operating as one cognitive fabric.', icon: Network, module: 'overview' },
    { id: 's2', title: 'Intelligence Anticipates Risk', subtitle: 'Across procurement, supply and logistics, AI monitors live signals and surfaces risk before it disrupts operations.', icon: Eye, module: 'overview', narrative: 'Emerging supplier concentration risk detected. Exposure: $4.2M across a narrow geographic base.' },
    { id: 's3', title: 'Investigation Through the Knowledge Graph', subtitle: 'Click into relationships — how suppliers, contracts, assets and logistics corridors connect to one another.', icon: GitBranch, module: 'procurement-graph', narrative: 'Following the graph reveals affected suppliers, contract dependency and spend exposure.' },
    { id: 's4', title: 'Autonomous Agents Investigate', subtitle: 'Specialist agents act on the shared cognitive fabric — each monitoring a domain and reporting with evidence.', icon: Bot, module: 'agents', narrative: 'Risk Agent investigating 3 anomalies. Logistics Agent optimizing 18 routes.' },
    { id: 's5', title: 'Digital Twins Model the Physical World', subtitle: 'Every critical asset mirrored as a live twin — spatial, relational, operational and temporal views.', icon: Shield, module: 'twin', narrative: 'Transformer TX-042: predicted degradation window identified from anomaly patterns.' },
    { id: 's6', title: 'Recommendations, Not Just Alerts', subtitle: 'AI recommends next steps with confidence, evidence and provenance — enterprise intelligence you can act on.', icon: Workflow, module: 'overview', narrative: 'Recommended: diversify transformer supplier base, mitigate corridor dependency, pre-position spares.' },
    { id: 's7', title: 'From Fragmented Operations to Autonomous Intelligence', subtitle: 'The same cognitive fabric powers every mission. One platform. Understood. Connected. Anticipated.', icon: CheckCircle2, module: 'overview' },
  ];


  const [notifications, setNotifications] = useState([
    { id: '1', type: 'freight', text: "Mombasa Customs hold warning on Substation cable shipment." },
    { id: '2', type: 'compliance', text: "Annual Public Procurement price audit compliance reconciled." }
  ]);

  const fetchTelemetry = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    try {
      const res = await fetch('/api/scm/telemetry', { signal: controller.signal });
      const data = await res.json();
      clearTimeout(timeoutId);
      if (data.success) {
        setTelemetryLogs(data.logs || []);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      // In-app high-fidelity fallback logs in case of offline dev server
      setTelemetryLogs([
        { id: 't1', agentName: 'SCMOrchestrator', timestamp: 'Just now', task: 'Scan Suswa Lot-4 supply readiness', result: 'Allocated 3 core intelligence agents.' },
        { id: 't2', agentName: 'Supplier Intelligence Agent', timestamp: '2 min ago', task: 'Evaluate vendor Shanghai Cable', result: 'SLA rating tagged at 78% reliability buffers.' }
      ]);
    }
  };

  useEffect(() => {
    async function getStats() {
      const stats = await checkSystemHealth();
      setSystemHealth(stats);
    }
    
    // Check for Development Auth Bypass (Requirement 5)
    async function checkAuthBypass() {
      try {
        const res = await fetch('/api/auth/config');
        const data = await res.json();
        if (data.bypassActive) {
          setIsAuthenticated(true);
          setUserProfile({
            name: 'Development User',
            role: 'Administrator',
            accessLevel: 'Level 10 (Full Access)',
            clearance: 'Top Secret'
          });
          switchTenant('ketraco');
        }
      } catch (err) {
        console.warn('[DEV] Auth bypass check failed:', err);
      }
    }

    getStats();
    fetchTelemetry();
    checkAuthBypass();
  }, [setUserProfile, switchTenant]);

  // Introduction sequenced step intervals
  useEffect(() => {
    if (isIntroCompleted) return;
    const t1 = setTimeout(() => setIntroStep(2), 2500);
    const t2 = setTimeout(() => setIntroStep(3), 7000);
    const t3 = setTimeout(() => setIsIntroCompleted(true), STARTUP_SEQUENCE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isIntroCompleted, STARTUP_SEQUENCE_MS]);

  // Command palette keyboard shortcut listener (Ctrl+K / /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // SCM Search Redirect
  const handleNavSearch = (val: string) => {
    setSearchString(val);
    const lower = val.toLowerCase();
    if (lower.includes('finance') || lower.includes('treasury') || lower.includes('budget') || lower.includes('payment') || lower.includes('commitment') || lower.includes('capex') || lower.includes('opex') || lower.includes('contract finance') || lower.includes('ledger')) setActiveModule('finance');
    if (lower.includes('drone') || lower.includes('inspection') || lower.includes('asset') || lower.includes('tower') || lower.includes('line') || lower.includes('grid intelligence')) setActiveModule('drone-intelligence');
    else if (lower.includes('graph') || lower.includes('relationship') || lower.includes('node') || lower.includes('edge')) setActiveModule('procurement-graph');
    else if (lower.includes('acin') || lower.includes('contract') || lower.includes('obligation') || lower.includes('negotiation') || lower.includes('assurance')) setActiveModule('acin');
    else if (lower.includes('tender') || lower.includes('bid')) setActiveModule('tender');
    else if (lower.includes('project') || lower.includes('cable')) setActiveModule('project');
    else if (lower.includes('inventory') || lower.includes('stock')) setActiveModule('inventory');
    else if (lower.includes('supplier') || lower.includes('vendor')) setActiveModule('supplier');
    else if (lower.includes('logistics') || lower.includes('mombasa')) setActiveModule('logistics');
    else if (lower.includes('risk') || lower.includes('compliance') || lower.includes('fraud')) setActiveModule('risk');
    else if (lower.includes('twin') || lower.includes('simulation')) setActiveModule('twin');
    else if (lower.includes('sourcing') || lower.includes('savings')) setActiveModule('sourcing');
    else if (lower.includes('executive') || lower.includes('board') || lower.includes('brief')) setActiveModule('executive');
    else if (lower.includes('agent') || lower.includes('sdk')) setActiveModule('agents');
    else if (lower.includes('federation') || lower.includes('cost') || lower.includes('budget') || lower.includes('token') || lower.includes('resilience') || lower.includes('circuit') || lower.includes('gateway')) setActiveModule('ai-ops');
    else if (lower.includes('admin') || lower.includes('telemetry')) setActiveModule('admin');
    else if (lower.includes('audit') || lower.includes('decision') || lower.includes('approval') || lower.includes('ppada') || lower.includes('sign') || lower.includes('ledger') || lower.includes('court') || lower.includes('procurement')) setActiveModule('decision');
    else if (lower.includes('runtime') || lower.includes('earp') || lower.includes('gateway') || lower.includes('prompt') || lower.includes('registry') || lower.includes('inference')) setActiveModule('ai-runtime');
  };

  // 11 Core SCM navigation links
  const menuItems = [
    { 
      id: 'overview', 
      label: currentTenant.id === 'ketraco' ? 'Command Center' : currentTenant.id === 'kengen' ? 'Generation Command' : 'Distribution Hub', 
      icon: Compass, 
      desc: currentTenant.id === 'ketraco' ? 'Central spatial metrics operations' : currentTenant.id === 'kengen' ? 'Geothermal & Hydro live dispatcher' : 'Last-mile grid distribution' 
    },
    { 
      id: 'tender', 
      label: currentTenant.id === 'kengen' ? 'Sourcing Suite' : 'Tender Intelligence', 
      icon: FileText, 
      desc: currentTenant.id === 'kengen' ? 'Machinery & turbine tender portfolios' : 'Bid evaluations & scoring matrix' 
    },
    { 
      id: 'project', 
      label: 'Project Supply Nexus', 
      icon: Network, 
      desc: 'Material readiness & BOM paths' 
    },
    {
      id: 'atlas-demo',
      label: 'Atlas Module Platform',
      icon: GitCommit,
      desc: 'Reusable graph-aware module demonstration'
    },
    { 
      id: 'inventory', 
      label: currentTenant.id === 'kplc' ? 'Transformer Vault' : 'Inventory Intelligence', 
      icon: Boxes, 
      desc: currentTenant.id === 'kplc' ? 'Subdivision inventory stocks' : 'Depot stocks & deadstock forecasting' 
    },
    { 
      id: 'supplier', 
      label: currentTenant.id === 'kengen' ? 'Vendor Grid' : currentTenant.id === 'kplc' ? 'Contractor Ledger' : 'Supplier Network', 
      icon: User, 
      desc: 'Reliability metrics & scoring trackers' 
    },
    { 
      id: 'logistics', 
      label: 'Logistics Command', 
      icon: Anchor, 
      desc: 'Maritime shipping & port ETA models' 
    },
    { 
      id: 'risk', 
      label: currentTenant.id === 'kplc' ? 'Grid Loss Prevention' : 'Risk & Compliance', 
      icon: ShieldCheck, 
      desc: 'Fraud auditing & conflict triggers' 
    },
    {
      id: 'decision',
      label: 'Decision & Audit Hub',
      icon: Scale,
      desc: 'PPADA statutory signs & trust ledger'
    },
    {
      id: 'acin',
      label: 'Contract Intelligence',
      icon: FileCheck,
      desc: 'Autonomous Obligation Twins & Simulator'
    },
    {
      id: 'drone-intelligence',
      label: 'Drone Intelligence',
      icon: Eye,
      desc: 'Inspection, defect, asset, and corridor intelligence'
    },
    {
      id: 'procurement-graph',
      label: 'Graph & Digital Twin',
      icon: Network,
      desc: 'Relationship Knowledge Graph & Digital Twins'
    },
    {
      id: 'intelligence',
      label: 'Decision Intelligence',
      icon: Activity,
      desc: 'Predictive Command Center & Case Management'
    },
    { 
      id: 'twin', 
      label: currentTenant.id === 'kengen' ? 'Reservoir Digital Twin' : 'SCM Digital Twin', 
      icon: Cpu, 
      desc: 'Disruption stressors & failure sandbox' 
    },
    { 
      id: 'sourcing', 
      label: 'Strategic Sourcing', 
      icon: BarChart3, 
      desc: 'Spend optimizations & savings indices' 
    },
    { 
      id: 'executive', 
      label: 'Executive Board', 
      icon: Sliders, 
      desc: 'Board briefings & KPI summaries' 
    },
    { 
      id: 'agents', 
      label: 'Agent OS', 
      icon: Bot, 
      desc: 'Enterprise AI federation & autonomous operations' 
    },
    { 
      id: 'ai-ops', 
      label: 'AI Operations Center', 
      icon: Cpu, 
      desc: 'Provider resilience & cost telemetry' 
    },
    { 
      id: 'ai-runtime', 
      label: 'AI Runtime Platform', 
      icon: Layers, 
      desc: 'Enterprise AI Governance & Gateway' 
    },
    { 
      id: 'admin', 
      label: currentTenant.id === 'kengen' ? 'Control Panel' : 'Administration OS', 
      icon: Settings, 
      desc: 'RBAC controls & multi-agent telemetry' 
    },
    { 
      id: 'finance', 
      label: 'Finance Intelligence', 
      icon: Wallet, 
      desc: 'Budget, commit, payment, CAPEX/OPEX & financial graph' 
    }
  ].filter(item => {
    const config = currentTenant.modules.find(m => m.id === item.id);
    return config ? config.enabled : true;
  });

  const handleTriggerCopilot = (promptText: string) => {
    setCopilotOverridePrompt(promptText);
  };

  useEffect(() => {
    if (activeModule === 'drone-intelligence') {
      const currentPath = window.location.pathname.replace(/\/+$/, '');
      if (!currentPath.startsWith('/drone-intelligence')) {
        window.history.replaceState({}, '', '/drone-intelligence');
      }
      return;
    }

    const normalizedPath = `/${activeModule}`;
    if (window.location.pathname !== normalizedPath) {
      window.history.replaceState({}, '', normalizedPath);
    }
  }, [activeModule]);

  // Render cinematic initial intro gate
  if (!isIntroCompleted) {
    return (
      <div className="fixed inset-0 bg-[#05070D] z-50 flex flex-col justify-center items-center overflow-hidden font-sans select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,255,0.06),transparent_60%)]"></div>
        
        {/* Intelligence topology canvas — subtle background */}
        <div className="absolute inset-x-0 h-44 pointer-events-none opacity-30">
          <AmbientParticleCanvas />
        </div>

        <div className="relative text-center space-y-6 z-10 px-6 max-w-lg">
          <AnimatePresence mode="wait">
            {introStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <h1 className="text-3xl font-display font-semibold tracking-tight text-white leading-none">SALIENCE ATLAS</h1>
                <p className="text-[11px] font-mono text-cyan-400/80 tracking-widest uppercase">Enterprise Intelligence Operating System</p>
              </motion.div>
            )}

            {introStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                <div className="w-16 h-[1px] bg-gradient-to-r from-cyan-400/60 to-transparent mx-auto mb-3" />
                <h2 className="text-sm font-display font-medium tracking-tight text-white/90">Connecting Enterprise Intelligence Fabric</h2>
                <div className="flex items-center justify-center gap-2 text-[9px] font-mono text-slate-500 tracking-wider">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                  KNOWLEDGE GRAPH
                  <span className="w-px h-3 bg-slate-800" />
                  <span className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                  AI FEDERATION
                  <span className="w-px h-3 bg-slate-800" />
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
                  DIGITAL TWINS
                </div>
              </motion.div>
            )}

            {introStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                <div className="w-16 h-[1px] bg-gradient-to-r from-violet-400/60 to-transparent mx-auto mb-3" />
                <h2 className="text-sm font-display font-medium tracking-tight text-white/90">Intelligence Environment Ready</h2>
                <p className="text-[9px] font-mono text-slate-500 tracking-wider">COGNITIVE FABRIC SYNCHRONIZED</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Zero Trust Identity Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#05070D] z-50 flex flex-col justify-center items-center overflow-hidden font-sans select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,255,0.04),transparent_60%)]"></div>
        
        {/* Intelligence topology canvas — subtle background */}
        <div className="absolute inset-x-0 h-44 pointer-events-none opacity-20">
          <AmbientParticleCanvas />
        </div>

        <div className="relative z-10 w-full max-w-md p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0B1220]/80 backdrop-blur-xl border border-cyan-500/10 rounded-2xl p-6 space-y-6 shadow-2xl"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 border border-cyan-500/20 rounded-2xl flex items-center justify-center bg-[#05070D] mx-auto">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-lg font-display font-semibold tracking-tight text-white uppercase mt-4">SALIENCE ATLAS</h1>
              <p className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-widest">Enterprise Intelligence Access</p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-950/30 border border-rose-500/20 text-rose-400 text-[10px] font-mono rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">Platform Environment</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ketraco', label: 'KETRACO' },
                    { id: 'kengen', label: 'KenGen' },
                    { id: 'kplc', label: 'KPLC' }
                  ].map(ten => (
                    <button
                      key={ten.id}
                      type="button"
                      onClick={() => setLoginTenantId(ten.id)}
                      className={`py-2 text-center rounded-lg border transition-all cursor-pointer ${
                        loginTenantId === ten.id
                          ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-400'
                          : 'bg-[#05070D] border-slate-800 text-slate-500 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {ten.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">Identity</label>
                <select
                  value={loginEmail}
                  onChange={e => {
                    setLoginEmail(e.target.value);
                  }}
                  className="w-full bg-[#05070D] border border-slate-800 focus:border-cyan-500/50 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/30 cursor-pointer transition-colors"
                >
                  <option value="kamau@ketraco.co.ke">John Kamau — SCM Intelligence Officer</option>
                  <option value="board@ketraco.co.ke">Board Director — KETRACO</option>
                  <option value="ndegwa@kengen.co.ke">Dr. Peter Ndegwa — CPO KenGen</option>
                  <option value="kariuki@kplc.co.ke">Eng. Alice Kariuki — Grid Logistics KPLC</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">Passphrase</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter passphrase"
                  className="w-full bg-[#05070D] border border-slate-800 focus:border-cyan-500/50 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/30 placeholder-slate-600 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 font-bold rounded-xl text-center uppercase cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4" /> Access Intelligence Environment
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-slate-800/60 pt-3 text-center">
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest block">
                Governed under Kenya National Treasury & PPADA 2015
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative flex flex-col font-sans text-slate-200 overflow-hidden select-none"
      style={{ backgroundColor: currentTenant.theme.bodyBg }}
    >
      
      {/* Refined intelligence atmosphere — subtle, purposeful */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] rounded-full bg-[#00D9FF] opacity-[0.04] blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#8B5CF6] opacity-[0.03] blur-[100px]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Dynamic background canvas */}
      <AmbientParticleCanvas />

      {/* TOP COMMAND NAVIGATION BAR - AI-native enterprise command rail */}
      <GlobalHeader
        searchString={searchString}
        onSearchChange={handleNavSearch}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onSwitchTenant={(id) => {
          switchTenant(id);
          setActiveModule('overview');
          window.history.replaceState({}, '', '/overview');
        }}
        onLogout={handleLogout}
        systemHealth={systemHealth}
        notifications={notifications}
        setNotifications={setNotifications}
      />

      {/* STAGE CONTAINER WITH LEFT COMPACT SIDEBAR AND CENTRAL STAGE */}
      <div className="flex-1 flex overflow-hidden select-none" id="shell-container">
        <GlobalSidebar
          items={menuItems as any}
          activeModule={activeModule}
          onNavigate={(id) => setActiveModule(id as any)}
          onShutdown={(msg) => {
            setNotifications(prev => [{ id: Date.now().toString(), type: 'shutdown', text: msg }, ...prev]);
            setShowNotifications(true);
          }}
        />

        {/* WORKSPACE CENTRAL MAIN BOARD STAGE */}
        <main className="flex-1 overflow-hidden flex select-none" id="workspace-main-board">
          
          {/* Main Module Render Block inside animated presence container */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <MinimalPageHero activeModule={activeModule} />
            <AnimatePresence mode="wait">
              {activeModule === 'drone-intelligence' && (
                <motion.div
                  key="drone-intelligence"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <DroneIntelligenceModule />
                </motion.div>
              )}

              {activeModule === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <OverviewController 
                    onAskCopilot={handleTriggerCopilot}
                    systemHealth={systemHealth}
                  />
                </motion.div>
              )}

              {activeModule === 'tender' && (
                <motion.div
                  key="tender"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <TenderStudio onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'project' && (
                <motion.div
                  key="project"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <ProjectSupplyNexus onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'atlas-demo' && (
                <motion.div
                  key="atlas-demo"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <AtlasModuleWorkspace onAskAtlas={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'inventory' && (
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <InventoryHub onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'supplier' && (
                <motion.div
                  key="supplier"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <SupplierIntelligence onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'logistics' && (
                <motion.div
                  key="logistics"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <LogisticsView onNavigate={(view) => setActiveModule(view as any)} />
                </motion.div>
              )}

              {activeModule === 'risk' && (
                <motion.div
                  key="risk"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <RiskComplianceCenter onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'decision' && (
                <motion.div
                  key="decision"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <DecisionApprovalCenter onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'acin' && (
                <motion.div
                  key="acin"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <ScmContractIntelligence onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'procurement-graph' && (
                <motion.div
                  key="procurement-graph"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <ProcurementGraphCenter />
                </motion.div>
              )}

              {activeModule === 'intelligence' && (
                <motion.div
                  key="intelligence"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                   <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="bg-white border-b border-slate-200 px-8 py-1 flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
                         {['Watch Center', 'Case Management'].map(tab => (
                            <button 
                               key={tab}
                               onClick={() => setIntelligenceTab(tab)}
                               className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${
                                  intelligenceTab === tab 
                                     ? 'text-blue-600 border-blue-600' 
                                     : 'text-slate-400 border-transparent hover:text-slate-600'
                               }`}
                            >
                               {tab}
                            </button>
                         ))}
                      </div>
                      <div className="flex-1 overflow-hidden">
                         {intelligenceTab === 'Watch Center' && <ProcurementWatchCenter />}
                         {intelligenceTab === 'Case Management' && <CaseManagementSystem />}
                      </div>
                   </div>
                </motion.div>
              )}

              {activeModule === 'twin' && (
                <motion.div
                  key="twin"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <ScmDigitalTwin onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'sourcing' && (
                <motion.div
                  key="sourcing"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <StrategicSourcing onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'executive' && (
                <motion.div
                  key="executive"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <ExecutiveIntelligence onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'agents' && (
                <motion.div
                  key="agents"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <AtlasAgentOS />
                </motion.div>
              )}

              {activeModule === 'ai-ops' && (
                <motion.div
                  key="ai-ops"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <AiOperationsCenter />
                </motion.div>
              )}

              {activeModule === 'ai-runtime' && (
                <motion.div
                  key="ai-runtime"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <AIRuntimeDashboard />
                </motion.div>
              )}

              {activeModule === 'admin' && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <AdministrationOS telemetryLogs={telemetryLogs} onAskCopilot={handleTriggerCopilot} />
                </motion.div>
              )}

              {activeModule === 'finance' && (
                <motion.div
                  key="finance"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <FinanceModule />
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* SCM AUTONOMOUS COPILOT SIDE DRAWER - Omnipresent companion */}
          <ScmCopilot 
            onRefreshTelemetry={fetchTelemetry}
            overridePrompt={copilotOverridePrompt}
            clearOverridePrompt={() => setCopilotOverridePrompt(null)}
          />

        </main>
      </div>

      <TransparentFooter systemHealth={systemHealth} />

      {/* Executive Demo Mode floating trigger */}
      {!demoMode && (
        <button
          onClick={() => setDemoMode(true)}
          className="fixed bottom-14 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1220]/90 border border-cyan-500/25 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all cursor-pointer shadow-xl"
          title="Launch executive presentation mode"
          aria-label="Launch executive demo mode"
        >
          <Play className="w-3 h-3" /> Demo Mode
        </button>
      )}

      {/* Executive Demo Mode overlay */}
      <AnimatePresence>
        {demoMode && (
          <ExecutiveDemoMode
            scenes={DEMO_SCENES}
            activeModule={activeModule}
            onNavigate={(id) => setActiveModule(id as any)}
            onExit={() => setDemoMode(false)}
          />
        )}
      </AnimatePresence>

      {/* DETAILED COMMAND PALETTE SHORTCUT MODAL triggered by Ctrl+K */}
      <AnimatePresence>
        {showCommandPalette && (
          <div className="fixed inset-0 bg-[#05070D]/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-xl bg-[#0B1220] border border-cyan-500/10 rounded-2xl overflow-hidden p-5 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                <span className="text-xs font-mono font-bold text-cyan-400/80 flex items-center gap-1.5 uppercase">
                  <Terminal className="w-3.5 h-3.5" /> Intelligence Command
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono text-slate-600 bg-[#05070D] px-1.5 py-0.5 rounded border border-slate-800">
                    ESC to close
                  </span>
                  <button 
                    onClick={() => { setShowCommandPalette(false); setPaletteSearch(''); }}
                    className="p-1 text-slate-500 hover:text-white rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic Interactive Input Field */}
              <div className="relative">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Type a module name to navigate, or query SCM Atlas AI directly..."
                  value={paletteSearch}
                  onChange={(e) => setPaletteSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (paletteSearch.trim()) {
                        const matched = menuItems.find(m => m.label.toLowerCase() === paletteSearch.toLowerCase().trim());
                        if (matched) {
                           setActiveModule(matched.id as any);
                           setShowCommandPalette(false);
                           setPaletteSearch('');
                        } else {
                           handleTriggerCopilot(paletteSearch);
                           setShowCommandPalette(false);
                           setPaletteSearch('');
                        }
                      }
                    }
                  }}
                  className="w-full bg-[#05070D] border border-slate-800 focus:border-cyan-500/30 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/10 transition-all font-sans"
                />
              </div>

              {/* Filtering logic: AI prompt execute suggestion */}
              {paletteSearch.trim() && (
                <div className="pt-1">
                  <button
                    onClick={() => {
                      handleTriggerCopilot(paletteSearch);
                      setShowCommandPalette(false);
                      setPaletteSearch('');
                    }}
                    className="w-full flex items-center justify-between p-3 bg-cyan-950/20 hover:bg-cyan-900/35 border border-cyan-500/20 text-slate-200 rounded-xl text-left cursor-pointer text-xs transition-all"
                  >
                    <div className="flex items-center gap-2 text-cyan-300 font-medium">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>Execute Brain Query: "{paletteSearch}"</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded font-black border border-cyan-500/20">
                      ⏎ ENTER TO RUN
                    </span>
                  </button>
                </div>
              )}

              {/* Route module selection with filtering */}
              <div className="space-y-1.5 pt-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 block">
                  {paletteSearch ? 'Filtered Modules' : 'Available SCM Operations'}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1">
                  {menuItems
                    .filter(m => 
                      !paletteSearch || 
                      m.label.toLowerCase().includes(paletteSearch.toLowerCase()) ||
                      m.desc.toLowerCase().includes(paletteSearch.toLowerCase())
                    )
                    .map(m => {
                      const MIcon = m.icon;
                      return (
                        <button
                          key={m.id}
                          onClick={() => {
                            setActiveModule(m.id as any);
                            setShowCommandPalette(false);
                            setPaletteSearch('');
                          }}
                          className="flex items-center gap-3 p-3 bg-slate-950 hover:bg-slate-900/80 border border-slate-900 hover:border-cyan-500/15 text-left rounded-xl transition-all cursor-pointer block"
                        >
                          <MIcon className="w-4 h-4 text-[#00D9FF]" />
                          <div>
                            <span className="text-xs font-semibold text-white block truncate">{m.label}</span>
                            <span className="text-[9px] font-mono text-slate-400 block mt-0.5 truncate">{m.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <TenantProvider>
      <ShellProvider>
        <AppInner />
      </ShellProvider>
    </TenantProvider>
  );
}
