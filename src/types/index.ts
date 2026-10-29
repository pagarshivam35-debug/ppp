export interface BoundingBox {
  ymin: number; // 0 to 1000 normalized
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  box: BoundingBox;
  status?: 'intact' | 'adversarially_suppressed' | 'restored_by_defense' | 'misclassified';
  originalLabel?: string;
  originalConfidence?: number;
  detectedSignCategory?: string;
}

export interface SuspiciousPatch {
  id: string;
  box: BoundingBox;
  anomalyScore: number; // 0.0 to 1.0
  entropyScore: number;
  gradientEnergy: number;
  riskAssessment: 'high' | 'medium' | 'low';
  heuristicReason: string;
}

export interface DetectionResult {
  mode: 'baseline' | 'defense';
  objects: DetectedObject[];
  suspiciousRegions: SuspiciousPatch[];
  inferenceTimeMs: number;
  defenseApplied: boolean;
  pipelineSteps: string[];
}

export interface SampleImage {
  id: string;
  name: string;
  category: 'traffic_sign' | 'pedestrian' | 'vehicle';
  isAdversarial: boolean;
  attackType?: string;
  description: string;
  researchReference?: string;
  dataUrl: string;
  groundTruth: {
    label: string;
    box: BoundingBox;
  }[];
  defaultPatchBox?: BoundingBox;
}

export interface EvaluationMetrics {
  sampleCount: number;
  precision: number;
  recall: number;
  map50: number;
  map50_95: number;
  latencyMs: number;
  fps: number;
  totalTP: number;
  totalFP: number;
  totalFN: number;
}

export interface EvaluationReport {
  evaluatedSampleCount: number;
  selectedSet: string;
  overall: {
    baseline: EvaluationMetrics;
    defended: EvaluationMetrics;
    mAPImprovement: number;
    latencyOverheadMs: number;
  };
  splitComparison: {
    clean: {
      baselineMap50: number;
      defendedMap50: number;
      retentionRate: string;
      note: string;
    };
    adversarial: {
      baselineMap50: number;
      defendedMap50: number;
      recoveryGain: string;
      note: string;
    };
  };
  benchmarkItems: {
    id: string;
    name: string;
    category: string;
    isAdversarial: boolean;
    patchDetails?: {
      type: string;
      coveragePct: number;
      targetClass: string;
    };
    baselineObjCount: number;
    defendedObjCount: number;
    baselineLatencyMs: number;
    defendedLatencyMs: number;
  }[];
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  imageName: string;
  mode: 'baseline' | 'defense';
  objectCount: number;
  objectsDetected: string[];
  flaggedPatchesCount: number;
  latencyMs: number;
  status: 'normal' | 'adversarial_drop' | 'misclassified' | 'restored';
}
