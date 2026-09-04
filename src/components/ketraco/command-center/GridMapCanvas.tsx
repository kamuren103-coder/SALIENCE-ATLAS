import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, RotateCcw, Layers, Eye, 
  EyeOff, AlertTriangle, ShieldCheck, Zap, Activity, Info, 
  MapPin, Compass, Search, Filter, Play, CheckCircle2, ChevronRight,
  TrendingUp, Radio
} from 'lucide-react';
import { 
  GridAsset, 
  TransmissionLine, 
  MapLayerKey, 
  ViewCameraPreset, 
  OperationalViewMode,
  GisHierarchyLevel
} from './types';
import { CANONICAL_CORRIDORS } from './canonical/canonical-model';
import ConfidenceBadge from './primitives/ConfidenceBadge';

interface GridMapCanvasProps {
  substations: Record<string, GridAsset>;
  lines: Record<string, TransmissionLine>;
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string) => void;
  activeLayers: Record<MapLayerKey, boolean>;
  onToggleLayer: (layer: MapLayerKey) => void;
  operationalMode: OperationalViewMode;
  onSetOperationalMode: (mode: OperationalViewMode) => void;
  cameraPreset: ViewCameraPreset;
  onSetCameraPreset: (preset: ViewCameraPreset) => void;
  highlightedPath?: string[];
}

