export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: any) => Promise<any>;
}

export class ToolRuntime {
  private static tools: Map<string, ToolDefinition> = new Map();

  static register(tool: ToolDefinition) {
    this.tools.set(tool.name, tool);
  }

  static async execute(name: string, args: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool ${name} not found in Tool Runtime`);
    
    console.log(`[TOOL-RUNTIME] Executing tool: ${name}`, args);
    try {
      const result = await tool.execute(args);
      return result;
    } catch (err: any) {
      console.error(`[TOOL-RUNTIME] Tool ${name} execution failed:`, err.message);
      throw err;
    }
  }

  static getToolDefinitions(): any[] {
    return Array.from(this.tools.values()).map(t => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }));
  }
}
