import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import FinancePageHeader from '../components/FinancePageHeader';
import { useFinanceDataContext } from '../components/FinanceDataContext';
import {
  Panel, DataStateBadge, StatusChip, formatFullKES, formatKES, formatPct,
  useTooltip, FinanceSelect,
} from '../components/primitives';
import { financeTokens } from '../tokens';

export default function Payments() {
  const data = useFinanceDataContext();
  const { show, hide, tooltip } = useTooltip();
  const [method, setMethod] = useState('all');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    return data.invoices.filter((inv) => {
      if (status !== 'all' && inv.status !== status) return false;
      const pay = data.payments.find((p) => p.invoiceId === inv.invoiceId);
      if (method !== 'all' && pay && pay.method !== method) return false;
      return true;
    });
  }, [data.invoices, data.payments, method, status]);

  const lifecycle = [
    { label: 'RECEIVED', count: data.invoices.filter((i) => i.status === 'RECEIVED').length, color: financeTokens.chart.budget },
    { label: 'VALIDATED', count: data.invoices.filter((i) => i.status === 'VALIDATED').length, color: financeTokens.chart.forecast },
    { label: 'APPROVED', count: data.invoices.filter((i) => i.status === 'APPROVED').length, color: financeTokens.chart.committed },
    { label: 'SCHEDULED', count: data.payments.filter((p) => p.status === 'SCHEDULED').length, color: financeTokens.chart.actual },
    { label: 'PAID', count: data.payments.filter((p) => p.status === 'COMPLETED').length, color: financeTokens.chart.paid },
  ];

  const totalPaymentsValue = data.payments.reduce((s, p) => s + p.amount, 0);
  const totalInvoicesValue = data.invoices.reduce((s, i) => s + i.amount, 0);
  const totalDue = data.invoices.filter((i) => i.status === 'APPROVED' || i.status === 'VALIDATED').reduce((s, i) => s + i.amount, 0);
  const overdue = data.invoices.filter((i) => {
    if (i.status === 'PAID') return false;
    if (i.status === 'RECEIVED') return false;
    return new Date(i.dueDate) < new Date();
  });

  const maxCount = Math.max(...lifecycle.map((l) => l.count), 1);

  return (
    <div className="flex flex-col min-h-full">
      <FinancePageHeader
        title="Payables & Payments"
        subtitle="Invoice-to-payment lifecycle, aging and settlement intelligence"
        right={<DataStateBadge state={data.state} />}
      />

      <div className="p-5 space-y-5">
        {/* Lifecycle visualization */}
        <Panel title="Payment Lifecycle" subtitle="Invoice → Validated → Approved → Scheduled → Paid" accent={financeTokens.chart.paid}>
          <div className="flex items-end gap-2 flex-wrap">
            {lifecycle.map((l, i) => (
              <React.Fragment key={l.label}>
                {i > 0 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="text-slate-600 font-mono text-lg pb-8">→</motion.span>}
                <div className="flex-1 min-w-[70px] text-center">
                  <div className="flex items-end justify-center gap-0.5 h-28">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(l.count / maxCount) * 100}%` }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="w-6 rounded-t"
                      style={{ backgroundColor: l.color, opacity: 0.85, minHeight: 4 }}
                    />
                  </div>
                  <div className="mt-1 text-[10px] font-mono font-bold" style={{ color: l.color }}>{l.label}</div>
                  <div className="text-[11px] font-mono text-slate-300">{l.count}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="text-[10px] font-mono text-slate-500 mt-2">Animation conveys lifecycle transitions only — counts are backend-derived.</p>
        </Panel>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="finance-kpi"><div className="finance-label">Invoice Value</div><div className="finance-value" style={{ color: financeTokens.chart.actual }}>{formatKES(totalInvoicesValue)}</div><div className="text-[10px] text-slate-500 font-mono">{data.invoices.length} invoices</div></div>
          <div className="finance-kpi"><div className="finance-label">Paid Value</div><div className="finance-value" style={{ color: financeTokens.chart.paid }}>{formatKES(totalPaymentsValue)}</div><div className="text-[10px] text-slate-500 font-mono">{data.payments.length} payments</div></div>
          <div className="finance-kpi"><div className="finance-label">Pending Approval</div><div className="finance-value" style={{ color: financeTokens.chart.committed }}>{formatKES(totalDue)}</div><div className="text-[10px] text-slate-500 font-mono">validated + approved</div></div>
          <div className="finance-kpi"><div className="finance-label">Overdue</div><div className="finance-value" style={{ color: overdue.length ? financeTokens.colors.negative : financeTokens.colors.positive }}>{overdue.length}</div><div className="text-[10px] text-slate-500 font-mono">past due date</div></div>
        </div>

        {/* Invoices table */}
        <Panel
          title="Invoice Register"
          subtitle="Filter by lifecycle status and payment method"
          accent={financeTokens.colors.primary}
          right={
            <div className="flex items-center gap-2">
              <FinanceSelect
                value={status}
                onChange={setStatus}
                options={[
                  { value: 'all', label: 'ALL STATUS' },
                  { value: 'RECEIVED', label: 'RECEIVED' },
                  { value: 'VALIDATED', label: 'VALIDATED' },
                  { value: 'APPROVED', label: 'APPROVED' },
                  { value: 'PAID', label: 'PAID' },
                ]}
                label="Status"
              />
              <FinanceSelect
                value={method}
                onChange={setMethod}
                options={[
                  { value: 'all', label: 'ALL' },
                  { value: 'BANK_TRANSFER', label: 'BANK' },
                  { value: 'RTGS', label: 'RTGS' },
                ]}
                label="Method"
              />
            </div>
          }
        >
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-[#64748B] border-b border-white/5">
                  <th className="text-left py-2 px-2">Invoice</th>
                  <th className="text-left py-2 px-2">Supplier</th>
                  <th className="text-right py-2 px-2">Amount</th>
                  <th className="text-right py-2 px-2">Due</th>
                  <th className="text-right py-2 px-2">Method</th>
                  <th className="text-right py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const pay = data.payments.find((p) => p.invoiceId === inv.invoiceId);
                  const isOverdue = inv.status !== 'PAID' && new Date(inv.dueDate) < new Date();
                  return (
                    <tr
                      key={inv.invoiceId}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer"
                      onMouseEnter={(e) => show(e, <span><b>{inv.invoiceNumber}</b> — {formatFullKES(inv.totalAmount)}</span>)}
                      onMouseLeave={hide}
                    >
                      <td className="py-2 px-2 text-cyan-300">{inv.invoiceNumber}</td>
                      <td className="py-2 px-2 text-slate-200">{inv.supplierName}</td>
                      <td className="text-right py-2 px-2 text-slate-300">{formatKES(inv.totalAmount)}</td>
                      <td className={`text-right py-2 px-2 ${isOverdue ? 'text-rose-400' : 'text-slate-400'}`}>{new Date(inv.dueDate).toLocaleDateString('en-KE')}{isOverdue ? ' ⚠' : ''}</td>
                      <td className="text-right py-2 px-2 text-slate-400">{pay?.method?.replace('_', ' ') ?? '—'}</td>
                      <td className="text-right py-2 px-2">
                        <StatusChip label={inv.status} color={inv.status === 'PAID' ? '#10B981' : inv.status === 'REJECTED' ? '#F43F5E' : '#F59E0B'} />
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-slate-500">No invoices match filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
      {tooltip}
    </div>
  );
}
