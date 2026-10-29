import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon, 
  Play, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Eye, 
  EyeOff, 
  Download,
  Move,
  Info
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/sampleImages';
import { detectObjects, DefenseConfig, defaultDefenseConfig } from '../services/api';
import { DetectedObject, SuspiciousPatch, DetectionResult, SampleImage } from '../types';

export function getSignDetails(label: string) {
  switch (label.toLowerCase()) {
    case 'one_way':
    case 'oneway_sign':
    case 'one_way_sign':
      return {
        title: 'One Way Sign',
        icon: '➡️',
        code: 'MUTCD R6-1 / R6-2',
        category: 'Directional Regulation',
        meaning: 'Vehicular traffic must proceed only in the indicated direction of the arrow.'
      };
    case 'do_not_enter':
    case 'do_not_enter_sign':
      return {
        title: 'Do Not Enter Sign',
        icon: '⛔',
        code: 'MUTCD R5-1',
        category: 'Prohibitory Regulation',
        meaning: 'Vehicular traffic prohibited from entering roadway, ramp, or lane in this direction.'
      };
    case 'school_zone':
    case 'school_crossing':
      return {
        title: 'School Zone / Crossing',
        icon: '🚸',
        code: 'MUTCD S1-1',
        category: 'School Pedestrian Safety',
        meaning: 'School crosswalk or children zone; reduced speed and heightened caution mandatory.'
      };
    case 'pedestrian_crossing':
      return {
        title: 'Pedestrian Crossing Sign',
        icon: '🚶‍♂️',
        code: 'MUTCD W11-2',
        category: 'Crosswalk Warning',
        meaning: 'Designated pedestrian crossing area ahead; yield right-of-way to pedestrians.'
      };
    case 'stop_sign':
      return {
        title: 'Stop Sign',
        icon: '🛑',
        code: 'MUTCD R1-1',
        category: 'Regulatory Priority',
        meaning: 'Full vehicular stop mandatory before intersection or crosswalk.'
      };
    case 'no_parking_sign':
      return {
        title: 'No Parking Sign',
        icon: '🅿️🚫',
        code: 'MUTCD R7-1',
        category: 'Parking Restriction',
        meaning: 'Vehicular stopping, standing, or parking prohibited at all times.'
      };
    case 'railroad_crossing_sign':
      return {
        title: 'Railroad Crossing Sign',
        icon: '🚆⚠️',
        code: 'MUTCD W10-1',
        category: 'Rail Advance Warning',
        meaning: 'Approaching highway-rail grade intersection; yield to oncoming trains.'
      };
    case 'train':
      return {
        title: 'Train / Rail Transit',
        icon: '🚆',
        code: 'Rolling Rail Stock',
        category: 'Heavy Rail Transit',
        meaning: 'Passenger or freight commuter train in railway corridor.'
      };
    case 'speed_limit_45':
    case 'speed_limit_sign':
    case 'speed_limit':
      return {
        title: 'Speed Limit Sign (45 MPH)',
        icon: '⚡',
        code: 'MUTCD R2-1',
        category: 'Regulatory Velocity',
        meaning: 'Maximum permitted legal travel velocity in miles per hour.'
      };
    case 'yield_sign':
      return {
        title: 'Yield Sign',
        icon: '⚠️',
        code: 'MUTCD R1-2',
        category: 'Priority Assignment',
        meaning: 'Slow down and yield right-of-way to intersecting traffic.'
      };
    case 'parking_allowed':
      return {
        title: 'Parking Permitted (Inverted)',
        icon: '🅿️',
        code: 'MUTCD R7-8 (Adversarial Error)',
        category: 'Prohibition Inversion',
        meaning: 'Adversarial sticker over the red slash forced the detector into permitting parking in a tow zone.'
      };
    case 'shipping_container':
      return {
        title: 'Freight Container (Misclassified)',
        icon: '📦',
        code: 'Cargo Box (Adversarial Error)',
        category: 'Intermodal Transit',
        meaning: 'Deep neural network misclassified passenger train locomotive due to localized window sticker.'
      };
    case 'scaffolding':
      return {
        title: 'Construction Scaffolding (Misclassified)',
        icon: '🚧',
        code: 'Work Zone (Adversarial Error)',
        category: 'Hazard Mitigation',
        meaning: 'Adversarial noise sticker corrupted the railroad crossbuck feature representation.'
      };
    case 'construction_sign':
      return {
        title: 'Construction Warning (Misclassified)',
        icon: '🚧',
        code: 'Temporary Warning (Adversarial Error)',
        category: 'Roadwork Hazard',
        meaning: 'Adversarial sticker corrupted the equilateral yield boundary geometry.'
      };
    case 'traffic_light':
      return {
        title: 'Traffic Signal Light',
        icon: '🚦',
        code: 'MUTCD Part 4',
        category: 'Active Signalization',
        meaning: 'Automated electric roadway signal directing intersection right-of-way.'
      };
    case 'person':
      return {
        title: 'Pedestrian',
        icon: '🚶',
        code: 'VRU Entity',
        category: 'Pedestrian Infrastructure',
        meaning: 'Vulnerable road user on sidewalk or crosswalk zone.'
      };
    case 'car':
      return {
        title: 'Passenger Car',
        icon: '🚗',
        code: 'Motor Vehicle',
        category: 'Roadway Vehicle',
        meaning: 'Standard passenger automotive sedan in transit.'
      };
    case 'regulatory_sign':
      return {
        title: 'Regulatory Road Sign',
        icon: '📋',
        code: 'MUTCD Regulatory',
        category: 'Traffic Regulation',
        meaning: 'Standard statutory roadway regulatory signboard.'
      };
    case 'warning_sign':
      return {
        title: 'Warning Sign',
        icon: '⚠️',
        code: 'MUTCD Series W',
        category: 'Roadway Caution',
        meaning: 'Advance roadway warning alerting drivers to specific hazards.'
      };
    default:
      return {
        title: label.replace(/_/g, ' '),
        icon: '🔍',
        code: 'Detected Entity',
        category: 'Road Infrastructure',
        meaning: 'Detected visual entity extracted by vision model.'
      };
  }
}

