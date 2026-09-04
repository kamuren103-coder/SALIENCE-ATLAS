import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Layers, Landmark, Coins, Radar, Activity } from 'lucide-react';
import FinancePageHeader from '../components/FinancePageHeader';
import { useFinanceDataContext } from '../components/FinanceDataContext';
import {
  Panel, KpiCard, DataStateBadge, formatKES, formatFullKES, formatPct,
  Sparkline, useTooltip, UtilizationBar, StatusChip, usePrefersReducedMotion,
} from '../components/primitives';
import { financeTokens } from '../tokens';
import type { FinanceView } from '../types';

type PositionState = 'committed' | 'actual' | 'paid' | 'remaining' | 'forecast';

const STATE_LABEL: Record<PositionState, string> = {
  committed: 'COMMITTED',
  actual: 'ACTUAL',
  paid: 'PAID',
  remaining: 'REMAINING',
  forecast: 'FORECAST',
};

export default function FinancialOverview({ onNavigate }: { onNavigate: (v: FinanceView) => void }) {
  const data = useFinanceDataContext();
  const reduced = usePrefersReducedMotion();
  const { show, hide, tooltip } = useTooltip();
  const [activeState, setActiveState] = useState<PositionState | 'total' | null>('total');

  const totals = useMemo(() => {
    const budgets = data.budgets;
    const total = budgets.reduce((s, b) => s + b.revisedAmount, 0);
    const approved = budgets.reduce((s, b) => s + b.approvedAmount, 0);
    const committed = budgets.reduce((s, b) => s + b.committedAmount, 0);
    const actual = budgets.reduce((s, b) => s + b.actualAmount, 0);
    const paid = budgets.reduce((s, b) => s + b.paidAmount, 0);
    const forecast = budgets.reduce((s, b) => s + b.forecastAmount, 0);
    const remaining = Math.max(total - committed, 0);
    const capex = budgets.filter((b) => b.accountType === 'CAPEX').reduce((s, b) => s + b.revisedAmount, 0);
    const opex = budgets.filter((b) => b.accountType === 'OPEX').reduce((s, b) => s + b.revisedAmount, 0);
    return { total, approved, committed, actual, paid, forecast, remaining, capex, opex };
  }, [data.budgets]);

  const utilization = totals.total > 0 ? (totals.actual / totals.total) * 100 : 0;

  // Derive trend sparklines from deterministic budget/commitment progression
  const budgetSeries = useMemo(() => data.budgets.map((b) => b.revisedAmount), [data.budgets]);
  const commitmentSeries = useMemo(() => data.commitments.map((c) => c.amount), [data.commitments]);
  const paymentSeries = useMemo(() => data.payments.map((p) => p.amount), [data.payments]);

  const positionSegments: { state: PositionState; value: number; color: string; label: string }[] = [
    { state: 'committed', value: totals.committed, color: financeTokens.chart.committed, label: 'Committed' },
    { state: 'actual', value: totals.actual, color: financeTokens.chart.actual, label: 'Actual' },
    { state: 'paid', value: totals.paid, color: financeTokens.chart.paid, label: 'Paid' },
    { state: 'remaining', value: totals.remaining, color: financeTokens.chart.remaining, label: 'Remaining' },
    { state: 'forecast', value: totals.forecast, color: financeTokens.chart.forecast, label: 'Forecast' },
  ];

  const stackedWidths = useMemo(() => {
    const scaleKey = Math.max(totals.total, totals.forecast, 1);
    return positionSegments.map((s) => (s.value / scaleKey) * 100);
  }, [positionSegments, totals]);

  const stateValue: Record<PositionState, number> = {
    committed: totals.committed,
    actual: totals.actual,
    paid: totals.paid,
    remaining: totals.remaining,
    forecast: totals.forecast,
  };

  const DETAIL_SECTIONS: { title: string; value: number; color: string; sub: string; onNav?: FinanceView }[] = [
    { title: 'Budget Deployment', value: totals.committed, color: financeTokens.chart.committed, sub: 'Total encumbered spend', onNav: 'commitments' },
    { title: 'Cash Disbursed', value: totals.paid, color: financeTokens.chart.paid, sub: 'Payments cleared', onNav: 'payments' },
    { title: 'CAPEX Portfolio', value: totals.capex, color: financeTokens.chart.capex, sub: 'Capital investment', onNav: 'capex-opex' },
    { title: 'OPEX Base', value: totals.opex, color: financeTokens.chart.opex, sub: 'Operational running' },
  ];

  return (
    <div className="flex flex-col min-h-full">
      <FinancePageHeader
        title="Finance Intelligence"
        subtitle="Enterprise financial position, deployment and performance across KETRACO operations"
        right={<DataStateBadge state={data.state} />}
      />

      <div className="p-5 space-y-5">
        {/* Hero intelligence layer */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3">
          <KpiCard
            label="Financial Position"
            value={formatKES(totals.total)}
            sub={formatFullKES(totals.total)}
            accent={financeTokens.colors.primary}
            icon={<Landmark className="w-4 h-4" />}
            dataState={data.state}
            onClick={() => setActiveState('total')}
          />
          <KpiCard
            label="Committed"
            value={formatKES(totals.committed)}
            sub={`${formatPct(totals.total ? (totals.committed / totals.total) * 100 : 0, false)} of budget`}
            accent={financeTokens.chart.committed}
            icon={<Layers className="w-4 h-4" />}
            trend="UP"
          />
          <KpiCard
            label="Actual Spend"
            value={formatKES(totals.actual)}
            sub={`${formatPct(utilization, false)} utilization`}
            accent={financeTokens.chart.actual}
            icon={<Activity className="w-4 h-4" />}
            trend="UP"
          />
          <KpiCard
            label="Paid"
            value={formatKES(totals.paid)}
            sub={`${formatPct(totals.total ? (totals.paid / totals.total) * 100 : 0, false)} of budget`}
            accent={financeTokens.chart.paid}
            icon={<Coins className="w-4 h-4" />}
            trend="UP"
          />
          <KpiCard
            label="Forecast"
            value={formatKES(totals.forecast)}
            sub="Full-year projection"
            accent={financeTokens.chart.forecast}
            icon={<Radar className="w-4 h-4" />}
            trend="STABLE"
          />
          <KpiCard
            label="Remaining"
            value={formatKES(totals.remaining)}
            sub="Unencumbered budget"
            accent={financeTokens.chart.remaining}
            trend="DOWN"
          />
          <KpiCard
            label="CAPEX / OPEX"
            value={`${formatPct(totals.capex, false)}`}
            sub={`C:${formatKES(totals.capex)} O:${formatKES(totals.opex)}`}
            accent={financeTokens.colors.secondary}
            trend="UP"
          />
        </div>

        {/* Financial position drill-in + stack */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Panel
            title="Financial Position Drill-Down"
            subtitle="Click a segment to isolate its exposure"
            className="xl:col-span-2"
            accent={financeTokens.colors.primary}
            right={<DataStateBadge state={data.state} />}
          >
            <div className="space-y-4">
              {/* Stacked position bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="finance-label">TOTAL BUDGET / DEPLOYMENT</span>
                  <span className="text-[11px] font-mono text-slate-300">{formatFullKES(activeState && activeState !== 'total' ? stateValue[activeState] : totals.total)}</span>
                </div>
                <div
                  className="flex h-9 w-full rounded overflow-hidden border border-white/5"
                  role="img"
                  aria-label="Financial position stacked bar showing committed, actual, paid, remaining and forecast against total budget"
                >
                  {positionSegments.map((seg, i) => (
                    <motion.button
                      key={seg.state}
                      initial={{ width: 0 }}
                      animate={{ width: `${stackedWidths[i]}%` }}
                      transition={reduced ? { duration: 0 } : { duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                      className="h-full cursor-pointer transition-opacity hover:opacity-80"
                      style={{ backgroundColor: seg.color, opacity: activeState === seg.state || activeState === 'total' || activeState === null ? 0.9 : 0.28 }}
                      onClick={() => setActiveState(activeState === seg.state ? null : seg.state)}
                      onMouseEnter={(e) => show(e, <span><b>{seg.label}</b> — {formatFullKES(seg.value)}</span>)}
                      onMouseLeave={hide}
                      title={`${seg.label}: ${formatFullKES(seg.value)}`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {positionSegments.map((seg) => (
                    <button
                      key={seg.state}
                      onClick={() => setActiveState(activeState === seg.state ? null : seg.state)}
                      className={`flex items-center gap-1.5 text-[10px] font-mono cursor-pointer ${activeState === seg.state ? 'text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: seg.color }} />
                      {seg.label}
                      <span className="text-slate-400">{formatKES(seg.value)}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => setActiveState('total')}
                    className="flex items-center gap-1.5 text-[10px] font-mono cursor-pointer text-cyan-400 font-bold"
                  >
                    RESET
                  </button>
                </div>
              </div>

              {/* Vertical state breakdown when a state is selected */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {positionSegments
                  .filter((s) => activeState === 'total' || activeState === null || s.state === activeState)
                  .map((seg) => {
                    const pctOfTotal = totals.total ? (seg.value / totals.total) * 100 : 0;
                    const pctOfCommitted = totals.committed ? (seg.value / totals.committed) * 100 : 0;
                    return (
                      <div key={seg.state} className="rounded border border-white/[0.05] bg-[#0B1220] p-3">
                        <div className="flex items-center justify-between">
                          <span className="finance-label" style={{ color: seg.color }}>{STATE_LABEL[seg.state]}</span>
                          <DataStateBadge state={data.state} compact />
                        </div>
                        <div className="mt-1.5 text-lg font-display font-semibold text-slate-100">{formatFullKES(seg.value)}</div>
                        <div className="mt-2 space-y-1.5">
                          <UtilizationBar pct={seg.state === 'remaining' ? pctOfTotal : pctOfCommitted} label={`${seg.state === 'remaining' ? 'Share of budget' : 'Share of committed'}`} value={`${formatPct(seg.state === 'remaining' ? pctOfTotal : pctOfCommitted, false)}`} color={seg.color} />
                          <UtilizationBar pct={pctOfTotal} label="Share of total budget" value={`${formatPct(pctOfTotal, false)}`} color={seg.color} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </Panel>

          {/* Detail sections */}
          <div className="space-y-4">
            {DETAIL_SECTIONS.map((s) => (
              <button
                key={s.title}
                onClick={() => s.onNav && onNavigate(s.onNav)}
                className={`finance-panel w-full text-left p-3 hover:border-white/15 transition-colors ${s.onNav ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="finance-label">{s.title}</span>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                    {s.onNav ? <ArrowUpRight className="w-3 h-3 text-cyan-400" /> : null}
                  </span>
                </div>
                <div className="mt-1 text-base font-display font-semibold text-slate-100" style={{ color: s.color }}>{formatFullKES(s.value)}</div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">{s.sub}</span>
                  <Sparkline data={budgetSeries} width={64} height={22} color={s.color} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom insight row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Panel title="Committed vs Paid Coverage" accent={financeTokens.chart.committed}>
            <div className="space-y-2.5">
              <UtilizationBar pct={totals.committed ? (totals.actual / totals.committed) * 100 : 0} label="Actual / Committed" value={formatPct(totals.committed ? (totals.actual / totals.committed) * 100 : 0, false)} color={financeTokens.chart.actual} />
              <UtilizationBar pct={totals.committed ? (totals.paid / totals.committed) * 100 : 0} label="Paid / Committed" value={formatPct(totals.committed ? (totals.paid / totals.committed) * 100 : 0, false)} color={financeTokens.chart.paid} />
              <UtilizationBar pct={totals.actual ? (totals.paid / totals.actual) * 100 : 0} label="Paid / Actual" value={formatPct(totals.actual ? (totals.paid / totals.actual) * 100 : 0, false)} color={financeTokens.chart.forecast} />
            </div>
          </Panel>
          <Panel title="Spend Velocity" accent={financeTokens.chart.forecast}>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Committed series</span>
                <StatusChip label={`${data.commitments.length} ent.`} color="#F59E0B" />
              </div>
              <Sparkline data={commitmentSeries} width={'100%'} color={financeTokens.chart.committed} />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2">
                <span>Payment series</span>
                <StatusChip label={`${data.payments.length} tx`} color="#10B981" />
              </div>
              <Sparkline data={paymentSeries} width={'100%'} color={financeTokens.chart.paid} />
            </div>
          </Panel>
          <Panel title="Portfolio Summary" accent={financeTokens.colors.secondary}>
            <div className="space-y-2 text-[11px] font-mono">
              <div className="flex justify-between"><span className="text-slate-500">Budgets</span><span className="text-slate-200">{data.budgets.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Projects</span><span className="text-slate-200">{data.projects.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Commitments</span><span className="text-slate-200">{data.commitments.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Invoices</span><span className="text-slate-200">{data.invoices.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Payments</span><span className="text-slate-200">{data.payments.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Sources</span><span className="text-slate-200">{data.sources.length}</span></div>
            </div>
          </Panel>
        </div>
      </div>
      {tooltip}
    </div>
  );
}
