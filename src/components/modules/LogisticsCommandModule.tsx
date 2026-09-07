import React from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle,
  Radio,
  Anchor,
  Box
} from 'lucide-react';
import { LogisticsConsignment } from '../../types';

export const LogisticsCommandModule: React.FC = () => {
  const consignments: LogisticsConsignment[] = [
    {
      id: 'CNV-2026-08',
      trackingNumber: 'KE-KTR-TRF-0019',
      description: '250 MVA 400/220/33kV Auto-Transformer (Suswa Hub Upgrade)',
      origin: 'Mombasa Port Berth 21',
      destination: 'Suswa 400kV Converter Substation',
      eta: '2026-09-12 14:00 EAT',
      status: 'IN_TRANSIT',
      criticality: 'CRITICAL',
      carrier: 'Bolloré Logistics Special Projects (Heavy Haul 18-Axle)'
    },
    {
      id: 'CNV-2026-09',
      trackingNumber: 'KE-KTR-CBL-4402',
      description: '400kV XLPE Under-River Submarine Cables (Lamu Intertie)',
      origin: 'Kilindini Harbour Customs Yard',
      destination: 'Mariakani 400kV Substation Yard',
      eta: '2026-09-08 19:30 EAT',
      status: 'CUSTOMS_HOLD',
      criticality: 'HIGH',
      carrier: 'Siginon Global Logistics'
    },
    {
      id: 'CNV-2026-10',
      trackingNumber: 'KE-KTR-ISO-9981',
      description: 'Composite Polymer Insulators & Corona Rings (1,400 Units)',
      origin: 'JKIA Air Cargo Terminal',
      destination: 'Olkaria Logistics Depot',
      eta: '2026-09-07 22:00 EAT',
      status: 'DISPATCHED',
      criticality: 'NORMAL',
      carrier: 'Freight Forwarders Kenya'
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* KPI Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE CONVOYS IN TRANSIT</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">3 En Route</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">KeNHA special permits approved</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PORT CUSTOMS PIPELINE</span>
            <Anchor className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">KES 480M</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Duty exemption Sec 140 PPADA</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SUBSTATION CRITICAL STOCK</span>
            <Box className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-300">96.8%</div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">Safety stock across 8 regional hubs</div>
        </div>

        <div className="atlas-card p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ROAD ESCORT & POLICE SYNC</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-100">Synchronized</div>
          <div className="mt-1 text-[11px] text-emerald-400 font-mono">NTSA & Traffic HQ corridor clearance</div>
        </div>
      </div>

      {/* Main Convoys Table */}
      <div className="atlas-card p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>National Grid Heavy Logistics & Transformer Convoys</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live highway telemetry, axle load weight stations, and destination substation staging.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Mombasa – Nairobi – Suswa Corridor
          </span>
        </div>

        <div className="space-y-3">
          {consignments.map(c => (
            <div
              key={c.id}
              className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-2"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-cyan-400">{c.trackingNumber}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {c.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        c.status === 'IN_TRANSIT'
                          ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/20'
                          : c.status === 'CUSTOMS_HOLD'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1">
                    {c.description}
                  </div>
                </div>

                <div className="text-left md:text-right font-mono shrink-0">
                  <div className="text-xs text-slate-300 flex items-center md:justify-end gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>ETA: {c.eta}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Carrier: {c.carrier}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Route: {c.origin} ➔ {c.destination}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>KeNHA Axle Weighbridge Cleared</span>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span>Escort: National Police Grid Protection Unit</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
