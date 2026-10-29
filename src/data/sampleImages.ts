import { SampleImage } from '../types';

// Helper to encode SVG string to base64 Data URL
function svgToDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// 1. Stop Sign with Adversarial Sticker (RP2 Attack, Eykholt et al.)
const stopSignAdversarialSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4B779A"/>
      <stop offset="50%" stop-color="#7EA5C3"/>
      <stop offset="100%" stop-color="#B2CCE0"/>
    </linearGradient>
    <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <pattern id="advPattern" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#EC4899"/>
      <rect x="20" width="20" height="20" fill="#3B82F6"/>
      <rect y="20" width="20" height="20" fill="#EAB308"/>
      <rect x="20" y="20" width="20" height="20" fill="#10B981"/>
      <circle cx="20" cy="20" r="10" fill="#8B5CF6"/>
      <path d="M0 0 L40 40 M40 0 L0 40" stroke="#000" stroke-width="3"/>
    </pattern>
  </defs>

  <rect width="800" height="380" fill="url(#skyGrad)"/>
  <rect y="380" width="800" height="220" fill="url(#roadGrad)"/>
  <rect y="370" width="800" height="18" fill="#94A3B8"/>
  <line x1="0" y1="480" x2="800" y2="480" stroke="#F8FAFC" stroke-width="4" stroke-dasharray="30 20"/>

  <path d="M 50 380 Q 120 280 180 380 Z" fill="#2E4F4F"/>
  <path d="M 620 380 Q 710 260 790 380 Z" fill="#2C3639"/>

  <!-- Sign Post -->
  <rect x="390" y="320" width="20" height="260" fill="#64748B"/>
  <rect x="393" y="320" width="5" height="260" fill="#94A3B8"/>

  <!-- Red Octagonal STOP Sign -->
  <polygon points="400,100 520,150 570,270 520,390 400,440 280,390 230,270 280,150" fill="#DC2626" stroke="#FFFFFF" stroke-width="12"/>
  <text x="400" y="295" font-family="Plus Jakarta Sans, Impact, sans-serif" font-weight="900" font-size="88" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">STOP</text>

  <!-- Physical Adversarial Sticker Affixed to the sign face -->
  <g transform="translate(360, 220) rotate(-6)">
    <rect x="-45" y="-35" width="90" height="70" fill="url(#advPattern)" stroke="#111827" stroke-width="3" rx="4"/>
    <rect x="-35" y="-25" width="70" height="50" fill="none" stroke="#FDE047" stroke-width="2" stroke-dasharray="4 2"/>
    <text x="0" y="3" font-family="monospace" font-size="10" fill="#FFFFFF" font-weight="bold" text-anchor="middle" filter="drop-shadow(0 1px 1px black)">ADV_RP2</text>
  </g>
</svg>
`;

// 2. Clean Stop Sign
const stopSignCleanSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4B779A"/>
      <stop offset="50%" stop-color="#7EA5C3"/>
      <stop offset="100%" stop-color="#B2CCE0"/>
    </linearGradient>
    <linearGradient id="roadGrad2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
  </defs>

  <rect width="800" height="380" fill="url(#skyGrad2)"/>
  <rect y="380" width="800" height="220" fill="url(#roadGrad2)"/>
  <rect y="370" width="800" height="18" fill="#94A3B8"/>
  <line x1="0" y1="480" x2="800" y2="480" stroke="#F8FAFC" stroke-width="4" stroke-dasharray="30 20"/>

  <path d="M 50 380 Q 120 280 180 380 Z" fill="#2E4F4F"/>
  <path d="M 620 380 Q 710 260 790 380 Z" fill="#2C3639"/>

  <rect x="390" y="320" width="20" height="260" fill="#64748B"/>
  <rect x="393" y="320" width="5" height="260" fill="#94A3B8"/>

  <polygon points="400,100 520,150 570,270 520,390 400,440 280,390 230,270 280,150" fill="#DC2626" stroke="#FFFFFF" stroke-width="12"/>
  <text x="400" y="295" font-family="Plus Jakarta Sans, Impact, sans-serif" font-weight="900" font-size="88" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">STOP</text>
</svg>
`;

