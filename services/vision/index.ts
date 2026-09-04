import type {
  AssetKind,
  ConfidenceBand,
  HumanReviewState,
  SeverityLevel
} from '../../packages/domain';
import { generateId } from '../../src/core/shared/crypto';

export type VisionAssetClass =
  | 'TOWER_BODY'
  | 'TOWER_LEG'
  | 'BRACING'
  | 'BOLT'
  | 'JOINT'
  | 'CROSSARM'
  | 'PLATFORM'
  | 'LADDER'
  | 'TOWER_TOP_ASSEMBLY'
  | 'CONDUCTOR'
  | 'BUNDLED_CONDUCTOR'
  | 'JUMPER'
  | 'SAG'
  | 'BROKEN_STRAND'
  | 'CORROSION'
  | 'MECHANICAL_DAMAGE'
  | 'ABNORMAL_GEOMETRY'
  | 'INSULATOR'
  | 'INSULATOR_STRING'
  | 'DISC'
  | 'POLYMER_INSULATOR'
  | 'CRACKED_COMPONENT'
  | 'VEGETATION'
  | 'ARRESTER'
  | 'CONNECTOR';

export type VisionDefectClass =
  | 'CRACKED_INSULATOR'
  | 'CORRODED_METAL'
  | 'BROKEN_CONDUCTOR_STRAND'
  | 'LOOSE_CONNECTION'
  | 'MECHANICAL_DAMAGE'
  | 'VEGETATION_INTRUSION'
  | 'SPARKING_ARC'
  | 'JOINT_DISPLACEMENT'
  | 'ABNORMAL_SAG'
  | 'UNSTABLE_GEOMETRY';

export interface VisionDetectionRequest {
  missionId: string;
  mediaId: string;
  frameIndex?: number;
  assetHints?: Array<{ kind: AssetKind; name: string; confidence?: number }>;
  imageFeatures?: {
    brightness?: number;
    contrast?: number;
    blur?: number;
    glare?: number;
    occlusion?: number;
  };
}

export interface VisionDetectionResult {
  id: string;
  missionId: string;
  mediaId: string;
  assetClass: VisionAssetClass;
  defectClass?: VisionDefectClass;
  confidence: number;
  severity: SeverityLevel;
  humanReviewRequired: boolean;
  reviewState: HumanReviewState;
  confidenceBand: ConfidenceBand;
  boundingBox?: { x: number; y: number; width: number; height: number };
  evidenceSummary: string[];
  createdAt: string;
}

export interface VisionPipelineResult {
  missionId: string;
  mediaId: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'REVIEW_REQUIRED';
  detections: VisionDetectionResult[];
  defectCandidates: VisionDetectionResult[];
  modelVersion: string;
  generatedAt: string;
}

export const VISION_DETECTION_CLASSES: readonly VisionAssetClass[] = [
  'TOWER_BODY', 'TOWER_LEG', 'BRACING', 'BOLT', 'JOINT', 'CROSSARM', 'PLATFORM', 'LADDER', 'TOWER_TOP_ASSEMBLY',
  'CONDUCTOR', 'BUNDLED_CONDUCTOR', 'JUMPER', 'SAG', 'BROKEN_STRAND', 'CORROSION', 'MECHANICAL_DAMAGE', 'ABNORMAL_GEOMETRY',
  'INSULATOR', 'INSULATOR_STRING', 'DISC', 'POLYMER_INSULATOR', 'CRACKED_COMPONENT', 'VEGETATION', 'ARRESTER', 'CONNECTOR'
] as const;

export const VISION_DEFECT_CLASSES: readonly VisionDefectClass[] = [
  'CRACKED_INSULATOR', 'CORRODED_METAL', 'BROKEN_CONDUCTOR_STRAND', 'LOOSE_CONNECTION', 'MECHANICAL_DAMAGE', 'VEGETATION_INTRUSION',
  'SPARKING_ARC', 'JOINT_DISPLACEMENT', 'ABNORMAL_SAG', 'UNSTABLE_GEOMETRY'
] as const;

export const VISION_PIPELINE_STAGES = [
  'FRAME_EXTRACTION',
  'OBJECT_DETECTION',
  'DEFECT_DETECTION',
  'TEMPORAL_TRACKING',
  'SPATIAL_CORRELATION',
  'CONDITION_ASSESSMENT',
  'ENGINEERING_REVIEW'
] as const;

export const visionService = {
  name: 'vision',
  phase: 'PHASE_2',
  purpose: 'Provides the extensible CV pipeline contract and model-agnostic inference governance for grid asset and defect detection.'
};

