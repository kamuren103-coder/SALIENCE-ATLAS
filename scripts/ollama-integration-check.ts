// ============================================================================
// SALIENCE ATLAS — REAL OLLAMA INTEGRATION VALIDATION
// Exercises the actual local Ollama runtime through the AIFederationService.
// This is a REAL integration test — no mocks.
// ============================================================================

import { AIFederationService } from '../backend/ai-federation/AIFederationService';
import { OllamaClient } from '../backend/ai-federation/providers/ollama/OllamaClient';

async function main() {
  console.log('=== SALIENCE ATLAS — REAL OLLAMA INTEGRATION VALIDATION ===\n');

  const service = AIFederationService.getInstance();

  // 1. Client-level health
  console.log('--- [1] OLLAMA CLIENT HEALTH ---');
  const client = new OllamaClient();
  const health = await client.health();
  console.log(`  reachable: ${health.reachable}`);
  console.log(`  models: ${health.modelCount} -> ${JSON.stringify(health.modelNames)}`);
  console.log(`  latency: ${health.latencyMs}ms`);
  if (!health.reachable) {
    console.error('  FATAL: Ollama runtime not reachable.');
    process.exit(1);
  }

  // 2. Dynamic model discovery
  console.log('\n--- [2] MODEL DISCOVERY (/api/tags) ---');
  const models = await service.getProvider().listModels();
  for (const m of models) {
    console.log(`  - name=${m.name} family=${m.family} paramSize=${m.parameterSize} quant=${m.quantizationLevel} ctx=${m.contextLength}`);
  }

  // 3. Model registry sync
  console.log('\n--- [3] MODEL REGISTRY SYNC ---');
  const reg = await service.syncModelRegistry();
  console.log(`  registered: ${reg.count} models`);
  const qwen = service.getQwenModels();
  console.log(`  qwen models: ${qwen.map(m => m.name).join(', ') || 'NONE'}`);

  // 4. Provider status
  console.log('\n--- [4] PROVIDER STATUS ---');
  const status = await service.getProviderStatus();
  console.log(`  status: ${status.status}`);
  console.log(`  modelCount: ${status.modelCount}`);
  console.log(`  latency: ${status.latencyMs}ms`);
  console.log(`  reachable: ${status.reachable}`);

  // 5. Real inference
  console.log('\n--- [5] REAL INFERENCE (Qwen via AIFederationService) ---');
  const chat = await service.execute({
    message: 'Describe in two sentences what an enterprise AI federation is.',
    system: 'You are a concise enterprise AI assistant.',
    maxTokens: 120,
  });
  console.log(`  success: ${chat.success}`);
  console.log(`  provider: ${chat.provider}`);
  console.log(`  model: ${chat.model}`);
  console.log(`  latency: ${chat.latencyMs}ms`);
  console.log(`  usage: ${JSON.stringify(chat.usage)}`);
  console.log(`  queue: ${JSON.stringify(chat.queue)}`);
  if (chat.success) {
    console.log(`  response: "${chat.response}"`);
  } else {
    console.log(`  error: ${chat.error}`);
  }

  // 6. Direct provider capability test (FederatedModelProvider contract)
  console.log('\n--- [6] FEDERATED PROVIDER CONTRACT (infer) ---');
  const provider = service.getProvider();
  const resp = await provider.infer({
    messages: [{ role: 'user', content: 'Say OK in one word.' }],
    temperature: 0.2,
    maxTokens: 32,
    metadata: {
      requestId: `it_req_${Date.now()}`,
      agentDepth: 0,
      tenantId: 'ketraco',
      module: 'validation',
      dataClassification: 'INTERNAL',
      requiredCapabilities: [],
      auditRequired: true,
      citationRequired: false,
      timestamp: new Date().toISOString(),
    },
  });
  console.log(`  model: ${resp.model} | provider: ${resp.provider}`);
  console.log(`  tokens: prompt=${resp.usage.promptTokens} completion=${resp.usage.completionTokens}`);
  console.log(`  text: "${resp.text}"`);

  console.log('\n=== VALIDATION COMPLETE ===');
}

main().catch(err => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
