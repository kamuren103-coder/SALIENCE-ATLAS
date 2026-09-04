import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import FinancePageHeader from '../components/FinancePageHeader';
import { useFinanceDataContext } from '../components/FinanceDataContext';
import {
  Panel, DataStateBadge, StatusChip, formatNumber, formatDate, usePrefersReducedMotion,
} from '../components/primitives';
import { financeTokens } from '../tokens';

const SOURCE_ICON: Record<string, string> = {
  SAP_S4HANA: '#00D9FF',
  SAP_ARIBA: '#8B5CF6',
  EXCEL: '#10B981',
  CSV: '#0EA5E9',
  DATABASE: '#F59E0B',
  API: '#F43F5E',
  BANK: '#64748B',
  PROJECT_SYSTEM: '#8B5CF6',
};

const PIPELINE_STAGES = [
  { label: 'SOURCE', color: financeTokens.chart.budget },
  { label: 'INGESTION', color: financeTokens.chart.forecast },
  { label: 'VALIDATION', color: financeTokens.chart.committed },
  { label: 'NORMALIZATION', color: financeTokens.chart.actual },
  { label: 'ONTOLOGY', color: financeTokens.colors.secondary },
  { label: 'GRAPH', color: financeTokens.chart.paid },
];

export default function DataFabric() {
  const data = useFinanceDataContext();
  const reduced = usePrefersReducedMotion();

  const totalRecords = useMemo(() => data.batches.reduce((s, b) => s + b.recordCount, 0), [data.batches]);
  const totalFailures = useMemo(() => data.batches.reduce((s, b) => s + b.failureCount, 0), [data.batches]);
  const totalWarnings = useMemo(() => data.batches.reduce((s, b) => s + b.warningCount, 0), [data.batches]);
  const qualityAvg = useMemo(() => {
    if (!data.quality.length) return 0;
    return (data.quality.reduce((s, q) => s + q.overallScore, 0) / data.quality.length) * 100;
  }, [data.quality]);

  return (
    <div className="flex flex-col min-h-full">
      <FinancePageHeader
        title="Finance Data Fabric"
        subtitle="Live pipeline of source systems through ingestion, validation, normalization, ontology and graph"
        right={<DataStateBadge state={data.state} />}
      />

      <div className="p-5 space-y-5">
        {/* Pipeline visualization */}
        <Panel title="Data Pipeline" subtitle="Animated flow from source to knowledge graph" accent={financeTokens.colors.primary}>
          <div className="flex items-center gap-2 flex-wrap py-2">
            {PIPELINE_STAGES.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && (
                  <div className="flex-1 min-w-[24px] h-1 rounded-full overflow-hidden bg-white/5 relative">
                    {!reduced && (
                      <motion.div
                        className="absolute inset-y-0 w-6 rounded-full"
                        animate={{ left: ['-10%', '110%'] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: 'linear' }}
                        style={{ backgroundColor: s.color, opacity: 0.6 }}
                      />
                    )}
                  </div>
                )}
                <div className="flex flex-col items-center rounded border border-white/[0.06] bg-[#0B1220] px-3 py-2 min-w-[96px]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: s.color }}>{s.label}</span>
                  <span className="text-[9px] font-mono text-slate-500 mt-0.5">Stage {i + 1}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="text-[10px] font-mono text-slate-500">SOURCE → INGESTION → VALIDATION → NORMALIZATION → ONTOLOGY → GRAPH</p>
        </Panel>

        {/* Source summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="finance-kpi"><div className="finance-label">Source Systems</div><div className="finance-value">{data.sources.length}</div><div className="text-[10px] text-slate-500 font-mono">registered</div></div>
          <div className="finance-kpi"><div className="finance-label">Records Processed</div><div className="finance-value" style={{ color: financeTokens.chart.budget }}>{formatNumber(totalRecords)}</div><div className="text-[10px] text-slate-500 font-mono">across batches</div></div>
          <div className="finance-kpi"><div className="finance-label">Failures</div><div className="finance-value" style={{ color: totalFailures ? financeTokens.colors.negative : financeTokens.colors.positive }}>{totalFailures}</div><div className="text-[10px] text-slate-500 font-mono">{totalWarnings} warnings</div></div>
          <div className="finance-kpi"><div className="finance-label">Avg Data Quality</div><div className="finance-value" style={{ color: financeTokens.colors.positive }}>{qualityAvg.toFixed(0)}%</div><div className="text-[10px] text-slate-500 font-mono">overall score</div></div>
        </div>

        {/* Source status grid */}
        <Panel title="Source Systems" subtitle="Connection, last sync, records, errors, quality and status per source" accent={financeTokens.colors.secondary}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {data.sources.map((src) => {
              const batches = data.batches.filter((b) => b.sourceId === src.sourceId);
              const records = batches.reduce((s, b) => s + b.recordCount, 0);
              const errors = batches.reduce((s, b) => s + b.failureCount, 0);
              const quality = data.quality.find((q) => q.sourceId === src.sourceId);
              const color = SOURCE_ICON[src.sourceType] ?? financeTokens.colors.primary;
              const connected = src.connectionStatus === 'CONNECTED' || src.connectionStatus === 'AUTHENTICATED';
              return (
                <div key={src.sourceId} className="rounded border border-white/[0.05] bg-[#0B1220] p-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded flex items-center justify-center text-[10px] font-mono font-bold" style={{ backgroundColor: `${color}1a`, color, border: `1px solid ${color}44` }}>
                      {src.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[12px] font-medium text-slate-100 truncate">{src.name}</div>
                      <div className="text-[9px] font-mono text-slate-500">{src.sourceType.replace('_', ' ')} • {src.system}</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] font-mono">
                    <div className="flex justify-between"><span className="text-slate-500">Connection</span><StatusChip label={src.connectionStatus} color={connected ? '#10B981' : '#F43F5E'} /></div>
                    <div className="flex justify-between"><span className="text-slate-500">Status</span><StatusChip label={src.status} color={src.status === 'ENABLED' ? '#00D9FF' : '#64748B'} /></div>
                    <div className="flex justify-between"><span className="text-slate-500">Last Sync</span><span className="text-slate-300">{formatDate(src.lastSuccessfulSync)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Records</span><span className="text-slate-300">{formatNumber(records)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Errors</span><span className={errors ? 'text-rose-400' : 'text-emerald-400'}>{errors}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Quality</span><span className="text-emerald-400">{quality ? `${Math.round(quality.overallScore * 100)}%` : '—'}</span></div>
                  </div>
                </div>
              );
            })}
            {data.sources.length === 0 && <div className="text-[11px] text-slate-500 font-mono col-span-full">No sources loaded.</div>}
          </div>
        </Panel>

        {/* Batch streams */}
        <Panel title="Ingestion Batch Streams" subtitle="Recent ingestion batches and their status" accent={financeTokens.chart.budget}>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-[#64748B] border-b border-white/5">
                  <th className="text-left py-2 px-2">Batch</th>
                  <th className="text-left py-2 px-2">Source</th>
                  <th className="text-right py-2 px-2">Records</th>
                  <th className="text-right py-2 px-2">Success</th>
                  <th className="text-right py-2 px-2">Warnings</th>
                  <th className="text-right py-2 px-2">Failures</th>
                  <th className="text-right py-2 px-2">Quarantined</th>
                  <th className="text-right py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.batches.map((b) => {
                  const src = data.sources.find((s) => s.sourceId === b.sourceId);
                  return (
                    <tr key={b.batchId} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="py-2 px-2 text-cyan-300">{b.batchId}</td>
                      <td className="py-2 px-2 text-slate-200">{src?.name ?? b.sourceId}</td>
                      <td className="text-right py-2 px-2 text-slate-300">{formatNumber(b.recordCount)}</td>
                      <td className="text-right py-2 px-2 text-emerald-400">{formatNumber(b.successCount)}</td>
                      <td className="text-right py-2 px-2 text-amber-400">{b.warningCount}</td>
                      <td className="text-right py-2 px-2 text-rose-400">{b.failureCount}</td>
                      <td className="text-right py-2 px-2 text-slate-400">{b.quarantinedCount}</td>
                      <td className="text-right py-2 px-2"><StatusChip label={b.status} color={b.status === 'COMPLETED' ? '#10B981' : b.status === 'FAILED' ? '#F43F5E' : '#F59E0B'} /></td>
                    </tr>
                  );
                })}
                {data.batches.length === 0 && <tr><td colSpan={8} className="py-6 text-center text-slate-500">No batches loaded.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
