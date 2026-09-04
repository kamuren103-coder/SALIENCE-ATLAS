import React, { useMemo, useState } from 'react';
import FinancePageHeader from '../components/FinancePageHeader';
import { useFinanceDataContext } from '../components/FinanceDataContext';
import {
  Panel, DataStateBadge, StatusChip, formatDate, FinanceSelect,
} from '../components/primitives';
import { financeTokens } from '../tokens';
import type { FinanceLineageRecord } from '../types';

export default function Lineage() {
  const data = useFinanceDataContext();
  const [entity, setEntity] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);

  const entityOptions = useMemo(() => {
    const set = new Set(data.lineage.map((l) => l.entityKind).filter(Boolean));
    return [{ value: 'all', label: 'ALL ENTITIES' }, ...[...set].map((e) => ({ value: e as string, label: e as string }))];
  }, [data.lineage]);

  const filtered = useMemo(() => {
    return data.lineage.filter((l) => entity === 'all' || l.entityKind === entity);
  }, [data.lineage, entity]);

  const selectedRecord = data.lineage.find((l) => l.lineageId === selected) ?? filtered[0];

  const TRANSFORM_COLOR: Record<string, string> = {
    SOURCE_RECEIVE: financeTokens.chart.budget,
    RAW_RECORD_CREATE: financeTokens.chart.budget,
    VALIDATE: financeTokens.chart.committed,
    NORMALIZE: financeTokens.chart.actual,
    RESOLVE_ENTITY: financeTokens.colors.secondary,
    ONTOLOGY_MAP: financeTokens.colors.secondary,
    PERSIST: financeTokens.chart.forecast,
    GRAPH_CREATE_NODE: financeTokens.chart.paid,
    GRAPH_CREATE_EDGE: financeTokens.chart.paid,
    QUALITY_SCORE: '#10B981',
    EVENT_EMIT: '#64748B',
    ANALYTIC_CONSUME: '#64748B',
  };

  return (
    <div className="flex flex-col min-h-full">
      <FinancePageHeader
        title="Lineage Inspector"
        subtitle="Traceability from source records through transformations to graph entities and metrics"
        right={<DataStateBadge state={data.state} />}
      />

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Lineage list */}
          <Panel
            title="Lineage Records"
            subtitle="Source → Raw → Transform → Entity → Graph → Metric"
            accent={financeTokens.colors.primary}
            right={<FinanceSelect value={entity} onChange={setEntity} options={entityOptions} label="Entity" />}
          >
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filtered.map((l) => {
                const active = selectedRecord?.lineageId === l.lineageId;
                const color = TRANSFORM_COLOR[l.transformationType] ?? financeTokens.colors.primary;
                return (
                  <button
                    key={l.lineageId}
                    onClick={() => setSelected(l.lineageId)}
                    className={`w-full text-left rounded border p-2.5 transition-all ${active ? 'border-cyan-400/40 bg-[rgba(0,217,255,0.06)]' : 'border-white/[0.05] bg-[#0B1220] hover:border-white/15'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase" style={{ color }}>{l.transformationType.replace(/_/g, ' ')}</span>
                      <StatusChip label={l.entityKind ?? '—'} color={color} />
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 mt-1">{formatDate(l.occurredAt)} • rule · {l.transformationRule ?? '—'}</div>
                  </button>
                );
              })}
              {filtered.length === 0 && <div className="text-[11px] text-slate-500 font-mono">No lineage records for this entity.</div>}
            </div>
          </Panel>

          {/* Inspector detail */}
          <div className="xl:col-span-2 space-y-4">
            {selectedRecord ? (
              <>
                {/* Trace chain */}
                <Panel title="Trace Path" subtitle={selectedRecord.entityKind ? `Entity: ${selectedRecord.entityKind} » ${selectedRecord.entityId}` : 'Record trace'} accent={financeTokens.colors.primary}>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { label: 'SOURCE', value: selectedRecord.sourceId },
                      { label: 'RAW RECORD', value: selectedRecord.recordId },
                      { label: 'TRANSFORM', value: selectedRecord.transformationType },
                      { label: 'ENTITY', value: `${selectedRecord.entityKind}/${selectedRecord.entityId}` },
                      { label: 'GRAPH', value: selectedRecord.fromEntityKind ? `${selectedRecord.fromEntityKind} → ${selectedRecord.toEntityKind}` : undefined },
                      { label: 'METRIC', value: selectedRecord.toEntityKind },
                    ].map((s, i) => (
                      <React.Fragment key={s.label}>
                        {i > 0 && <span className="text-slate-600 font-mono">→</span>}
                        <div className="rounded border border-white/[0.06] bg-[#0B1220] px-2.5 py-1.5 text-center min-w-[90px]">
                          <div className="text-[8px] font-mono uppercase tracking-widest text-[#64748B]">{s.label}</div>
                          <div className="text-[10px] font-mono text-slate-200 mt-0.5 break-all">{s.value ?? '—'}</div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </Panel>

                {/* Detail fields */}
                <div className="grid grid-cols-2 gap-4">
                  <Panel title="Transformation Detail" accent={financeTokens.chart.actual}>
                    <div className="space-y-2 text-[11px] font-mono">
                      <div className="flex justify-between"><span className="text-slate-500">Lineage ID</span><span className="text-cyan-300">{selectedRecord.lineageId}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="text-slate-200">{selectedRecord.transformationType}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Rule</span><span className="text-slate-200">{selectedRecord.transformationRule ?? '—'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Timestamp</span><span className="text-slate-200">{formatDate(selectedRecord.occurredAt)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Batch</span><span className="text-slate-200">{selectedRecord.batchId ?? '—'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Parent</span><span className="text-slate-200">{selectedRecord.parentLineageId ?? '—'}</span></div>
                    </div>
                  </Panel>
                  <Panel title="Entity Mapping" accent={financeTokens.colors.secondary}>
                    <div className="space-y-2 text-[11px] font-mono">
                      <div className="flex justify-between"><span className="text-slate-500">From</span><span className="text-slate-200">{selectedRecord.fromEntityKind ? `${selectedRecord.fromEntityKind} (${selectedRecord.fromEntityId})` : '—'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">To</span><span className="text-slate-200">{selectedRecord.toEntityKind ? `${selectedRecord.toEntityKind} (${selectedRecord.toEntityId})` : '—'}</span></div>
                      {selectedRecord.fieldMappings && (
                        <div className="border-t border-white/5 pt-2">
                          <div className="text-slate-500 mb-1">Field Mappings</div>
                          <div className="space-y-0.5">
                            {Object.entries(selectedRecord.fieldMappings).map(([k, v]) => (
                              <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="text-slate-300">{v}</span></div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Panel>
                </div>
              </>
            ) : (
              <Panel title="Lineage Inspector">
                <div className="text-[11px] text-slate-500 font-mono text-center py-10">Select a lineage record to inspect its traceability. This communicates trust and provenance from source to metric.</div>
              </Panel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
