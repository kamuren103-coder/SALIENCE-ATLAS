import { createHash } from 'node:crypto';
import { generateId } from '../../src/core/shared/crypto';

import type {
  GeoLocation,
  MediaIngestionRequest,
  MediaIngestionResult,
  MediaType,
  QualityGateResult,
  QualityIssueCode,
  ResumableUploadSession,
  MediaProcessingStatus,
} from '../../packages/domain';

export const MEDIA_QUALITY_GATE_RULES = [
  'corrupt media',
  'insufficient resolution',
  'motion blur',
  'severe glare',
  'poor illumination',
  'obstruction',
  'excessive compression',
  'missing telemetry',
  'duplicate frames',
  'unusable viewing angle'
] as const;

export const ingestionService = {
  name: 'ingestion',
  phase: 'PHASE_1',
  purpose: 'Resumable ingestion of drone media, metadata extraction, quality gating, and evidence hashing.'
};

export class DroneMediaIngestionService {
  static readonly QUALITY_THRESHOLD = 70;
  static readonly REVIEW_THRESHOLD = 85;
  static readonly sessionStore = new Map<string, ResumableUploadSession>();

  static createUploadSession(input: {
    missionId: string;
    mediaType: MediaType;
    totalBytes?: number;
    mediaId?: string;
    chunkCount?: number;
  }): ResumableUploadSession {
    const sessionId = generateId('upload');
    const session: ResumableUploadSession = {
      sessionId,
      missionId: input.missionId,
      mediaId: input.mediaId,
      mediaType: input.mediaType,
      totalBytes: input.totalBytes ?? 0,
      receivedBytes: 0,
      chunkCount: input.chunkCount ?? 1,
      status: 'ACTIVE',
      updatedAt: new Date().toISOString()
    };

    this.sessionStore.set(sessionId, session);
    return session;
  }

  static applyUploadChunk(sessionId: string, chunkBytes: number, chunkIndex?: number): ResumableUploadSession {
    const session = this.sessionStore.get(sessionId);
    if (!session) {
      throw new Error(`Upload session ${sessionId} not found`);
    }

    session.receivedBytes += Math.max(0, chunkBytes);
    if (typeof chunkIndex === 'number') {
      session.chunkCount = Math.max(session.chunkCount, chunkIndex + 1);
    }

    session.updatedAt = new Date().toISOString();
    if (session.totalBytes > 0 && session.receivedBytes >= session.totalBytes) {
      session.status = 'COMPLETED';
    }

    this.sessionStore.set(sessionId, session);
    return session;
  }

