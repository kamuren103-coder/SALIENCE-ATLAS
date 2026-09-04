import { useCallback, useEffect, useMemo, useState } from 'react';
import { financeApi } from '../api/finance-api';
import type {
  FinanceSource,
  FinanceBatch,
  FinanceAccount,
  FinanceCostCentre,
  FinanceBudget,
  FinanceCommitment,
  FinanceInvoice,
  FinancePayment,
  FinanceProject,
  FinanceLineageRecord,
  DataQualityScore,
  DataState,
  FinanceMetric,
} from '../types';

export interface FinanceDataState {
  loading: boolean;
  state: DataState;
  sources: FinanceSource[];
  batches: FinanceBatch[];
  accounts: FinanceAccount[];
  costCentres: FinanceCostCentre[];
  budgets: FinanceBudget[];
  commitments: FinanceCommitment[];
  invoices: FinanceInvoice[];
  payments: FinancePayment[];
  projects: FinanceProject[];
  lineage: FinanceLineageRecord[];
  quality: DataQualityScore[];
  metrics: FinanceMetric[];
  refresh: () => Promise<void>;
}

export function useFinanceData(): FinanceDataState {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<DataState>('LOADING');
  const [sources, setSources] = useState<FinanceSource[]>([]);
  const [batches, setBatches] = useState<FinanceBatch[]>([]);
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [costCentres, setCostCentres] = useState<FinanceCostCentre[]>([]);
  const [budgets, setBudgets] = useState<FinanceBudget[]>([]);
  const [commitments, setCommitments] = useState<FinanceCommitment[]>([]);
  const [invoices, setInvoices] = useState<FinanceInvoice[]>([]);
  const [payments, setPayments] = useState<FinancePayment[]>([]);
  const [projects, setProjects] = useState<FinanceProject[]>([]);
  const [lineage, setLineage] = useState<FinanceLineageRecord[]>([]);
  const [quality, setQuality] = useState<DataQualityScore[]>([]);
  const [metrics, setMetrics] = useState<FinanceMetric[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        financeApi.getSources(),
        financeApi.getBatches(),
        financeApi.getAccounts(),
        financeApi.getCostCentres(),
        financeApi.getBudgets(),
        financeApi.getCommitments(),
        financeApi.getInvoices(),
        financeApi.getPayments(),
        financeApi.getProjects(),
        financeApi.getLineage(),
        financeApi.getQuality(),
        financeApi.getMetrics(),
      ]);

      const states = new Set<DataState>();
      const setters = [setSources, setBatches, setAccounts, setCostCentres, setBudgets, setCommitments, setInvoices, setPayments, setProjects, setLineage, setQuality, setMetrics];

      results.forEach((r, i) => {
        const setter = setters[i];
        if (r.status === 'fulfilled') {
          states.add(r.value.dataState);
          setter(r.value.items);
        } else {
          states.add('ERROR');
          setter([]);
        }
      });

      // If any endpoint is REAL, prefer showing real state for those. For fixture
      // derivation, if the majority are fixtures and none real, it's dev fixture.
      const resolved: DataState = states.has('REAL')
        ? 'REAL'
        : states.has('ERROR') && !states.has('DEVELOPMENT_FIXTURE')
          ? 'ERROR'
          : states.has('DEVELOPMENT_FIXTURE')
            ? 'DEVELOPMENT_FIXTURE'
            : states.has('PARTIAL')
              ? 'PARTIAL'
              : 'UNAVAILABLE';

      setState(resolved);
    } catch {
      setState('ERROR');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo<FinanceDataState>(
    () => ({
      loading,
      state,
      sources,
      batches,
      accounts,
      costCentres,
      budgets,
      commitments,
      invoices,
      payments,
      projects,
      lineage,
      quality,
      metrics,
      refresh: load,
    }),
    [loading, state, sources, batches, accounts, costCentres, budgets, commitments, invoices, payments, projects, lineage, quality, metrics, load],
  );

  return value;
}
