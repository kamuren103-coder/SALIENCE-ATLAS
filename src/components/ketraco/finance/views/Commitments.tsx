import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import FinancePageHeader from '../components/FinancePageHeader';
import { useFinanceDataContext } from '../components/FinanceDataContext';
import {
  Panel, DataStateBadge, StatusChip, formatFullKES, formatKES, formatPct,
  useTooltip, FinanceSelect, UtilizationBar,
} from '../components/primitives';
import { financeTokens } from '../tokens';
import type { FinanceCommitment } from '../types';

export default function Commitments() {
  const data = useFinanceDataContext();
  const { show, hide, tooltip } = useTooltip();
  const [risk, setRisk] = useState('all');

  const totalBudget = data.budgets.reduce((s, b) => s + b.revisedAmount, 0);
  const totalCommitted = data.commitments.reduce((s, c) => s + c.amount, 0);
  const totalInvoiced = data.commitments.reduce((s, c) => s + c.invoicedAmount, 0);
  const totalPaid = data.commitments.reduce((s, c) => s + c.paidAmount, 0);
  const totalRemaining = data.commitments.reduce((s, c) => s + c.remainingAmount, 0);

  const filtered = useMemo(() => {
    return data.commitments.filter((c) => risk === 'all' || c.riskLevel === risk);
  }, [data.commitments, risk]);

  const stages = [
    { label: 'BUDGET', value: totalBudget, color: financeTokens.chart.budget, desc: 'Available approved funds' },
    { label: 'COMMITTED', value: totalCommitted, color: financeTokens.chart.committed, desc: 'Purchase orders & contracts' },
    { label: 'INVOICED', value: totalInvoiced, color: financeTokens.chart.actual, desc: 'Invoices received against PO' },
    { label: 'PAID', value: totalPaid, color: financeTokens.chart.paid, desc: 'Payments settled' },
  ];

  const displayCount = Math.min(data.budgets.length, data.commitments.length, 4);

  const pipelinePct = (i: number) => {
    const denom = stages[i].value || totalCommitted || 1;
    const num = i === 0 ? totalCommitted : stages[i].value;
    return (num / denom) * 100;
  };

  const highRiskCount = data.commitments.filter((c) => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL').length;

  return (
    <div className="flex flex-col min-h-full">
      <FinancePageHeader
        title="Commitment Monitor"
        subtitle="Budget to committed, invoiced and paid — with exposure tracking"
        right={<DataStateBadge state={data.state} />}
      />

      <div className="p-5 space-y-5">
        {/* Pipeline flow */}
        <Panel title="Commitment Pipeline" subtitle="Budget → Committed → Invoiced → Paid" accent={financeTokens.chart.committed}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stages.map((s, i) => (
              <div key={s.label} className="rounded border border-white/[0.05] bg-[#0B1220] p-3">
                <div className="flex items-center gap-2">
                  <span className="finance-label" style={{ color: s.color }}>{s.label}</span>
                  {i > 0 && <span className="text-[9px] font-mono text-slate-600">{pipelinePct(i).toFixed(0)}% retained</span>}
                </div>
                <div className="mt-1 text-lg font-display font-semibold text-slate-100">{formatFullKES(s.value)}</div>
                <div className="text-[9px] font-mono text-slate-500">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            {stages.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <span className="text-slate-600 font-mono text-sm">→</span>}
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(i / 3, 1) * 100}%` }}
                    transition={{ duration: 0.6 }}
                    style={{ backgroundColor: s.color, opacity: 0.7 }}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        </Panel>

        {/* Risk exposure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Panel title="Total Exposure" accent={financeTokens.chart.committed}>
            <div className="finance-value" style={{ color: financeTokens.chart.committed }}>{formatFullKES(totalCommitted)}</div>
            <div className="text-[10px] font-mono text-slate-500">Committed against budget of {formatKES(totalBudget)}</div>
            <div className="mt-2"><UtilizationBar pct={totalBudget ? (totalCommitted / totalBudget) * 100 : 0} label="Encumbrance ratio" value={formatPct(totalBudget ? (totalCommitted / totalBudget) * 100 : 0, false)} color={financeTokens.chart.committed} /></div>
          </Panel>
          <Panel title="Remaining on Commitments" accent={financeTokens.chart.remaining}>
            <div className="finance-value" style={{ color: financeTokens.chart.remaining }}>{formatFullKES(totalRemaining)}</div>
            <div className="text-[10px] font-mono text-slate-500">Unfulfilled commitment balance</div>
          </Panel>
          <Panel title="High / Critical Risk" accent={financeTokens.colors.negative}>
            <div className="finance-value" style={{ color: highRiskCount ? financeTokens.colors.negative : financeTokens.colors.positive }}>{highRiskCount}</div>
            <div className="text-[10px] font-mono text-slate-500">commitments flagged by backend risk model</div>
          </Panel>
        </div>

        {/* Commitments table */}
        <Panel
          title="Commitment Register"
          subtitle="Exposure sourced from backend — no synthetic risk scores"
          accent={financeTokens.colors.primary}
          right={
            <FinanceSelect
              value={risk}
              onChange={setRisk}
              options={[
                { value: 'all', label: 'ALL' },
                { value: 'LOW', label: 'LOW' },
                { value: 'MEDIUM', label: 'MEDIUM' },
                { value: 'HIGH', label: 'HIGH' },
                { value: 'CRITICAL', label: 'CRITICAL' },
              ]}
              label="Risk"
            />
          }
        >
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-[#64748B] border-b border-white/5">
                  <th className="text-left py-2 px-2">Reference</th>
                  <th className="text-left py-2 px-2">Description / Supplier</th>
                  <th className="text-right py-2 px-2">Amount</th>
                  <th className="text-right py-2 px-2">Invoiced</th>
                  <th className="text-right py-2 px-2">Paid</th>
                  <th className="text-right py-2 px-2">Remaining</th>
                  <th className="text-right py-2 px-2">Status</th>
                  <th className="text-right py-2 px-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.commitmentId}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer"
                    onMouseEnter={(e) => show(e, <span><b>{c.description}</b> — {formatFullKES(c.amount)}</span>)}
                    onMouseLeave={hide}
                  >
                    <td className="py-2 px-2 text-cyan-300">{c.reference}</td>
                    <td className="py-2 px-2">
                      <div className="text-slate-200">{c.description}</div>
                      <div className="text-[9px] text-slate-500">{c.supplierName}</div>
                    </td>
                    <td className="text-right py-2 px-2 text-slate-300">{formatKES(c.amount)}</td>
                    <td className="text-right py-2 px-2 text-purple-400">{formatKES(c.invoicedAmount)}</td>
                    <td className="text-right py-2 px-2 text-emerald-400">{formatKES(c.paidAmount)}</td>
                    <td className="text-right py-2 px-2 text-amber-400">{formatKES(c.remainingAmount)}</td>
                    <td className="text-right py-2 px-2"><StatusChip label={c.status} color={c.status === 'ACTIVE' ? '#00D9FF' : c.status === 'EXPIRED' ? '#F43F5E' : '#64748B'} /></td>
                    <td className="text-right py-2 px-2">
                      <StatusChip label={c.riskLevel} color={c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL' ? '#F43F5E' : c.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981'} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={8} className="py-6 text-center text-slate-500">No commitments loaded.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
      {tooltip}
    </div>
  );
}
