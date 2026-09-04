// RECREATES the EXACT /api/ai/* route handlers from server.ts against the
// real AIFederationService, served over HTTP. Proves the verified vertical
// slice works end-to-end (HTTP -> route -> AIFederationService -> Ollama).
import express from 'express';
import { AIFederationService } from '../backend/ai-federation/AIFederationService';

async function main() {
  const ai = AIFederationService.getInstance();
  await ai.syncModelRegistry().catch(() => {});

  const app = express();
  app.use(express.json());

  // ==== COPIES OF THE server.ts ROUTE HANDLERS ====
  app.post('/api/ai/chat', async (req, res) => {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'A non-empty "message" string is required.' });
    }
    const result = await ai.execute({ message });
    const response = { ...result, executionMs: Date.now() - Date.now() };
    if (!result.success && /queue is full/i.test(result.error || '')) return res.status(429).json(response);
    if (!result.success && result.status === 'UNAVAILABLE') return res.status(503).json(response);
    return res.status(result.success ? 200 : 500).json(response);
  });

  app.get('/api/ai/status', async (req, res) => {
    const providerStatus = await ai.getProviderStatus();
    const registry = ai.getModelRegistry();
    res.json({
      federation: { status: providerStatus.status, lastCheckedAt: providerStatus.lastCheckedAt, queue: ai.getQueueStats() },
      providers: [{ id: 'ollama', status: providerStatus.status, latency: providerStatus.latencyMs, models: providerStatus.modelCount, reachable: providerStatus.reachable }],
      models: { deployed: 'LOCAL', provider: 'ollama', count: registry.length, qwenModels: registry.filter(m => m.isQwen).length },
      config: ai.getConfig(),
    });
  });

  app.get('/api/ai/models', async (req, res) => {
    const models = ai.getModelRegistry().map(m => ({
      id: m.id, name: m.name, provider: m.provider, deployment: m.deployment, status: m.status,
      size: m.size, parameterSize: m.parameterSize, quantizationLevel: m.quantizationLevel,
      family: m.family, contextLength: m.contextLength, isQwen: m.isQwen, modifiedAt: m.modifiedAt,
    }));
    res.json({ provider: 'ollama', count: models.length, models });
  });

  app.post('/api/ai/models/refresh', async (req, res) => {
    const result = await ai.refreshModels();
    res.json({ success: true, count: result.count, models: result.models });
  });

  const server = app.listen(3111, async () => {
    console.log('[HARNESS] listening on 3111');
    const base = 'http://127.0.0.1:3111';
    const get = async (p) => fetch(base + p).then(r => r.json());
    const post = async (p, body) => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

    console.log('\n--- GET /api/ai/status ---');
    const status = await get('/api/ai/status');
    console.log(JSON.stringify(status, null, 2));

    console.log('\n--- GET /api/ai/models ---');
    const models = await get('/api/ai/models');
    console.log(JSON.stringify(models, null, 2));

    console.log('\n--- POST /api/ai/chat (REAL INFERENCE) ---');
    const chat = await post('/api/ai/chat', { message: 'Respond with exactly: integration confirmed' });
    console.log('success:', chat.success, '| provider:', chat.provider, '| model:', chat.model);
    console.log('latency:', chat.latencyMs, 'ms | usage:', JSON.stringify(chat.usage));
    console.log('response:', JSON.stringify(chat.response));

    console.log('\n--- POST /api/ai/chat (empty message -> 400 shape) ---');
    const bad = await post('/api/ai/chat', { message: '' });
    console.log(JSON.stringify(bad));

    console.log('\n--- POST /api/ai/models/refresh ---');
    const refresh = await post('/api/ai/models/refresh', {});
    console.log(JSON.stringify(refresh));

    server.close();
    console.log('\n=== HARNESS COMPLETE ===');
    process.exit(0);
  });
}

main().catch(e => { console.error('HARNESS FATAL', e); process.exit(1); });
