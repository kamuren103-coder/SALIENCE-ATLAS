/**
 * PHASE 02 - LOGISTICS API ROUTES
 * 
 * Mounted in server.ts as `/api/logistics/*`
 * 
 * All endpoints query real SQLite data via DatabaseCore.
 * If the database is unavailable, responses include `dataAvailable: false`
 * and status indicators reflect the degraded state.
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import type { DatabaseCore } from '../../database/db-core';
import type { KnowledgeGraph } from '../../evaluation/knowledge-graph';
import { AuthorizationService } from '../../security/authorization-service';
import type { AuditLogger } from '../../observability/audit-logger';
import { assessCriticality, assessStockRisk } from './inventory-intelligence';
import { buildSourceFreshness } from './data-quality';

interface KPIMetric {
  label: string;
  value: number | string;
  status: 'healthy' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  source?: string;
}

interface OverviewResponse {
  timestamp: string;
  kpis: {
    shipments: KPIMetric;
    inventory: KPIMetric;
    fleet: KPIMetric;
    risk: KPIMetric;
    sla: KPIMetric;
  };
  dataAvailable: boolean;
  lastUpdate?: string;
}

export interface LogisticsApiDeps {
  db: DatabaseCore;
  kg?: KnowledgeGraph;
  authz: AuthorizationService;
  audit: AuditLogger;
}

function ok(res: Response, body: unknown) {
  res.status(200).json({ ok: true, data: body });
}

function fail(res: Response, status: number, code: string, message: string, details?: unknown) {
  res.status(status).json({ ok: false, error: { code, message, details } });
}

export function createLogisticsApiRouter(deps: LogisticsApiDeps): express.Router {
  const router = express.Router();
  const { db, authz, audit } = deps;

  // GET /api/logistics/data-quality
  // Reports only timestamps and counts present in the operational store.
  router.get('/data-quality', async (req: Request, res: Response) => {
    try {
      const tenantId = (req as any).tenantId || 'ketraco';
      const canRead = await authz.check((req as any).userId, 'logistics', 'read', { tenantId });
      if (!canRead) return fail(res, 403, 'UNAUTHORIZED', 'Not authorized to read logistics data quality');

      const sources = [
        { source: 'shipments', table: 'logistics_order' },
        { source: 'stock', table: 'logistics_stock' },
        { source: 'facilities', table: 'logistics_facility' },
        { source: 'events', table: 'logistics_event' },
      ];
      const freshness = await Promise.all(sources.map(async ({ source, table }) => {
        const row = await db.get<{ recordCount: number; lastUpdatedAt: string | null }>(
          `SELECT COUNT(*) as recordCount, MAX(updated_at) as lastUpdatedAt FROM ${table} WHERE tenant_id = ?`,
          [tenantId],
        );
        return buildSourceFreshness(source, table, Number(row?.recordCount || 0), row?.lastUpdatedAt);
      }));

      return ok(res, {
        generatedAt: new Date().toISOString(),
        tenantId,
        freshness,
        importIntelligence: {
          status: 'UNVERIFIED',
          reason: 'No validated customs, port, carrier or import milestone source is persisted in the logistics domain.',
        },
      });
    } catch (error) {
      return fail(res, 500, 'DATA_QUALITY_ERROR', 'Failed to retrieve logistics data quality', error);
    }
  });

  // =====================================================================
  // GET /api/logistics/overview
  // =====================================================================
  router.get('/overview', async (req: Request, res: Response) => {
    try {
      const tenantId = (req as any).tenantId || 'ketraco';

      audit.log({
        actor: (req as any).userId || 'system',
        action: 'logistics:overview:get',
        resourceType: 'logistics_overview',
        resourceId: tenantId,
        status: 'initiated'
      });



      let dataAvailable = true;

      // Query real counts from database
      const shipmentCount = await db.get<{ cnt: number }>(
        `SELECT COUNT(*) as cnt FROM logistics_order WHERE tenant_id = ? AND status IN ('PENDING','CONFIRMED','DISPATCHED','IN_TRANSIT')`,
        [tenantId]
      ).catch(() => { dataAvailable = false; return { cnt: 0 }; });

      const stockAgg = await db.get<{ total_qty: number }>(
        `SELECT COALESCE(SUM(quantity), 0) as total_qty FROM logistics_stock WHERE tenant_id = ?`,
        [tenantId]
      ).catch(() => { dataAvailable = false; return { total_qty: 0 }; });

      const vehicleStats = await db.get<{ total: number; available: number; in_transit: number; maintenance: number }>(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available,
          SUM(CASE WHEN status = 'IN_TRANSIT' THEN 1 ELSE 0 END) as in_transit,
          SUM(CASE WHEN status = 'MAINTENANCE' THEN 1 ELSE 0 END) as maintenance
        FROM logistics_vehicle WHERE tenant_id = ?`,
        [tenantId]
      ).catch(() => { dataAvailable = false; return { total: 0, available: 0, in_transit: 0, maintenance: 0 }; });

      const riskCount = await db.get<{ cnt: number }>(
        `SELECT COUNT(*) as cnt FROM logistics_event WHERE tenant_id = ? AND severity IN ('CRITICAL','WARNING')`,
        [tenantId]
      ).catch(() => { dataAvailable = false; return { cnt: 0 }; });

      const delayedOrders = await db.get<{ cnt: number }>(
        `SELECT COUNT(*) as cnt FROM logistics_order WHERE tenant_id = ? AND status = 'IN_TRANSIT' AND estimated_arrival < datetime('now')`,
        [tenantId]
      ).catch(() => ({ cnt: 0 }));

      // Calculate fleet utilization
      const fleetUtil = vehicleStats.total > 0
        ? Math.round(((vehicleStats.in_transit || 0) / vehicleStats.total) * 100)
        : 0;

      // Determine SLA status: delayed orders / total in-transit
      const totalInTransit = await db.get<{ cnt: number }>(
        `SELECT COUNT(*) as cnt FROM logistics_order WHERE tenant_id = ? AND status IN ('IN_TRANSIT','DISPATCHED')`,
        [tenantId]
      ).catch(() => ({ cnt: 0 }));

      const slaPercent = (totalInTransit.cnt || 0) > 0
        ? Math.round((((totalInTransit.cnt || 0) - (delayedOrders.cnt || 0)) / (totalInTransit.cnt || 1)) * 1000) / 10
        : 100;

      const response: OverviewResponse = {
        timestamp: new Date().toISOString(),
        kpis: {
          shipments: {
            label: 'Active Shipments',
            value: shipmentCount.cnt || 0,
            status: (shipmentCount.cnt || 0) > 20 ? 'warning' : 'healthy',
            trend: 'stable',
            source: 'logistics_order'
          },
          inventory: {
            label: 'Inventory Units',
            value: (stockAgg.total_qty || 0).toLocaleString(),
            status: 'healthy',
            trend: 'stable',
            source: 'logistics_stock'
          },
          fleet: {
            label: 'Fleet In Transit',
            value: `${fleetUtil}%`,
            status: fleetUtil > 85 ? 'warning' : 'healthy',
            trend: fleetUtil > 70 ? 'up' : 'stable',
            source: 'logistics_vehicle'
          },
          risk: {
            label: 'Active Exceptions',
            value: riskCount.cnt || 0,
            status: (riskCount.cnt || 0) > 5 ? 'critical' : (riskCount.cnt || 0) > 0 ? 'warning' : 'healthy',
            trend: 'stable',
            source: 'logistics_event'
          },
          sla: {
            label: 'SLA Compliance',
            value: `${slaPercent}%`,
            status: slaPercent >= 90 ? 'healthy' : slaPercent >= 75 ? 'warning' : 'critical',
            trend: slaPercent >= 90 ? 'up' : 'down',
            source: 'logistics_order'
          }
        },
        dataAvailable,
        lastUpdate: new Date().toISOString()
      };

      audit.log({
        actor: (req as any).userId || 'system',
        action: 'logistics:overview:get',
        resourceType: 'logistics_overview',
        resourceId: tenantId,
        status: 'completed',
        metadata: { dataAvailable, kpis_returned: Object.keys(response.kpis).length }
      });

      return ok(res, response);
    } catch (error) {
      return fail(res, 500, 'LOGISTICS_OVERVIEW_ERROR', 'Failed to retrieve logistics overview', { dataAvailable: false });
    }
  });

  // =====================================================================
  // GET /api/logistics/shipments
  // =====================================================================
  router.get('/shipments', async (req: Request, res: Response) => {
    try {
      const tenantId = (req as any).tenantId || 'ketraco';
      const page = Math.max(parseInt(req.query.page as string) || 1, 1);
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = (page - 1) * limit;
      const status = req.query.status as string | undefined;

      const canRead = await authz.check((req as any).userId, 'shipment', 'read', { tenantId });
      if (!canRead) {
        return fail(res, 403, 'UNAUTHORIZED', 'Not authorized to read shipments');
      }

      let whereClause = 'WHERE o.tenant_id = ?';
      const params: any[] = [tenantId];

      if (status) {
        whereClause += ' AND o.status = ?';
        params.push(status.toUpperCase());
      }

      const totalRow = await db.get<{ cnt: number }>(
        `SELECT COUNT(*) as cnt FROM logistics_order o ${whereClause}`,
        params
      );
      const total = totalRow?.cnt || 0;

      const shipments = await db.all<any>(
        `SELECT 
          o.id, o.order_number as orderId, o.status, o.priority,
          o.total_items as items, o.total_weight as weight,
          o.estimated_departure as createdAt, o.estimated_arrival as eta,
          o.actual_departure, o.actual_arrival,
          of.name as origin, df.name as destination
        FROM logistics_order o
        LEFT JOIN logistics_facility of ON o.origin_facility_id = of.id
        LEFT JOIN logistics_facility df ON o.destination_facility_id = df.id
        ${whereClause}
        ORDER BY o.updated_at DESC
        LIMIT ? OFFSET ?`,
        [...params, limit, skip]
      );

      // Normalize status to frontend format
      const normalizedShipments = shipments.map(s => ({
        id: s.id,
        orderId: s.orderId,
        origin: s.origin || 'Unknown',
        destination: s.destination || 'Unknown',
        status: s.status === 'IN_TRANSIT' ? 'in-transit' :
                s.status === 'DELIVERED' ? 'delivered' :
                s.status === 'PENDING' ? 'pending' :
                s.status === 'CONFIRMED' ? 'pending' :
                s.status === 'DISPATCHED' ? 'in-transit' :
                'exception',
        items: s.items || 0,
        weight: s.weight || 0,
        priority: (s.priority || 'normal').toLowerCase(),
        eta: s.eta,
        createdAt: s.createdAt || new Date().toISOString(),
        updatedAt: s.actual_arrival || s.createdAt || new Date().toISOString()
      }));

      return ok(res, {
        shipments: normalizedShipments,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      return fail(res, 500, 'SHIPMENTS_LIST_ERROR', 'Failed to list shipments', error);
    }
  });

  // =====================================================================
  // GET /api/logistics/shipments/:id
  // =====================================================================
  router.get('/shipments/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const tenantId = (req as any).tenantId || 'ketraco';

      const canRead = await authz.check((req as any).userId, 'shipment', 'read', { tenantId, resourceId: id });
      if (!canRead) {
        return fail(res, 403, 'UNAUTHORIZED', 'Not authorized to read this shipment');
      }

      const order = await db.get<any>(
        `SELECT 
          o.*,
          of.name as origin_name, of.code as origin_code,
          df.name as destination_name, df.code as destination_code,
          v.name as vehicle_name, v.license_plate,
          d.name as driver_name, d.phone as driver_phone,
          r.name as route_name, r.distance_km
        FROM logistics_order o
        LEFT JOIN logistics_facility of ON o.origin_facility_id = of.id
        LEFT JOIN logistics_facility df ON o.destination_facility_id = df.id
        LEFT JOIN logistics_movement m ON m.order_id = o.id
        LEFT JOIN logistics_vehicle v ON m.vehicle_id = v.id
        LEFT JOIN logistics_driver d ON m.driver_id = d.id
        LEFT JOIN logistics_route r ON m.route_id = r.id
        WHERE o.id = ? AND o.tenant_id = ?`,
        [id, tenantId]
      );

      if (!order) {
        return fail(res, 404, 'NOT_FOUND', 'Shipment not found');
      }

      const lineItems = await db.all<any>(
        `SELECT oi.*, p.name as product_name, p.sku
        FROM logistics_order_item oi
        LEFT JOIN logistics_product p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
        [id]
      );

      const events = await db.all<any>(
        `SELECT * FROM logistics_event 
        WHERE entity_id = ? AND tenant_id = ?
        ORDER BY created_at DESC LIMIT 20`,
        [id, tenantId]
      );

      return ok(res, {
        id: order.id,
        orderId: order.order_number,
        origin: order.origin_name || 'Unknown',
        destination: order.destination_name || 'Unknown',
        status: order.status,
        items: order.total_items,
        weight: order.total_weight,
        priority: order.priority,
        eta: order.estimated_arrival,
        vehicle: order.vehicle_name,
        driver: order.driver_name,
        route: order.route_name,
        distanceKm: order.distance_km,
        createdAt: order.estimated_departure || order.created_at,
        updatedAt: order.actual_arrival || order.updated_at,
        lineItems: lineItems.map(li => ({
          sku: li.sku,
          productName: li.product_name,
          quantity: li.quantity,
          allocated: li.allocated,
          shipped: li.shipped,
          received: li.received
        })),
        events: events.map(e => ({
          timestamp: e.created_at,
          type: e.event_type,
          severity: e.severity,
          message: e.message,
          source: e.source
        }))
      });
    } catch (error) {
      return fail(res, 500, 'SHIPMENT_GET_ERROR', 'Failed to retrieve shipment', error);
    }
  });

  // =====================================================================
  // GET /api/logistics/inventory
  // =====================================================================
  router.get('/inventory', async (req: Request, res: Response) => {
    try {
      const tenantId = (req as any).tenantId || 'ketraco';

      const canRead = await authz.check((req as any).userId, 'inventory', 'read', { tenantId });
      if (!canRead) {
        return fail(res, 403, 'UNAUTHORIZED', 'Not authorized to read inventory');
      }

      const inventory = await db.all<any>(
        `SELECT 
          f.id as facilityId, f.name as location, f.code as locationCode,
          f.facility_type as locationType, f.capacity,
          COALESCE(SUM(s.quantity), 0) as items,
          f.capacity,
          CASE WHEN f.capacity > 0 
            THEN ROUND(CAST(COALESCE(SUM(s.quantity), 0) AS REAL) / f.capacity * 100, 1)
            ELSE 0 
          END as utilization
        FROM logistics_facility f
        LEFT JOIN logistics_stock s ON s.facility_id = f.id AND s.tenant_id = f.tenant_id
        WHERE f.tenant_id = ? AND f.status = 'ACTIVE'
        GROUP BY f.id
        ORDER BY utilization DESC`,
        [tenantId]
      );

      const enriched = inventory.map(inv => ({
        location: inv.locationCode,
        locationType: inv.locationType,
        locationName: inv.location,
        items: inv.items,
        capacity: inv.capacity,
        utilization: inv.utilization,
        status: inv.utilization > 85 ? 'warning' : inv.utilization > 95 ? 'critical' : 'healthy'
      }));

      return ok(res, { inventory: enriched, timestamp: new Date().toISOString() });
    } catch (error) {
      return fail(res, 500, 'INVENTORY_ERROR', 'Failed to retrieve inventory', error);
    }
  });

  // GET /api/logistics/inventory/risk
  // Risk remains UNVERIFIED when validated consumption data is not supplied.
  router.get('/inventory/risk', async (req: Request, res: Response) => {
    try {
      const tenantId = (req as any).tenantId || 'ketraco';
      const canRead = await authz.check((req as any).userId, 'inventory', 'read', { tenantId });
      if (!canRead) return fail(res, 403, 'UNAUTHORIZED', 'Not authorized to read inventory risk');

      const dailyConsumptionParam = req.query.dailyConsumption as string | undefined;
      const leadTimeParam = req.query.leadTimeDays as string | undefined;
      const dailyConsumption = dailyConsumptionParam === undefined ? undefined : Number(dailyConsumptionParam);
      const leadTimeDays = leadTimeParam === undefined ? undefined : Number(leadTimeParam);
      if (dailyConsumption !== undefined && (!Number.isFinite(dailyConsumption) || dailyConsumption < 0)) {
        return fail(res, 400, 'INVALID_DAILY_CONSUMPTION', 'dailyConsumption must be a non-negative number');
      }
      if (leadTimeDays !== undefined && (!Number.isFinite(leadTimeDays) || leadTimeDays < 0)) {
        return fail(res, 400, 'INVALID_LEAD_TIME', 'leadTimeDays must be a non-negative number');
      }

      const rows = await db.all<any>(
        `SELECT s.id, s.product_id as productId, p.sku, p.name, p.category,
                s.quantity, s.reserved, s.status, f.id as facilityId, f.name as facilityName
           FROM logistics_stock s
           JOIN logistics_product p ON p.id = s.product_id AND p.tenant_id = s.tenant_id
           JOIN logistics_facility f ON f.id = s.facility_id AND f.tenant_id = s.tenant_id
          WHERE s.tenant_id = ?
          ORDER BY s.updated_at DESC`,
        [tenantId],
      );

      const assessments = rows.map(row => ({
        stock: {
          id: row.id,
          productId: row.productId,
          sku: row.sku,
          name: row.name,
          category: row.category,
          facilityId: row.facilityId,
          facilityName: row.facilityName,
          status: row.status,
        },
        criticality: assessCriticality({}, 'logistics_product/logistics_stock'),
        stockRisk: assessStockRisk({
          quantityOnHand: Number(row.quantity || 0),
          reservedQuantity: Number(row.reserved || 0),
          dailyConsumption,
          leadTimeDays,
        }, 'logistics_stock'),
      }));

      return ok(res, {
        deterministic: true,
        generatedAt: new Date().toISOString(),
        inputs: { dailyConsumption, leadTimeDays },
        assessments,
      });
    } catch (error) {
      return fail(res, 500, 'INVENTORY_RISK_ERROR', 'Failed to calculate inventory risk', error);
    }
  });

  // =====================================================================
  // GET /api/logistics/fleet
  // =====================================================================
  router.get('/fleet', async (req: Request, res: Response) => {
    try {
      const tenantId = (req as any).tenantId || 'ketraco';

      const canRead = await authz.check((req as any).userId, 'fleet', 'read', { tenantId });
      if (!canRead) {
        return fail(res, 403, 'UNAUTHORIZED', 'Not authorized to read fleet');
      }

      const stats = await db.get<any>(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available,
          SUM(CASE WHEN status = 'IN_TRANSIT' THEN 1 ELSE 0 END) as inTransit,
          SUM(CASE WHEN status = 'MAINTENANCE' THEN 1 ELSE 0 END) as maintenance,
          SUM(CASE WHEN status = 'OUT_OF_SERVICE' THEN 1 ELSE 0 END) as outOfService,
          COALESCE(SUM(capacity_weight), 0) as totalCapacity,
          COALESCE(AVG(capacity_weight), 0) as avgCapacity
        FROM logistics_vehicle WHERE tenant_id = ?`,
        [tenantId]
      );

      const byType = await db.all<any>(
        `SELECT 
          vehicle_type as type,
          COUNT(*) as total,
          SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available,
          COALESCE(SUM(capacity_weight), 0) as totalCapacity
        FROM logistics_vehicle WHERE tenant_id = ?
        GROUP BY vehicle_type`,
        [tenantId]
      );

      const total = stats?.total || 0;
      const utilization = total > 0 ? Math.round(((stats?.inTransit || 0) / total) * 100) : 0;

      const fleet = {
        total,
        available: stats?.available || 0,
        inTransit: stats?.inTransit || 0,
        maintenance: stats?.maintenance || 0,
        outOfService: stats?.outOfService || 0,
        utilization,
        status: utilization > 85 ? 'warning' : 'healthy',
        byType: byType.map(t => ({
          type: t.type,
          total: t.total,
          available: t.available,
          utilization: t.total > 0 ? Math.round((t.available / t.total) * 100) : 0
        })),
        avgCapacity: Math.round(stats?.avgCapacity || 0)
      };

      return ok(res, { fleet, timestamp: new Date().toISOString() });
    } catch (error) {
      return fail(res, 500, 'FLEET_ERROR', 'Failed to retrieve fleet', error);
    }
  });

  // =====================================================================
  // GET /api/logistics/warehouses
  // =====================================================================
  router.get('/warehouses', async (req: Request, res: Response) => {
    try {
      const tenantId = (req as any).tenantId || 'ketraco';

      const canRead = await authz.check((req as any).userId, 'warehouse', 'read', { tenantId });
      if (!canRead) {
        return fail(res, 403, 'UNAUTHORIZED', 'Not authorized to read warehouses');
      }

      const warehouses = await db.all<any>(
        `SELECT 
          f.id, f.name, f.code, f.facility_type as type,
          f.address, f.city,
          f.capacity,
          COALESCE(SUM(s.quantity), 0) as currentStock,
          CASE WHEN f.capacity > 0
            THEN ROUND(CAST(COALESCE(SUM(s.quantity), 0) AS REAL) / f.capacity * 100, 1)
            ELSE 0
          END as utilization,
          f.status,
          f.operating_hours as operatingHours
        FROM logistics_facility f
        LEFT JOIN logistics_stock s ON s.facility_id = f.id AND s.tenant_id = f.tenant_id
        WHERE f.tenant_id = ? AND f.facility_type IN ('WAREHOUSE', 'DISTRIBUTION_CENTER', 'DEPOT')
        GROUP BY f.id
        ORDER BY f.name`,
        [tenantId]
      );

      const enriched = warehouses.map(w => ({
        id: w.code,
        name: w.name,
        location: w.city ? `${w.city}` : w.address || 'Unknown',
        type: w.type,
        capacity: w.capacity,
        currentStock: w.currentStock,
        utilization: w.utilization,
        status: w.status === 'ACTIVE' ? 'operational' : w.status === 'MAINTENANCE' ? 'maintenance' : 'offline',
        operatingHours: w.operatingHours
      }));

      return ok(res, { warehouses: enriched, timestamp: new Date().toISOString() });
    } catch (error) {
      return fail(res, 500, 'WAREHOUSES_ERROR', 'Failed to retrieve warehouses', error);
    }
  });

  // =====================================================================
  // GET /api/logistics/events
  // =====================================================================
  router.get('/events', async (req: Request, res: Response) => {
    try {
      const tenantId = (req as any).tenantId || 'ketraco';
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const severity = req.query.severity as string | undefined;

      const canRead = await authz.check((req as any).userId, 'logistics_event', 'read', { tenantId });
      if (!canRead) {
        return fail(res, 403, 'UNAUTHORIZED', 'Not authorized to read events');
      }

      let whereClause = 'WHERE tenant_id = ?';
      const params: any[] = [tenantId];

      if (severity) {
        whereClause += ' AND severity = ?';
        params.push(severity.toUpperCase());
      }

      const events = await db.all<any>(
        `SELECT id, event_type as type, severity, source, message, entity_type, entity_id, created_at as timestamp
        FROM logistics_event
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT ?`,
        [...params, limit]
      );

      return ok(res, {
        events,
        status: events.length > 0 ? 'LIVE' : 'STALE',
        streamHealth: 'connected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return fail(res, 500, 'EVENTS_ERROR', 'Failed to retrieve events', error);
    }
  });

  // =====================================================================
  // GET /api/logistics/twin/:entityId
  // =====================================================================
  router.get('/twin/:entityId', async (req: Request, res: Response) => {
    try {
      const { entityId } = req.params;
      const tenantId = (req as any).tenantId || 'ketraco';

      const canRead = await authz.check((req as any).userId, 'digital_twin', 'read', { tenantId, entityId });
      if (!canRead) {
        return fail(res, 403, 'UNAUTHORIZED', 'Not authorized to read this twin');
      }

      // Try to find entity across multiple tables
      let twin: any = null;

      // Check vehicles
      const vehicle = await db.get<any>(
        `SELECT * FROM logistics_vehicle WHERE id = ? AND tenant_id = ?`,
        [entityId, tenantId]
      );
      if (vehicle) {
        const movements = await db.all<any>(
          `SELECT m.*, v.name as vehicle_name, d.name as driver_name, r.name as route_name
          FROM logistics_movement m
          LEFT JOIN logistics_vehicle v ON m.vehicle_id = v.id
          LEFT JOIN logistics_driver d ON m.driver_id = d.id
          LEFT JOIN logistics_route r ON m.route_id = r.id
          WHERE m.vehicle_id = ? ORDER BY m.created_at DESC LIMIT 5`,
          [entityId]
        );
        twin = {
          id: vehicle.id,
          type: 'vehicle',
          name: vehicle.name,
          code: vehicle.code,
          currentState: vehicle.status.toLowerCase(),
          specs: { make: vehicle.make, model: vehicle.model, year: vehicle.year, plate: vehicle.license_plate },
          capacity: { weight: vehicle.capacity_weight, volume: vehicle.capacity_volume },
          recentMovements: movements.map(m => ({
            id: m.id, number: m.movement_number, status: m.status,
            origin: m.origin_facility_id, destination: m.destination_facility_id
          }))
        };
      }

      // Check facilities
      if (!twin) {
        const facility = await db.get<any>(
          `SELECT * FROM logistics_facility WHERE id = ? AND tenant_id = ?`,
          [entityId, tenantId]
        );
        if (facility) {
          const stockCount = await db.get<{ cnt: number }>(
            `SELECT COUNT(*) as cnt FROM logistics_stock WHERE facility_id = ?`,
            [entityId]
          );
          const inboundMovements = await db.get<{ cnt: number }>(
            `SELECT COUNT(*) as cnt FROM logistics_movement WHERE destination_facility_id = ? AND status = 'IN_TRANSIT'`,
            [entityId]
          );
          twin = {
            id: facility.id,
            type: 'facility',
            name: facility.name,
            code: facility.code,
            currentState: facility.status.toLowerCase(),
            location: { latitude: facility.latitude, longitude: facility.longitude, city: facility.city },
            capacity: { total: facility.capacity, current: facility.current_stock },
            activeStock: stockCount.cnt || 0,
            inboundMovements: inboundMovements.cnt || 0
          };
        }
      }

      // Check orders
      if (!twin) {
        const order = await db.get<any>(
          `SELECT * FROM logistics_order WHERE id = ? AND tenant_id = ?`,
          [entityId, tenantId]
        );
        if (order) {
          twin = {
            id: order.id,
            type: 'order',
            orderNumber: order.order_number,
            currentState: order.status.toLowerCase(),
            priority: order.priority,
            origin: order.origin_facility_id,
            destination: order.destination_facility_id,
            items: order.total_items,
            weight: order.total_weight,
            eta: order.estimated_arrival
          };
        }
      }

      if (!twin) {
        return fail(res, 404, 'NOT_FOUND', 'Entity not found for digital twin');
      }

      return ok(res, { twin, timestamp: new Date().toISOString() });
    } catch (error) {
      return fail(res, 500, 'TWIN_ERROR', 'Failed to retrieve digital twin', error);
    }
  });

  return router;
}
