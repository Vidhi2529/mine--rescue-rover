export default function PlanViewCanvas({
  layerFilters = { rover: true, gas: true, refuges: true, mesh: true },
  focusPulse = false,
  measureActive = false,
  children,
}) {
  return (
    <svg
      className="w-full h-full"
      fill="none"
      viewBox="0 0 760 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Level 3 -850m Drift C Top-Down Plan View Map"
    >
      <defs>
        <pattern height="30" id="plan-grid-pattern" patternUnits="userSpaceOnUse" width="30">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#131b2e" strokeDasharray="2 2" strokeWidth="0.6" />
        </pattern>
        <linearGradient id="plan-rock-bg" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#080f1e" />
          <stop offset="50%" stopColor="#0a1324" />
          <stop offset="100%" stopColor="#050a14" />
        </linearGradient>
        <linearGradient id="plan-ch4-cloud" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#ffb77d" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffb77d" stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Background Bedrock Strata & Coordinate Grid */}
      <rect fill="url(#plan-rock-bg)" height="520" width="760" />
      <rect fill="url(#plan-grid-pattern)" height="520" width="760" />

      {/* Coordinate Grid Labels (Plan View Northing / Easting) */}
      <g opacity="0.4" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#89929b">
        <text x="75" y="35">E1100</text>
        <text x="235" y="35">E1200</text>
        <text x="395" y="35">E1300</text>
        <text x="555" y="35">E1400</text>
        <text x="695" y="35">E1500</text>
        <text x="15" y="150">N4600</text>
        <text x="15" y="265">N4500</text>
        <text x="15" y="390">N4400</text>
      </g>

      {/* Compass Rose & Heading (Top-Left) */}
      <g transform="translate(45, 45)">
        <circle cx="20" cy="20" r="16" stroke="#3f4850" strokeWidth="1" fill="#060e20" fillOpacity="0.8" />
        <line x1="20" y1="6" x2="20" y2="34" stroke="#89929b" strokeWidth="1" />
        <line x1="6" y1="20" x2="34" y2="20" stroke="#89929b" strokeWidth="1" />
        <polygon points="20,8 16,18 24,18" fill="#38bdf8" />
        <text x="25" y="12" fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="bold">N</text>
        <text x="-5" y="46" fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="9">GRID 4-C</text>
      </g>

      {/* =================================================================== */}
      {/* TUNNEL NETWORK (TOP-DOWN HORIZONTAL PLAN)                           */}
      {/* =================================================================== */}

      {/* Main Haulage Drift C (Running West to East) */}
      <g id="plan-drift-c">
        {/* Outer Rock Cut */}
        <path d="M 80 260 L 680 260" stroke="#2d3449" strokeLinecap="round" strokeWidth="36" />
        {/* Clear Interior Gallery Path */}
        <path d="M 80 260 L 680 260" stroke="#131b2e" strokeLinecap="round" strokeWidth="28" />
        {/* Mine Rail Haulage Tracks */}
        <line x1="85" y1="256" x2="675" y2="256" stroke="#3f4850" strokeWidth="1.2" strokeDasharray="4 2" />
        <line x1="85" y1="264" x2="675" y2="264" stroke="#3f4850" strokeWidth="1.2" strokeDasharray="4 2" />
        {/* Drift Label */}
        <text fill="#dae2fd" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" x="90" y="235">
          MAIN HAULAGE DRIFT C [-850m HORIZONTAL]
        </text>
      </g>

      {/* North Crosscut (Access to Refuge Shelter B) */}
      <g id="plan-crosscut-north">
        <path d="M 220 260 L 220 150" stroke="#2d3449" strokeLinecap="round" strokeWidth="28" />
        <path d="M 220 260 L 220 150" stroke="#131b2e" strokeLinecap="round" strokeWidth="20" />
        <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="10.5" x="235" y="205">
          XC-14 North Crosscut
        </text>
      </g>

      {/* South Ventilation Bypass Stub */}
      <g id="plan-crosscut-south">
        <path d="M 370 260 L 370 380" stroke="#2d3449" strokeLinecap="round" strokeWidth="26" />
        <path d="M 370 260 L 370 380" stroke="#131b2e" strokeLinecap="round" strokeWidth="18" />
        <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="10.5" x="385" y="340">
          XC-15 South Bypass
        </text>
      </g>

      {/* East Face / Dead-End Ventilation Heading */}
      <path d="M 680 260 L 710 260" stroke="#2d3449" strokeDasharray="3 3" strokeWidth="20" strokeLinecap="round" />
      <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="10" x="650" y="295">
        Drift Face (Unmapped)
      </text>

      {/* =================================================================== */}
      {/* FILTERABLE OVERLAYS (GAS, ROVER, REFUGES, MESH)                    */}
      {/* =================================================================== */}

      {/* 1. Methane Gas Advisory Zone Highlight (Station 14A) */}
      {layerFilters.gas && (
        <g id="plan-gas-advisory">
          <rect
            x="460"
            y="235"
            width="170"
            height="50"
            rx="5"
            fill="url(#plan-ch4-cloud)"
            stroke="#d97707"
            strokeDasharray="4 3"
            strokeWidth="1.5"
          />
          <text fill="#ffb77d" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="bold" x="468" y="225">
            ⚠️ ADVISORY: CH4 1.15% (STATION 14A)
          </text>
        </g>
      )}

      {/* 2. Refuge Shelter B */}
      {layerFilters.refuges && (
        <g id="plan-refuge-chamber">
          <rect
            x="160"
            y="130"
            width="120"
            height="32"
            rx="4"
            fill="#171f33"
            stroke="#62df7d"
            strokeWidth="1.5"
          />
          <text fill="#62df7d" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="bold" x="168" y="150">
            REFUGE SHELTER B
          </text>
          <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="9.5" x="168" y="178">
            Station 12 Stub &bull; Sealed
          </text>
        </g>
      )}

      {/* 3. LoRa Sensor Mesh Nodes */}
      {layerFilters.mesh && (
        <g id="plan-sensor-mesh">
          {/* LoRa Repeater Node 1 */}
          <circle cx="140" cy="260" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <text fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="10" x="110" y="285">MESH NODE-01</text>
          {/* LoRa Repeater Node 2 */}
          <circle cx="620" cy="260" r="5" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
          <text fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="10" x="590" y="285">MESH NODE-02</text>
          {/* RF Link Beam */}
          <line x1="140" y1="260" x2="410" y2="260" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <line x1="410" y1="260" x2="620" y2="260" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        </g>
      )}

      {/* 4. Active Rover R-01 (Manual Teleop) with Sensor Sweep Cone */}
      {layerFilters.rover && (
        <g id="plan-rover-teleop" className={focusPulse ? 'animate-bounce' : ''}>
          {/* Forward Sonar Sweep Cone */}
          <path
            d="M 410 260 L 470 238 L 470 282 Z"
            fill="#93ccff"
            fillOpacity="0.16"
            stroke="#93ccff"
            strokeDasharray="2 2"
            strokeWidth="0.8"
          />
          {/* Rover Chassis Body */}
          <rect
            x="396"
            y="250"
            width="28"
            height="20"
            rx="3"
            fill="#002c47"
            stroke="#93ccff"
            strokeWidth="1.5"
          />
          {/* Left / Right Tracks */}
          <rect x="394" y="247" width="32" height="4" rx="1" fill="#3198dc" />
          <rect x="394" y="269" width="32" height="4" rx="1" fill="#3198dc" />
          {/* Rover Center Point */}
          <circle cx="410" cy="260" r="3.5" fill="#93ccff" />
          {/* Telemetry Tag */}
          <rect x="360" y="290" width="130" height="20" rx="3" fill="#002c47" stroke="#93ccff" strokeWidth="1" />
          <text fill="#93ccff" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="bold" x="368" y="304">
            🤖 ROVER R-01 [EAST]
          </text>
        </g>
      )}

      {/* Distance Measure Tool Line */}
      {measureActive && (
        <g id="plan-measure-active">
          <line x1="220" y1="260" x2="410" y2="260" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 2" />
          <rect x="280" y="244" width="70" height="18" rx="3" fill="#0284c7" />
          <text fill="#ffffff" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="bold" x="288" y="257">
            📏 65.4m
          </text>
        </g>
      )}

      {/* Map Scale Ruler (Bottom Edge) */}
      <g transform="translate(80, 480)" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#89929b">
        <line x1="0" y1="0" x2="160" y2="0" stroke="#89929b" strokeWidth="1.5" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#89929b" strokeWidth="1.5" />
        <line x1="80" y1="-3" x2="80" y2="3" stroke="#89929b" strokeWidth="1" />
        <line x1="160" y1="-4" x2="160" y2="4" stroke="#89929b" strokeWidth="1.5" />
        <text x="0" y="14">0m</text>
        <text x="70" y="14">50m</text>
        <text x="145" y="14">100m</text>
        <text x="175" y="2" fill="#89929b">SCALE: 1:1000</text>
      </g>

      {/* Child Layers (e.g. ThermalOverlay) */}
      {children}
    </svg>
  );
}
