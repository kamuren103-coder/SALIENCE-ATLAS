import React, { useState, useEffect, useMemo, useRef } from 'react';
import GridHeader from './GridHeader';
import GridKpiStrip from './GridKpiStrip';
import GridMapCanvas from './GridMapCanvas';
import GridDigitalTwin3D from './GridDigitalTwin3D';
import GridGraphExplorer from './GridGraphExplorer';
import GridDataQualityPanel from './GridDataQualityPanel';
import GridIntelligencePanel from './GridIntelligencePanel';
import GridEventFabric from './GridEventFabric';
import GridCommandPalette from './GridCommandPalette';
import GridSystemHealthModal from './GridSystemHealthModal';
import GridResilienceModal from './GridResilienceModal';
import { GridReconciliationEngine } from './canonical/reconciliation-engine';

// Phase 04 Intelligence Fabric & Scorecards
import { GridIntelligenceEngine } from './intelligence/intelligence-fabric';
import GridTopBarIntelligenceHUD from './intelligence/GridTopBarIntelligenceHUD';
import GridIntelligenceScorecard from './intelligence/GridIntelligenceScorecard';
import GridIntelligenceTimeline from './intelligence/GridIntelligenceTimeline';
import { CopilotQAResult } from './intelligence/types';

// Phase 05 Predictive Operations & Scenario Digital Twin
import NationalGridPlanningDashboard from './planning/NationalGridPlanningDashboard';
import NationalOutageWall from './planning/NationalOutageWall';
import GridMaintenanceCalendar from './planning/GridMaintenanceCalendar';
import NationalForecastWall from './intelligence/NationalForecastWall';
import ScenarioLab from './intelligence/ScenarioLab';
import ContingencyRankingView from './intelligence/ContingencyRankingView';
import PredictiveWatchlistView from './intelligence/PredictiveWatchlistView';
import WeatherImpactView from './intelligence/WeatherImpactView';
import ModelDriftView from './intelligence/ModelDriftView';
import DigitalTwinTimeMachine, { TemporalMode } from './intelligence/DigitalTwinTimeMachine';
import OperatorDecisionPanel from './intelligence/OperatorDecisionPanel';
import { GridScenarioEngine } from './intelligence/scenario-engine';

// Phase 06 Operational Decision Intelligence & National Operating Picture
import { GridStateEngine } from './decision/grid-state-engine';
import { GridPriorityEngine } from './decision/priority-engine';
import { CrossDomainCorrelationEngine } from './decision/cross-domain-correlation-engine';
import { GridIncidentLifecycleManager } from './decision/incident-lifecycle-manager';
import { GridLearningEngine } from './decision/learning-engine';
import NationalOperatingPictureHUD from './decision/NationalOperatingPictureHUD';
import OperatorActionQueue from './decision/OperatorActionQueue';
import EventCausalityGraph from './decision/EventCausalityGraph';
import CrossDomainCorrelationView from './decision/CrossDomainCorrelationView';
import DecisionAuditLedgerView from './decision/DecisionAuditLedgerView';
import ExecutiveIntelligenceView from './decision/ExecutiveIntelligenceView';
import MaintenanceOperationsFusion from './decision/MaintenanceOperationsFusion';
import ModelDataTrustPanel from './decision/ModelDataTrustPanel';
import OperatorDecisionBriefModal from './decision/OperatorDecisionBriefModal';
import Asset360Modal from './decision/Asset360Modal';
import Corridor360Modal from './decision/Corridor360Modal';
import NationalGridHealthScorecard from './decision/NationalGridHealthScorecard';
import GridStateDriversModal from './decision/GridStateDriversModal';
import { OperatorDecisionAction } from './decision/types';