// 3. No Parking Sign (Clean)
const noParkingCleanSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="curbSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#BAE6FD"/>
    </linearGradient>
  </defs>

  <!-- Background Urban Street & Sidewalk -->
  <rect width="800" height="360" fill="url(#curbSky)"/>
  <rect y="360" width="800" height="240" fill="#334155"/>
  <rect y="350" width="800" height="25" fill="#CBD5E1"/>
  
  <!-- Curbside red curb marking -->
  <rect y="372" width="800" height="12" fill="#DC2626"/>

  <!-- Post -->
  <rect x="388" y="220" width="24" height="360" fill="#64748B"/>
  <rect x="392" y="220" width="6" height="360" fill="#94A3B8"/>

  <!-- NO PARKING SIGN PLATE (MUTCD R7-1 style) -->
  <g transform="translate(400, 200)">
    <!-- White reflective backing with rounded corners -->
    <rect x="-110" y="-140" width="220" height="280" rx="16" fill="#F8FAFC" stroke="#DC2626" stroke-width="10"/>

    <!-- International No Parking Symbol (Red Circle with Diagonal Slash over letter 'P') -->
    <circle cx="0" cy="-35" r="75" fill="none" stroke="#DC2626" stroke-width="18"/>
    <line x1="-53" y1="-88" x2="53" y2="18" stroke="#DC2626" stroke-width="18"/>

    <!-- Black Bold 'P' -->
    <text x="0" y="-10" font-family="Plus Jakarta Sans, Arial, sans-serif" font-weight="900" font-size="82" fill="#0F172A" text-anchor="middle">P</text>

    <!-- Text: NO PARKING ANY TIME -->
    <text x="0" y="70" font-family="Plus Jakarta Sans, Impact, sans-serif" font-weight="800" font-size="22" fill="#DC2626" text-anchor="middle" letter-spacing="1">NO PARKING</text>
    <text x="0" y="98" font-family="Plus Jakarta Sans, Impact, sans-serif" font-weight="800" font-size="19" fill="#DC2626" text-anchor="middle" letter-spacing="1">ANY TIME</text>
  </g>
</svg>
`;

// 4. No Parking Sign (With Adversarial Sticker)
const noParkingAdversarialSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="curbSky2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#BAE6FD"/>
    </linearGradient>
    <pattern id="parkAdvPattern" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect width="15" height="15" fill="#10B981"/>
      <rect x="15" width="15" height="15" fill="#EC4899"/>
      <rect y="15" width="15" height="15" fill="#3B82F6"/>
      <rect x="15" y="15" width="15" height="15" fill="#F59E0B"/>
      <circle cx="15" cy="15" r="6" fill="#8B5CF6"/>
      <path d="M0 0 L30 30" stroke="#000" stroke-width="2"/>
    </pattern>
  </defs>

  <rect width="800" height="360" fill="url(#curbSky2)"/>
  <rect y="360" width="800" height="240" fill="#334155"/>
  <rect y="350" width="800" height="25" fill="#CBD5E1"/>
  <rect y="372" width="800" height="12" fill="#DC2626"/>

  <rect x="388" y="220" width="24" height="360" fill="#64748B"/>
  <rect x="392" y="220" width="6" height="360" fill="#94A3B8"/>

  <g transform="translate(400, 200)">
    <rect x="-110" y="-140" width="220" height="280" rx="16" fill="#F8FAFC" stroke="#DC2626" stroke-width="10"/>

    <circle cx="0" cy="-35" r="75" fill="none" stroke="#DC2626" stroke-width="18"/>
    <line x1="-53" y1="-88" x2="53" y2="18" stroke="#DC2626" stroke-width="18"/>
    <text x="0" y="-10" font-family="Plus Jakarta Sans, Arial, sans-serif" font-weight="900" font-size="82" fill="#0F172A" text-anchor="middle">P</text>

    <text x="0" y="70" font-family="Plus Jakarta Sans, Impact, sans-serif" font-weight="800" font-size="22" fill="#DC2626" text-anchor="middle" letter-spacing="1">NO PARKING</text>
    <text x="0" y="98" font-family="Plus Jakarta Sans, Impact, sans-serif" font-weight="800" font-size="19" fill="#DC2626" text-anchor="middle" letter-spacing="1">ANY TIME</text>

    <!-- Physical Adversarial Sticker across the prohibition slash -->
    <g transform="translate(15, -40) rotate(12)">
      <rect x="-40" y="-30" width="80" height="60" fill="url(#parkAdvPattern)" stroke="#020617" stroke-width="3" rx="3"/>
      <rect x="-30" y="-20" width="60" height="40" fill="none" stroke="#FEF08A" stroke-width="2" stroke-dasharray="3 2"/>
      <text x="0" y="4" font-family="monospace" font-size="9" fill="#FFFFFF" font-weight="bold" text-anchor="middle" filter="drop-shadow(0 1px 1px black)">ADV_STK</text>
    </g>
  </g>
</svg>
`;

