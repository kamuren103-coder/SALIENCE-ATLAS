import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import FinancePageHeader from '../components/FinancePageHeader';
import { useFinanceDataContext } from '../components/FinanceDataContext';
import {
  Panel, DataStateBadge, FinanceSelect, StatusChip, formatFullKES, formatKES,
  formatPct, useTooltip, UtilizationBar,
} from '../components/primitives';
import { financeTokens } from '../tokens';
import type { FinanceBudget } from '../types';

export default function BudgetIntelligence() {
  const data = useFinanceDataContext();
  const { show, hide, tooltip } = useTooltip();

  const [fy, setFy] = useState('all');
  const [department, setDepartment] = useState('all');
  const [type, setType] = useState('all');

  const fyOptions = useMemo(() => {
    const set = new Set(data.budgets.map((b) => b.financialYear));
    return [{ value: 'all', label: 'All Years' }, ...[...set].map((f) => ({ value: f, label: f }))];
  }, [data.budgets]);

  const deptOptions = useMemo(() => {
    const set = new Set(data.budgets.map((b) => b.department).filter(Boolean));
    return [{ value: 'all', label: 'All Depts' }, ...[...set].map((d) => ({ value: d as string, label: d as string }))];
  }, [data.budgets]);

  const filtered = useMemo(() => {
    return data.budgets.filter((b) => {
      if (fy !== 'all' && b.financialYear !== fy) return false;
      if (department !== 'all' && b.department !== department) return false;
      if (type !== 'all' && b.accountType !== type) return false;
      return true;
    });
  }, [data.budgets, fy, department, type]);

  const totals = useMemo(() => {
    const approved = filtered.reduce((s, b) => s + b.approvedAmount, 0);
    const revised = filtered.reduce((s, b) => s + b.revisedAmount, 0);
    const committed = filtered.reduce((s, b) => s + b.committedAmount, 0);
    const actual = filtered.reduce((s, b) => s + b.actualAmount, 0);
    const paid = filtered.reduce((s, b) => s + b.paidAmount, 0);
    const forecast = filtered.reduce((s, b) => s + b.forecastAmount, 0);
    const remaining = filtered.reduce((s, b) => s + b.remainingAmount, 0);
    const variance = filtered.reduce((s, b) => s + b.variance, 0);
    return { approved, revised, committed, actual, paid, forecast, remaining, variance };
  }, [filtered]);

  // Variance diverging bars: negative = under budget (green), positive = over (red)
  const maxAbs = useMemo(() => Math.max(...filtered.map((b) => Math.abs(b.variance)), 1), [filtered]);

  return (
    <div className="flex flex-col min-h-full">
      <FinancePageHeader
        title="Budget Intelligence"
        subtitle="Approved, revised, committed, actual and forecast across the budget portfolio"
        right={<DataStateBadge state={data.state} />}
      />

      <div className="p-5 space-y-5">
        {/* Filter bar */}
        <div className="finance-panel p-3 flex flex-wrap items-center gap-3">
          <span className="finance-label">DIMENSIONS</span>
          <FinanceSelect value={fy} onChange={setFy} options={fyOptions} label="Year" />
          <FinanceSelect value={department} onChange={setDepartment} options={deptOptions} label="Dept" />
          <FinanceSelect
            value={type}
            onChange={setType}
            options={[
              { value: 'all', label: 'ALL' },
              { value: 'CAPEX', label: 'CAPEX' },
              { value: 'OPEX', label: 'OPEX' },
            ]}
            label="Class"
          />
          <span className="ml-auto text-[11px] font-mono text-slate-400">
            {filtered.length} budgets
          </span>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
          <div className="finance-kpi"><div className="finance-label">Approved</div><div className="finance-value" style={{ color: financeTokens.chart.budget }}>{formatKES(totals.approved)}</div><div className="text-[10px] text-slate-500 font-mono">{formatFullKES(totals.approved)}</div></div>
          <div className="finance-kpi"><div className="finance-label">Revised</div><div className="finance-value">{formatKES(totals.revised)}</div><div className="text-[10px] text-slate-500 font-mono">{formatFullKES(totals.revised)}</div></div>
          <div className="finance-kpi"><div className="finance-label">Committed</div><div className="finance-value" style={{ color: financeTokens.chart.committed }}>{formatKES(totals.committed)}</div><div className="text-[10px] text-slate-500 font-mono">{(totals.revised ? (totals.committed / totals.revised) * 100 : 0).toFixed(0)}% encumbered</div></div>
          <div className="finance-kpi"><div className="finance-label">Actual</div><div className="finance-value" style={{ color: financeTokens.chart.actual }}>{formatKES(totals.actual)}</div><div className="text-[10px] text-slate-500 font-mono">{(totals.revised ? (totals.actual / totals.revised) * 100 : 0).toFixed(0)}% used</div></div>
          <div className="finance-kpi"><div className="finance-label">Forecast</div><div className="finance-value" style={{ color: financeTokens.chart.forecast }}>{formatKES(totals.forecast)}</div><div className="text-[10px] text-slate-500 font-mono">projection</div></div>
          <div className="finance-kpi"><div className="finance-label">Remaining</div><div className="finance-value" style={{ color: financeTokens.chart.remaining }}>{formatKES(totals.remaining)}</div><div className="text-[10px] text-slate-500 font-mono">uncommitted</div></div>
          <div className="finance-kpi"><div className="finance-label">Variance</div><div className="finance-value" style={{ color: totals.variance >= 0 ? financeTokens.colors.positive : financeTokens.colors.negative }}>{formatFullKES(totals.variance)}</div><div className="text-[10px] text-slate-500 font-mono">over / under</div></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Variance diverging bars */}
          <Panel
            title="Budget Variance (Diverging)"
            subtitle="Left: under budget • Right: over budget"
            className="xl:col-span-2"
            accent={financeTokens.colors.positive}
          >
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-2">
                <span>Under Budget ←</span><span>→ Over Budget</span>
              </div>
              {filtered.map((b) => {
                const isOver = b.variance > 0;
                const width = (Math.abs(b.variance) / maxAbs) * 50;
                const color = b.variance >= 0 ? financeTokens.colors.positive : financeTokens.colors.negative;
                return (
                  <button
                    key={b.budgetId}
                    onMouseEnter={(e) => show(e, <span><b>{b.name}</b> — {b.variance >= 0 ? 'Over' : 'Under'} by {formatFullKES(Math.abs(b.variance))}</span>)}
                    onMouseLeave={hide}
                    className="w-full text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-300 truncate max-w-[55%]">{b.name}</span>
                      <span className={b.variance >= 0 ? 'text-rose-400' : 'text-emerald-400'}>{formatPct(b.variancePct)}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded mt-1 overflow-hidden flex">
                      <div className="h-full" style={{ width: `${isOver ? 50 - width : 50}%`, backgroundColor: 'transparent' }} />
                      <div className="h-full rounded" style={{ width: `${width}%`, backgroundColor: color }} />
                      <div className="h-full flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }} />
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && <div className="text-[11px] text-slate-500 font-mono">No budgets match the current filters.</div>}
            </div>
          </Panel>

          {/* Allocation flow + utilization */}
          <div className="space-y-4">
            <Panel title="Budget Flow" accent={financeTokens.chart.committed}>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500">Revised budget</span><span className="text-slate-200">{formatKES(totals.revised)}</span></div>
                <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500">→ Committed</span><span className="text-slate-300">{formatKES(totals.committed)}</span></div>
                <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500">→ Invoiced / Actual</span><span className="text-slate-300">{formatKES(totals.actual)}</span></div>
                <div className="flex justify-between text-[10px] font-mono"><span className="text-slate-500">→ Paid</span><span className="text-emerald-400">{formatKES(totals.paid)}</span></div>
                <div className="border-t border-white/[0.05] my-2" />
                <div className="space-y-2">
                  <UtilizationBar pct={totals.revised ? (totals.committed / totals.revised) * 100 : 0} label="Encumbrance" value={`${(totals.revised ? (totals.committed / totals.revised) * 100 : 0).toFixed(0)}%`} color={financeTokens.chart.committed} />
                  <UtilizationBar pct={totals.revised ? (totals.actual / totals.revised) * 100 : 0} label="Burn rate" value={`${(totals.revised ? (totals.actual / totals.revised) * 100 : 0).toFixed(0)}%`} color={financeTokens.chart.actual} />
                  <UtilizationBar pct={totals.revised ? ((totals.revised - totals.committed) / totals.revised) * 100 : 0} label="Headroom" value={`${(totals.revised ? ((totals.revised - totals.committed) / totals.revised) * 100 : 0).toFixed(0)}%`} color={financeTokens.chart.remaining} />
                </div>
              </div>
            </Panel>
            <Panel title="Status Legend">
              <div className="flex flex-wrap gap-2">
                <StatusChip label="Active" color="#00D9FF" />
                <StatusChip label="Frozen" color="#8B5CF6" />
                <StatusChip label="Closed" color="#64748B" />
                <StatusChip label="Draft" color="#64748B" />
              </div>
            </Panel>
          </div>
        </div>

        {/* Budget table */}
        <Panel title="Budget Register" subtitle="Drill into each budget line" accent={financeTokens.colors.primary}>
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-[#64748B] border-b border-white/5">
                  <th className="text-left py-2 px-2">Budget</th>
                  <th className="text-right py-2 px-2">Class</th>
                  <th className="text-right py-2 px-2">Approved</th>
                  <th className="text-right py-2 px-2">Revised</th>
                  <th className="text-right py-2 px-2">Committed</th>
                  <th className="text-right py-2 px-2">Actual</th>
                  <th className="text-right py-2 px-2">Remaining</th>
                  <th className="text-right py-2 px-2">Variance %</th>
                  <th className="text-right py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.budgetId} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="py-2 px-2">
                      <div className="text-slate-200">{b.name}</div>
                      <div className="text-[9px] text-slate-500">{b.budgetCode} • {b.department}</div>
                    </td>
                    <td className="text-right py-2 px-2"><StatusChip label={b.accountType} color={b.accountType === 'CAPEX' ? financeTokens.chart.capex : financeTokens.chart.opex} /></td>
                    <td className="text-right py-2 px-2 text-slate-400">{formatKES(b.approvedAmount)}</td>
                    <td className="text-right py-2 px-2 text-slate-300">{formatKES(b.revisedAmount)}</td>
                    <td className="text-right py-2 px-2 text-amber-400">{formatKES(b.committedAmount)}</td>
                    <td className="text-right py-2 px-2 text-purple-400">{formatKES(b.actualAmount)}</td>
                    <td className="text-right py-2 px-2 text-slate-400">{formatKES(b.remainingAmount)}</td>
                    <td className={`text-right py-2 px-2 ${b.variance >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>{formatPct(b.variancePct)}</td>
                    <td className="text-right py-2 px-2"><StatusChip label={b.status} color={b.status === 'ACTIVE' ? '#10B981' : '#64748B'} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="py-6 text-center text-slate-500">No budgets match filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
      {tooltip}
    </div>
  );
}