// Phase 02 Additions: Tokens, Switcher, Primitives and Density Layers
import ModeSwitcher from './ModeSwitcher';
import { CommandModeKey } from './tokens';
import SystemOperationsLayer from './layers/SystemOperationsLayer';
import TransmissionPerformanceLayer from './layers/TransmissionPerformanceLayer';
import AssetIntelligenceLayer from './layers/AssetIntelligenceLayer';
import GridRiskIntelligenceLayer from './layers/GridRiskIntelligenceLayer';
import OutageAlarmFabricLayer from './layers/OutageAlarmFabricLayer';
import ForecastEnvironmentalLayer from './layers/ForecastEnvironmentalLayer';
import AiIntelligenceAnomalyLayer from './layers/AiIntelligenceAnomalyLayer';
import { motionController } from './motion-controller';

import { 
  CANONICAL_SUBSTATIONS, 
  CANONICAL_LINES, 
  CANONICAL_KPIS, 
  CANONICAL_EVENTS, 
  CANONICAL_ALARMS, 
  CANONICAL_AI_INSIGHTS 
} from './grid-canonical-data';

import { 
  GridAsset, 
  TransmissionLine, 
  KpiFamily, 
  GridAlarm, 
  GridEvent, 
  MapLayerKey, 
  OperationalViewMode, 
  ViewCameraPreset, 
  DataFreshness 
} from './types';