// 5. Train & Railroad Crossing Scene (Clean)
const trainRailroadCleanSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="trainSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#7DD3FC"/>
    </linearGradient>
  </defs>

  <rect width="800" height="340" fill="url(#trainSky)"/>
  <rect y="340" width="800" height="260" fill="#475569"/>

  <!-- Railroad Track Ties & Steel Rails -->
  <g transform="translate(0, 360)">
    <!-- Wooden Ties -->
    <rect x="0" y="20" width="800" height="14" fill="#3E2723"/>
    <rect x="0" y="55" width="800" height="14" fill="#3E2723"/>
    <rect x="0" y="90" width="800" height="14" fill="#3E2723"/>
    <rect x="0" y="125" width="800" height="14" fill="#3E2723"/>
    <rect x="0" y="160" width="800" height="14" fill="#3E2723"/>
    <rect x="0" y="195" width="800" height="14" fill="#3E2723"/>

    <!-- Steel Parallel Rails -->
    <rect x="180" y="0" width="16" height="240" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/>
    <rect x="620" y="0" width="16" height="240" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/>
  </g>

  <!-- Modern Commuter Train Engine on Tracks -->
  <g transform="translate(190, 140)">
    <!-- Locomotive Body -->
    <path d="M 0 80 Q 20 20, 100 10 L 320 10 Q 400 20, 420 80 L 420 220 L 0 220 Z" fill="#DC2626" stroke="#991B1B" stroke-width="4"/>
    <!-- Cab Front Window -->
    <path d="M 50 70 L 120 40 L 300 40 L 370 70 L 350 110 L 70 110 Z" fill="#0284C7" stroke="#0F172A" stroke-width="3"/>
    <!-- Headlight Cluster -->
    <circle cx="210" cy="150" r="24" fill="#FEF08A" stroke="#CA8A04" stroke-width="3"/>
    <circle cx="210" cy="150" r="14" fill="#FFFFFF"/>
    <!-- Cowcatcher / Bumper -->
    <polygon points="60,220 360,220 380,250 40,250" fill="#1E293B"/>
    <!-- Train Label -->
    <text x="210" y="195" font-family="Plus Jakarta Sans, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">EXPRESS TRAIN</text>
  </g>

  <!-- RAILROAD CROSSING SIGN (W10-1 Circular Yellow RXR Sign) on foreground right -->
  <g transform="translate(110, 260)">
    <!-- Post -->
    <rect x="-8" y="0" width="16" height="340" fill="#64748B"/>
    <rect x="-4" y="0" width="4" height="340" fill="#94A3B8"/>

    <!-- Yellow Round Sign -->
    <circle cx="0" cy="0" r="85" fill="#FACC15" stroke="#0F172A" stroke-width="8"/>
    
    <!-- Bold Black 'X' and 'R' 'R' -->
    <line x1="-60" y1="-60" x2="60" y2="60" stroke="#0F172A" stroke-width="16"/>
    <line x1="-60" y1="60" x2="60" y2="-60" stroke="#0F172A" stroke-width="16"/>
    <text x="-48" y="16" font-family="Impact, sans-serif" font-weight="900" font-size="52" fill="#0F172A" text-anchor="middle">R</text>
    <text x="48" y="16" font-family="Impact, sans-serif" font-weight="900" font-size="52" fill="#0F172A" text-anchor="middle">R</text>
  </g>