export default function GridMapCanvas({
  substations,
  lines,
  selectedAssetId,
  onSelectAsset,
  activeLayers,
  onToggleLayer,
  operationalMode,
  onSetOperationalMode,
  cameraPreset,
  onSetCameraPreset,
  highlightedPath = []
}: GridMapCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);
  const [hoveredCorridorId, setHoveredCorridorId] = useState<string | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Derive Current Level of Detail (LOD)
  const currentLod: { level: GisHierarchyLevel; label: string; code: string } = useMemo(() => {
    if (zoom >= 2.6) return { level: 'EQUIPMENT', label: 'LOD-4: Substation Switchyard & Bay Topology', code: 'LOD-4' };
    if (zoom >= 1.9) return { level: 'SUBSTATION', label: 'LOD-3: Substation Local Bus & Feeders', code: 'LOD-3' };
    if (zoom >= 1.4) return { level: 'CORRIDOR', label: 'LOD-2: Bulk Transmission Corridor', code: 'LOD-2' };
    if (zoom >= 1.1) return { level: 'REGION', label: 'LOD-1: Regional Dispatch Grid', code: 'LOD-1' };
    return { level: 'NATIONAL', label: 'LOD-0: National Synchronous Backbone', code: 'LOD-0' };
  }, [zoom]);

  // Apply camera preset zooms and pans
  useEffect(() => {
    switch (cameraPreset) {
      case 'CENTRAL_RIFT':
        setZoom(1.8);
        setPan({ x: -100, y: -60 });
        break;
      case 'NAIROBI_METRO':
        setZoom(2.4);
        setPan({ x: -280, y: -200 });
        break;
      case 'COASTAL_CORRIDOR':
        setZoom(1.7);
        setPan({ x: -420, y: -450 });
        break;
      case 'WESTERN_INTERCONNECT':
        setZoom(2.0);
        setPan({ x: 120, y: -80 });
        break;
      case 'NORTHERN_HVDC':
        setZoom(1.6);
        setPan({ x: -180, y: 220 });
        break;
      case 'NATIONAL':
      default:
        setZoom(1);
        setPan({ x: 0, y: 0 });
        break;
    }
  }, [cameraPreset]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Convert geodetic (WGS84) to SVG coordinate viewport space
  const projectGeo = (lon: number, lat: number) => {
    const minLon = 33.8;
    const maxLon = 41.8;
    const minLat = -4.8;
    const maxLat = 4.8;

    const width = 720;
    const height = 640;

    const x = ((lon - minLon) / (maxLon - minLon)) * (width - 120) + 60;
    const y = height - (((lat - minLat) / (maxLat - minLat)) * (height - 120) + 60);

    return { x, y };
  };

  const substationList = useMemo(() => Object.values(substations), [substations]);
  const lineList = useMemo(() => Object.values(lines), [lines]);
  const corridorList = useMemo(() => Object.values(CANONICAL_CORRIDORS), []);

  // Filtered substations based on search
  const filteredSubstations = useMemo(() => {
    if (!searchQuery.trim()) return substationList;
    const q = searchQuery.toLowerCase();
    return substationList.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q) ||
      s.county.toLowerCase().includes(q)
    );
  }, [substationList, searchQuery]);

  return (
    <div 
      ref={containerRef}
      className="relative flex-1 bg-[#070d17] overflow-hidden select-none cursor-grab active:cursor-grabbing flex flex-col"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background Cartographic Subtle Grid & Grid Radial Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-600/10 blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-600/10 blur-[90px]" />
        <svg width="100%" height="100%" className="opacity-15">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00E1FF" strokeWidth="0.5" strokeDasharray="2 4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
        
        {/* View Mode Selector Tabs */}
        <div className="flex items-center p-1 rounded-lg bg-[#0c1524]/90 border border-slate-700/80 backdrop-blur-md shadow-lg">
          <button
            onClick={() => onSetOperationalMode('NORMAL')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
              operationalMode === 'NORMAL' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            2D GIS Grid
          </button>
          <button
            onClick={() => onSetOperationalMode('OUTAGE_MODE')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
              operationalMode === 'OUTAGE_MODE' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Outage Overlay
          </button>
          <button
            onClick={() => onSetOperationalMode('CRITICAL_ASSET_MODE')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
              operationalMode === 'CRITICAL_ASSET_MODE' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Critical Backbone
          </button>
          <button
            onClick={() => onSetOperationalMode('GRAPH_TOPOLOGY')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
              operationalMode === 'GRAPH_TOPOLOGY' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Graph Topology
          </button>
          <button
            onClick={() => onSetOperationalMode('3D_TWIN')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
              operationalMode === '3D_TWIN' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Digital Twin
          </button>
        </div>

        {/* Layer Controls Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`p-1.5 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-mono font-bold backdrop-blur-md transition-all cursor-pointer ${
              showLayerMenu 
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-[#0c1524]/90 border-slate-700/80 text-slate-300 hover:bg-[#132035]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10.5px]">LAYERS</span>
          </button>

          {/* Layer Controls Popover */}
          {showLayerMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-60 p-3 bg-[#0d1726]/95 border border-slate-700/90 rounded-xl shadow-2xl backdrop-blur-xl z-30 space-y-1.5">
              <div className="text-[9.5px] font-mono font-black uppercase text-cyan-400 tracking-wider mb-2 pb-1 border-b border-slate-800 flex justify-between">
                <span>GIS Map Layers</span>
                <span className="text-slate-400 font-normal">Active {Object.values(activeLayers).filter(Boolean).length}/14</span>
              </div>
              {(Object.keys(activeLayers) as MapLayerKey[]).map(layerKey => (
                <button
                  key={layerKey}
                  onClick={() => onToggleLayer(layerKey)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-[10px] font-mono text-left hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <span className={activeLayers[layerKey] ? 'text-slate-200 font-bold' : 'text-slate-400'}>
                    {layerKey.replace(/_/g, ' ')}
                  </span>
                  {activeLayers[layerKey] ? (
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Filter Search within map */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter substations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-2.5 py-1 text-[10.5px] font-mono bg-[#0c1524]/90 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500/80 w-44 backdrop-blur-md"
          />
        </div>
      </div>

      {/* Top Right Camera Presets & LOD Indicator */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-1.5 bg-[#0c1524]/90 border border-slate-700/80 p-1 rounded-lg backdrop-blur-md shadow-lg">
          {(['NATIONAL', 'CENTRAL_RIFT', 'NAIROBI_METRO', 'COASTAL_CORRIDOR', 'WESTERN_INTERCONNECT', 'NORTHERN_HVDC'] as ViewCameraPreset[]).map(preset => (
            <button
              key={preset}
              onClick={() => onSetCameraPreset(preset)}
              className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                cameraPreset === preset 
                  ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {preset.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Current LOD Display Badge */}
        <div className="px-2.5 py-1 rounded-md bg-[#0a121f]/90 border border-cyan-500/40 text-[9.5px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold">{currentLod.code}:</span>
          <span>{currentLod.label.split(':')[1] || currentLod.label}</span>
          <span className="text-slate-500">| Zoom {zoom.toFixed(1)}x</span>
        </div>
      </div>

      {/* Floating Zoom & Pan Controls (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.3, 4))}
          className="p-2 bg-[#0c1524]/90 hover:bg-[#15233c] text-slate-300 hover:text-white border border-slate-700/80 rounded-lg shadow-lg backdrop-blur-md transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.3, 0.6))}
          className="p-2 bg-[#0c1524]/90 hover:bg-[#15233c] text-slate-300 hover:text-white border border-slate-700/80 rounded-lg shadow-lg backdrop-blur-md transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); onSetCameraPreset('NATIONAL'); }}
          className="p-2 bg-[#0c1524]/90 hover:bg-[#15233c] text-slate-300 hover:text-white border border-slate-700/80 rounded-lg shadow-lg backdrop-blur-md transition-all cursor-pointer"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive National Grid Map SVG Visual Surface */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 720 640"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Subtle Kenya Geographic Boundary Outline */}
          <path
            d="M 280 40 L 480 30 L 580 90 L 640 180 L 620 320 L 590 440 L 560 590 L 460 560 L 380 430 L 260 380 L 160 320 L 90 280 L 110 180 L 190 100 Z"
            fill="rgba(10, 20, 36, 0.6)"
            stroke="rgba(6, 182, 212, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Regional County Boundaries (Subtle) */}
          <path d="M 280 40 L 340 280 L 460 560" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <path d="M 160 320 L 380 430 L 620 320" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

          {/* TRANSMISSION CORRIDORS LAYER (BULK CAPABILITY RIBBONS) */}
          {activeLayers.TRANSMISSION && corridorList.map(corr => {
            return (
              <g 
                key={corr.canonicalId}
                onMouseEnter={() => setHoveredCorridorId(corr.canonicalId)}
                onMouseLeave={() => setHoveredCorridorId(null)}
                className="cursor-pointer"
              >
                {/* Visual Corridor Line Ribbon linking substations */}
                {corr.substationIds.map((subId, idx) => {
                  if (idx === corr.substationIds.length - 1) return null;
                  const nextSubId = corr.substationIds[idx + 1];
                  const s1 = substations[subId];
                  const s2 = substations[nextSubId];
                  if (!s1 || !s2) return null;
                  const p1 = projectGeo(s1.longitude, s1.latitude);
                  const p2 = projectGeo(s2.longitude, s2.latitude);

                  const isHovered = hoveredCorridorId === corr.canonicalId;

                  return (
                    <line
                      key={`${corr.canonicalId}_${idx}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={corr.voltageKV === 500 ? '#f59e0b' : '#06b6d4'}
                      strokeWidth={isHovered ? 12 : 8}
                      strokeOpacity={isHovered ? 0.35 : 0.15}
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* TRANSMISSION LINES LAYER */}
          {activeLayers.LINES && lineList.map(line => {
            const fromSub = substations[line.fromSubstationId];
            const toSub = substations[line.toSubstationId];
            if (!fromSub || !toSub) return null;

            const fromPos = projectGeo(fromSub.longitude, fromSub.latitude);
            const toPos = projectGeo(toSub.longitude, toSub.latitude);

            const isHovered = hoveredLineId === line.id;
            const isSelected = selectedAssetId === line.id;
            const isPathHighlighted = highlightedPath.includes(line.fromSubstationId) && highlightedPath.includes(line.toSubstationId);

            // Voltage Stroke Color Code
            const strokeColor = 
              line.state === 'CRITICAL' ? '#f43f5e' :
              line.state === 'CONGESTED' ? '#f97316' :
              line.state === 'WARNING' ? '#eab308' :
              line.voltageKV === 500 ? '#eab308' : // 500kV Gold
              line.voltageKV === 400 ? '#00D9FF' : // 400kV Cyan
              line.voltageKV === 220 ? '#a855f7' : // 220kV Purple
              '#10b981'; // 132kV Green

            const strokeWidth = 
              isPathHighlighted ? 4 :
              isHovered || isSelected ? 3.5 :
              line.voltageKV === 500 ? 3.0 :
              line.voltageKV === 400 ? 2.5 :
              line.voltageKV === 220 ? 2.0 : 1.5;

            return (
              <g 
                key={line.id}
                onMouseEnter={() => setHoveredLineId(line.id)}
                onMouseLeave={() => setHoveredLineId(null)}
                className="cursor-pointer"
              >
                {/* Glow Backdrop */}
                {(isHovered || isSelected || isPathHighlighted || line.loadingPct > 75) && (
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth + 4}
                    strokeOpacity={0.3}
                    strokeLinecap="round"
                  />
                )}

                {/* Primary Transmission Line */}
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={line.state === 'WARNING' || line.state === 'CONGESTED' ? '6 4' : 'none'}
                />

                {/* Animated Power Flow Pulse (Simulated energy particles moving along line) */}
                {line.currentLoadMW > 0 && (
                  <circle r={line.voltageKV >= 400 ? 2.5 : 1.75} fill="#ffffff">
                    <animateMotion
                      path={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}
                      dur={`${Math.max(1.5, 6 - (line.currentLoadMW / 300))}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Mid-line Load Badge on Hover */}
                {isHovered && (
                  <g transform={`translate(${(fromPos.x + toPos.x) / 2}, ${(fromPos.y + toPos.y) / 2})`}>
                    <rect
                      x="-50"
                      y="-12"
                      width="100"
                      height="24"
                      rx="4"
                      fill="#0b1322"
                      stroke={strokeColor}
                      strokeWidth="1"
                      fillOpacity="0.95"
                    />
                    <text
                      textAnchor="middle"
                      y="4"
                      fill="#ffffff"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {line.currentLoadMW} MW ({line.loadingPct}%)
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* SUBSTATIONS LAYER */}
          {activeLayers.SUBSTATIONS && filteredSubstations.map(sub => {
            const pos = projectGeo(sub.longitude, sub.latitude);
            const isSelected = selectedAssetId === sub.id;
            const isHovered = hoveredNodeId === sub.id;
            const isPathNode = highlightedPath.includes(sub.id);

            // Ring Color based on Voltage & State
            const nodeColor = 
              sub.state === 'CRITICAL' ? '#f43f5e' :
              sub.state === 'CONGESTED' ? '#f97316' :
              sub.state === 'WARNING' ? '#eab308' :
              sub.voltageLevelKV === 500 ? '#fbbf24' :
              sub.voltageLevelKV === 400 ? '#00E1FF' :
              sub.voltageLevelKV === 220 ? '#c084fc' : '#34d399';

            const radius = 
              sub.voltageLevelKV === 500 ? 10 :
              sub.voltageLevelKV === 400 ? 8.5 :
              sub.voltageLevelKV === 220 ? 7 : 6;

            return (
              <g 
                key={sub.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => onSelectAsset(sub.id)}
                onMouseEnter={() => setHoveredNodeId(sub.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer group"
              >
                {/* Critical Alarm Pulse Ring */}
                {(sub.state === 'WARNING' || sub.state === 'CONGESTED' || sub.state === 'CRITICAL' || isSelected) && (
                  <circle
                    r={radius + 8}
                    fill="none"
                    stroke={nodeColor}
                    strokeWidth="1.5"
                    strokeOpacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Outer Glow Halo */}
                <circle
                  r={radius + 4}
                  fill={nodeColor}
                  fillOpacity={isSelected ? 0.35 : isHovered ? 0.25 : 0.12}
                />

                {/* Voltage Ring */}
                <circle
                  r={radius}
                  fill="#0b121e"
                  stroke={nodeColor}
                  strokeWidth={isSelected ? 3 : 2}
                />

                {/* Core Dot Indicator */}
                <circle
                  r={radius * 0.45}
                  fill={nodeColor}
                />

                {/* Single Point of Failure Flag if SPOF layer active */}
                {activeLayers.SPOF && sub.singlePointOfFailure && (
                  <g transform={`translate(${radius + 2}, -${radius + 4})`}>
                    <rect x="0" y="-8" width="36" height="12" rx="3" fill="#e11d48" />
                    <text x="18" y="0" fill="#ffffff" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      SPOF
                    </text>
                  </g>
                )}

                {/* Data Quality / Confidence Badge if layer active */}
                {activeLayers.DATA_QUALITY && (
                  <g transform={`translate(-${radius + 18}, -${radius + 4})`}>
                    <rect 
                      x="0" y="-8" width="22" height="12" rx="3" 
                      fill={sub.confidence >= 95 ? '#065f46' : '#92400e'} 
                    />
                    <text x="11" y="0" fill="#ffffff" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      {Math.round(sub.confidence)}%
                    </text>
                  </g>
                )}

                {/* Substation Label Text */}
                <text
                  x={radius + 6}
                  y="4"
                  fill={isSelected ? '#00E1FF' : '#e2e8f0'}
                  fontSize={sub.voltageLevelKV >= 400 ? '10' : '9'}
                  fontFamily="monospace"
                  fontWeight={isSelected || isHovered ? '900' : 'bold'}
                  className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                >
                  {sub.name.split(' ')[0]}
                </text>

                {/* Sub-label for Voltage & Load */}
                <text
                  x={radius + 6}
                  y="14"
                  fill="#94a3b8"
                  fontSize="7.5"
                  fontFamily="monospace"
                  className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                >
                  {sub.voltageLevelKV}kV | {sub.currentLoadMW}MW
                </text>

                {/* Detailed Hover Card */}
                {isHovered && (
                  <g transform={`translate(-80, -85)`} className="pointer-events-none z-40">
                    <rect
                      width="170"
                      height="75"
                      rx="6"
                      fill="#0a1322"
                      stroke={nodeColor}
                      strokeWidth="1.5"
                      fillOpacity="0.98"
                      className="shadow-2xl"
                    />
                    <text x="8" y="16" fill="#ffffff" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
                      {sub.name}
                    </text>
                    <text x="8" y="30" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                      Load: <tspan fill="#38bdf8" fontWeight="bold">{sub.currentLoadMW} MW</tspan> ({Math.round((sub.currentLoadMW / sub.ratedCapacityMVA) * 100)}%)
                    </text>
                    <text x="8" y="42" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                      Voltage: <tspan fill="#ffffff">{sub.telemetry.voltageKV?.value || sub.voltageLevelKV} kV</tspan>
                    </text>
                    <text x="8" y="54" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                      Health: <tspan fill={sub.healthScore >= 90 ? '#34d399' : '#f59e0b'} fontWeight="bold">{sub.healthScore}/100</tspan> | Risk: <tspan fill={sub.riskScore > 50 ? '#f43f5e' : '#34d399'}>{sub.riskScore}</tspan>
                    </text>
                    <text x="8" y="66" fill="#06b6d4" fontSize="7.5" fontFamily="monospace">
                      Reconciliation: {sub.reconciliationStatus} ({Math.round(sub.confidence)}%)
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Map Legend (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 bg-[#0c1524]/90 border border-slate-700/80 p-2.5 rounded-xl backdrop-blur-md text-[9.5px] font-mono shadow-2xl pointer-events-auto space-y-1.5 hidden sm:block">
        <div className="text-slate-400 font-bold uppercase tracking-wider text-[8.5px] pb-1 border-b border-slate-800">
          Transmission Voltage Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-amber-400 rounded" />
          <span className="text-slate-300">500kV HVDC Corridor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-cyan-400 rounded" />
          <span className="text-slate-300">400kV EHV Backbone</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-purple-400 rounded" />
          <span className="text-slate-300">220kV Primary Regional</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-emerald-400 rounded" />
          <span className="text-slate-300">132kV Sub-transmission</span>
        </div>
      </div>
    </div>
  );
}
