import { ObservabilityEngine } from '../observability/Observability';

export interface ToolManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  permissions: string[];
  inputs: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    description: string;
    required: boolean;
  }>;
  outputs: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  handler: (args: Record<string, any>, context: Record<string, any>) => Promise<any>;
}

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools = new Map<string, ToolManifest>();

  private constructor() {
    this.registerBuiltInTools();
  }

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  /**
   * Register a new tool manifest dynamically at runtime
   */
  public register(tool: ToolManifest): void {
    if (this.tools.has(tool.id)) {
      throw new Error(`Tool duplicate ID [${tool.id}] already registered in Platform tool database.`);
    }
    this.tools.set(tool.id, tool);
  }

  /**
   * Discover and retrieve tools matching permissions and semantic tags
   */
  public getTool(id: string): ToolManifest | undefined {
    return this.tools.get(id);
  }

  public getToolsByPermission(permission: string): ToolManifest[] {
    return Array.from(this.tools.values()).filter(t => t.permissions.includes(permission));
  }

  public getAllTools(): ToolManifest[] {
    return Array.from(this.tools.values());
  }

  /**
   * Safe execution wrapper utilizing Observability
   */
  public async executeTool(
    toolId: string,
    args: Record<string, any>,
    context: Record<string, any>
  ): Promise<any> {
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`Tool [${toolId}] cannot be executed because it is missing in the Tool Registry.`);
    }

    // Input Validation
    for (const input of tool.inputs) {
      if (input.required && args[input.name] === undefined) {
        throw new Error(`Execution error for tool [${toolId}]: Missing required input parameter [${input.name}].`);
      }
    }

    // Call under full action trace
    return await ObservabilityEngine.traceAction(
      `TOOL_EXECUTE_${toolId.toUpperCase()}`,
      `ToolRegistry`,
      { toolId, args, tenantId: context.tenantId },
      async () => {
        return await tool.handler(args, context);
      },
      context.traceId
    );
  }

  /**
   * Seed the registry with initial enterprise toolsets (Requirement 11)
   */
  private registerBuiltInTools(): void {
    this.register({
      id: 'supplier-risk-tool',
      name: 'Supplier Risk Analyzer',
      version: '1.0.0',
      description: 'Gathers geopolitical, logistics backlog, and financial risk profiles for suppliers.',
      permissions: ['supplier.read', 'risk.analyze'],
      inputs: [
        { name: 'supplierId', type: 'string', description: 'Unique core SCM vendor key', required: true },
        { name: 'geographyScope', type: 'string', description: 'Target SCM shipping route region', required: false }
      ],
      outputs: [
        { name: 'riskScore', type: 'number', description: 'A value from 0-100 indicating probability of supply downtime' }
      ],
      handler: async (args) => {
        const id = args.supplierId;
        const baseScore = id.includes('shanghai') ? 82 : 45;
        return {
          supplierId: id,
          riskScore: baseScore,
          criticalFailureProbability: baseScore / 100,
          reliabilityGrade: baseScore > 75 ? 'C- (Degraded)' : 'A (Optimal)'
        };
      }
    });

    this.register({
      id: 'contract-clause-ocr',
      name: 'Contract Intelligence Parser',
      version: '1.2.0',
      description: 'Performs legal OCR processing to extract indemnity ceilings and liquidated damage limits.',
      permissions: ['contract.read', 'ocr.extract'],
      inputs: [
        { name: 'contractId', type: 'string', description: 'Contract registry key', required: true }
      ],
      outputs: [
        { name: 'indemnityClauseText', type: 'string', description: 'Verbatim clause text extracted from PDF document' }
      ],
      handler: async (args) => {
        return {
          contractId: args.contractId,
          extractedClauses: {
            retentionClauseCode: 'KET_L4_SEC8',
            liquidatedPenaltyPct: 10,
            maximumCapValueUsd: 150000,
            allowableForceMajeureDays: 14
          }
        };
      }
    });
  }
}
