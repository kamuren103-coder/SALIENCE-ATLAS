import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import FinancePageHeader from '../components/FinancePageHeader';
import { useFinanceDataContext } from '../components/FinanceDataContext';
import {
  Panel, DataStateBadge, StatusChip, formatFullKES, formatKES, formatPct,
  useTooltip, UtilizationBar,
} from '../components/primitives';
import { financeTokens } from '../tokens';

export default function CapexOpex() {
  const data = useFinanceDataContext();
  const { show, hide, tooltip } = useTooltip();
  const [focus, setFocus] = useState<'CAPEX' | 'OPEX' | null>(null);

  const capexBudgets = useMemo(() => data.budgets.filter((b) => b.accountType === 'CAPEX'), [data.budgets]);
  const opexBudgets = useMemo(() => data.budgets.filter((b) => b.accountType === 'OPEX'), [data.budgets]);

  const capexTotal = capexBudgets.reduce((s, b) => s + b.revisedAmount, 0);
  const opexTotal = opexBudgets.reduce((s, b) => s + b.revisedAmount, 0);
  const grand = capexTotal + opexTotal || 1;

  const capexCape = capexBudgets.reduce((s, b) => s + b.actualAmount, 0);
  const opexActual = opexBudgets.reduce((s, b) => s + b.actualAmount, 0);
  const capexComm = capexBudgets.reduce((s, b) => s + b.committedAmount, 0);
  const opexComm = opexBudgets.reduce((s, b) => s + b.committedAmount, 0);
  const capexPaid = capexBudgets.reduce((s, b) => s + b.paidAmount, 0);
  const opexPaid = opexBudgets.reduce((s, b) => s + b.paidAmount, 0);

  // Radial donut for split
  const arc = (start: number, end: number, r: number, cx: number, cy: number) => {
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  const capexPct = (capexTotal / grand) * 100;
  const opexPct = (opexTotal / grand) * 100;
  const capexRad = (capexPct / 100) * Math.PI * 2;
  const opexRad = (opexPct / 100) * Math.PI * 2;
  const startAngle = -Math.PI / 2;

  const donutSize = 220;
  const rOuter = donutSize / 2 - 8;
  const rInner = rOuter * 0.62;

  const breakdown = focus === 'CAPEX' ? capexBudgets : focus === 'OPEX' ? opexBudgets : [...capexBudgets, ...opexBudgets];

  return (
    <div className="flex flex-col min-h-full">
      <FinancePageHeader
        title="CAPEX / OPEX Intelligence"
        subtitle="Capital investment versus operational expenditure — trace amounts to originating budgets"
        right={<DataStateBadge state={data.state} />}
      />

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Donut split */}
          <Panel title="CAPEX / OPEX Split" accent={financeTokens.colors.secondary}>
            <div className="flex items-center justify-center py-2">
              <div className="relative" style={{ width: donutSize, height: donutSize }}>
                <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} role="img" aria-label="CAPEX versus OPEX budget split donut chart">
                  <g>
                    <motion.path
                      d={arc(startAngle, startAngle + capexRad, rOuter, donutSize / 2, donutSize / 2)}
                      fill={financeTokens.chart.capex}
                      opacity={focus === 'OPEX' ? 0.25 : 1}
                      className="cursor-pointer"
                      onClick={() => setFocus(focus === 'CAPEX' ? null : 'CAPEX')}
                    />
                    <motion.path
                      d={arc(startAngle, startAngle + capexRad, rInner, donutSize / 2, donutSize / 2)}
                      fill="transparent"
                      stroke={financeTokens.chart.capex}
                      strokeWidth={2}
                      opacity={focus === 'OPEX' ? 0.25 : 0.7}
                    />
                    <motion.path
                      d={arc(startAngle + capexRad, startAngle + capexRad + opexRad, rOuter, donutSize / 2, donutSize / 2)}
                      fill={financeTokens.chart.opex}
                      opacity={focus === 'CAPEX' ? 0.25 : 1}
                      className="cursor-pointer"
                      onClick={() => setFocus(focus === 'OPEX' ? null : 'OPEX')}
                    />
                    <motion.path
                      d={arc(startAngle + capexRad, startAngle + capexRad + opexRad, rInner, donutSize / 2, donutSize / 2)}
                      fill="transparent"
                      stroke={financeTokens.chart.opex}
                      strokeWidth={2}
                      opacity={focus === 'CAPEX' ? 0.25 : 0.7}
                    />
                  </g>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="finance-label">Total</span>
                  <span className="text-lg font-display font-semibold text-slate-100">{formatKES(grand)}</span>
                  <span className="text-[9px] font-mono text-slate-500">per annum</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => setFocus(focus === 'CAPEX' ? null : 'CAPEX')} className="rounded border border-white/5 bg-[#0B1220] p-2 text-left cursor-pointer hover:border-cyan-400/40">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: financeTokens.chart.capex }} /><span className="finance-label" style={{ color: financeTokens.chart.capex }}>CAPEX</span></div>
                <div className="text-base font-display font-semibold text-slate-100">{formatPct(capexPct, false)}</div>
                <div className="text-[9px] font-mono text-slate-500">{formatKES(capexTotal)}</div>
              </button>
              <button onClick={() => setFocus(focus === 'OPEX' ? null : 'OPEX')} className="rounded border border-white/5 bg-[#0B1220] p-2 text-left cursor-pointer hover:border-purple-400/40">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ backgroundColor: financeTokens.chart.opex }} /><span className="finance-label" style={{ color: financeTokens.chart.opex }}>OPEX</span></div>
                <div className="text-base font-display font-semibold text-slate-100">{formatPct(opexPct, false)}</div>
                <div className="text-[9px] font-mono text-slate-500">{formatKES(opexTotal)}</div>
              </button>
            </div>
          </Panel>

          {/* Side by side detail */}
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Panel title="CAPEX Portfolio" accent={financeTokens.chart.capex} right={<StatusChip label={`${capexBudgets.length} budgets`} color={financeTokens.chart.capex} />}>
              <div className="space-y-2">
                <UtilizationBar pct={capexTotal ? (capexComm / capexTotal) * 100 : 0} label="Committed" value={formatKES(capexComm)} color={financeTokens.chart.committed} />
                <UtilizationBar pct={capexTotal ? (capexCape / capexTotal) * 100 : 0} label="Actual spend" value={formatKES(capexCape)} color={financeTokens.chart.actual} />
                <UtilizationBar pct={capexTotal ? (capexPaid / capexTotal) * 100 : 0} label="Paid" value={formatKES(capexPaid)} color={financeTokens.chart.paid} />
                <div className="text-[10px] font-mono text-slate-500 pt-1">Infrastructure • Substations • Transmission lines • Grid expansion</div>
              </div>
            </Panel>
            <Panel title="OPEX Base" accent={financeTokens.chart.opex} right={<StatusChip label={`${opexBudgets.length} budgets`} color={financeTokens.chart.opex} />}>
              <div className="space-y-2">
                <UtilizationBar pct={opexTotal ? (opexComm / opexTotal) * 100 : 0} label="Committed" value={formatKES(opexComm)} color={financeTokens.chart.committed} />
                <UtilizationBar pct={opexTotal ? (opexActual / opexTotal) * 100 : 0} label="Actual spend" value={formatKES(opexActual)} color={financeTokens.chart.actual} />
                <UtilizationBar pct={opexTotal ? (opexPaid / opexTotal) * 100 : 0} label="Paid" value={formatKES(opexPaid)} color={financeTokens.chart.paid} />
                <div className="text-[10px] font-mono text-slate-500 pt-1">Maintenance • Operations • Administration • Services</div>
              </div>
            </Panel>
          </div>
        </div>

        {/* Breakdown after split selection */}
        <Panel
          title={focus ? `${focus} Budget Breakdown` : 'Budget Breakdown (CAPEX + OPEX)'}
          subtitle={focus ? 'Click a budget to see its deployment' : 'Select CAPEX or OPEX on the left to focus'}
          accent={financeTokens.colors.primary}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {breakdown.map((b) => {
              const pctOfSegment = focus ? (b.revisedAmount / (focus === 'CAPEX' ? capexTotal : opexTotal || 1)) * 100 : (b.revisedAmount / grand) * 100;
              const color = b.accountType === 'CAPEX' ? financeTokens.chart.capex : financeTokens.chart.opex;
              return (
                <div key={b.budgetId} className="rounded border border-white/[0.05] bg-[#0B1220] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-200 truncate">{b.name}</span>
                    <StatusChip label={b.accountType} color={color} />
                  </div>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">{b.department} • {b.budgetCode}</div>
                  <div className="mt-2 text-base font-display font-semibold text-slate-100">{formatFullKES(b.revisedAmount)}</div>
                  <div className="mt-1 text-[10px] font-mono text-slate-500">{pctOfSegment.toFixed(1)}% of {focus ?? 'total'}</div>
                  <div className="mt-2 space-y-1">
                    <UtilizationBar pct={b.revisedAmount ? (b.actualAmount / b.revisedAmount) * 100 : 0} label="Actual" value={formatPct(b.revisedAmount ? (b.actualAmount / b.revisedAmount) * 100 : 0, false)} color={financeTokens.chart.actual} />
                    <UtilizationBar pct={b.revisedAmount ? (b.committedAmount / b.revisedAmount) * 100 : 0} label="Committed" value={formatPct(b.revisedAmount ? (b.committedAmount / b.revisedAmount) * 100 : 0, false)} color={financeTokens.chart.committed} />
                  </div>
                </div>
              );
            })}
            {breakdown.length === 0 && <div className="text-[11px] text-slate-500 font-mono col-span-full">No budgets loaded for this class.</div>}
          </div>
        </Panel>
      </div>
      {tooltip}
    </div>
  );
}