  static evaluateMediaQuality(payload: MediaIngestionRequest): QualityGateResult {
    const issues: QualityIssueCode[] = [];
    const warnings: string[] = [];
    const resolution = payload.resolution ?? {};
    const metrics = payload.imageMetrics ?? {};
    const hasTelemetry = Boolean(payload.telemetry && payload.telemetry.gps && Number.isFinite(payload.telemetry.gps.latitude) && Number.isFinite(payload.telemetry.gps.longitude));

    if (payload.isDuplicateFrame) {
      issues.push('DUPLICATE_FRAME');
      warnings.push('Duplicate frame detected; do not treat as independent evidence.');
    }

    if (!hasTelemetry) {
      issues.push('MISSING_TELEMETRY');
      warnings.push('Telemetry missing; location and capture metadata cannot be trusted for engineering decisions.');
    }

    const width = resolution.width ?? 0;
    const height = resolution.height ?? 0;
    if (width < 1920 || height < 1080) {
      issues.push('INSUFFICIENT_RESOLUTION');
      warnings.push('Resolution is below the minimum evidence threshold for grid inspection.');
    }

    if (typeof metrics.blurScore === 'number' && metrics.blurScore > 0.45) {
      issues.push('MOTION_BLUR');
      warnings.push('Detected motion blur above acceptable evidence threshold.');
    }

    if (typeof metrics.glareScore === 'number' && metrics.glareScore > 0.7) {
      issues.push('SEVERE_GLARE');
      warnings.push('Severe glare likely obscures component condition.');
    }

    if (typeof metrics.illuminationScore === 'number' && metrics.illuminationScore < 0.35) {
      issues.push('POOR_ILLUMINATION');
      warnings.push('Low illumination may reduce defect visibility and confidence.');
    }

    if (typeof metrics.compressionRatio === 'number' && metrics.compressionRatio > 0.75) {
      issues.push('EXCESSIVE_COMPRESSION');
      warnings.push('Compression ratio exceeds the safe evidence-quality range.');
    }

    if (typeof metrics.viewingAngleDeg === 'number' && (metrics.viewingAngleDeg < 20 || metrics.viewingAngleDeg > 160)) {
      issues.push('UNUSABLE_VIEWING_ANGLE');
      warnings.push('Viewing angle is outside the reliable inspection range for defect interpretation.');
    }

    let score = 100;
    const penaltyMap: Record<QualityIssueCode, number> = {
      CORRUPT_MEDIA: 35,
      INSUFFICIENT_RESOLUTION: 18,
      MOTION_BLUR: 16,
      SEVERE_GLARE: 15,
      POOR_ILLUMINATION: 12,
      OBSTRUCTION: 20,
      EXCESSIVE_COMPRESSION: 12,
      MISSING_TELEMETRY: 18,
      DUPLICATE_FRAME: 12,
      UNUSABLE_VIEWING_ANGLE: 14
    };

    for (const issue of issues) {
      score -= penaltyMap[issue] ?? 10;
    }

    const qualityScore = Math.max(0, Math.min(100, Math.round(score)));

    let status: QualityGateResult['status'] = 'PASS';
    if (issues.length > 0) {
      status = qualityScore >= this.QUALITY_THRESHOLD ? 'REVIEW' : 'REJECT';
    }

    return {
      qualityScore,
      status,
      issues,
      warnings
    };
  }

  static ingestMedia(payload: MediaIngestionRequest): MediaIngestionResult {
    const mediaId = payload.mediaId ?? generateId('media');
    const missionId = payload.missionId;
    const fileHash = payload.fileHash ?? this.computeSourceHash(payload);
    const quality = this.evaluateMediaQuality(payload);
    const location: GeoLocation | undefined = payload.location ?? (payload.telemetry?.gps ? payload.telemetry.gps : undefined);
    const processingStatus: MediaProcessingStatus = quality.status === 'REJECT' ? 'REJECTED' : 'VALIDATED';
    const uploadSession = payload.sessionId ? this.sessionStore.get(payload.sessionId) : undefined;

    return {
      mediaId,
      missionId,
      inspectionId: payload.inspectionId,
      mediaType: payload.mediaType,
      fileName: payload.fileName,
      sourceHash: fileHash,
      captureTimestamp: payload.captureTimestamp,
      location,
      telemetry: payload.telemetry,
      camera: payload.camera,
      qualityScore: quality.qualityScore,
      processingStatus,
      chainOfCustody: `mission:${missionId};media:${mediaId};hash:${fileHash};captured:${payload.captureTimestamp}`,
      qualityIssues: quality.issues,
      qualityWarnings: quality.warnings,
      uploadSession
    };
  }

  private static computeSourceHash(payload: MediaIngestionRequest): string {
    const canonical = JSON.stringify({
      missionId: payload.missionId,
      mediaType: payload.mediaType,
      fileName: payload.fileName ?? 'unknown',
      captureTimestamp: payload.captureTimestamp,
      location: payload.location,
      telemetry: payload.telemetry,
      content: payload.content ?? '',
      frameIndex: payload.frameIndex ?? 0
    });

    return createHash('sha256').update(canonical).digest('hex');
  }
}

export const phase1IngestionContracts = {
  phase: 'PHASE_1',
  qualityGates: MEDIA_QUALITY_GATE_RULES,
  availableActions: [
    'createUploadSession',
    'applyUploadChunk',
    'evaluateMediaQuality',
    'ingestMedia'
  ]
};

export default DroneMediaIngestionService;