</svg>
`;

// 6. Train & Railroad Crossing Scene with Adversarial Patch
const trainRailroadAdversarialSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="trainSky2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#7DD3FC"/>
    </linearGradient>
    <pattern id="trainAdvSticker" width="28" height="28" patternUnits="userSpaceOnUse">
      <rect width="14" height="14" fill="#A855F7"/>
      <rect x="14" width="14" height="14" fill="#E11D48"/>
      <rect y="14" width="14" height="14" fill="#06B6D4"/>
      <rect x="14" y="14" width="14" height="14" fill="#FBBF24"/>
      <circle cx="14" cy="14" r="5" fill="#000000"/>
    </pattern>
  </defs>

  <rect width="800" height="340" fill="url(#trainSky2)"/>
  <rect y="340" width="800" height="260" fill="#475569"/>

  <g transform="translate(0, 360)">
    <rect x="0" y="20" width="800" height="14" fill="#3E2723"/>
    <rect x="0" y="55" width="800" height="14" fill="#3E2723"/>
    <rect x="0" y="90" width="800" height="14" fill="#3E2723"/>
    <rect x="0" y="125" width="800" height="14" fill="#3E2723"/>
    <rect x="0" y="160" width="800" height="14" fill="#3E2723"/>
    <rect x="0" y="195" width="800" height="14" fill="#3E2723"/>

    <rect x="180" y="0" width="16" height="240" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/>
    <rect x="620" y="0" width="16" height="240" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/>
  </g>

  <!-- Train on Tracks -->
  <g transform="translate(190, 140)">
    <path d="M 0 80 Q 20 20, 100 10 L 320 10 Q 400 20, 420 80 L 420 220 L 0 220 Z" fill="#DC2626" stroke="#991B1B" stroke-width="4"/>
    <path d="M 50 70 L 120 40 L 300 40 L 370 70 L 350 110 L 70 110 Z" fill="#0284C7" stroke="#0F172A" stroke-width="3"/>
    <circle cx="210" cy="150" r="24" fill="#FEF08A" stroke="#CA8A04" stroke-width="3"/>
    <circle cx="210" cy="150" r="14" fill="#FFFFFF"/>
    <polygon points="60,220 360,220 380,250 40,250" fill="#1E293B"/>
    <text x="210" y="195" font-family="Plus Jakarta Sans, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">EXPRESS TRAIN</text>
  </g>

  <!-- Railroad Crossing Sign with Physical Adversarial Sticker -->
  <g transform="translate(110, 260)">
    <rect x="-8" y="0" width="16" height="340" fill="#64748B"/>
    <rect x="-4" y="0" width="4" height="340" fill="#94A3B8"/>

    <circle cx="0" cy="0" r="85" fill="#FACC15" stroke="#0F172A" stroke-width="8"/>
    <line x1="-60" y1="-60" x2="60" y2="60" stroke="#0F172A" stroke-width="16"/>
    <line x1="-60" y1="60" x2="60" y2="-60" stroke="#0F172A" stroke-width="16"/>
    <text x="-48" y="16" font-family="Impact, sans-serif" font-weight="900" font-size="52" fill="#0F172A" text-anchor="middle">R</text>
    <text x="48" y="16" font-family="Impact, sans-serif" font-weight="900" font-size="52" fill="#0F172A" text-anchor="middle">R</text>

    <!-- Adversarial sticker blocking the railway intersection cross -->
    <g transform="translate(-10, -10) rotate(-15)">
      <rect x="-35" y="-30" width="70" height="60" fill="url(#trainAdvSticker)" stroke="#020617" stroke-width="3" rx="4"/>
      <rect x="-25" y="-20" width="50" height="40" fill="none" stroke="#FDE047" stroke-width="2" stroke-dasharray="3 2"/>
      <text x="0" y="3" font-family="monospace" font-size="8" fill="#FFFFFF" font-weight="bold" text-anchor="middle" filter="drop-shadow(0 1px 1px black)">ADV_RAIL</text>
    </g>
  </g>
</svg>
`;