interface DetectionLabProps {
  onLogHistory: (record: {
    imageName: string;
    mode: 'baseline' | 'defense';
    objectCount: number;
    objectsDetected: string[];
    flaggedPatchesCount: number;
    latencyMs: number;
    status: 'normal' | 'adversarial_drop' | 'misclassified' | 'restored';
  }) => void;
}

export const DetectionLab: React.FC<DetectionLabProps> = ({ onLogHistory }) => {
  // Input state
  const [selectedInputType, setSelectedInputType] = useState<'sample' | 'upload' | 'webcam'>('sample');
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(SAMPLE_PRESETS[0].dataUrl);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_PRESETS[0].id);
  const [imageName, setImageName] = useState<string>(SAMPLE_PRESETS[0].name);

  // Pipeline execution state
  const [mode, setMode] = useState<'baseline' | 'defense'>('baseline');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<DetectionResult | null>(null);

  // Interactive sticker overlay state
  const [stickerEnabled, setStickerEnabled] = useState<boolean>(false);
  const [stickerType, setStickerType] = useState<'rp2' | 'adv_noise' | 'geometric'>('rp2');
  const [stickerPos, setStickerPos] = useState<{ x: number; y: number; size: number }>({ x: 50, y: 50, size: 18 });

  // Defense configuration state
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [defenseConfig, setDefenseConfig] = useState<DefenseConfig>(defaultDefenseConfig);

  // Webcam state
  const [webcamActive, setWebcamActive] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [liveStreamFps, setLiveStreamFps] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const liveProcessingRef = useRef<boolean>(false);

  // Canvas ref for overlay bounding boxes
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  // Engine selector state
  const [engine, setEngine] = useState<'fast_cv' | 'cloud_ai'>('fast_cv');
  const [processElapsed, setProcessElapsed] = useState<number>(0);

  // Active target sign classification state ('auto' or specific sign)
  const [selectedSignTarget, setSelectedSignTarget] = useState<string>('auto');
  const [autoDetectedSignNotice, setAutoDetectedSignNotice] = useState<string | null>(null);

  // Handle Preset Selection
  const handleSelectPreset = (preset: SampleImage) => {
    setSelectedPresetId(preset.id);
    setCurrentImageSrc(preset.dataUrl);
    setImageName(preset.name);
    setStickerEnabled(false);
    setSelectedSignTarget('auto');
    setAutoDetectedSignNotice(null);
    setTimeout(() => {
      handleRunDetection(mode, preset.dataUrl, preset.id, false, 'auto', preset.name);
    }, 10);
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const src = event.target.result;
        setCurrentImageSrc(src);
        setImageName(file.name);
        setSelectedPresetId('');

        // Measure natural aspect ratio to assist geometry heuristic
        const img = new Image();
        img.onload = () => {
          const ratio = img.naturalWidth && img.naturalHeight ? Number((img.naturalWidth / img.naturalHeight).toFixed(2)) : 1.0;

          // Detect sign type from filename automatically
          let autoSign = 'auto';
          const fn = file.name.toLowerCase();
          if (fn.includes('oneway') || fn.includes('one_way') || fn.includes('one-way') || fn.includes('arrow')) autoSign = 'one_way';
          else if (fn.includes('donotenter') || fn.includes('do_not_enter') || fn.includes('no_entry') || (fn.includes('enter') && !fn.includes('center'))) autoSign = 'do_not_enter';
          else if (fn.includes('train') || fn.includes('locomotive') || fn.includes('railway') || fn.includes('transit') || fn.includes('subway')) autoSign = 'train';
          else if (fn.includes('parking') || fn.includes('no_park') || fn.includes('nopark') || fn.includes('tow')) autoSign = 'no_parking_sign';
          else if (fn.includes('railroad') || fn.includes('crossbuck') || fn.includes('rxr') || fn.includes('crossing')) autoSign = 'railroad_crossing_sign';
          else if (fn.includes('yield')) autoSign = 'yield_sign';
          else if (fn.includes('speed') || fn.includes('limit') || fn.includes('mph') || fn.includes('kmh')) autoSign = 'speed_limit_45';
          else if (fn.includes('school')) autoSign = 'school_zone';
          else if (fn.includes('crosswalk')) autoSign = 'pedestrian_crossing';
          else if (fn.includes('traffic') && (fn.includes('light') || fn.includes('signal'))) autoSign = 'traffic_light';
          else if (fn.includes('pedestrian') || fn.includes('person') || fn.includes('walk')) autoSign = 'person';
          else if (fn.includes('car') || fn.includes('vehicle') || fn.includes('auto')) autoSign = 'car';
          else if (fn.includes('stop')) autoSign = 'stop_sign';

          if (autoSign !== 'auto') {
            setSelectedSignTarget(autoSign);
            setAutoDetectedSignNotice(`Target identified: ${getSignDetails(autoSign).icon} ${getSignDetails(autoSign).title}`);
          } else {
            setAutoDetectedSignNotice(`AI Analyzing image visual features...`);
          }

          // Default engine to cloud_ai on uploads for deep vision neural analysis
          setEngine('cloud_ai');

          setTimeout(() => {
            handleRunDetection(mode, src, undefined, stickerEnabled, autoSign, file.name, ratio);
          }, 10);
        };
        img.src = src;
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Webcam Start / Stop
  const startWebcam = async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setWebcamActive(true);
    } catch (err: any) {
      setWebcamError(err.message || 'Camera permission denied or camera device unavailable.');
      setWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setWebcamActive(false);
  };

  // Capture single frame from webcam to test
  const captureWebcamFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCurrentImageSrc(dataUrl);
    setImageName('Webcam Snapshot');
    stopWebcam();
    setSelectedInputType('upload');
    setEngine('cloud_ai');
    setTimeout(() => {
      handleRunDetection(mode, dataUrl, undefined, stickerEnabled, selectedSignTarget, 'webcam_snapshot.jpg', 1.33);
    }, 10);
  };

  // Clean up webcam on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Run Object Detection (Optimized, never hangs)
  const handleRunDetection = async (
    overrideMode?: 'baseline' | 'defense',
    overrideSrc?: string,
    overrideSampleId?: string,
    overrideStickerEnabled?: boolean,
    overrideTargetSign?: string,
    overrideFileName?: string,
    overrideAspectRatio?: number
  ) => {
    const runMode = overrideMode || mode;
    const runSrc = overrideSrc || currentImageSrc;
    const runSampleId = overrideSampleId !== undefined ? overrideSampleId : selectedPresetId;
    const runStickerEnabled = overrideStickerEnabled !== undefined ? overrideStickerEnabled : stickerEnabled;
    const runTargetSign = overrideTargetSign !== undefined ? overrideTargetSign : selectedSignTarget;
    const runFileName = overrideFileName !== undefined ? overrideFileName : imageName;

    setIsProcessing(true);
    setProcessElapsed(0);
    const timer = setInterval(() => setProcessElapsed((p) => p + 15), 15);

    try {
      const detectionOutput = await detectObjects(
        runSrc, 
        runMode, 
        defenseConfig,
        {
          engine,
          sampleId: runSampleId,
          targetSign: runTargetSign,
          fileName: runFileName,
          aspectRatio: overrideAspectRatio,
          attachedSticker: {
            enabled: runStickerEnabled,
            x: stickerPos.x,
            y: stickerPos.y,
            size: stickerPos.size
          }
        }
      );
      setResult(detectionOutput);

      // Determine outcome status for history log
      let status: 'normal' | 'adversarial_drop' | 'misclassified' | 'restored' = 'normal';
      const hasMisclassified = detectionOutput.objects.some(o => o.status === 'misclassified');
      const hasRestored = detectionOutput.objects.some(o => o.status === 'restored_by_defense');
      const isDropped = detectionOutput.objects.length === 0;

      if (hasRestored) status = 'restored';
      else if (hasMisclassified) status = 'misclassified';
      else if (isDropped) status = 'adversarial_drop';

      onLogHistory({
        imageName,
        mode: runMode,
        objectCount: detectionOutput.objects.length,
        objectsDetected: detectionOutput.objects.map(o => o.label),
        flaggedPatchesCount: detectionOutput.suspiciousRegions.length,
        latencyMs: detectionOutput.inferenceTimeMs,
        status
      });
    } catch (err) {
      console.error('Detection run error:', err);
    } finally {
      clearInterval(timer);
      setIsProcessing(false);
    }
  };

  // Run initial detection once on mount
  useEffect(() => {
    handleRunDetection(mode, currentImageSrc, selectedPresetId, stickerEnabled);
  }, []);

  // Trigger detection on mode switch
  const handleSwitchMode = (newMode: 'baseline' | 'defense') => {
    setMode(newMode);
    handleRunDetection(newMode, currentImageSrc, selectedPresetId, stickerEnabled);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Title & Mode Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#1C2541]/60 border border-slate-800 rounded-xl p-4 lg:p-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Detection Laboratory</h1>
            <span className="text-xs text-slate-400 font-mono">
              · {mode === 'baseline' ? 'Standard Detector' : 'PatchGuard Active'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test object detection against physical adversarial stickers under baseline and defense modes.
          </p>
        </div>

        {/* Engine & Mode Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Engine Selector */}
          <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setEngine('fast_cv')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                engine === 'fast_cv'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Runs local computer vision engine in 15-25ms. Always reliable."
            >
              <span>⚡ Fast CV (20ms)</span>
            </button>
            <button
              onClick={() => setEngine('cloud_ai')}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                engine === 'cloud_ai'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Uses Gemini Vision AI with 2.0s automatic fallback."
            >
              <span>☁️ Cloud AI</span>
            </button>
          </div>

          {/* Mode Toggle Controls */}
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => handleSwitchMode('baseline')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                mode === 'baseline'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Baseline Mode
            </button>
            <button
              onClick={() => handleSwitchMode('defense')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                mode === 'defense'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Defense Mode</span>
            </button>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
              showConfig 
                ? 'bg-slate-700 text-white border-slate-600' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Defense Parameters"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleRunDetection(mode, currentImageSrc, selectedPresetId, stickerEnabled)}
            disabled={isProcessing}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isProcessing ? `Running (${processElapsed}ms)...` : 'Run Detection'}</span>
          </button>
        </div>
      </div>

      {/* Defense Tuning Drawer (Collapsible) */}
      {showConfig && (
        <div className="bg-[#1C2541]/90 border border-cyan-500/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Defense Pipeline Parameters</h3>
            </div>
            <span className="text-xs text-slate-400">Modular Receptive Field Masking & Suppression</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Receptive Field Bound */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">Receptive Field Bounding Size</span>
                <span className="font-mono text-cyan-400">{defenseConfig.receptiveFieldSize}px</span>
              </div>
              <input
                type="range"
                min="48"
                max="240"
                step="16"
                value={defenseConfig.receptiveFieldSize}
                onChange={(e) => setDefenseConfig({ ...defenseConfig, receptiveFieldSize: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Limits how far a localized sticker pattern can propagate activations across convolutional layers.
              </p>
            </div>

            {/* Suspicion Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-medium">Gradient Anomaly Threshold</span>
                <span className="font-mono text-cyan-400">{defenseConfig.suspicionThreshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.30"
                max="0.95"
                step="0.05"
                value={defenseConfig.suspicionThreshold}
                onChange={(e) => setDefenseConfig({ ...defenseConfig, suspicionThreshold: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Higher values reduce false-positive masking on textured backgrounds like tree leaves.
              </p>
            </div>

            {/* Mask Strategy */}
            <div className="space-y-2">
              <span className="text-slate-300 font-medium block">Mitigation Mask Strategy</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'neutral_fill', label: 'Neutral Mean Fill' },
                  { id: 'inpainting', label: 'Local Inpainting' },
                  { id: 'bilateral_blur', label: 'Bilateral Blur' },
                  { id: 'clipping', label: 'Activation Clipping' },
                ].map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setDefenseConfig({ ...defenseConfig, maskStrategy: strat.id as any })}
                    className={`p-2 rounded border text-left transition-colors cursor-pointer ${
                      defenseConfig.maskStrategy === strat.id
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="font-semibold block">{strat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Workbench Grid: Image Canvas on Left, Controls & Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image / Video Display Canvas with Bounding Boxes */}
        <div className="lg:col-span-8 space-y-4">
          {/* Input Method Segmented Tabs */}
          <div className="flex items-center justify-between bg-[#1C2541]/40 border border-slate-800 rounded-lg p-1.5">
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setSelectedInputType('sample'); stopWebcam(); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedInputType === 'sample'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Benchmark Samples</span>
              </button>
              <button
                onClick={() => { setSelectedInputType('upload'); stopWebcam(); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedInputType === 'upload'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </button>
              <button
                onClick={() => { setSelectedInputType('webcam'); startWebcam(); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  selectedInputType === 'webcam'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Webcam Stream</span>
              </button>
            </div>

            {/* Interactive Sticker Overlay Trigger */}
            <button
              onClick={() => {
                const next = !stickerEnabled;
                setStickerEnabled(next);
                handleRunDetection(mode, currentImageSrc, selectedPresetId, next);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                stickerEnabled
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
              title="Add or remove an interactive adversarial sticker to test detector resilience"
            >
              <Move className="w-3.5 h-3.5" />
              <span>{stickerEnabled ? 'Remove Sticker' : 'Attach Adversarial Sticker'}</span>
            </button>
          </div>

          {/* Active Target Sign Classifier Selector */}
          <div className="bg-[#1C2541]/80 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse" />
                <span className="font-semibold text-white">Sign Classifier Target:</span>
                <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                  (Choose active sign or auto-detect)
                </span>
              </div>
              {autoDetectedSignNotice && (
                <span className="text-[11px] text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded font-mono">
                  {autoDetectedSignNotice}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'auto', label: '🎯 Auto-Detect' },
                { id: 'one_way', label: '➡️ One Way' },
                { id: 'no_parking_sign', label: '🅿️🚫 No Parking' },
                { id: 'do_not_enter', label: '⛔ Do Not Enter' },
                { id: 'stop_sign', label: '🛑 Stop Sign' },
                { id: 'yield_sign', label: '🔻 Yield Sign' },
                { id: 'speed_limit_45', label: '⚡ Speed Limit' },
                { id: 'train', label: '🚆 Train' },
                { id: 'railroad_crossing_sign', label: '❌ Railroad Sign' },
                { id: 'school_zone', label: '🚸 School Zone' },
                { id: 'traffic_light', label: '🚦 Traffic Light' },
                { id: 'person', label: '🚶 Pedestrian' },
                { id: 'car', label: '🚗 Car' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedSignTarget(item.id);
                    setAutoDetectedSignNotice(null);
                    handleRunDetection(mode, currentImageSrc, selectedPresetId, stickerEnabled, item.id);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                    selectedSignTarget === item.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 ring-1 ring-cyan-300'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Canvas Frame */}
          <div 
            ref={imageContainerRef}
            className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center select-none shadow-inner"
          >
            {/* Webcam Video Stream */}
            {selectedInputType === 'webcam' ? (
              <div className="relative w-full h-full">
                {webcamError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    <AlertTriangle className="w-10 h-10 text-amber-400 mb-2" />
                    <p className="text-sm text-slate-200 font-medium">Camera Access Unavailable</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">{webcamError}</p>
                    <button
                      onClick={startWebcam}
                      className="mt-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-md"
                    >
                      Retry Camera
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-700 rounded px-2.5 py-1 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                      <span>Live Stream Active</span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <button
                        onClick={captureWebcamFrame}
                        className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg hover:bg-cyan-400 cursor-pointer"
                      >
                        Capture & Inspect
                      </button>
                      <button
                        onClick={stopWebcam}
                        className="px-3 py-1.5 bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700"
                      >
                        Stop Camera
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Static Image Frame */
              <div className="relative w-full h-full">
                <img
                  src={currentImageSrc}
                  alt={imageName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Interactive Drag-and-Drop / Configurable Adversarial Sticker */}
                {stickerEnabled && (
                  <div
                    style={{
                      position: 'absolute',
                      top: `${stickerPos.y}%`,
                      left: `${stickerPos.x}%`,
                      width: `${stickerPos.size}%`,
                      height: `${stickerPos.size * 0.8}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="cursor-move border-2 border-red-500 rounded shadow-2xl flex flex-col items-center justify-center overflow-hidden z-20 group"
                  >
                    <div className="w-full h-full bg-gradient-to-tr from-pink-600 via-amber-400 to-cyan-500 opacity-90 p-1 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-mono font-bold text-black bg-white/90 px-1 rounded shadow">
                        ADV_STICKER
                      </span>
                      <span className="text-[9px] text-black font-mono font-semibold">
                        RP2 Pattern
                      </span>
                    </div>
                    {/* Position hint */}
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[9px] text-white text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Drag to object
                    </div>
                  </div>
                )}

                {/* Overlaid Detected Bounding Boxes */}
                {result && result.objects.map((obj) => {
                  const top = obj.box.ymin / 10;
                  const left = obj.box.xmin / 10;
                  const height = (obj.box.ymax - obj.box.ymin) / 10;
                  const width = (obj.box.xmax - obj.box.xmin) / 10;

                  const isRestored = obj.status === 'restored_by_defense';
                  const isMisclassified = obj.status === 'misclassified';
                  const isSuppressed = obj.status === 'adversarially_suppressed';

                  let borderColor = 'border-cyan-400';
                  let badgeBg = 'bg-cyan-500 text-slate-950';

                  if (isRestored) {
                    borderColor = 'border-emerald-400';
                    badgeBg = 'bg-emerald-500 text-slate-950';
                  } else if (isMisclassified) {
                    borderColor = 'border-red-500';
                    badgeBg = 'bg-red-600 text-white';
                  } else if (isSuppressed) {
                    borderColor = 'border-amber-400 border-dashed';
                    badgeBg = 'bg-amber-500 text-slate-950';
                  }

                  const signMeta = getSignDetails(obj.label);

                  return (
                    <div
                      key={obj.id}
                      style={{
                        position: 'absolute',
                        top: `${top}%`,
                        left: `${left}%`,
                        height: `${height}%`,
                        width: `${width}%`,
                      }}
                      className={`border-2 ${borderColor} rounded-sm transition-all pointer-events-auto group z-10 shadow-sm`}
                    >
                      {/* Detection Tag with Sign Icon & Readable Name */}
                      <div className={`absolute -top-7 left-0 px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1.5 whitespace-nowrap shadow-lg ${badgeBg}`}>
                        <span>{signMeta.icon}</span>
                        <span>{signMeta.title}</span>
                        <span>{Math.round(obj.confidence * 100)}%</span>
                        {isRestored && <span className="text-[9px] uppercase tracking-wider bg-black/30 px-1 rounded">Defended</span>}
                        {isMisclassified && <span className="text-[9px] uppercase tracking-wider bg-black/40 px-1 rounded">Misclassified</span>}
                      </div>
                    </div>
                  );
                })}

                {/* Overlaid Suspicious Patch Regions (Defense Mode) */}
                {result && result.suspiciousRegions.map((patch) => {
                  const top = patch.box.ymin / 10;
                  const left = patch.box.xmin / 10;
                  const height = (patch.box.ymax - patch.box.ymin) / 10;
                  const width = (patch.box.xmax - patch.box.xmin) / 10;

                  return (
                    <div
                      key={patch.id}
                      style={{
                        position: 'absolute',
                        top: `${top}%`,
                        left: `${left}%`,
                        height: `${height}%`,
                        width: `${width}%`,
                      }}
                      className="border-2 border-dashed border-amber-400 bg-amber-400/20 backdrop-blur-[2px] rounded-sm z-15 pointer-events-auto flex items-center justify-center group"
                    >
                      <div className="absolute -bottom-6 left-0 bg-amber-950/90 border border-amber-500/60 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap shadow">
                        Suspicious Patch (Anomaly {Math.round(patch.anomalyScore * 100)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Sticker Position Adjuster (if enabled) */}
          {stickerEnabled && (
            <div className="bg-[#1C2541]/70 border border-amber-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 text-amber-300">
                <Move className="w-4 h-4" />
                <span className="font-semibold">Simulate Sticker Placement:</span>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-slate-300">
                  <span>Horizontal (X):</span>
                  <input
                    type="range"
                    min="15"
                    max="85"
                    value={stickerPos.x}
                    onChange={(e) => setStickerPos({ ...stickerPos, x: Number(e.target.value) })}
                    className="accent-amber-400 w-24"
                  />
                  <span className="font-mono text-amber-300">{stickerPos.x}%</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300">
                  <span>Vertical (Y):</span>
                  <input
                    type="range"
                    min="15"
                    max="85"
                    value={stickerPos.y}
                    onChange={(e) => setStickerPos({ ...stickerPos, y: Number(e.target.value) })}
                    className="accent-amber-400 w-24"
                  />
                  <span className="font-mono text-amber-300">{stickerPos.y}%</span>
                </label>
                <label className="flex items-center gap-2 text-slate-300">
                  <span>Scale:</span>
                  <input
                    type="range"
                    min="10"
                    max="35"
                    value={stickerPos.size}
                    onChange={(e) => setStickerPos({ ...stickerPos, size: Number(e.target.value) })}
                    className="accent-amber-400 w-20"
                  />
                  <span className="font-mono text-amber-300">{stickerPos.size}%</span>
                </label>
                <button
                  onClick={() => handleRunDetection(mode, currentImageSrc, selectedPresetId, true)}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer"
                >
                  Apply Placement
                </button>
              </div>
            </div>
          )}

          {/* Preset Selector Carousel */}
          {selectedInputType === 'sample' && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Curated Benchmark Images
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SAMPLE_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#1C2541] border-cyan-400 ring-1 ring-cyan-400/30'
                          : 'bg-[#1C2541]/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200 truncate">{preset.name}</span>
                        {preset.isAdversarial ? (
                          <span className="text-[10px] text-amber-400 font-mono">Patched</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">Clean</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                        {preset.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload Dropzone */}
          {selectedInputType === 'upload' && (
            <div className="border border-dashed border-slate-700 rounded-xl p-6 text-center bg-[#1C2541]/30">
              <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-medium">Select an image from your computer</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Supports PNG, JPG, WebP up to 15MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="mt-3 text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Right Column: Execution Metrics, Detections List & Pipeline Log */}
        <div className="lg:col-span-4 space-y-4">
          {/* Output Summary Card */}
          <div className="bg-[#1C2541]/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Detection Output</h3>
                <span className="text-xs text-slate-400 font-mono">
                  {mode === 'baseline' ? 'Baseline Model Pass' : 'PatchGuard Sanitized Pass'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Latency</span>
                <span className="font-mono text-sm font-bold text-cyan-400 tabular-nums">
                  {result ? result.inferenceTimeMs : '--'} ms
                </span>
              </div>
            </div>

            {/* Detected Objects List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Recognized Objects ({result ? result.objects.length : 0})
              </span>

              {result && result.objects.length > 0 ? (
                <div className="space-y-2">
                  {result.objects.map((obj) => {
                    const signMeta = getSignDetails(obj.label);
                    return (
                      <div 
                        key={obj.id} 
                        className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                          obj.status === 'restored_by_defense' 
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
                            : obj.status === 'misclassified'
                            ? 'bg-red-950/30 border-red-500/40 text-red-300'
                            : 'bg-[#0B132B] border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-bold font-sans text-sm text-white">
                              <span className="text-base">{signMeta.icon}</span>
                              <span>{signMeta.title}</span>
                            </div>
                            <span className="text-[11px] text-cyan-400 font-mono block">
                              {signMeta.code} · {signMeta.category}
                            </span>
                          </div>
                          <span className="font-mono tabular-nums font-bold text-xs bg-slate-900/80 px-2 py-1 rounded border border-slate-700">
                            {(obj.confidence * 100).toFixed(1)}%
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-snug">
                          {signMeta.meaning}
                        </p>
                        
                        {/* Confidence Bar */}
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              obj.status === 'restored_by_defense' ? 'bg-emerald-400' : 'bg-cyan-400'
                            }`}
                            style={{ width: `${obj.confidence * 100}%` }}
                          />
                        </div>

                        {obj.status === 'restored_by_defense' && (
                          <p className="text-[11px] text-emerald-400 font-sans flex items-center gap-1.5 pt-1 border-t border-emerald-900/30">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Sign restored: PatchGuard masked the adversarial sticker</span>
                          </p>
                        )}
                        {obj.status === 'misclassified' && (
                          <p className="text-[11px] text-red-400 font-sans flex items-center gap-1.5 pt-1 border-t border-red-900/30">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Adversarial perturbation forced misclassification</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-[#0B132B] border border-slate-800 text-center text-xs text-slate-400">
                  {isProcessing ? (
                    <span className="text-cyan-400">Analyzing frame features...</span>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-amber-400 font-medium block">No objects detected</span>
                      <span className="text-[11px] text-slate-400">
                        {mode === 'baseline' 
                          ? 'Under physical sticker attack, the object can completely disappear from the detector.' 
                          : 'Try adjusting the anomaly threshold or switching samples.'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Suspicious Patch Regions */}
            {result && result.suspiciousRegions.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  Identified Adversarial Patches ({result.suspiciousRegions.length})
                </span>
                {result.suspiciousRegions.map((p) => (
                  <div key={p.id} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
                    <div className="flex justify-between text-amber-300 font-semibold">
                      <span>Suspicious Sticker Region</span>
                      <span className="font-mono tabular-nums">{Math.round(p.anomalyScore * 100)}% anomaly</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {p.heuristicReason}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Defense Execution Pipeline Stepper */}
          <div className="bg-[#1C2541]/70 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pipeline Execution Trace
            </h4>
            <div className="space-y-2 text-xs">
              {(result?.pipelineSteps || [
                '1. Image normalization & dimension alignment',
                '2. Feature extraction across receptive fields',
                '3. Bounding box non-maximum suppression'
              ]).map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="font-mono text-[11px]">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
