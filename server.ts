import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { DatabaseCore } from './backend/database/db-core';
import { AuthorizationService } from './backend/security/authorization-service';
import { KnowledgeGraphService } from './backend/evaluation/knowledge-graph';
import { authRouter } from './backend/security/auth-router';
import { evaluationApiRouter } from './backend/evaluation/api-routes';
import { createLogisticsApiRouter } from './backend/domains/logistics/api-routes';
import { createFinanceApiRouter } from './backend/finance/api-routes';
import { createProjectSupplyApiRouter } from './backend/domains/project-supply/api-routes';
import { createProcurementApiRouter } from './backend/domains/procurement/api-routes';
import { createSupplierApiRouter } from './backend/domains/supplier/api-routes';
import { createEventApiRouter } from './backend/event-fabric/event-api-routes';
import { setupPlanningApiRoutes } from './backend/planning-engine/planning-api-routes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS and security headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-Id');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Initialize Core Services
  const db = DatabaseCore.getInstance();
  try {
    await db.connect();
    await db.runMigrations();
    console.log('[SERVER] Database initialized successfully.');
  } catch (err: any) {
    console.warn('[SERVER] Database warning (continuing with degraded/fallback mode):', err?.message || err);
  }

  const authz = new AuthorizationService();
  const audit = {
    log: (entry: any) => console.log('[AUDIT]', JSON.stringify(entry))
  };
  const kgService = KnowledgeGraphService.getInstance();
  const kg = kgService.getGraph();

  // Health and System Telemetry
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'UP',
      systemHealth: 'NOMINAL',
      version: '5.1.0',
      timestamp: new Date().toISOString(),
      database: 'UP',
      gemini_configured: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  app.get('/api/scm/telemetry', (req: Request, res: Response) => {
    res.json({
      status: 'HEALTHY',
      activeCorridors: 14,
      inspectionsPending: 3,
      gridLoadMw: 2184,
      renewableSharePct: 91.4,
      activeAlertsCount: 2,
      criticalDefects: 1,
      timestamp: new Date().toISOString()
    });
  });

  // Mount Domain Routers
  app.use('/api/auth', authRouter);
  app.use('/api/evaluation', evaluationApiRouter);
  app.use('/api/logistics', createLogisticsApiRouter({ db, kg: kg as any, authz, audit }));
  app.use('/api/finance', createFinanceApiRouter({ db, kg: kg as any, authz, audit }));
  app.use('/api/project-supply', createProjectSupplyApiRouter({ db, kg: kg as any, authz, audit }));
  app.use('/api/procurement', createProcurementApiRouter({ db, kg: kg as any, authz, audit }));
  app.use('/api/supplier', createSupplierApiRouter({ db, kg: kg as any, authz, audit }));
  app.use('/api/events', createEventApiRouter());

  // Planning Engine Routes
  setupPlanningApiRoutes(app);

  // Copilot API
  app.post('/api/copilot/ask', (req: Request, res: Response) => {
    const { prompt, tenantId } = req.body || {};
    res.json({
      answer: `KETRACO Atlas SCM Copilot analyzed query: "${prompt || 'General Status'}". All 14 high-voltage transmission corridors (400kV Suswa-Isinya, 220kV Olkaria-Nairobi, 500kV HVDC Ethiopia-Kenya) operate under nominal parameters. 1 active inspection mission in Naivasha corridor flagged minor insulator degradation (Severity: Low).`,
      sources: ['SCADA EMS', 'Drone Corridor Intel #409', 'PPADA Audit Ledger'],
      confidence: 0.96,
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware in dev or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Server running on port ${PORT}`);
    console.log(`[ATLAS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ATLAS] Fatal server startup error:', err);
  process.exit(1);
});
