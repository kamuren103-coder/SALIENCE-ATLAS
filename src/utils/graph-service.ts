import { GraphNode, GraphEdge, DigitalTwin } from '../types/evaluation';

export const fetchFullGraph = async (): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> => {
  const res = await fetch('/api/v3/graph');
  return res.json();
};

export const fetchNodeTraverse = async (id: string, depth: number = 2): Promise<{ nodes: GraphNode[]; edges: GraphEdge[] }> => {
  const res = await fetch(`/api/v3/graph/traverse/${id}?depth=${depth}`);
  return res.json();
};

export const fetchSupplierTwin = async (id: string): Promise<DigitalTwin> => {
  const res = await fetch(`/api/v3/twin/supplier/${id}`);
  if (!res.ok) throw new Error('Supplier twin not found');
  return res.json();
};

export const fetchTenderTwin = async (id: string): Promise<DigitalTwin> => {
  const res = await fetch(`/api/v3/twin/tender/${id}`);
  if (!res.ok) throw new Error('Tender twin not found');
  return res.json();
};

export const fetchOrganizationTwin = async (id: string): Promise<DigitalTwin> => {
  const res = await fetch(`/api/v3/twin/organization/${id}`);
  if (!res.ok) throw new Error('Organization twin not found');
  return res.json();
};

export const runCollusionAnalysis = async (): Promise<any[]> => {
  const res = await fetch('/api/v3/collusion/analyze');
  return res.json();
};
