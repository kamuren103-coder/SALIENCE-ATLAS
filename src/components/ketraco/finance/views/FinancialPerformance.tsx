import React, { useMemo, useState } from 'react';
import FinancePageHeader from '../components/FinancePageHeader';
import { useFinanceDataContext } from '../components/FinanceDataContext';
import {
  Panel, DataStateBadge, StatusChip, formatFullKES, formatKES, formatPct,
  useTooltip, FinanceSelect,
} from '../components/primitives';
import { financeTokens } from '../tokens';

interface ChartPoint {
  label: string;
  budget: number;
  actual: number;
  comm: number;
  paid: number;
  forecast: number;
}

export default function FinancialPerformance() {
  const data = useFinanceDataContext();
  const { show, hide, tooltip } = useTooltip();
  const [metric, setMetric] = useState('all');

  // Build a deterministic comparison by cost centre (x axis)
  const series: ChartPoint[] = useMemo(() => {
    return data.costCentres.map((cc) => {
      const ccBudgets = data.budgets.filter((b) => b.costCentreId === cc.costCentreId);
      return {
        label: cc.code,
        budget: ccBudgets.reduce((s, b) => s + b.revisedAmount, 0),
        actual: ccBudgets.reduce((s, b) => s + b.actualAmount, 0),
        comm: ccBudgets.reduce((s, b) => s + b.committedAmount, 0),
        paid: ccBudgets.reduce((s, b) => s + b.paidAmount, 0),
        forecast: ccBudgets.reduce((s, b) => s + b.forecastAmount, 0),
      };
    }).filter((p) => p.budget > 0);
  }, [data.costCentres, data.budgets]);

  const W = 720;
  const H = 260;
  const padL = 70;
  const padR = 20;
  const padT = 20;
  const padB = 40;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const maxVal = useMemo(() => Math.max(...series.flatMap((p) => [p.budget, p.actual, p.forecast, p.comm, p.paid]), 1) * 1.1, [series]);

  const x = (i: number) => padL + (series.length === 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
  const y = (v: number) => padT + innerH - (v / maxVal) * innerH;

  const metricLines = [
    { id: 'budget' as const, color: financeTokens.chart.budget },
    { id: 'forecast' as const, color: financeTokens.chart.forecast },
    { id: 'comm' as const, color: financeTokens.chart.committed },
    { id: 'actual' as const, color: financeTokens.chart.actual },
    { id: 'paid' as const, color: financeTokens.chart.paid },
  ].filter((l) => metric === 'all' || l.id === metric);

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => y(maxVal * f));

  const METRIC_LABEL: Record<string, string> = { budget: 'Budget', forecast: 'Forecast', comm: 'Committed', actual: 'Actual', paid: 'Paid' };

  return (
    <div className="flex flex-col min-h-full">
      <FinancePageHeader
        title="Financial Performance"
        subtitle="Budget vs actual, forecast and spend trends across cost centres"
        right={<DataStateBadge state={data.state} />}
      />

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Trend chart */}
          <Panel
            title="Cost Centre Comparison"
            subtitle="Hover to inspect — select a metric to isolate"
            className="xl:col-span-2"
            accent={financeTokens.colors.primary}
            right={
              <FinanceSelect
                value={metric}
                onChange={setMetric}
                options={[
                  { value: 'all', label: 'ALL METRICS' },
                  { value: 'budget', label: 'BUDGET' },
                  { value: 'actual', label: 'ACTUAL' },
                  { value: 'comm', label: 'COMMITTED' },
                  { value: 'paid', label: 'PAID' },
                  { value: 'forecast', label: 'FORECAST' },
                ]}
                label="Metric"
              />
            }
          >
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Line chart comparing budget, committed, actual, paid and forecast across cost centres">
              {gridLines.map((gy, i) => (
                <g key={i}>
                  <line x1={padL} y1={gy} x2={W - padR} y2={gy} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                  <text x={padL - 8} y={gy + 3} textAnchor="end" fontSize="9" fill="#64748B" fontFamily="'JetBrains Mono',monospace">{formatKES(maxVal * (i ? (1 - i / 4) : 1))}</text>
                </g>
              ))}
              {series.map((p, i) => (
                <g key={p.label}>
                  <line x1={x(i)} y1={padT} x2={x(i)} y2={H - padB} stroke="rgba(255,255,255,0.04)" strokeWidth={1} strokeDasharray="2 3" />
                  <text x={x(i)} y={H - 18} textAnchor="middle" fontSize="9" fill="#64748B" fontFamily="'JetBrains Mono',monospace">{p.label}</text>
                </g>
              ))}
              {metricLines.map((l) => {
                const line = series.map((p, i) => `${x(i)},${y(p[l.id])}`).join(' ');
                return (
                  <g key={l.id} onMouseEnter={(e) => show(e, <span><b>{METRIC_LABEL[l.id]}</b> series over {series.length} cost centres</span>)} onMouseLeave={hide}>
                    <polyline points={line} fill="none" stroke={l.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    {series.map((p, i) => (
                      <circle key={i} cx={x(i)} cy={y(p[l.id])} r={3.5} fill={l.color} stroke="#05070D" strokeWidth={1.5}>
                        <title>{`${p.label} — ${METRIC_LABEL[l.id]}: ${formatFullKES(p[l.id])}`}</title>
                      </circle>
                    ))}
                  </g>
                );
              })}
            </svg>
            <div className="flex flex-wrap gap-3 mt-2">
              {metricLines.map((l) => (
                <span key={l.id} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="w-2 h-0.5" style={{ backgroundColor: l.color }} />{METRIC_LABEL[l.id]}
                </span>
              ))}
            </div>
          </Panel>

          {/* Aggregate performance */}
          <div className="space-y-4">
            <Panel title="Budget Utilisation" accent={financeTokens.chart.actual}>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500">Total budget</span><span className="text-slate-200">{formatFullKES(series.reduce((s, p) => s + p.budget, 0))}</span></div>
                <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500">Actual spend</span><span className="text-purple-400">{formatFullKES(series.reduce((s, p) => s + p.actual, 0))}</span></div>
                <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500">Forecast</span><span className="text-sky-400">{formatFullKES(series.reduce((s, p) => s + p.forecast, 0))}</span></div>
                <div className="border-t border-white/5 mt-2 pt-2">
                  <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-400">Utilisation</span><span className="text-cyan-300 font-bold">{formatPct(series.reduce((s, p) => s + p.budget, 0) ? (series.reduce((s, p) => s + p.actual, 0) / series.reduce((s, p) => s + p.budget, 0)) * 100 : 0, false)}</span></div>
                </div>
              </div>
            </Panel>
            <Panel title="Metric Legend">
              <div className="flex flex-wrap gap-2">
                {metricLines.map((l) => (
                  <span key={l.id}>
                    <StatusChip label={METRIC_LABEL[l.id]} color={l.color} />
                  </span>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        {/* Performance table */}
        <Panel title="Performance Register" subtitle="Per cost centre — budget, actual, forecast and variance" accent={financeTokens.colors.secondary}>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-[#64748B] border-b border-white/5">
                  <th className="text-left py-2 px-2">Cost Centre</th>
                  <th className="text-right py-2 px-2">Budget</th>
                  <th className="text-right py-2 px-2">Committed</th>
                  <th className="text-right py-2 px-2">Actual</th>
                  <th className="text-right py-2 px-2">Paid</th>
                  <th className="text-right py-2 px-2">Forecast</th>
                  <th className="text-right py-2 px-2">Utilisation</th>
                </tr>
              </thead>
              <tbody>
                {series.map((p) => {
                  const pct = p.budget ? (p.actual / p.budget) * 100 : 0;
                  return (
                    <tr key={p.label} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="py-2 px-2 text-slate-200">{p.label}</td>
                      <td className="text-right py-2 px-2 text-slate-300">{formatKES(p.budget)}</td>
                      <td className="text-right py-2 px-2 text-amber-400">{formatKES(p.comm)}</td>
                      <td className="text-right py-2 px-2 text-purple-400">{formatKES(p.actual)}</td>
                      <td className="text-right py-2 px-2 text-emerald-400">{formatKES(p.paid)}</td>
                      <td className="text-right py-2 px-2 text-sky-400">{formatKES(p.forecast)}</td>
                      <td className="text-right py-2 px-2"><StatusChip label={`${pct.toFixed(0)}%`} color={pct > 85 ? '#F59E0B' : '#10B981'} /></td>
                    </tr>
                  );
                })}
                {series.length === 0 && <tr><td colSpan={7} className="py-6 text-center text-slate-500">No cost centre data loaded.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
      {tooltip}
    </div>
  );
}
