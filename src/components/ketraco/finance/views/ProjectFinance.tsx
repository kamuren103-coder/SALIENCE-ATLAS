import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import FinancePageHeader from '../components/FinancePageHeader';
import { useFinanceDataContext } from '../components/FinanceDataContext';
import {
  Panel, DataStateBadge, StatusChip, formatFullKES, formatKES, formatPct,
  UtilizationBar, useTooltip,
} from '../components/primitives';
import { financeTokens } from '../tokens';

interface GraphNode {
  id: string;
  kind: string;
  label: string;
  value: number;
}

export default function ProjectFinance() {
  const data = useFinanceDataContext();
  const { show, hide, tooltip } = useTooltip();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => data.projects.find((p) => p.projectId === selectedProjectId) ?? data.projects[0] ?? null,
    [data.projects, selectedProjectId],
  );

  const totalBudget = data.projects.reduce((s, p) => s + p.totalBudget, 0);
  const totalCommitted = data.projects.reduce((s, p) => s + p.committedAmount, 0);
  const totalActual = data.projects.reduce((s, p) => s + p.actualAmount, 0);
  const totalPaid = data.projects.reduce((s, p) => s + p.paidAmount, 0);
  const totalForecast = data.projects.reduce((s, p) => s + p.forecastAmount, 0);

  // Financial lifecycle graph nodes for the selected project
  const graphNodes: GraphNode[] = useMemo(() => {
    if (!selectedProject) return [];
    const proj = selectedProject;
    const budget = data.budgets.find((b) => b.projectId === proj.projectId);
    const projectCommitments = data.commitments.filter((c) => c.projectId === proj.projectId);
    const projectInvoices = data.invoices.filter((i) => i.projectId === proj.projectId);
    const projectPayments = data.payments.filter((p) => p.projectId === proj.projectId);
    const committed = projectCommitments.reduce((s, c) => s + c.amount, 0);
    const invoiced = projectInvoices.reduce((s, i) => s + i.amount, 0);
    const paid = projectPayments.reduce((s, p) => s + p.amount, 0);

    return [
      { id: `${proj.projectId}-b`, kind: 'BUDGET', label: budget?.name ?? 'Budget', value: budget?.revisedAmount ?? proj.totalBudget },
      { id: `${proj.projectId}-c`, kind: 'COMMIT', label: `${projectCommitments.length} commitments`, value: committed },
      { id: `${proj.projectId}-i`, kind: 'INVOICE', label: `${projectInvoices.length} invoices`, value: invoiced },
      { id: `${proj.projectId}-p`, kind: 'PAYMENT', label: `${projectPayments.length} payments`, value: paid },
      { id: `${proj.projectId}-a`, kind: 'ASSET', label: 'Capitalized asset', value: paid },
    ];
  }, [selectedProject, data.budgets, data.commitments, data.invoices, data.payments]);

  const NODE_COLOR: Record<string, string> = {
    BUDGET: financeTokens.chart.budget,
    COMMIT: financeTokens.chart.committed,
    INVOICE: financeTokens.chart.actual,
    PAYMENT: financeTokens.chart.paid,
    ASSET: financeTokens.colors.secondary,
  };

  const maxNode = Math.max(...graphNodes.map((n) => n.value), 1);
  const nodeX = (i: number, count: number) => (count === 1 ? 50 : (i / (count - 1)) * 100);

  return (
    <div className="flex flex-col min-h-full">
      <FinancePageHeader
        title="Project Finance"
        subtitle="Project to budget, commitment, invoice, payment and asset intelligence"
        right={<DataStateBadge state={data.state} />}
      />

      <div className="p-5 space-y-5">
        {/* Portfolio KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="finance-kpi"><div className="finance-label">Project Budget</div><div className="finance-value" style={{ color: financeTokens.chart.budget }}>{formatKES(totalBudget)}</div><div className="text-[10px] text-slate-500 font-mono">{data.projects.length} projects</div></div>
          <div className="finance-kpi"><div className="finance-label">Committed</div><div className="finance-value" style={{ color: financeTokens.chart.committed }}>{formatKES(totalCommitted)}</div><div className="text-[10px] text-slate-500 font-mono">encumbered</div></div>
          <div className="finance-kpi"><div className="finance-label">Actual</div><div className="finance-value" style={{ color: financeTokens.chart.actual }}>{formatKES(totalActual)}</div><div className="text-[10px] text-slate-500 font-mono">spent to date</div></div>
          <div className="finance-kpi"><div className="finance-label">Paid</div><div className="finance-value" style={{ color: financeTokens.chart.paid }}>{formatKES(totalPaid)}</div><div className="text-[10px] text-slate-500 font-mono">cash out</div></div>
          <div className="finance-kpi"><div className="finance-label">Forecast</div><div className="finance-value" style={{ color: financeTokens.chart.forecast }}>{formatKES(totalForecast)}</div><div className="text-[10px] text-slate-500 font-mono">completion cost</div></div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Project selector list */}
          <Panel title="Project Portfolio" subtitle="Select a project to reveal its financial graph" accent={financeTokens.colors.primary}>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {data.projects.map((p) => {
                const active = selectedProject?.projectId === p.projectId;
                const burn = p.totalBudget ? (p.actualAmount / p.totalBudget) * 100 : 0;
                return (
                  <button
                    key={p.projectId}
                    onClick={() => setSelectedProjectId(p.projectId)}
                    className={`w-full text-left rounded border p-2.5 transition-all ${active ? 'border-cyan-400/40 bg-[rgba(0,217,255,0.06)]' : 'border-white/[0.05] bg-[#0B1220] hover:border-white/15'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-medium truncate ${active ? 'text-cyan-200' : 'text-slate-200'}`}>{p.name}</span>
                      <StatusChip label={p.status} color={p.status === 'IN_PROGRESS' ? '#00D9FF' : '#64748B'} />
                    </div>
                    <div className="text-[9px] font-mono text-slate-500 mt-0.5">{p.projectCode} • {p.capexOpex}</div>
                    <div className="mt-1.5">
                      <UtilizationBar pct={burn} label="" value={`${burn.toFixed(0)}%`} color={financeTokens.chart.actual} />
                    </div>
                  </button>
                );
              })}
              {data.projects.length === 0 && <div className="text-[11px] text-slate-500 font-mono">No projects loaded.</div>}
            </div>
          </Panel>

          {/* Selected project detail */}
          <div className="xl:col-span-2 space-y-4">
            {selectedProject && (
              <>
                <Panel title="Financial Lifecycle" subtitle={selectedProject.name} accent={financeTokens.colors.primary} right={<StatusChip label={selectedProject.status} color="#00D9FF" />}>
                  {/* Lifecycle flow graph (SVG) */}
                  <div className="w-full" style={{ height: 180 }} role="img" aria-label={`Financial lifecycle for ${selectedProject.name}: budget to commitment to invoice to payment to asset`}>
                    <svg viewBox="0 0 760 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                      {/* connector lines */}
                      {graphNodes.length > 1 && graphNodes.slice(0, -1).map((_, i) => {
                        const x1 = (nodeX(i, graphNodes.length) / 100) * 760;
                        const x2 = (nodeX(i + 1, graphNodes.length) / 100) * 760;
                        return (
                          <g key={`edge-${i}`}>
                            <line x1={x1 + 55} y1={90} x2={x2 - 55} y2={90} stroke="rgba(0,217,255,0.25)" strokeWidth={1.5} strokeDasharray="4 3" />
                            <line x1={x1 + 55} y1={90} x2={x2 - 55} y2={90} stroke="rgba(0,217,255,0.5)" strokeWidth={1.5}>
                              <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.5s" repeatCount="indefinite" />
                            </line>
                          </g>
                        );
                      })}
                      {graphNodes.map((n, i) => {
                        const cx = (nodeX(i, graphNodes.length) / 100) * 760;
                        const r = 16 + (n.value / maxNode) * 34;
                        const color = NODE_COLOR[n.kind] ?? '#00D9FF';
                        return (
                          <g key={n.id}
                            onMouseEnter={(e) => show(e as any, <span><b>{n.kind}</b> — {n.label}: {formatFullKES(n.value)}</span>)}
                            onMouseLeave={hide}
                          >
                            <circle cx={cx} cy={90} r={r + 4} fill={color} opacity={0.08} />
                            <circle cx={cx} cy={90} r={r} fill={`${color}22`} stroke={color} strokeWidth={1.5} />
                            <text x={cx} y={92} textAnchor="middle" fill="#F8FAFC" fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="bold">{n.kind[0]}</text>
                            <text x={cx} y={142} textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'JetBrains Mono',monospace">{n.label}</text>
                            <text x={cx} y={158} textAnchor="middle" fill={color} fontSize="11" fontFamily="'JetBrains Mono',monospace" fontWeight="bold">{formatKES(n.value)}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </Panel>

                {/* Health metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Panel title="Cost to Complete" accent={financeTokens.chart.committed}>
                    <div className="finance-value" style={{ color: financeTokens.chart.committed }}>{formatFullKES(selectedProject.costToComplete)}</div>
                    <div className="mt-2"><UtilizationBar pct={selectedProject.totalBudget ? ((selectedProject.totalBudget - selectedProject.costToComplete) / selectedProject.totalBudget) * 100 : 0} label="Budget consumed" value={`${(selectedProject.totalBudget ? ((selectedProject.totalBudget - selectedProject.costToComplete) / selectedProject.totalBudget) * 100 : 0).toFixed(0)}%`} color={financeTokens.chart.committed} /></div>
                  </Panel>
                  <Panel title="Forecast Completion" accent={financeTokens.chart.forecast}>
                    <div className="finance-value" style={{ color: financeTokens.chart.forecast }}>{formatFullKES(selectedProject.forecastCompletionCost)}</div>
                    <div className="mt-1 text-[10px] font-mono text-slate-500">vs budget {formatKES(selectedProject.totalBudget)}</div>
                  </Panel>
                  <Panel title="Variance" accent={selectedProject.variance >= 0 ? financeTokens.colors.negative : financeTokens.colors.positive}>
                    <div className="finance-value" style={{ color: selectedProject.variance >= 0 ? financeTokens.colors.negative : financeTokens.colors.positive }}>{formatPct(selectedProject.variancePct)}</div>
                    <div className="mt-1 text-[10px] font-mono text-slate-500">{formatFullKES(selectedProject.variance)} {selectedProject.variance >= 0 ? 'over' : 'under'} budget</div>
                  </Panel>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {tooltip}
    </div>
  );
}