// 7. Multi-Sign Urban Rail Intersection (Stop Sign + No Parking Sign + Railroad Sign + Train)
const multiSignIntersectionSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="multiSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="60%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#BAE6FD"/>
    </linearGradient>
  </defs>

  <!-- Sky & Road & Rail -->
  <rect width="800" height="320" fill="url(#multiSky)"/>
  <rect y="320" width="800" height="280" fill="#334155"/>
  <rect y="310" width="800" height="20" fill="#94A3B8"/>

  <!-- Rail Tracks in middle ground -->
  <rect x="420" y="240" width="380" height="8" fill="#78350F"/>
  <rect x="420" y="270" width="380" height="8" fill="#78350F"/>
  <line x1="420" y1="230" x2="800" y2="230" stroke="#CBD5E1" stroke-width="4"/>
  <line x1="420" y1="285" x2="800" y2="285" stroke="#CBD5E1" stroke-width="4"/>

  <!-- Train Passing on Tracks (Right side) -->
  <g transform="translate(450, 180)">
    <rect width="320" height="100" rx="10" fill="#2563EB" stroke="#1D4ED8" stroke-width="3"/>
    <!-- Windows -->
    <rect x="30" y="25" width="50" height="35" rx="4" fill="#BAE6FD"/>
    <rect x="100" y="25" width="50" height="35" rx="4" fill="#BAE6FD"/>
    <rect x="170" y="25" width="50" height="35" rx="4" fill="#BAE6FD"/>
    <rect x="240" y="25" width="50" height="35" rx="4" fill="#BAE6FD"/>
    <!-- Wheels -->
    <circle cx="60" cy="100" r="14" fill="#0F172A"/>
    <circle cx="260" cy="100" r="14" fill="#0F172A"/>
    <text x="160" y="80" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" text-anchor="middle">METRO TRANSIT TRAIN</text>
  </g>

  <!-- 1. STOP SIGN (Left) -->
  <g transform="translate(130, 230)">
    <rect x="-6" y="0" width="12" height="370" fill="#64748B"/>
    <polygon points="0,-100 48,-65 68,-15 48,35 0,70 -48,35 -68,-15 -48,-65" fill="#DC2626" stroke="#FFFFFF" stroke-width="5"/>
    <text x="0" y="-8" font-family="Impact, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle">STOP</text>
  </g>

  <!-- 2. NO PARKING SIGN (Center-Left) -->
  <g transform="translate(260, 240)">
    <rect x="-5" y="0" width="10" height="360" fill="#64748B"/>
    <rect x="-40" y="-110" width="80" height="110" rx="8" fill="#F8FAFC" stroke="#DC2626" stroke-width="4"/>
    <circle cx="0" cy="-65" r="30" fill="none" stroke="#DC2626" stroke-width="7"/>
    <line x1="-21" y1="-86" x2="21" y2="-44" stroke="#DC2626" stroke-width="7"/>
    <text x="0" y="-55" font-family="Plus Jakarta Sans, sans-serif" font-weight="900" font-size="32" fill="#0F172A" text-anchor="middle">P</text>
    <text x="0" y="-22" font-family="Impact, sans-serif" font-weight="800" font-size="9" fill="#DC2626" text-anchor="middle">NO PARKING</text>
  </g>

  <!-- 3. RAILROAD CROSSING SIGN (Center-Right) -->
  <g transform="translate(390, 220)">
    <rect x="-6" y="0" width="12" height="380" fill="#64748B"/>
    <circle cx="0" cy="-60" r="48" fill="#FACC15" stroke="#0F172A" stroke-width="5"/>
    <line x1="-34" y1="-94" x2="34" y2="-26" stroke="#0F172A" stroke-width="9"/>
    <line x1="-34" y1="-26" x2="34" y2="-94" stroke="#0F172A" stroke-width="9"/>
    <text x="-26" y="-51" font-family="Impact, sans-serif" font-weight="900" font-size="28" fill="#0F172A" text-anchor="middle">R</text>
    <text x="26" y="-51" font-family="Impact, sans-serif" font-weight="900" font-size="28" fill="#0F172A" text-anchor="middle">R</text>
  </g>
