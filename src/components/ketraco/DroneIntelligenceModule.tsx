import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Camera,
  CheckCircle2,
  Cpu,
  FileImage,
  Gauge,
  Layers3,
  MapPinned,
  MonitorPlay,
  Play,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
  Video,
  Waypoints,
  Wifi,
  Zap,
} from 'lucide-react';
import DroneMissionPipelinePanel from './DroneMissionPipelinePanel';

const tabs = ['Overview', 'Missions', 'Evidence', 'Fleet'];

const fleetMetrics = [
  { label: 'Airframes online', value: '08/10', delta: '+2 ready' },
  { label: 'Avg coverage', value: '94.8%', delta: '+4.1%' },
  { label: 'Critical findings', value: '12', delta: '4 escalated' },
  { label: 'Telemetry sync', value: '99.2%', delta: 'stable' },
];

const watchlist = [
  { title: 'Suswa corridor', severity: 'Critical', detail: 'Corrosion cluster on tower leg B3', icon: MapPinned },
  { title: 'Approval gate', severity: 'Action', detail: 'Engineering sign-off required before closeout', icon: ShieldCheck },
  { title: 'Vision quality', severity: 'Watch', detail: 'Two frames require human review for glare variance', icon: Camera },
];

const missionCards = [
  { title: 'Inspection readiness', value: '96%', tone: 'emerald', detail: 'All planned sorties are validated.' },
  { title: 'AI defect confidence', value: '89%', tone: 'cyan', detail: 'High-confidence corrosion and thermal detections.' },
  { title: 'Risk posture', value: 'Elevated', tone: 'amber', detail: 'Human review gate remains active.' },
];

const droneFleet = [
  { id: 'D-07', status: 'IN_FLIGHT', battery: 71, altitude: 184, speed: 12, signal: 'GOOD', mission: 'SUSWA-CORRIDOR-17' },
  { id: 'D-12', status: 'CAPTURING', battery: 68, altitude: 132, speed: 9, signal: 'GOOD', mission: 'KTR-184-INSPECTION' },
  { id: 'D-04', status: 'LOITERING', battery: 54, altitude: 98, speed: 6, signal: 'STABLE', mission: 'LINE-RECOVERY' },
];

const telemetryEvents = [
  '09:42:03 Position updated',
  '09:42:04 Tower detected',
  '09:42:07 Suspected anomaly',
  '09:42:11 Asset correlation complete',
  '09:42:17 Engineer review queued',
];

const inspectionMarkers = [
  { time: '00:02', label: 'Tower', kind: 'asset' },
  { time: '00:08', label: 'Defect', kind: 'defect' },
  { time: '00:15', label: 'Insulator', kind: 'asset' },
  { time: '00:26', label: 'Vegetation', kind: 'risk' },
];

const providerState = [
  { name: 'Custom Enterprise Drone Adapter', status: 'Connected', latency: '118ms', health: 'Healthy' },
  { name: 'Event Fabric', status: 'Streaming', latency: '39ms', health: 'Healthy' },
  { name: 'Vision Inference', status: 'Active', latency: '620ms', health: 'Stable' },
];

function DroneSpatialScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050d1b);
    scene.fog = new THREE.FogExp2(0x050d1b, 0.035);

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(26, 18, 26);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x93c5fd, 1.5);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0x67e8f9, 1.8);
    sun.position.set(18, 28, 12);
    scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(60, 1, 42),
      new THREE.MeshStandardMaterial({ color: 0x091827, roughness: 0.9, metalness: 0.1 })
    );
    ground.position.y = -1;
    scene.add(ground);

    const grid = new THREE.GridHelper(60, 32, 0x22d3ee, 0x112033);
    grid.position.y = 0;
    scene.add(grid);

    const towerGroup = new THREE.Group();
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.92, roughness: 0.28 });
    const legGeometry = new THREE.CylinderGeometry(0.18, 0.22, 12, 8);
    const beamGeometry = new THREE.BoxGeometry(18, 0.5, 0.7);

    for (const [x, z] of [[-6, -3], [6, -3], [-6, 3], [6, 3]]) {
      const leg = new THREE.Mesh(legGeometry, towerMaterial);
      leg.position.set(x, 5.5, z);
      towerGroup.add(leg);
    }

    const beam = new THREE.Mesh(beamGeometry, towerMaterial);
    beam.position.set(0, 11, 0);
    towerGroup.add(beam);

    const lineMaterial = new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x0ea5e9, emissiveIntensity: 0.6 });
    const cable1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 20, 10), lineMaterial);
    cable1.rotation.z = Math.PI / 2.8;
    cable1.position.set(0, 8, 0);
    towerGroup.add(cable1);

    const drone = new THREE.Group();
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xc4b5fd, metalness: 0.6, roughness: 0.2 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 1.4), bodyMaterial);
    drone.add(body);
    const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.3, 8);
    for (const angle of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
      const arm = new THREE.Mesh(armGeo, new THREE.MeshStandardMaterial({ color: 0x7dd3fc, metalness: 0.8, roughness: 0.25 }));
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = angle;
      arm.position.set(Math.cos(angle) * 1.3, 0, Math.sin(angle) * 1.3);
      drone.add(arm);
    }
    drone.position.set(12, 12, 0);
    towerGroup.add(drone);

    const defect = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 18, 18),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.4 })
    );
    defect.position.set(-2, 6, 0);
    towerGroup.add(defect);

    scene.add(towerGroup);
    camera.lookAt(0, 6, 0);

    const animate = () => {
      const t = performance.now() * 0.001;
      drone.position.x = 12 + Math.sin(t * 1.8) * 2.8;
      drone.position.z = Math.cos(t * 1.4) * 2.8;
      drone.rotation.y += 0.02;
      defect.scale.setScalar(1 + Math.sin(t * 3.5) * 0.08);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const width = mount.clientWidth || 640;
      const height = mount.clientHeight || 340;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="h-[280px] w-full rounded-2xl border border-slate-800 bg-[#050d1b]" />;
}

