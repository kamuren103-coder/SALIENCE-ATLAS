import type { AssetKind, GeoLocation, TelemetrySnapshot } from '../../packages/domain';

export type AssetResolutionMatchStatus = 'MATCHED' | 'REVIEW' | 'UNRESOLVED';

export interface AssetResolutionRequest {
  missionId: string;
  mediaId: string;
  location?: GeoLocation;
  telemetry?: Partial<TelemetrySnapshot>;
  assetHints?: Array<{ kind?: AssetKind; name?: string; location?: GeoLocation; confidence?: number }>;
  corridor?: string;
}

export interface AssetResolutionCandidate {
  assetId: string;
  assetName: string;
  kind: AssetKind;
  confidence: number;
  score: number;
  status: AssetResolutionMatchStatus;
  reasons: string[];
}

export interface AssetResolutionResult {
  missionId: string;
  mediaId: string;
  selectedAssetId?: string;
  selectedAssetName?: string;
  reviewRequired: boolean;
  candidates: AssetResolutionCandidate[];
  generatedAt: string;
}

export const ASSET_RESOLUTION_CATALOG: Array<{ id: string; name: string; kind: AssetKind; location: GeoLocation; corridor?: string; status: 'ACTIVE' | 'MONITOR'; }> = [
  { id: 'asset-tower-01', name: 'Tower 01', kind: 'TOWER', location: { latitude: -1.2850, longitude: 36.8170 }, corridor: 'Nairobi North', status: 'ACTIVE' },
  { id: 'asset-tower-02', name: 'Tower 02', kind: 'TOWER', location: { latitude: -1.2865, longitude: 36.8160 }, corridor: 'Nairobi North', status: 'ACTIVE' },
  { id: 'asset-conductor-01', name: 'Line A1 Conductor', kind: 'CONDUCTOR', location: { latitude: -1.2860, longitude: 36.8165 }, corridor: 'Nairobi North', status: 'ACTIVE' },
  { id: 'asset-insulator-01', name: 'Insulator String 3', kind: 'INSULATOR', location: { latitude: -1.2848, longitude: 36.8175 }, corridor: 'Nairobi North', status: 'MONITOR' },
  { id: 'asset-substation-01', name: 'Suswa 132kV Bay', kind: 'SUBSTATION', location: { latitude: -1.2910, longitude: 36.8200 }, corridor: 'Suswa Corridor', status: 'ACTIVE' }
];

export const assetResolutionService = {
  name: 'asset-resolution',
  phase: 'PHASE_3',
  purpose: 'Determines which physical asset an image belongs to using geospatial, telemetry, and graph evidence.'
};

export class AssetResolutionService {
  static readonly RESOLUTION_THRESHOLD = 0.72;

  static resolveAsset(request: AssetResolutionRequest): AssetResolutionResult {
    const guessLocation = request.location ?? request.telemetry?.gps ?? { latitude: -1.2855, longitude: 36.8168 };
    const candidates = ASSET_RESOLUTION_CATALOG.map((asset) => {
      const distanceKm = this.haversineKm(guessLocation, asset.location);
      const kindBoost = this.kindMatchBoost(request, asset.kind);
      const corridorBoost = request.corridor && asset.corridor === request.corridor ? 0.12 : 0;
      const score = Math.max(0, Math.min(1, 0.7 - distanceKm / 15 + kindBoost + corridorBoost));
      const confidence = Number(score.toFixed(2));
      const status: AssetResolutionMatchStatus = confidence >= this.RESOLUTION_THRESHOLD ? 'MATCHED' : confidence >= 0.5 ? 'REVIEW' : 'UNRESOLVED';

      return {
        assetId: asset.id,
        assetName: asset.name,
        kind: asset.kind,
        confidence,
        score: confidence,
        status,
        reasons: [
          `Geo-distance ${distanceKm.toFixed(2)} km from estimated capture point.`,
          `Kind fit ${asset.kind} relative to observed asset hints.`,
          corridorBoost > 0 ? `Corridor fits ${request.corridor}.` : 'Corridor evidence is inconclusive.'
        ]
      };
    }).sort((a, b) => b.score - a.score);

    const selected = candidates[0];
    const reviewRequired = selected.status === 'REVIEW' || selected.status === 'UNRESOLVED';

    return {
      missionId: request.missionId,
      mediaId: request.mediaId,
      selectedAssetId: selected ? (selected.status === 'UNRESOLVED' ? undefined : selected.assetId) : undefined,
      selectedAssetName: selected ? (selected.status === 'UNRESOLVED' ? undefined : selected.assetName) : undefined,
      reviewRequired,
      candidates: candidates.slice(0, 5),
      generatedAt: new Date().toISOString()
    };
  }

  private static kindMatchBoost(request: AssetResolutionRequest, kind: AssetKind): number {
    const hints = request.assetHints ?? [];
    if (hints.length === 0) {
      return 0.1;
    }

    const match = hints.some((hint) => hint.kind === kind || hint.name?.toLowerCase().includes(kind.toLowerCase().replace('_', ' ')));
    return match ? 0.25 : 0;
  }

  private static haversineKm(a: GeoLocation, b: GeoLocation): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const hav = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
    return 2 * earthRadiusKm * Math.asin(Math.sqrt(hav));
  }
}

export default AssetResolutionService;
