// ============================================================================
// SALIENCE ATLAS AI FEDERATION V2 — MODEL REGISTRY
// Central registry of all models with capabilities, pricing, and metadata
// ============================================================================

import {
  ModelIdentity,
  ModelCapabilities,
  ProviderCategory,
  DeploymentMode,
  DataClassification,
  ModelEvaluation,
} from '../federation/types';
import { FederatedModelProvider } from '../providers/FederatedModelProvider';

export interface RegisteredModel {
  identity: ModelIdentity;
  capabilities: ModelCapabilities;
  provider: FederatedModelProvider;
  evaluations: ModelEvaluation[];
  registeredAt: string;
}

export class ModelRegistry {
  private static instance: ModelRegistry;
  private models: Map<string, RegisteredModel> = new Map();

  private constructor() {
    this.registerBuiltinModels();
  }

  public static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  /**
   * Register a new model
   */
  register(
    identity: ModelIdentity,
    capabilities: ModelCapabilities,
    provider: FederatedModelProvider
  ): void {
    const key = `${identity.providerId}:${identity.id}`;
    this.models.set(key, {
      identity,
      capabilities,
      provider,
      evaluations: [],
      registeredAt: new Date().toISOString(),
    });
    console.log(`[MODEL-REGISTRY] Registered model: ${identity.id} (${identity.providerId})`);
  }

  /**
   * Get a model by ID
   */
  getModel(modelId: string): RegisteredModel | undefined {
    // Try exact match first
    if (this.models.has(modelId)) return this.models.get(modelId);

    // Try provider:model format
    for (const [key, model] of this.models) {
      if (key.endsWith(`:${modelId}`)) return model;
    }

    return undefined;
  }

  /**
   * Get a provider by ID
   */
  getProvider(providerId: string): FederatedModelProvider | undefined {
    for (const model of this.models.values()) {
      if (model.identity.providerId === providerId) {
        return model.provider;
      }
    }
    return undefined;
  }

  /**
   * Get all models
   */
  getAllModels(): ModelIdentity[] {
    return Array.from(this.models.values()).map(m => m.identity);
  }

  /**
   * Get all registered models with full capabilities/provider metadata
   */
  getAllRegisteredModels(): RegisteredModel[] {
    return Array.from(this.models.values());
  }

  /**
   * Get evaluations for a model
   */
  getEvaluations(modelId: string): ModelEvaluation[] {
    const model = this.getModel(modelId);
    return model?.evaluations || [];
  }

  /**
   * Record an evaluation
   */
  recordEvaluation(modelId: string, evaluation: ModelEvaluation): void {
    const model = this.getModel(modelId);
    if (model) {
      model.evaluations.push(evaluation);
      // Keep last 100 evaluations
      if (model.evaluations.length > 100) {
        model.evaluations = model.evaluations.slice(-100);
      }
    }
  }

  /**
   * Register built-in models for the federation
   */
  private registerBuiltinModels(): void {
    // This is called during initialization; actual providers are registered externally
    console.log('[MODEL-REGISTRY] Initialized with built-in model definitions');
  }
}
