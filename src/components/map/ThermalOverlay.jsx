import { simulatedThermalTelemetry } from '../../data/thermalMapData';

export default function ThermalOverlay({
  viewMode = '2d',
  hotspots = null,
  activeElevation = 'ALL',
}) {
  const dataset = hotspots || (viewMode === 'plan'
    ? simulatedThermalTelemetry.hotspotsPlan
    : simulatedThermalTelemetry.hotspots2D);

  // Color helper based on thermal status level
  const getColor = (level) => {
    switch (level) {
      case 'CRITICAL':
      case 'HOT':
        return { stroke: '#ef4444', text: '#fca5a5', fill: '#ef4444' };
      case 'HIGH':
      case 'ELEVATED':
        return { stroke: '#f97316', text: '#fdba74', fill: '#f97316' };
      case 'MODERATE':
      case 'NORMAL':
        return { stroke: '#10b981', text: '#86efac', fill: '#10b981' };
      case 'COOL':
      default:
        return { stroke: '#38bdf8', text: '#bae6fd', fill: '#38bdf8' };
    }
  };

  return (
    <g id="thermal-overlay-layer" className="transition-opacity duration-300 pointer-events-none">
      <defs>
        {/* Radial Heatmap Gradients for Intensity Zones */}
        <radialGradient id="grad-thermal-hot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#f97316" stopOpacity="0.25" />
          <stop offset="85%" stopColor="#f97316" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="grad-thermal-elevated" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.38" />
          <stop offset="55%" stopColor="#eab308" stopOpacity="0.18" />
          <stop offset="85%" stopColor="#eab308" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="grad-thermal-normal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="grad-thermal-cool" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#1e40af" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="grad-thermal-shaft-plenum" x1="0%" x2="0%" y1="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.32" />
          <stop offset="60%" stopColor="#eab308" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
        </linearGradient>

        <linearGradient id="grad-strata-cool-band" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.18" />
          <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      {/* =================================================================== */}
      {/* 1. HEATMAP INTENSITY ZONES (SEMI-TRANSPARENT, MAP REMAINS VISIBLE)  */}
      {/* =================================================================== */}
      {viewMode === '2d' ? (
        <g id="heatmap-zones-2d">
          {/* COOL: Surface Cap & Upper Aquifer (0m to -170m) */}
          <rect
            x="60"
            y="45"
            width="690"
            height="115"
            fill="url(#grad-strata-cool-band)"
            rx="4"
            opacity={activeElevation === 'ALL' ? 1 : 0.25}
          />

          {/* NORMAL: Level 1 (-350m) & Level 2 (-620m) Galleries */}
          <rect
            x="198"
            y="124"
            width="482"
            height="22"
            fill="url(#grad-thermal-normal)"
            rx="8"
            opacity={activeElevation === 'ALL' || activeElevation === 'L1' ? 1 : 0.25}
          />
          <rect
            x="198"
            y="244"
            width="512"
            height="28"
            fill="url(#grad-thermal-normal)"
            rx="10"
            opacity={activeElevation === 'ALL' || activeElevation === 'L2' ? 1 : 0.25}
          />

          {/* ELEVATED: Shaft 1 Hoist Drive Machinery (-620m / Mid-Shaft) */}
          <ellipse
            cx="184"
            cy="240"
            rx="46"
            ry="32"
            fill="url(#grad-thermal-elevated)"
            opacity={activeElevation === 'ALL' || activeElevation === 'L2' ? 1 : 0.3}
          />

          {/* ELEVATED: Shaft 2 Air Exhaust Plenum Upward Heat Dispersion */}
          <rect
            x="538"
            y="120"
            width="28"
            height="260"
            fill="url(#grad-thermal-shaft-plenum)"
            rx="4"
            opacity={activeElevation === 'ALL' || activeElevation === 'L2' ? 1 : 0.35}
          />

          {/* ELEVATED: Level 4 Drainage Sump Pump Engine (-900m) */}
          <ellipse
            cx="420"
            cy="476"
            rx="58"
            ry="26"
            fill="url(#grad-thermal-elevated)"
            opacity={activeElevation === 'ALL' || activeElevation === 'SUMP' ? 1 : 0.25}
          />

          {/* HOTSPOT CLOUD: Level 3 Drift C / Station 14A CH4 Zone (-850m) */}
          <g opacity={activeElevation === 'ALL' || activeElevation === 'L3' ? 1 : 0.25}>
            <ellipse
              cx="480"
              cy="405"
              rx="115"
              ry="34"
              fill="url(#grad-thermal-hot)"
            />
            <ellipse
              cx="480"
              cy="405"
              rx="48"
              ry="16"
              fill="#ef4444"
              fillOpacity="0.22"
            />
          </g>
        </g>
      ) : (
        <g id="heatmap-zones-plan">
          {/* COOL: West Portal Fresh Air Intake Crosscut */}
          <ellipse
            cx="140"
            cy="260"
            rx="75"
            ry="45"
            fill="url(#grad-thermal-cool)"
          />

          {/* NORMAL: Main Haulage Drift C Gallery */}
          <rect
            x="180"
            y="238"
            width="470"
            height="44"
            fill="url(#grad-thermal-normal)"
            rx="12"
          />

          {/* NORMAL: Refuge Shelter B Stub Room */}
          <ellipse
            cx="220"
            cy="160"
            rx="45"
            ry="35"
            fill="url(#grad-thermal-normal)"
          />

          {/* ELEVATED: Rover R-01 Electric Drive Motors & Battery */}
          <ellipse
            cx="410"
            cy="260"
            rx="52"
            ry="38"
            fill="url(#grad-thermal-elevated)"
          />

          {/* HOTSPOT CLOUD: Station 14A Active Face Thermal Zone */}
          <ellipse
            cx="540"
            cy="260"
            rx="110"
            ry="54"
            fill="url(#grad-thermal-hot)"
          />
          <circle
            cx="540"
            cy="260"
            r="26"
            fill="#ef4444"
            fillOpacity="0.25"
          />
        </g>
      )}

      {/* =================================================================== */}
      {/* 2. REALISTIC HOTSPOT SENSOR MARKERS & HUD LABELS                    */}
      {/* =================================================================== */}
      <g id="thermal-hotspot-markers">
        {dataset.map((spot) => {
          const colors = getColor(spot.level);
          const isHot = spot.level === 'HOT' || spot.level === 'CRITICAL';
          const isElevated = spot.level === 'ELEVATED' || spot.level === 'HIGH';
          const spotOpacity =
            viewMode !== '2d' || activeElevation === 'ALL' || !spot.levelKey
              ? 1
              : spot.levelKey === activeElevation
                ? 1
                : 0.22;

          return (
            <g
              key={spot.id}
              id={spot.id}
              className="thermal-spot-group transition-opacity duration-300"
              opacity={spotOpacity}
            >
              {/* Radar pulse ring for HOT and ELEVATED zones */}
              {(isHot || isElevated) && (
                <circle
                  cx={spot.cx}
                  cy={spot.cy}
                  r={spot.radius * 0.42}
                  fill="none"
                  stroke={colors.stroke}
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                  opacity="0.75"
                />
              )}

              {/* Core Sensor Pip */}
              <circle
                cx={spot.cx}
                cy={spot.cy}
                r={isHot ? 5 : 4}
                fill={colors.fill}
                stroke="#060e20"
                strokeWidth="1.5"
              />

              {/* Leader Pointer Line to Tag */}
              <line
                x1={spot.cx}
                y1={spot.cy}
                x2={spot.tagX}
                y2={spot.tagY}
                stroke={colors.stroke}
                strokeWidth="0.8"
                strokeDasharray="2 2"
                opacity="0.6"
              />

              {/* High-Contrast Semi-Transparent Dark Glass HUD Tag */}
              <rect
                x={spot.tagX - 4}
                y={spot.tagY - 13}
                width={isHot ? 165 : 155}
                height="18"
                rx="3"
                fill="#060e20"
                fillOpacity="0.88"
                stroke={colors.stroke}
                strokeWidth="0.9"
                strokeOpacity="0.75"
              />

              {/* Sensor Temperature & Title Readout */}
              <text
                x={spot.tagX + 3}
                y={spot.tagY}
                fill={colors.text}
                fontFamily="JetBrains Mono, monospace"
                fontSize="10"
                fontWeight="bold"
                letterSpacing="0.2"
              >
                {isHot ? '🔥' : isElevated ? '⚡' : '●'} {spot.temperature}°C &bull; {spot.title}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
}
