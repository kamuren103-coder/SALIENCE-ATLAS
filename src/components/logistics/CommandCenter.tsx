import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle, TrendingUp, TrendingDown, Clock, Activity,
  Package, Truck, AlertCircle, Zap, RefreshCw, MapPin, ArrowRight
} from 'lucide-react';
import { colors } from '../../design-system/tokens';

interface KPIData {
  label: string;
  value: string | number;
  unit?: string;
  status: 'healthy' | 'warning' | 'critical';
  change: string;
}

interface LogisticEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: string;
  message: string;
  source: string;
  entity_type?: string;
  entity_id?: string;
}

interface Shipment {
  id: string;
  orderId: string;
  origin: string;
  destination: string;
  status: string;
  items: number;
  weight: number;
  priority: string;
  eta?: string;
}

const severityConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  CRITICAL: { bg: '#dc262620', text: '#ef4444', icon: <AlertTriangle size={12} /> },
  WARNING: { bg: '#f59e0b20', text: '#f59e0b', icon: <AlertCircle size={12} /> },
  INFO: { bg: '#06b6d420', text: '#06b6d4', icon: <Activity size={12} /> },
};

const statusColors: Record<string, string> = {
  healthy: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
};

const CommandCenter: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<Record<string, KPIData>>({
    shipments: { label: 'Active Shipments', value: '—', status: 'healthy', change: 'Loading...' },
    inventory: { label: 'Inventory Units', value: '—', status: 'warning', change: 'Loading...' },
    fleet: { label: 'Fleet In Transit', value: '—', unit: '%', status: 'healthy', change: 'Loading...' },
    risk: { label: 'Active Exceptions', value: '—', status: 'warning', change: 'Loading...' },
    sla: { label: 'SLA Compliance', value: '—', unit: '%', status: 'healthy', change: 'Loading...' },
  });

  const [events, setEvents] = useState<LogisticEvent[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [eventStatus, setEventStatus] = useState<'LIVE' | 'PAUSED' | 'STALE'>('PAUSED');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [overviewRes, eventsRes, shipmentsRes] = await Promise.allSettled([
        fetch('/api/logistics/overview'),
        fetch('/api/logistics/events?limit=8'),
        fetch('/api/logistics/shipments?limit=5'),
      ]);

      // Process overview
      if (overviewRes.status === 'fulfilled' && overviewRes.value.ok) {
        const body = await overviewRes.value.json();
        const overview = body.data;
        if (overview?.kpis) {
          setKpis({
            shipments: {
              label: overview.kpis.shipments.label,
              value: overview.kpis.shipments.value,
              status: overview.kpis.shipments.status,
              change: overview.kpis.shipments.trend || 'stable',
            },
            inventory: {
              label: overview.kpis.inventory.label,
              value: overview.kpis.inventory.value,
              status: overview.kpis.inventory.status,
              change: overview.kpis.inventory.trend || 'stable',
            },
            fleet: {
              label: overview.kpis.fleet.label,
              value: overview.kpis.fleet.value,
              unit: '%',
              status: overview.kpis.fleet.status,
              change: overview.kpis.fleet.trend || 'stable',
            },
            risk: {
              label: overview.kpis.risk.label,
              value: overview.kpis.risk.value,
              status: overview.kpis.risk.status,
              change: overview.kpis.risk.trend || 'stable',
            },
            sla: {
              label: overview.kpis.sla.label,
              value: overview.kpis.sla.value,
              unit: '%',
              status: overview.kpis.sla.status,
              change: overview.kpis.sla.trend || 'stable',
            },
          });
          setEventStatus(overview.dataAvailable ? 'LIVE' : 'STALE');
        }
      }

      // Process events
      if (eventsRes.status === 'fulfilled' && eventsRes.value.ok) {
        const body = await eventsRes.value.json();
        setEvents(body.data?.events || []);
      }

      // Process shipments
      if (shipmentsRes.status === 'fulfilled' && shipmentsRes.value.ok) {
        const body = await shipmentsRes.value.json();
        setShipments(body.data?.shipments || []);
      }
    } catch (err) {
      console.error('CommandCenter fetch error:', err);
      setEventStatus('STALE');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <TrendingUp size={14} style={{ color: '#10b981' }} />;
    if (trend === 'down') return <TrendingDown size={14} style={{ color: '#ef4444' }} />;
    return <Clock size={14} style={{ color: '#64748b' }} />;
  };

  const KPICard = ({ id, data }: { id: string; data: KPIData; key?: React.Key }) => (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 rounded-lg border"
      style={{ backgroundColor: colors.logistics.surface, borderColor: colors.logistics.border }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: colors.logistics.textMuted }}>
            {data.label}
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <div className="text-2xl font-bold" style={{ color: colors.logistics.text }}>{data.value}</div>
            {data.unit && <div className="text-sm" style={{ color: colors.logistics.textMuted }}>{data.unit}</div>}
          </div>
        </div>
        <div
          className="w-2 h-8 rounded-full"
          style={{ backgroundColor: statusColors[data.status], opacity: 0.7 }}
        />
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: colors.logistics.textMuted }}>
        <TrendIcon trend={data.change} />
        <span className="capitalize">{data.change}</span>
      </div>
    </motion.div>
  );

  const kpiEntries = Object.entries(kpis) as Array<[string, KPIData]>;

  return (
    <div className="p-6 space-y-5 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: colors.logistics.text }}>
            LOGISTICS COMMAND CENTER
          </h1>
          <p className="text-xs mt-0.5" style={{ color: colors.logistics.textMuted }}>
            Operational intelligence and decision support
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all hover:opacity-80"
          style={{
            backgroundColor: colors.logistics.surface,
            borderColor: colors.logistics.border,
            color: colors.logistics.textMuted,
          }}
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* KPI Strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-5 gap-3">
        {kpiEntries.map(([key, data]) => (
          <KPICard key={key} id={key} data={data} />
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-4" style={{ minHeight: '420px' }}>
        {/* Recent Shipments — Left 2 columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-2 rounded-lg border flex flex-col"
          style={{ backgroundColor: colors.logistics.surface, borderColor: colors.logistics.border }}
        >
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: colors.logistics.border }}>
            <span className="font-semibold text-sm flex items-center gap-2" style={{ color: colors.logistics.primary }}>
              <Truck size={14} /> RECENT SHIPMENTS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.logistics.bg, color: colors.logistics.textMuted }}>
              {shipments.length} loaded
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {shipments.length === 0 ? (
              <div className="h-full flex items-center justify-center px-4">
                <div className="text-center">
                  <Package size={24} style={{ color: colors.logistics.textMuted, opacity: 0.4 }} className="mx-auto mb-2" />
                  <div className="text-xs" style={{ color: colors.logistics.textMuted }}>
                    No shipments currently tracked
                  </div>
                </div>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: colors.logistics.border }}>
                {shipments.map((s) => (
                  <div key={s.id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-semibold" style={{ color: colors.logistics.text }}>
                        {s.orderId}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: s.status === 'in-transit' ? '#06b6d420' : s.status === 'delivered' ? '#10b98120' : s.status === 'exception' ? '#ef444420' : '#64748b20',
                          color: s.status === 'in-transit' ? '#06b6d4' : s.status === 'delivered' ? '#10b981' : s.status === 'exception' ? '#ef4444' : '#64748b',
                        }}
                      >
                        {s.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]" style={{ color: colors.logistics.textMuted }}>
                      <MapPin size={10} />
                      <span>{s.origin}</span>
                      <ArrowRight size={10} style={{ opacity: 0.4 }} />
                      <span>{s.destination}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-[10px]" style={{ color: colors.logistics.textMuted }}>
                      <span>{s.items} items</span>
                      <span>{s.weight.toLocaleString()} kg</span>
                      {s.eta && <span>ETA: {new Date(s.eta).toLocaleDateString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Right column: Exceptions + Events */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Exceptions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 rounded-lg border overflow-hidden flex flex-col"
            style={{ backgroundColor: colors.logistics.surface, borderColor: colors.logistics.border }}
          >
            <div className="px-4 py-3 border-b font-semibold text-sm flex items-center gap-2" style={{ borderColor: colors.logistics.border, color: '#f59e0b' }}>
              <Zap size={14} /> EXCEPTIONS
            </div>
            <div className="flex-1 overflow-y-auto">
              {(() => {
                const criticalEvents = events.filter(e => e.severity === 'CRITICAL' || e.severity === 'WARNING');
                if (criticalEvents.length === 0) {
                  return (
                    <div className="h-full flex items-center justify-center px-4">
                      <div className="text-center">
                        <div className="text-xs" style={{ color: colors.logistics.textMuted }}>
                          No active exceptions
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="divide-y" style={{ borderColor: colors.logistics.border }}>
                    {criticalEvents.map(ev => {
                      const config = severityConfig[ev.severity] || severityConfig.INFO;
                      return (
                        <div key={ev.id} className="px-3 py-2.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: config.bg, color: config.text }}>
                              {config.icon}
                              {ev.severity}
                            </span>
                            <span className="text-[10px] font-mono" style={{ color: colors.logistics.textMuted }}>
                              {ev.type.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="text-xs leading-relaxed" style={{ color: colors.logistics.text }}>
                            {ev.message}
                          </div>
                          <div className="text-[10px] mt-1" style={{ color: colors.logistics.textMuted }}>
                            {ev.source} • {new Date(ev.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </motion.div>

          {/* Live Events */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 rounded-lg border overflow-hidden flex flex-col"
            style={{ backgroundColor: colors.logistics.surface, borderColor: colors.logistics.border }}
          >
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: colors.logistics.border }}>
              <span className="font-semibold text-sm flex items-center gap-2" style={{ color: colors.logistics.primary }}>
                <Activity size={14} /> LIVE EVENTS
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: eventStatus === 'LIVE' ? '#10b98120' : eventStatus === 'STALE' ? '#ef444420' : '#64748b20',
                  color: eventStatus === 'LIVE' ? '#10b981' : eventStatus === 'STALE' ? '#ef4444' : '#64748b',
                }}
              >
                {eventStatus}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {events.length === 0 ? (
                <div className="h-full flex items-center justify-center px-4">
                  <div className="text-center">
                    <Activity size={20} style={{ color: colors.logistics.textMuted, opacity: 0.3 }} className="mx-auto mb-2" />
                    <div className="text-xs" style={{ color: colors.logistics.textMuted }}>
                      No logistics events recorded
                    </div>
                  </div>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: colors.logistics.border }}>
                  {events.map(ev => {
                    const config = severityConfig[ev.severity] || severityConfig.INFO;
                    return (
                      <div key={ev.id} className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: config.bg, color: config.text }}>
                            {config.icon}
                          </span>
                          <span className="text-[11px] flex-1" style={{ color: colors.logistics.text }}>
                            {ev.message.length > 60 ? ev.message.substring(0, 60) + '...' : ev.message}
                          </span>
                        </div>
                        <div className="text-[10px] mt-0.5 ml-5" style={{ color: colors.logistics.textMuted }}>
                          {new Date(ev.timestamp).toLocaleTimeString()} • {ev.source}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-[10px] flex items-center gap-4" style={{ color: colors.logistics.textMuted }}>
        <span>Logistics Intelligence Platform v5.1.0</span>
        <span>•</span>
        <span>Phase 00-04 foundation complete • Phases 05-09 in development</span>
      </div>
    </div>
  );
};

export default CommandCenter;