</svg>
`;

// 8. One Way Sign (Clean - MUTCD R6-1)
const oneWayCleanSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="onewaySky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#BAE6FD"/>
    </linearGradient>
  </defs>

  <!-- Sky and Urban Roadway -->
  <rect width="800" height="380" fill="url(#onewaySky)"/>
  <rect y="380" width="800" height="220" fill="#334155"/>
  <rect y="370" width="800" height="15" fill="#94A3B8"/>
  <line x1="0" y1="480" x2="800" y2="480" stroke="#F8FAFC" stroke-width="4" stroke-dasharray="30 20"/>

  <!-- Curb & Greenery -->
  <path d="M 30 380 Q 90 290 150 380 Z" fill="#2E4F4F"/>
  <path d="M 650 380 Q 720 280 790 380 Z" fill="#2C3639"/>

  <!-- Sign Post -->
  <rect x="390" y="270" width="20" height="310" fill="#64748B"/>
  <rect x="394" y="270" width="4" height="310" fill="#94A3B8"/>

  <!-- Horizontal ONE WAY Sign (MUTCD R6-1: 36" x 12" standard) -->
  <g transform="translate(140, 150)">
    <rect width="520" height="180" rx="14" fill="#0F172A" stroke="#FFFFFF" stroke-width="8"/>
    <!-- Large White Directional Arrow pointing right -->
    <path d="M 35 90 L 370 90 L 370 45 L 485 90 L 370 135 L 370 90 Z" fill="#FFFFFF"/>
    <!-- Black text inside arrow -->
    <text x="200" y="105" font-family="Plus Jakarta Sans, Impact, sans-serif" font-weight="900" font-size="44" fill="#0F172A" text-anchor="middle" letter-spacing="4">ONE WAY</text>
  </g>
</svg>
`;

// 9. One Way Sign with Adversarial Sticker
const oneWayAdversarialSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="onewaySky2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#BAE6FD"/>
    </linearGradient>
    <pattern id="oneWayAdvSticker" width="30" height="30" patternUnits="userSpaceOnUse">
      <rect width="15" height="15" fill="#EF4444"/>
      <rect x="15" width="15" height="15" fill="#10B981"/>
      <rect y="15" width="15" height="15" fill="#6366F1"/>
      <rect x="15" y="15" width="15" height="15" fill="#F59E0B"/>
      <path d="M0 0 L30 30 M30 0 L0 30" stroke="#000" stroke-width="2"/>
    </pattern>
  </defs>

  <rect width="800" height="380" fill="url(#onewaySky2)"/>
  <rect y="380" width="800" height="220" fill="#334155"/>
  <rect y="370" width="800" height="15" fill="#94A3B8"/>
  <line x1="0" y1="480" x2="800" y2="480" stroke="#F8FAFC" stroke-width="4" stroke-dasharray="30 20"/>

  <path d="M 30 380 Q 90 290 150 380 Z" fill="#2E4F4F"/>
  <path d="M 650 380 Q 720 280 790 380 Z" fill="#2C3639"/>

  <rect x="390" y="270" width="20" height="310" fill="#64748B"/>
  <rect x="394" y="270" width="4" height="310" fill="#94A3B8"/>

  <g transform="translate(140, 150)">
    <rect width="520" height="180" rx="14" fill="#0F172A" stroke="#FFFFFF" stroke-width="8"/>
    <path d="M 35 90 L 370 90 L 370 45 L 485 90 L 370 135 L 370 90 Z" fill="#FFFFFF"/>
    <text x="200" y="105" font-family="Plus Jakarta Sans, Impact, sans-serif" font-weight="900" font-size="44" fill="#0F172A" text-anchor="middle" letter-spacing="4">ONE WAY</text>

    <!-- Physical Adversarial Sticker over Arrow Head -->
    <g transform="translate(425, 90) rotate(8)">
      <rect x="-40" y="-35" width="80" height="70" fill="url(#oneWayAdvSticker)" stroke="#0F172A" stroke-width="3" rx="4"/>
      <rect x="-32" y="-27" width="64" height="54" fill="none" stroke="#FDE047" stroke-width="2" stroke-dasharray="3 2"/>
      <text x="0" y="4" font-family="monospace" font-size="9" fill="#FFFFFF" font-weight="bold" text-anchor="middle" filter="drop-shadow(0 1px 1px black)">ADV_ONEWAY</text>
    </g>
  </g>