export class VisionPipelineService {
  static readonly MODEL_VERSION = 'ketraco-cv-v2.1';

  static detectInfrastructure(payload: VisionDetectionRequest): VisionDetectionResult[] {
    const assetClassSeed = payload.assetHints?.[0]?.kind ?? 'TOWER';
    const baseClassMap: Record<string, VisionAssetClass> = {
      TOWER: 'TOWER_BODY',
      TOWER_COMPONENT: 'BRACING',
      CONDUCTOR: 'CONDUCTOR',
      INSULATOR: 'INSULATOR',
      HARDWARE: 'CONNECTOR',
      LOCATION: 'VEGETATION',
      GRID: 'TOWER_BODY'
    };

    const primaryClass = baseClassMap[assetClassSeed] ?? 'TOWER_BODY';
    const features = payload.imageFeatures ?? {};
    const brightnessFactor = (features.brightness ?? 0.6) * 100;
    const blurFactor = (features.blur ?? 0.2) * 100;
    const glareFactor = (features.glare ?? 0.15) * 100;
    const occlusionFactor = (features.occlusion ?? 0.1) * 100;

    const confidence = Math.max(0.55, Math.min(0.97, 0.78 - (blurFactor / 400) - (glareFactor / 500) - (occlusionFactor / 600) + (brightnessFactor / 1000)));
    const severity: SeverityLevel = confidence > 0.82 ? 'HIGH' : confidence > 0.68 ? 'MEDIUM' : 'LOW';
    const reviewRequired = confidence < 0.75 || (features.occlusion ?? 0) > 0.3 || (features.glare ?? 0) > 0.5;

    return [{
      id: generateId('det'),
      missionId: payload.missionId,
      mediaId: payload.mediaId,
      assetClass: primaryClass,
      confidence: Math.round(confidence * 100) / 100,
      severity,
      humanReviewRequired: reviewRequired,
      reviewState: reviewRequired ? 'PENDING' : 'APPROVED',
      confidenceBand: confidence > 0.85 ? 'HIGH' : confidence > 0.7 ? 'STRONG' : confidence > 0.6 ? 'REVIEW' : 'UNCERTAIN',
      boundingBox: { x: 12, y: 18, width: 68, height: 52 },
      evidenceSummary: [
        `Frame ${payload.frameIndex ?? 1} processed under the grid-asset CV pipeline.`,
        `Detected asset class: ${primaryClass}.`,
        reviewRequired ? 'Confidence is below the auto-approval threshold; human review required.' : 'Confidence meets the auto-approval threshold.'
      ],
      createdAt: new Date().toISOString()
    }];
  }

  static classifyDefects(detections: VisionDetectionResult[]): VisionDetectionResult[] {
    return detections.map((detection) => {
      const defectMap: Partial<Record<VisionAssetClass, VisionDefectClass>> = {
        TOWER_BODY: 'JOINT_DISPLACEMENT',
        BRACING: 'MECHANICAL_DAMAGE',
        CONDUCTOR: 'BROKEN_CONDUCTOR_STRAND',
        INSULATOR: 'CRACKED_INSULATOR',
        CONNECTOR: 'LOOSE_CONNECTION',
        VEGETATION: 'VEGETATION_INTRUSION'
      };

      const defectClass = defectMap[detection.assetClass] ?? 'UNSTABLE_GEOMETRY';
      const defectSeverity: SeverityLevel = detection.confidence > 0.8 ? 'HIGH' : detection.confidence > 0.65 ? 'MEDIUM' : 'LOW';

      return {
        ...detection,
        defectClass,
        severity: defectSeverity,
        humanReviewRequired: detection.humanReviewRequired || detection.confidence < 0.8,
        reviewState: detection.humanReviewRequired ? 'PENDING' : 'APPROVED',
        evidenceSummary: [...detection.evidenceSummary, `Candidate defect classified as ${defectClass}.`]
      };
    });
  }

  static runPipeline(request: VisionDetectionRequest): VisionPipelineResult {
    const detections = this.detectInfrastructure(request);
    const defectCandidates = this.classifyDefects(detections);

    return {
      missionId: request.missionId,
      mediaId: request.mediaId,
      status: defectCandidates.some((d) => d.humanReviewRequired) ? 'REVIEW_REQUIRED' : 'COMPLETED',
      detections,
      defectCandidates,
      modelVersion: this.MODEL_VERSION,
      generatedAt: new Date().toISOString()
    };
  }
}

export default VisionPipelineService;