function MediaDropzone() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<Array<{ id: string; name: string; size: string; status: string }>>([]);

  const handleFiles = (incoming: FileList | File[]) => {
    const next = Array.from(incoming).map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'Queued',
    }));
    setFiles((current) => [...current, ...next]);
  };

  useEffect(() => {
    if (files.length === 0) return;

    const interval = window.setInterval(() => {
      setFiles((current) => current.map((item) => {
        const nextStatus = item.status === 'Queued'
          ? 'Validating'
          : item.status === 'Validating'
            ? 'Processing'
            : item.status === 'Processing'
              ? 'AI analysis'
              : 'Evidence ready';
        return { ...item, status: nextStatus };
      }));
    }, 1200);

    return () => window.clearInterval(interval);
  }, [files.length]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#071723] p-4">
      <div
        className="flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-500/30 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.1),_transparent_40%),#0b1526] p-6 text-center transition hover:border-cyan-400/60 hover:bg-slate-900/30"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (event.dataTransfer.files) handleFiles(event.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.22em] text-cyan-300">Drop drone media here</div>
        <h3 className="mt-2 text-xl font-semibold text-white">Images • Video • Inspection Evidence</h3>
        <p className="mt-2 max-w-md text-sm text-slate-400">Auto-extract GPS, EXIF, and telemetry metadata before AI correlation.</p>
        <button
          type="button"
          className="mt-4 rounded-full border border-cyan-500/40 bg-cyan-950/30 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-200"
        >
          Browse files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(event) => {
            if (event.target.files) handleFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#091d2d] px-3 py-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-950 text-cyan-300">
                  {file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.mov') ? <Video className="h-4 w-4" /> : <FileImage className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm text-white">{file.name}</div>
                  <div className="text-[9px] font-mono text-slate-400">{file.size} • {file.status}</div>
                </div>
              </div>
              <div className="text-[9px] font-mono text-emerald-300">{file.status === 'Evidence ready' ? 'Ready' : 'Processing'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DroneIntelligenceModule() {
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const slug = activeTab.toLowerCase().replace(/\s+/g, '-');
    const targetPath = `/drone-intelligence/${slug}`;
    if (window.location.pathname !== targetPath) {
      window.history.replaceState({}, '', targetPath);
    }
  }, [activeTab]);

  const activeSummary = useMemo(() => {
    const summaries: Record<string, string> = {
      Overview: 'Mission operations remain stable across the current inspection window with two human review gates in effect.',
      Missions: 'Planned sorties are mapped to corridor priority heatmaps and engineering review queues.',
      Evidence: 'Evidence packages are validated for telemetry consistency, image quality, and asset correlation.',
      Fleet: 'Fleet health, flight readiness, and maintenance slack are monitored against active inspection load.',
    };

    return summaries[activeTab] ?? summaries.Overview;
  }, [activeTab]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#030b14] text-slate-100">
      <div className="border-b border-slate-800/80 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_42%),linear-gradient(180deg,#071321_0%,#040d18_100%)] px-5 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-300">
                <span>Salience Atlas</span>
                <span className="text-slate-500">//</span>
                <span className="text-slate-400">Drone Intelligence</span>
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">Autonomous Grid Inspection</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-emerald-500/30 bg-emerald-950/30 px-2.5 py-1 text-[10px] font-mono text-emerald-300">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Live operations</span>
            </div>
            <div className="rounded-full border border-amber-500/30 bg-amber-950/30 px-2.5 py-1 text-[10px] font-mono text-amber-300">
              <span className="inline-flex items-center gap-1.5"><AlertTriangle className="h-3 w-3" /> 2 review gates</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-4">
          {[
            { label: 'Live drones', value: '08', tone: 'cyan' },
            { label: 'Active missions', value: '04', tone: 'violet' },
            { label: 'Critical findings', value: '12', tone: 'amber' },
            { label: 'Assets inspected', value: '487', tone: 'emerald' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-800 bg-[#091a2a] p-3">
              <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
              <div className={`mt-2 text-2xl font-semibold ${item.tone === 'cyan' ? 'text-cyan-300' : item.tone === 'violet' ? 'text-violet-300' : item.tone === 'amber' ? 'text-amber-300' : 'text-emerald-300'}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] transition-all ${
                activeTab === tab
                  ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,0.14)]'
                  : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <DroneMissionPipelinePanel />

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="rounded-2xl border border-slate-800 bg-[#071723] p-4 shadow-[0_12px_40px_rgba(2,6,23,0.38)]">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                <Layers3 className="h-3.5 w-3.5 text-cyan-300" /> Spatial intelligence
              </div>
              <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400" /> Simulation mode
              </div>
            </div>

            <div className="mt-4">
              <DroneSpatialScene />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {fleetMetrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-slate-800 bg-[#0d1a2a] p-3">
                  <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-slate-400">{metric.label}</div>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <div className="text-2xl font-semibold text-white">{metric.value}</div>
                    <div className="text-[9px] font-mono text-cyan-300">{metric.delta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-[#091823] p-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                <RadioTower className="h-3.5 w-3.5 text-violet-300" /> Live mission status
              </div>
              <div className="mt-4 space-y-3">
                {droneFleet.map((drone) => (
                  <div key={drone.id} className="rounded-xl border border-slate-800 bg-[#0d1a2a] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-white">{drone.id}</div>
                      <span className="rounded-full border border-cyan-500/30 bg-cyan-950/30 px-1.5 py-0.5 text-[8px] font-mono uppercase text-cyan-300">{drone.status}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                      <div>Battery: <span className="text-cyan-300">{drone.battery}%</span></div>
                      <div>Altitude: <span className="text-cyan-300">{drone.altitude}m</span></div>
                      <div>Speed: <span className="text-cyan-300">{drone.speed}m/s</span></div>
                      <div>Signal: <span className="text-emerald-300">{drone.signal}</span></div>
                    </div>
                    <div className="mt-2 text-[9px] font-mono uppercase tracking-[0.16em] text-slate-500">{drone.mission}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#091823] p-4">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
                <Wifi className="h-3.5 w-3.5 text-emerald-300" /> Connectivity gateway
              </div>
              <div className="mt-4 space-y-2">
                {providerState.map((item) => (
                  <div key={item.name} className="rounded-xl border border-slate-800 bg-[#0d1a2a] p-2.5 text-[10px] text-slate-300">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-white">{item.name}</span>
                      <span className="text-emerald-300">{item.status}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-slate-400">
                      <span>Latency</span>
                      <span>{item.latency}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-slate-400">
                      <span>Health</span>
                      <span className="text-cyan-300">{item.health}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <MediaDropzone />

          <div className="rounded-2xl border border-slate-800 bg-[#071723] p-4">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
              <MonitorPlay className="h-3.5 w-3.5 text-cyan-300" /> Live telemetry stream
            </div>
            <div className="mt-4 space-y-2">
              {telemetryEvents.map((event) => (
                <div key={event} className="rounded-xl border border-slate-800 bg-[#0d1a2a] px-3 py-2 text-[10px] text-slate-300">
                  {event}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {missionCards.map(({ title, value, tone, detail }) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-[#071723] p-4">
              <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">
                <span>{title}</span>
                <ArrowUpRight className={`h-3.5 w-3.5 ${tone === 'emerald' ? 'text-emerald-300' : tone === 'cyan' ? 'text-cyan-300' : 'text-amber-300'}`} />
              </div>
              <div className={`mt-3 text-3xl font-semibold ${tone === 'emerald' ? 'text-emerald-300' : tone === 'cyan' ? 'text-cyan-300' : 'text-amber-300'}`}>
                {value}
              </div>
              <div className="mt-2 text-xs leading-5 text-slate-400">{detail}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-[#071723] p-4">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
              <Camera className="h-3.5 w-3.5 text-cyan-300" /> Evidence viewer
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {['Previous inspection', 'Current inspection'].map((label, index) => (
                <div key={label} className="rounded-xl border border-slate-800 bg-[#0d1a2a] p-3">
                  <div className="flex items-center justify-between gap-2 text-[9px] font-mono uppercase tracking-[0.18em] text-slate-400">
                    <span>{label}</span>
                    <span className={index === 1 ? 'text-emerald-300' : 'text-amber-300'}>{index === 1 ? 'Live' : 'Archive'}</span>
                  </div>
                  <div className="mt-3 h-36 rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.12),_transparent_32%),linear-gradient(135deg,#0b1623,#0d1a2a)] p-3">
                    <div className="flex h-full items-center justify-center text-slate-500">
                      <div className="text-center">
                        <Play className="mx-auto h-6 w-6 text-cyan-300" />
                        <div className="mt-2 text-[10px] font-mono uppercase tracking-[0.18em]">Inspection frame</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#071723] p-4">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
              <Zap className="h-3.5 w-3.5 text-violet-300" /> Temporal twin
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.18em] text-slate-500">
                <span>2025</span>
                <span>Healthy</span>
                <span>Degraded</span>
                <span>Critical</span>
              </div>
              <div className="relative flex h-16 items-center">
                <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-slate-700" />
                {['', '', '', ''].map((_, index) => (
                  <div key={index} className="relative z-10 flex-1 flex items-center justify-center">
                    <div className={`h-3 w-3 rounded-full ${index === 1 ? 'bg-cyan-400' : index === 2 ? 'bg-amber-400' : index === 3 ? 'bg-rose-400' : 'bg-slate-600'} shadow-[0_0_12px_rgba(34,211,238,0.35)]`} />
                  </div>
                ))}
              </div>
              <div className="grid gap-2 text-[10px] text-slate-300">
                {inspectionMarkers.map((marker) => (
                  <div key={marker.time} className="flex items-center justify-between rounded-lg border border-slate-800 bg-[#0d1a2a] px-2.5 py-2">
                    <span className="font-mono text-slate-500">{marker.time}</span>
                    <span className="text-white">{marker.label}</span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-mono uppercase ${marker.kind === 'defect' ? 'bg-amber-500/10 text-amber-300' : marker.kind === 'risk' ? 'bg-rose-500/10 text-rose-300' : 'bg-cyan-500/10 text-cyan-300'}`}>
                      {marker.kind}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-800 bg-[#071723] p-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
            <Gauge className="h-3.5 w-3.5 text-emerald-300" /> Command intelligence summary
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Drone route health', value: 'Excellent', status: 'good' },
              { label: 'Asset matching', value: '92.4%', status: 'good' },
              { label: 'Calibration drift', value: 'Low', status: 'watch' },
              { label: 'Maintenance load', value: 'Balanced', status: 'good' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-[#0d1a2a] p-3">
                <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                <div className={`mt-2 text-base font-semibold ${item.status === 'watch' ? 'text-amber-300' : 'text-emerald-300'}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
