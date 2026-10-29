import React from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';

export const AboutMethodology: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="bg-[#1C2541]/60 border border-slate-800 rounded-xl p-6 lg:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
          <span>Research Documentation</span>
          <span aria-hidden="true">·</span>
          <span>Computer Vision Safety</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          About PatchGuard & Research Methodology
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          An educational research platform exploring the vulnerability of real-time object detection models to physical adversarial stickers, and investigating defense pipelines based on receptive field bounding and localized feature sanitization.
        </p>
      </div>

      {/* 1. Problem Statement & Motivation */}
      <section className="bg-[#1C2541]/50 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>1. Problem Statement & Motivation</span>
        </h2>
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Modern autonomous systems—such as self-driving vehicles, delivery drones, and automated surveillance networks—rely heavily on deep neural object detectors (e.g., YOLO, SSD, Faster R-CNN, and Vision Transformers) to identify critical entities like pedestrians, vehicles, and traffic signs.
          </p>
          <p>
            While deep learning detectors achieve high accuracy on standard benchmarks, they remain vulnerable to adversarial examples. In real-world physical environments, an adversary cannot directly inject digital pixel perturbations into the camera’s digital memory bus. Instead, attackers print physical stickers or decals and attach them to physical objects.
          </p>
          <p>
            These physical stickers are designed via optimization algorithms (e.g., Expectation Over Transformation or EOT) to manipulate feature maps within deep convolutional layers, causing high-confidence misclassifications or causing the target object to vanish entirely from the detection feed.
          </p>
        </div>
      </section>

      {/* 2. Physical Stickers vs Digital Perturbations */}
      <section className="bg-[#1C2541]/50 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>2. Physical Adversarial Stickers vs. Digital $L_p$ Perturbations</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#0B132B] border border-slate-800 rounded-lg space-y-2">
            <span className="font-bold text-slate-200 block text-sm">Digital Perturbations ($L_\infty, L_2$)</span>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Applied across every single pixel in the entire image.</li>
              <li>• Constrained to be imperceptibly small in magnitude ($\epsilon \le 8/255$).</li>
              <li>• Cannot be deployed directly in the physical world without software access.</li>
              <li>• Easily destroyed by camera lens distortion, natural lighting changes, and blur.</li>
            </ul>
          </div>

          <div className="p-4 bg-[#0B132B] border border-slate-800 rounded-lg space-y-2">
            <span className="font-bold text-cyan-300 block text-sm">Physical Adversarial Stickers</span>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Confined to a localized physical patch (typically 2% to 15% of surface area).</li>
              <li>• Unconstrained pixel magnitude inside the sticker (high contrast, bright colors).</li>
              <li>• Printed on standard photographic paper, vinyl, or t-shirts.</li>
              <li>• Optimized with EOT to remain effective across various angles, distances, and lighting.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. System Architecture & Proposed Defense Workflow */}
      <section className="bg-[#1C2541]/50 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>3. PatchGuard Defense Pipeline Architecture</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Standard deep networks have large, unbounded receptive fields: a small 8% sticker can spread anomalous activations across the entire feature tensor. The PatchGuard defense paradigm mitigates this vulnerability through modular stages:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-[#0B132B] border border-slate-800 rounded-lg flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
              A
            </span>
            <div>
              <strong className="text-slate-200 block">Image Preprocessing & Frame Validation</strong>
              <p className="text-slate-400 mt-0.5">
                Normalizes color channels, validates aspect ratios, and aligns image dimensions for consistent spatial feature alignment.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[#0B132B] border border-slate-800 rounded-lg flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
              B
            </span>
            <div>
              <strong className="text-slate-200 block">Suspicious Region Analysis (Heuristic Saliency)</strong>
              <p className="text-slate-400 mt-0.5">
                Computes localized directional gradients, high-frequency spectral flatness, and color entropy. Identifies bounding boxes exhibiting out-of-distribution adversarial textures.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[#0B132B] border border-slate-800 rounded-lg flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
              C
            </span>
            <div>
              <strong className="text-slate-200 block">Receptive Field Neutralization & Masking</strong>
              <p className="text-slate-400 mt-0.5">
                Applies bounded neutral fill, local inpainting, or bilateral smoothing over the candidate patch to eliminate gradient spikes before convolutional pooling.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-[#0B132B] border border-slate-800 rounded-lg flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
              D
            </span>
            <div>
              <strong className="text-slate-200 block">Robust Re-Inference & Aggregation</strong>
              <p className="text-slate-400 mt-0.5">
                Re-evaluates the sanitized feature map, recovering true object bounding boxes and computing confidence delta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Limitations & Scientific Disclaimer */}
      <section className="bg-[#1C2541]/50 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>4. Limitations & Scientific Disclaimer</span>
        </h2>
        <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2 text-xs text-slate-300 leading-relaxed">
          <strong className="text-amber-300 block text-sm">Educational Prototype Notice</strong>
          <p>
            This application is an educational and exploratory software prototype inspired by published research on physical adversarial patches and robust object detection. It is not scientifically validated or certified for production autonomous vehicle deployment.
          </p>
          <p>
            <strong>Key Limitations:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
            <li><strong>Natural Texture False Positives:</strong> High-frequency heuristics can occasionally flag benign visual textures (e.g. dense foliage, decorative logos, or QR codes) as suspicious.</li>
            <li><strong>Occlusion Penalty:</strong> Masking any region of an image removes some visual information, causing a small performance reduction on unattacked images (e.g. ~2.8% clean mAP trade-off).</li>
            <li><strong>Adaptive Attackers:</strong> In a white-box scenario, an adversary with knowledge of the heuristic threshold may optimize stickers specifically to stay just below the anomaly boundary. Provable defenses require certified bounding architectures (e.g. BagNet / certified clipping).</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