</svg>
`;

// 10. Do Not Enter Sign (Clean - MUTCD R5-1)
const doNotEnterCleanSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="dneSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4B779A"/>
      <stop offset="100%" stop-color="#94A3B8"/>
    </linearGradient>
  </defs>

  <rect width="800" height="380" fill="url(#dneSky)"/>
  <rect y="380" width="800" height="220" fill="#334155"/>
  <rect y="370" width="800" height="15" fill="#94A3B8"/>

  <!-- Post -->
  <rect x="390" y="320" width="20" height="260" fill="#64748B"/>
  <rect x="393" y="320" width="5" height="260" fill="#94A3B8"/>

  <!-- Square White Plate with Red Circle and White Bar (MUTCD R5-1) -->
  <g transform="translate(250, 90)">
    <rect width="300" height="300" rx="18" fill="#F8FAFC" stroke="#0F172A" stroke-width="4"/>
    <circle cx="150" cy="150" r="130" fill="#DC2626"/>
    <!-- Horizontal White Bar -->
    <rect x="35" y="125" width="230" height="50" rx="4" fill="#FFFFFF"/>
    <!-- Top & Bottom Text -->
    <text x="150" y="100" font-family="Plus Jakarta Sans, Impact, sans-serif" font-weight="900" font-size="30" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">DO NOT</text>
    <text x="150" y="222" font-family="Plus Jakarta Sans, Impact, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">ENTER</text>
  </g>
</svg>
`;