export default function CommandCenterShell() {
  // Live Data State
  const [substations, setSubstations] = useState<Record<string, GridAsset>>(CANONICAL_SUBSTATIONS);
  const [lines, setLines] = useState<Record<string, TransmissionLine>>(CANONICAL_LINES);
  const [kpis, setKpis] = useState<KpiFamily[]>(CANONICAL_KPIS);
  const [events, setEvents] = useState<GridEvent[]>(CANONICAL_EVENTS);
  const [alarms, setAlarms] = useState<GridAlarm[]>(CANONICAL_ALARMS);
  
  // Selection and Views
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedKpiId, setSelectedKpiId] = useState<string | undefined>(undefined);
  const [operationalMode, setOperationalMode] = useState<OperationalViewMode>('NORMAL');
  const [activeCommandMode, setActiveCommandMode] = useState<CommandModeKey>('OPERATIONS');
  const [activeDensityLevel, setActiveDensityLevel] = useState<number>(0);
  const [cameraPreset, setCameraPreset] = useState<ViewCameraPreset>('NATIONAL');
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);
  const [dataFreshness, setDataFreshness] = useState<DataFreshness>('LIVE');
  const [temporalMode, setTemporalMode] = useState<TemporalMode>('LIVE');
  const [labScenarioId, setLabScenarioId] = useState<string | null>('SCEN_SUSWA_T1_TRIP');

  // AI Copilot QA History
  const [copilotQAHistory, setCopilotQAHistory] = useState<CopilotQAResult[]>([]);

  const handleLaunchScenarioInLab = (scenId: string) => {
    setLabScenarioId(scenId);
    setActiveCommandMode('SCENARIO_LAB');
  };

  // Phase 06 Operational Decision Intelligence States
  const [isDecisionBriefModalOpen, setIsDecisionBriefModalOpen] = useState(false);
  const [activeBriefIncidentId, setActiveBriefIncidentId] = useState<string>('INC-2026-08-SSW-01');
  const [isAsset360ModalOpen, setIsAsset360ModalOpen] = useState(false);
  const [activeAsset360Id, setActiveAsset360Id] = useState<string>('suswa');
  const [isCorridor360ModalOpen, setIsCorridor360ModalOpen] = useState(false);
  const [activeCorridor360Id, setActiveCorridor360Id] = useState<string>('tl_ssw_isy');
  const [isSystemHealthModalOpen, setIsSystemHealthModalOpen] = useState(false);
  const [isResilienceModalOpen, setIsResilienceModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isHealthScorecardModalOpen, setIsHealthScorecardModalOpen] = useState(false);
  const [isGridStateDriversModalOpen, setIsGridStateDriversModalOpen] = useState(false);

  // Phase 06 Engines Real-time Computations
  const gridStateAssessment = useMemo(() => {
    return GridStateEngine.evaluateState(substations, lines, alarms);
  }, [substations, lines, alarms]);

  const priorityQueue = useMemo(() => {
    return GridPriorityEngine.computePriorityQueue(substations, lines, alarms, events);
  }, [substations, lines, alarms, events]);

  const correlations = useMemo(() => {
    return CrossDomainCorrelationEngine.computeCorrelations(substations, lines, alarms, events);
  }, [substations, lines, alarms, events]);

  const gridHealthScore = useMemo(() => {
    return GridStateEngine.computeHealthScore(substations, lines, alarms);
  }, [substations, lines, alarms]);

  const incidents = GridIncidentLifecycleManager.getIncidents();
  const decisionLedger = GridIncidentLifecycleManager.getDecisionLedger();
  const learningHistory = GridLearningEngine.getLearningHistory();
  const maintenanceRiskList = GridIncidentLifecycleManager.getMaintenanceOperationsRiskList();
  const causalityGraphData = GridIncidentLifecycleManager.generateCausalityGraph(activeBriefIncidentId);

  const activeBrief = useMemo(() => {
    return GridIncidentLifecycleManager.generateDecisionBrief(activeBriefIncidentId);
  }, [activeBriefIncidentId]);

  const activeAsset360Profile = useMemo(() => {
    const targetAsset = substations[activeAsset360Id] || substations['suswa'] || Object.values(substations)[0];
    return GridIncidentLifecycleManager.generateAsset360(targetAsset);
  }, [substations, activeAsset360Id]);

  const activeCorridor360Profile = useMemo(() => {
    const targetLine = lines[activeCorridor360Id] || lines['tl_ssw_isy'] || Object.values(lines)[0];
    return GridIncidentLifecycleManager.generateCorridor360(targetLine);
  }, [lines, activeCorridor360Id]);

  const handleOpenDecisionBrief = (incidentId: string) => {
    setActiveBriefIncidentId(incidentId);
    setIsDecisionBriefModalOpen(true);
  };

  const handleAuthorizeBrief = (action: OperatorDecisionAction, notes: string, optionId?: string) => {
    const ledgerEntry = GridIncidentLifecycleManager.recordOperatorAuthorization(
      activeBrief,
      'OP-NCC-8841',
      'Eng. David Kiprono (Lead Grid Controller)',
      action,
      notes
    );

    if (action === 'AUTHORIZED') {
      GridLearningEngine.logVerifiedOutcome(ledgerEntry, 76.4, 76.2);
    }
  };

  const handleOpenAsset360 = (assetId: string) => {
    setActiveAsset360Id(assetId);
    setIsAsset360ModalOpen(true);
  };

  const handleOpenCorridor360 = (corridorId: string) => {
    setActiveCorridor360Id(corridorId);
    setIsCorridor360ModalOpen(true);
  };

  // Active Map Layers
  const [activeLayers, setActiveLayers] = useState<Record<MapLayerKey, boolean>>({
    TRANSMISSION: true,
    SUBSTATIONS: true,
    LINES: true,
    TRANSFORMERS: true,
    OUTAGES: true,
    ALARMS: true,
    RISK: true,
    ASSET_HEALTH: true,
    PROJECTS: false,
    WEATHER: false,
    VOLTAGE: true,
    CONGESTION: true
  });

  // Dynamic Telemetry Jitter Loop (Realistic SCADA stream simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      // Small frequency oscillation around 50.00 Hz
      const freqDelta = (Math.random() - 0.5) * 0.04;
      const newFreq = (50.01 + freqDelta).toFixed(2);

      // System Load oscillation ±4 MW
      const loadDelta = Math.floor((Math.random() - 0.5) * 8);

      setKpis(prevKpis => 
        prevKpis.map(kpi => {
          if (kpi.id === '03_FREQUENCY') {
            const newSparkline = [...kpi.sparkline.slice(1), parseFloat(newFreq)];
            return { ...kpi, value: parseFloat(newFreq), sparkline: newSparkline };
          }
          if (kpi.id === '01_SYSTEM_DEMAND') {
            const curVal = Number(kpi.value);
            const updatedVal = curVal + loadDelta;
            const newSparkline = [...kpi.sparkline.slice(1), updatedVal];
            return { ...kpi, value: updatedVal, sparkline: newSparkline };
          }
          return kpi;
        })
      );

      // Subtle substation active power jitter
      setSubstations(prevSubs => {
        const next = { ...prevSubs };
        const keys = Object.keys(next);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        if (next[randomKey]) {
          const currentLoad = next[randomKey].currentLoadMW;
          const delta = (Math.random() - 0.5) * 2;
          next[randomKey] = {
            ...next[randomKey],
            currentLoadMW: Math.round(Math.max(10, currentLoad + delta))
          };
        }
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Compute Phase 04 Real-Time Grid Intelligence Engine State
  const intelligenceState = useMemo(() => {
    return GridIntelligenceEngine.evaluateGrid(substations, lines, alarms, events);
  }, [substations, lines, alarms, events]);

  // Compute Grid Data Quality Reconciliation Audit from Canonical Reconciliation Engine
  const reconciliationAudit = useMemo(() => {
    return GridReconciliationEngine.auditGrid(substations, lines);
  }, [substations, lines]);

  // Handlers
  const handleToggleLayer = (layer: MapLayerKey) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
  };

  const handleAcknowledgeAlarm = (alarmId: string) => {
    setAlarms(prev => 
      prev.map(a => a.id === alarmId ? { ...a, acknowledged: true } : a)
    );
  };

  const handleToggleSimulation = () => {
    setDataFreshness(prev => prev === 'LIVE' ? 'SIMULATION' : 'LIVE');
  };

  const handleAskCopilot = (prompt: string) => {
    const qaResult = GridIntelligenceEngine.askCopilot(
      prompt,
      intelligenceState,
      substations,
      lines,
      selectedAssetId
    );
    setCopilotQAHistory(prev => [...prev, qaResult]);
  };

  const handleModeChange = (mode: CommandModeKey) => {
    setActiveCommandMode(mode);
    if (mode === 'DIGITAL_TWIN') {
      setOperationalMode('3D_TWIN');
      const el = document.getElementById('level-0-stage');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (mode === 'GRAPH') {
      setOperationalMode('GRAPH_TOPOLOGY');
      const el = document.getElementById('level-0-stage');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (mode === 'DATA_QUALITY') {
      setOperationalMode('DATA_QUALITY');
      const el = document.getElementById('level-0-stage');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (mode === 'RESILIENCE') {
      setIsResilienceModalOpen(true);
    } else if (mode === 'RISK') {
      const el = document.getElementById('level-4-risk');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveDensityLevel(4);
    } else if (mode === 'CONGESTION') {
      const el = document.getElementById('level-2-transmission');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveDensityLevel(2);
    } else if (mode === 'ASSET_HEALTH') {
      const el = document.getElementById('level-3-assets');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveDensityLevel(3);
    } else if ((mode as string) === 'OUTAGE' || (mode as string) === 'ALARMS') {
      const el = document.getElementById('level-5-outages');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveDensityLevel(5);
    } else if (mode === 'WEATHER') {
      const el = document.getElementById('level-6-forecast');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveDensityLevel(6);
    } else if (mode === 'OPERATIONS') {
      setOperationalMode('NORMAL');
      const el = document.getElementById('level-1-ops');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveDensityLevel(1);
    } else if ((mode as string) === 'PLANNING' || (mode as string) === 'INVESTMENT' || (mode as string) === 'FUTURE_GRID') {
      setOperationalMode('NORMAL');
      const el = document.getElementById('level-0-stage');
      el?.scrollIntoView({ behavior: 'smooth' });
      setActiveDensityLevel(1);
    }
  };

  const handleTraceCorridor = (corridorCode: string) => {
    const lineList = Object.values(lines) as TransmissionLine[];
    const line = lineList.find(l => l.id === corridorCode || l.name.toLowerCase().includes(corridorCode.toLowerCase()));
    if (line) {
      setHighlightedPath([line.fromSubstationId, line.toSubstationId]);
      setSelectedAssetId(line.fromSubstationId);
      const el = document.getElementById('level-0-stage');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectedAsset = selectedAssetId ? substations[selectedAssetId] || null : null;

  // Derive header values from canonical state
  const systemLoadKpi = kpis.find(k => k.id === '01_SYSTEM_DEMAND')?.value || 2984;
  const generationKpi = kpis.find(k => k.id === '02_GENERATION_AVAILABILITY')?.value || 3120;
  const frequencyKpi = kpis.find(k => k.id === '03_FREQUENCY')?.value || '50.01';
  const spinningReserveVal = kpis.find(k => k.id === '02_GENERATION_AVAILABILITY')?.secondaryMetric.value || 380;
  const transmissionAvailVal = kpis.find(k => k.id === '04_TRANSMISSION_AVAILABILITY')?.value || 99.4;
  const onlineSubstationsVal = kpis.find(k => k.id === '05_SUBSTATION_AVAILABILITY')?.value || '48/49';
  const activeAlarmsCount = alarms.filter(a => !a.acknowledged && (a.severity === 'CRITICAL' || a.severity === 'HIGH' || a.severity === 'P1')).length;

  return (
    <div className="w-full h-full flex flex-col bg-[#050913] text-slate-100 overflow-y-auto font-sans relative select-text">
      
      {/* 1. Permanent National Grid Telemetry Header */}
      <GridHeader
        systemLoadMW={Number(systemLoadKpi)}
        generationMW={Number(generationKpi)}
        frequencyHz={frequencyKpi}
        spinningReserveMW={Number(spinningReserveVal)}
        transmissionAvailPct={transmissionAvailVal}
        onlineSubstationsCount={String(onlineSubstationsVal)}
        activeOutagesCount={1}
        criticalAlarmsCount={activeAlarmsCount}
        dataFreshness={dataFreshness}
        onOpenSystemHealth={() => setIsSystemHealthModalOpen(true)}
        onOpenResilienceModal={() => setIsResilienceModalOpen(true)}
        onToggleSimulation={handleToggleSimulation}
        onTriggerCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* 1.5. Phase 06 Permanent National Grid Situational Awareness & Operating Picture */}
      <NationalOperatingPictureHUD
        assessment={gridStateAssessment}
        onOpenStateDrivers={() => setIsGridStateDriversModalOpen(true)}
        onOpenHealthScorecard={() => setIsHealthScorecardModalOpen(true)}
        onOpenActionQueue={() => setActiveCommandMode('DECISION_QUEUE')}
      />

      {/* 2. Phase 04 Top Bar Grid Intelligence HUD */}
      <GridTopBarIntelligenceHUD
        intelligence={intelligenceState}
        onSelectAsset={handleSelectAsset}
        onOpenCopilotWithPrompt={handleAskCopilot}
        onSwitchMode={(mode) => handleModeChange(mode as any)}
      />

      {/* 3. Operational Mode Switcher Bar */}
      <ModeSwitcher
        currentMode={activeCommandMode}
        onSelectMode={handleModeChange}
        activeLevel={activeDensityLevel}
        onScrollToLevel={setActiveDensityLevel}
      />

      {/* 3.5. Phase 05 Digital Twin Time Machine (LIVE / HISTORICAL / SIMULATED / FORECAST) */}
      <DigitalTwinTimeMachine
        currentMode={temporalMode}
        onModeChange={(newMode) => {
          setTemporalMode(newMode);
          if (newMode === 'FORECAST') setActiveCommandMode('FORECAST_WALL');
          if (newMode === 'SIMULATED') setActiveCommandMode('SCENARIO_LAB');
          if (newMode === 'LIVE') setActiveCommandMode('OPERATIONS');
        }}
      />

      {/* 4. 10 Operational KPI Families Strip */}
      <GridKpiStrip
        kpis={kpis}
        selectedKpiId={selectedKpiId}
        onSelectKpi={(kpiId) => setSelectedKpiId(kpiId)}
      />

      {/* Phase 09 National Grid Planning + Outage Coordination */}
      <NationalGridPlanningDashboard />

      {/* 5. Phase 04 Permanent Grid Intelligence & Accuracy Scorecard */}
      <div className="px-4 py-2 bg-[#050913]">
        <GridIntelligenceScorecard
          accuracy={intelligenceState.accuracyMetrics}
          onOpenDataQualityModal={() => setOperationalMode('DATA_QUALITY')}
          onSelectAsset={handleSelectAsset}
        />
      </div>

      {/* Phase 05 & Phase 06 Dedicated View Modules when chosen in Mode Switcher */}
      {activeCommandMode === 'DECISION_QUEUE' ? (
        <div className="p-4 bg-[#050913]">
          <OperatorActionQueue
            items={priorityQueue.items}
            onOpenAsset360={handleOpenAsset360}
            onOpenCorridor360={handleOpenCorridor360}
            onOpenDecisionBrief={handleOpenDecisionBrief}
          />
        </div>
      ) : activeCommandMode === 'INCIDENT_ROOM' ? (
        <div className="p-4 bg-[#050913] space-y-4">
          <EventCausalityGraph
            graphData={causalityGraphData}
            onOpenAsset360={handleOpenAsset360}
            onOpenDecisionBrief={handleOpenDecisionBrief}
          />
          <MaintenanceOperationsFusion
            items={maintenanceRiskList}
            onOpenAsset360={handleOpenAsset360}
            onOpenDecisionBrief={handleOpenDecisionBrief}
          />
        </div>
      ) : activeCommandMode === 'CORRELATION' ? (
        <div className="p-4 bg-[#050913]">
          <CrossDomainCorrelationView
            correlations={correlations}
            onOpenAsset360={handleOpenAsset360}
            onOpenCorridor360={handleOpenCorridor360}
            onOpenDecisionBrief={handleOpenDecisionBrief}
          />
        </div>
      ) : activeCommandMode === 'DECISION_AUDIT' ? (
        <div className="p-4 bg-[#050913] space-y-4">
          <DecisionAuditLedgerView
            entries={decisionLedger}
            onOpenDecisionBrief={handleOpenDecisionBrief}
          />
          <ModelDataTrustPanel
            learningHistory={learningHistory}
          />
        </div>
      ) : activeCommandMode === 'EXECUTIVE' ? (
        <div className="p-4 bg-[#050913]">
          <ExecutiveIntelligenceView
            assessment={gridStateAssessment}
            healthScore={gridHealthScore}
            onOpenDecisionBrief={handleOpenDecisionBrief}
            onOpenActionQueue={() => setActiveCommandMode('DECISION_QUEUE')}
          />
        </div>
      ) : activeCommandMode === 'FORECAST_WALL' ? (
        <NationalForecastWall
          substations={substations}
          lines={lines}
          onSelectAsset={handleSelectAsset}
          onLaunchScenario={handleLaunchScenarioInLab}
        />
      ) : activeCommandMode === 'SCENARIO_LAB' ? (
        <ScenarioLab
          substations={substations}
          lines={lines}
          onSelectAsset={handleSelectAsset}
          preselectedScenarioId={labScenarioId}
        />
      ) : activeCommandMode === 'CONTINGENCY_RANK' ? (
        <ContingencyRankingView
          substations={substations}
          lines={lines}
          onSelectScenarioForLab={handleLaunchScenarioInLab}
        />
      ) : activeCommandMode === 'PREDICTIVE_WATCH' ? (
        <PredictiveWatchlistView
          substations={substations}
          onSelectAsset={handleSelectAsset}
          onSimulateOutage={handleLaunchScenarioInLab}
        />
      ) : activeCommandMode === 'WEATHER' ? (
        <WeatherImpactView lines={lines} />
      ) : activeCommandMode === 'MODEL_DRIFT' ? (
        <ModelDriftView />
      ) : activeCommandMode === 'PLANNING' || activeCommandMode === 'INVESTMENT' || activeCommandMode === 'FUTURE_GRID' ? (
        <div className="p-4 bg-[#050913]">
          <NationalGridPlanningDashboard onSelectAsset={handleSelectAsset} />
        </div>
      ) : (
        /* 6. Level 0 Stage: GIS Map / 3D Switchyard Twin / Graph Topology + Intelligence Panel */
        <div id="level-0-stage" className="w-full h-[620px] shrink-0 flex overflow-hidden relative border-b border-slate-800">
          
          {/* Main Center Canvas according to Operational Mode */}
          {operationalMode === 'DATA_QUALITY' ? (
            <GridDataQualityPanel
              summary={reconciliationAudit.summary}
              reports={reconciliationAudit.reports}
              conflicts={reconciliationAudit.conflicts}
              selectedAssetId={selectedAssetId}
              onSelectAsset={handleSelectAsset}
              onClose={() => setOperationalMode('NORMAL')}
            />
          ) : operationalMode === '3D_TWIN' && selectedAsset ? (
            <GridDigitalTwin3D
              selectedAsset={selectedAsset}
              onClose={() => setOperationalMode('NORMAL')}
            />
          ) : operationalMode === '3D_TWIN' && !selectedAsset ? (
            <GridDigitalTwin3D
              selectedAsset={substations['suswa']}
              onClose={() => setOperationalMode('NORMAL')}
            />
          ) : operationalMode === 'GRAPH_TOPOLOGY' ? (
            <GridGraphExplorer
              substations={substations}
              lines={lines}
              selectedAssetId={selectedAssetId}
              onSelectAsset={handleSelectAsset}
              onHighlightPath={(path) => setHighlightedPath(path)}
            />
          ) : (
            <GridMapCanvas
              substations={substations}
              lines={lines}
              selectedAssetId={selectedAssetId}
              onSelectAsset={handleSelectAsset}
              activeLayers={activeLayers}
              onToggleLayer={handleToggleLayer}
              operationalMode={operationalMode}
              onSetOperationalMode={setOperationalMode}
              cameraPreset={cameraPreset}
              onSetCameraPreset={setCameraPreset}
              highlightedPath={highlightedPath}
            />
          )}

          {/* Right Intelligence Panel (AI Copilot, Anomaly Feed, Incidents) */}
          <GridIntelligencePanel
            selectedAsset={selectedAsset}
            onClearSelection={() => setSelectedAssetId(null)}
            alarms={alarms}
            events={events}
            aiInsights={CANONICAL_AI_INSIGHTS}
            onAskCopilot={handleAskCopilot}
            intelligenceState={intelligenceState}
            copilotQAHistory={copilotQAHistory}
            onSelectAsset={handleSelectAsset}
          />
        </div>
      )}

      {/* 7. Bottom Real-Time Event & Alarm Fabric Strip */}
      <GridEventFabric
        events={events}
        alarms={alarms}
        onSelectAsset={handleSelectAsset}
        onAcknowledgeAlarm={handleAcknowledgeAlarm}
      />

      {/* 8. Phase 04 Multi-Horizon Intelligence Timeline */}
      <div className="px-4 py-3 bg-[#050913]">
        <GridIntelligenceTimeline
          timeline={intelligenceState.timeline}
          onSelectAsset={handleSelectAsset}
          selectedAssetId={selectedAssetId}
        />
      </div>

      {/* 9. Level 1: System Operations Intelligence Layer (KPIs 11-16) */}
      <SystemOperationsLayer />

      {/* 10. Level 2: Transmission Performance Intelligence Layer (KPIs 17-20) */}
      <TransmissionPerformanceLayer
        onSelectCorridor={(corridor) => handleTraceCorridor(corridor)}
      />

      {/* 11. Level 3: Asset Intelligence & Fleet Health Layer (KPIs 21-25) */}
      <AssetIntelligenceLayer />

      {/* 12. Level 4: Grid Risk Intelligence & Matrices */}
      <GridRiskIntelligenceLayer
        substations={substations}
        lines={lines}
        selectedAssetId={selectedAssetId}
        onSelectAsset={handleSelectAsset}
        onTraceCorridor={handleTraceCorridor}
      />

      {/* 13. Level 5: Outage Intelligence, Alarm Pressure & Event Velocity */}
      <OutageAlarmFabricLayer
        alarms={alarms}
        events={events}
        onSelectAsset={handleSelectAsset}
        onAcknowledgeAlarm={handleAcknowledgeAlarm}
      />

      {/* 14. Level 6: Forecast Horizon & Environmental Telemetry */}
      <ForecastEnvironmentalLayer />

      {/* 15. Level 7: AI Intelligence Feed & Grid Anomaly Ledger */}
      <AiIntelligenceAnomalyLayer
        insights={CANONICAL_AI_INSIGHTS}
        onSelectAsset={handleSelectAsset}
        onExecuteRemedialAction={(action) => {
          setIsResilienceModalOpen(true);
        }}
      />

      {/* 16. Ctrl+K Global Command Palette */}
      <GridCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        substations={substations}
        lines={lines}
        onSelectAsset={handleSelectAsset}
        onSetOperationalMode={setOperationalMode}
        onOpenResilienceModal={() => setIsResilienceModalOpen(true)}
        onOpenSystemHealth={() => setIsSystemHealthModalOpen(true)}
        onToggleSimulation={handleToggleSimulation}
      />

      {/* 17. System Health Subsystem Diagnostics Modal */}
      <GridSystemHealthModal
        isOpen={isSystemHealthModalOpen}
        onClose={() => setIsSystemHealthModalOpen(false)}
      />

      {/* 18. N-1 Resilience & Contingency Simulation Modal */}
      <GridResilienceModal
        isOpen={isResilienceModalOpen}
        onClose={() => setIsResilienceModalOpen(false)}
      />

      {/* 19. Phase 06 Operator 9-Part Structured Decision Brief Modal */}
      <OperatorDecisionBriefModal
        brief={activeBrief}
        isOpen={isDecisionBriefModalOpen}
        onClose={() => setIsDecisionBriefModalOpen(false)}
        onAuthorizeAction={handleAuthorizeBrief}
        onOpenAsset360={handleOpenAsset360}
        onOpenCorridor360={handleOpenCorridor360}
      />

      {/* 20. Phase 06 Asset 360 Operational Profile Modal */}
      <Asset360Modal
        profile={activeAsset360Profile}
        isOpen={isAsset360ModalOpen}
        onClose={() => setIsAsset360ModalOpen(false)}
        onOpenDecisionBrief={handleOpenDecisionBrief}
      />

      {/* 21. Phase 06 Corridor 360 Operational Profile Modal */}
      <Corridor360Modal
        profile={activeCorridor360Profile}
        isOpen={isCorridor360ModalOpen}
        onClose={() => setIsCorridor360ModalOpen(false)}
        onOpenDecisionBrief={handleOpenDecisionBrief}
      />

      {/* 22. Phase 06 National Grid Health Scorecard Modal */}
      <NationalGridHealthScorecard
        healthScore={gridHealthScore}
        isOpen={isHealthScorecardModalOpen}
        onClose={() => setIsHealthScorecardModalOpen(false)}
        onOpenDecisionBrief={handleOpenDecisionBrief}
      />

      {/* 23. Phase 06 Grid State Engine Drivers & Decomposition Modal */}
      <GridStateDriversModal
        assessment={gridStateAssessment}
        isOpen={isGridStateDriversModalOpen}
        onClose={() => setIsGridStateDriversModalOpen(false)}
        onOpenDecisionBrief={handleOpenDecisionBrief}
      />
    </div>
  );
}