export const SAMPLE_PRESETS: SampleImage[] = [
  {
    id: 'sample-oneway-clean',
    name: 'One Way Sign (Clean - MUTCD R6-1)',
    category: 'traffic_sign',
    isAdversarial: false,
    description: 'A standard regulatory One Way sign with white directional arrow on black background.',
    researchReference: 'MUTCD Section 2B.40 One-Way Signs',
    dataUrl: svgToDataUrl(oneWayCleanSvg),
    groundTruth: [
      { label: 'one_way', box: { ymin: 150, xmin: 140, ymax: 330, xmax: 660 } }
    ]
  },
  {
    id: 'sample-oneway-adversarial',
    name: 'One Way Sign with Adversarial Sticker',
    category: 'traffic_sign',
    isAdversarial: true,
    attackType: 'Directional Deception Sticker',
    description: 'Adversarial sticker disrupting the arrow boundary, misleading autonomous driving models or confusing arrow orientation.',
    researchReference: 'Eykholt et al., Physical Adversarial Attacks on Deep Learning Vision',
    dataUrl: svgToDataUrl(oneWayAdversarialSvg),
    groundTruth: [
      { label: 'one_way', box: { ymin: 150, xmin: 140, ymax: 330, xmax: 660 } }
    ],
    defaultPatchBox: { ymin: 180, xmin: 520, ymax: 300, xmax: 620 }
  },
  {
    id: 'sample-no-parking-clean',
    name: 'No Parking Sign (Clean - MUTCD R7-1)',
    category: 'traffic_sign',
    isAdversarial: false,
    description: 'A standard MUTCD R7-1 No Parking Any Time regulatory sign on curbside post.',
    dataUrl: svgToDataUrl(noParkingCleanSvg),
    groundTruth: [
      { label: 'no_parking_sign', box: { ymin: 100, xmin: 360, ymax: 570, xmax: 640 } }
    ]
  },
  {
    id: 'sample-no-parking-adversarial',
    name: 'No Parking Sign with Adversarial Sticker',
    category: 'traffic_sign',
    isAdversarial: true,
    attackType: 'Parking Prohibition Inversion Patch',
    description: 'A localized adversarial sticker affixed across the prohibition slash, causing autonomous parking systems to misread restriction.',
    dataUrl: svgToDataUrl(noParkingAdversarialSvg),
    groundTruth: [
      { label: 'no_parking_sign', box: { ymin: 100, xmin: 360, ymax: 570, xmax: 640 } }
    ],
    defaultPatchBox: { ymin: 210, xmin: 480, ymax: 330, xmax: 590 }
  },
  {
    id: 'sample-train-railroad-clean',
    name: 'Railroad Crossing Sign & Train (Clean)',
    category: 'traffic_sign',
    isAdversarial: false,
    description: 'Advance Railroad Crossing W10-1 warning sign with oncoming passenger train on parallel tracks.',
    dataUrl: svgToDataUrl(trainRailroadCleanSvg),
    groundTruth: [
      { label: 'railroad_crossing_sign', box: { ymin: 290, xmin: 30, ymax: 580, xmax: 245 } },
      { label: 'train', box: { ymin: 230, xmin: 230, ymax: 580, xmax: 780 } }
    ]
  },
  {
    id: 'sample-train-railroad-adversarial',
    name: 'Railroad Crossing Sign with Adversarial Sticker',
    category: 'traffic_sign',
    isAdversarial: true,
    attackType: 'Railway Warning Disruption Sticker',
    description: 'An adversarial sticker obscuring the railway warning cross, preventing autonomous train / vehicle crossing detection.',
    dataUrl: svgToDataUrl(trainRailroadAdversarialSvg),
    groundTruth: [
      { label: 'railroad_crossing_sign', box: { ymin: 290, xmin: 30, ymax: 580, xmax: 245 } },
      { label: 'train', box: { ymin: 230, xmin: 230, ymax: 580, xmax: 780 } }
    ],
    defaultPatchBox: { ymin: 380, xmin: 80, ymax: 480, xmax: 180 }
  },
  {
    id: 'sample-donotenter-clean',
    name: 'Do Not Enter Sign (Clean - MUTCD R5-1)',
    category: 'traffic_sign',
    isAdversarial: false,
    description: 'Standard MUTCD R5-1 Do Not Enter regulatory sign for wrong-way prohibition.',
    dataUrl: svgToDataUrl(doNotEnterCleanSvg),
    groundTruth: [
      { label: 'do_not_enter', box: { ymin: 90, xmin: 250, ymax: 390, xmax: 550 } }
    ]
  },
  {
    id: 'sample-multi-signs',
    name: 'Multi-Sign Rail Crossing (Stop, No Parking, Railroad & Train)',
    category: 'traffic_sign',
    isAdversarial: false,
    description: 'An urban railway intersection featuring multiple critical road signs simultaneously: Stop Sign, No Parking Sign, Railroad Crossing Sign, and a passing Train.',
    researchReference: 'MUTCD Standard Highway Signs & High-Speed Automated Rail Surveillance',
    dataUrl: svgToDataUrl(multiSignIntersectionSvg),
    groundTruth: [
      { label: 'stop_sign', box: { ymin: 210, xmin: 75, ymax: 510, xmax: 200 } },
      { label: 'no_parking_sign', box: { ymin: 215, xmin: 210, ymax: 420, xmax: 310 } },
      { label: 'railroad_crossing_sign', box: { ymin: 180, xmin: 335, ymax: 390, xmax: 445 } },
      { label: 'train', box: { ymin: 300, xmin: 440, ymax: 490, xmax: 780 } }
    ]
  },
  {
    id: 'sample-stop-clean',
    name: 'Stop Sign (Clean Baseline - MUTCD R1-1)',
    category: 'traffic_sign',
    isAdversarial: false,
    description: 'An uncorrupted Stop Sign under daylight conditions. Detectors successfully achieve high-confidence detection (~94%).',
    dataUrl: svgToDataUrl(stopSignCleanSvg),
    groundTruth: [
      { label: 'stop_sign', box: { ymin: 160, xmin: 280, ymax: 730, xmax: 710 } }
    ]
  },
  {
    id: 'sample-stop-adversarial',
    name: 'Stop Sign with Adversarial Sticker',
    category: 'traffic_sign',
    isAdversarial: true,
    attackType: 'RP2 Chromatic Disruption Sticker',
    description: 'A physical high-gradient sticker placed on a Stop Sign. Causes baseline object detectors to either drop the bounding box or misclassify it as a Speed Limit sign.',
    researchReference: 'Eykholt et al., "Robust Physical-World Attacks on Deep Learning Models", CVPR 2018',
    dataUrl: svgToDataUrl(stopSignAdversarialSvg),
    groundTruth: [
      { label: 'stop_sign', box: { ymin: 160, xmin: 280, ymax: 730, xmax: 710 } }
    ],
    defaultPatchBox: { ymin: 340, xmin: 440, ymax: 500, xmax: 580 }
  }
];

