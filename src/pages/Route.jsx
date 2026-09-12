import { useState } from 'react';
import { amg8833ThermalGrid, getThermalCellColor } from '../data/roverControlData';

export default function Route() {
  const [viewMode, setViewMode] = useState('2d');
  const [thermalOverlay, setThermalOverlay] = useState(false);

  return (
    <>
      {/* 2. CENTER COLUMN: PRIMARY WORKSPACE */}
      <main className="flex-1 min-w-0 bg-[#0b1326] p-3.5 flex flex-col gap-3 overflow-y-auto industrial-scrollbar">
        {/* MAP CONTROLS & FILTER SYSTEM BAR (Jury Safe - Real Prototype Focus) */}
        <div className="shrink-0 bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3 flex flex-col gap-2.5 shadow-sm font-mono">
          <div className="flex items-center justify-between gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded border border-outline-variant/30 text-[13px]">
              <button
                className={`px-3.5 py-1.5 rounded font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer ${
                  viewMode === '2d'
                    ? 'bg-primary text-[#003351]'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
                onClick={() => setViewMode('2d')}
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">layers</span> 2D Cross-Section
              </button>
              <button
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-2 font-medium cursor-pointer ${
                  viewMode === 'plan'
                    ? 'bg-primary text-[#003351] font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setViewMode('plan')}
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">radar</span> Plan View
              </button>
              <button
                aria-pressed={thermalOverlay}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-2 cursor-pointer ${
                  thermalOverlay
                    ? 'bg-primary text-[#003351] font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
                data-state={thermalOverlay ? 'on' : 'off'}
                onClick={() => setThermalOverlay((prev) => !prev)}
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">device_thermostat</span> Thermal Overlay
              </button>
            </div>

            {/* Quick Action Tools */}
            <div className="flex items-center gap-2 text-[12.5px]">
              <button className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors font-medium" title="Measure Gallery Distance" type="button">
                <span className="material-symbols-outlined text-[16px] text-primary">straighten</span> Measure
              </button>
              <button className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors font-medium" title="Focus Rover Coordinates" type="button">
                <span className="material-symbols-outlined text-[16px] text-tertiary">center_focus_strong</span> Focus Rover
              </button>
              <button className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors font-medium" title="Export Telemetry Log" type="button">
                <span className="material-symbols-outlined text-[16px] text-outline">download</span> Export Log
              </button>
            </div>
          </div>

          {/* Sub-row: Depth pills & Layer toggles */}
          <div className="flex items-center justify-between border-t border-outline-variant/20 pt-2.5 text-[12px] md:text-[12.5px]">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-outline uppercase font-semibold mr-1 text-[12px]">Elevations:</span>
              <button className="px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant/30 text-primary font-semibold" type="button">All Levels</button>
              <button className="px-2.5 py-1 rounded bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant" type="button">L1: -350m</button>
              <button className="px-2.5 py-1 rounded bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant" type="button">L2: -620m</button>
              <button className="px-2.5 py-1 rounded bg-sky-950/60 border border-primary/40 text-primary font-semibold" type="button">L3: -850m [Active]</button>
              <button className="px-2.5 py-1 rounded bg-surface-container/60 hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant" type="button">Sump: -900m</button>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-on-surface-variant bg-surface-container/50 px-2.5 py-1 rounded border border-outline-variant/20 cursor-pointer">
                <input defaultChecked className="rounded bg-surface-container-lowest border-outline-variant/40 text-primary w-3.5 h-3.5" type="checkbox" />
                <span className="text-primary font-semibold text-[12px]">Rover R-01</span>
              </label>
              <label className="flex items-center gap-1.5 text-on-surface-variant bg-surface-container/50 px-2.5 py-1 rounded border border-outline-variant/20 cursor-pointer">
                <input defaultChecked className="rounded bg-surface-container-lowest border-outline-variant/40 text-primary w-3.5 h-3.5" type="checkbox" />
                <span className="text-secondary font-semibold text-[12px]">Gas Advisory (CH4)</span>
              </label>
              <label className="flex items-center gap-1.5 text-on-surface-variant bg-surface-container/50 px-2.5 py-1 rounded border border-outline-variant/20 cursor-pointer">
                <input defaultChecked className="rounded bg-surface-container-lowest border-outline-variant/40 text-primary w-3.5 h-3.5" type="checkbox" />
                <span className="text-tertiary font-semibold text-[12px]">Refuges (2)</span>
              </label>
              <label className="flex items-center gap-1.5 text-on-surface-variant bg-surface-container/50 px-2.5 py-1 rounded border border-outline-variant/20 cursor-pointer">
                <input defaultChecked className="rounded bg-surface-container-lowest border-outline-variant/40 text-primary w-3.5 h-3.5" type="checkbox" />
                <span className="text-sky-400 font-semibold text-[12px]">Sensor Mesh</span>
              </label>
            </div>
          </div>
        </div>

        {/* GEOSPATIAL MINE CROSS-SECTION SCHEMATIC VIEWPORT */}
        <div className="relative flex-1 min-h-[480px] bg-black rounded-xl border border-outline-variant/40 overflow-hidden shadow-2xl ring-1 ring-primary/20 flex flex-col">
          {/* SVG Schematic Canvas */}
          <svg className="w-full h-full" fill="none" viewBox="0 0 760 520" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="30" id="grid-pattern" patternUnits="userSpaceOnUse" width="30">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#131b2e" strokeDasharray="2 2" strokeWidth="0.6" />
              </pattern>
              <linearGradient id="rock-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#080f1e" />
                <stop offset="50%" stopColor="#0a1324" />
                <stop offset="100%" stopColor="#050a14" />
              </linearGradient>
              <linearGradient id="ch4-cloud" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#ffb77d" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffb77d" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="vent-flow" x1="0%" x2="0%" y1="100%" y2="0%">
                <stop offset="0%" stopColor="#3198dc" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#93ccff" stopOpacity="0.1" />
              </linearGradient>
              <radialGradient id="amg-thermal-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.75" />
                <stop offset="35%" stopColor="#ea580c" stopOpacity="0.5" />
                <stop offset="70%" stopColor="#d97707" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="thermal-scan-cone" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#ea580c" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Background Strata */}
            <rect fill="url(#rock-gradient)" height="520" width="760" />
            <rect fill="url(#grid-pattern)" height="520" width="760" />

            {/* Geological Strata Layers / Rock Formations */}
            <path d="M 60 50 Q 280 45 480 55 T 750 48" stroke="#2d3449" strokeDasharray="3 3" strokeWidth="1.2" />
            <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="600" x="610" y="42">SURFACE CAP [0.0m]</text>
            <path d="M 60 170 Q 250 160 520 175 T 750 165" stroke="#1f283d" strokeDasharray="4 2" strokeWidth="1" />
            <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11.5" x="550" y="160">SANDSTONE AQUIFER SHIELD</text>
            <path d="M 60 305 Q 310 295 560 312 T 750 300" stroke="#1f283d" strokeDasharray="4 2" strokeWidth="1" />
            <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11.5" x="580" y="295">ORE VEIN ALPHA FAULT</text>
            <path d="M 60 435 Q 330 425 580 440 T 750 430" stroke="#1f283d" strokeDasharray="4 2" strokeWidth="1" />
            <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11.5" x="560" y="425">BASALT BEDROCK (-880m)</text>

            {/* VERTICAL SHAFTS */}
            {/* Shaft 1 (Main Access / Hoist) */}
            <rect fill="#131b2e" height="445" stroke="#3f4850" strokeWidth="1.5" width="28" x="170" y="45" />
            <line stroke="#3198dc" strokeDasharray="4 4" strokeWidth="1" x1="184" x2="184" y1="45" y2="490" />
            {/* Hoist Cage Visual */}
            <rect fill="#222a3d" height="28" rx="2" stroke="#93ccff" strokeWidth="1.5" width="22" x="173" y="240" />
            <line stroke="#93ccff" strokeWidth="1" x1="178" x2="190" y1="254" y2="254" />
            <text fill="#93ccff" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" x="115" y="37">SHAFT 1 (MAIN HOIST)</text>

            {/* Shaft 2 (Exhaust Air Plenum) */}
            <rect fill="url(#vent-flow)" height="390" stroke="#3f4850" strokeWidth="1.5" width="24" x="540" y="45" />
            <path d="M 552 430 L 552 50" stroke="#3198dc" strokeDasharray="6 4" strokeWidth="1.5" />
            <text fill="#62df7d" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" x="470" y="37">SHAFT 2 (AIR EXHAUST)</text>

            {/* Surface Headframe & Portal */}
            <polygon fill="none" points="160,45 184,15 208,45" stroke="#89929b" strokeWidth="1.5" />
            <circle cx="184" cy="22" fill="none" r="6" stroke="#93ccff" strokeWidth="1.5" />

            {/* HORIZONTAL DRIFTS / MINE LEVELS */}
            {/* LEVEL 1: -350m Haulage Gallery */}
            <g id="level-350m">
              <path d="M 198 135 L 540 135 L 680 135" stroke="#2d3449" strokeLinecap="round" strokeWidth="22" />
              <path d="M 198 135 L 540 135 L 680 135" stroke="#131b2e" strokeLinecap="round" strokeWidth="18" />
              <line stroke="#3f4850" strokeDasharray="4 3" strokeWidth="1" x1="200" x2="675" y1="140" y2="140" />
              <path d="M 230 132 L 245 132 M 310 132 L 325 132 M 450 132 L 465 132" stroke="#3198dc" strokeDasharray="3 3" strokeWidth="1.5" />
              <rect fill="#171f33" height="24" rx="3" stroke="#3f4850" strokeWidth="1" width="98" x="70" y="123" />
              <text fill="#dae2fd" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" x="76" y="139">L1 -350m</text>
              <rect fill="#131b2e" height="20" rx="3" stroke="#3f4850" strokeWidth="1" width="115" x="375" y="125" />
              <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11.5" x="382" y="139">North Drift Entry</text>
            </g>

            {/* LEVEL 2: -620m Ore Gallery */}
            <g id="level-620m">
              <path d="M 198 250 L 320 250 L 370 270 L 540 270 L 710 270" stroke="#2d3449" strokeLinecap="round" strokeWidth="22" />
              <path d="M 198 250 L 320 250 L 370 270 L 540 270 L 710 270" stroke="#131b2e" strokeLinecap="round" strokeWidth="18" />
              <rect fill="#171f33" height="24" rx="3" stroke="#3f4850" strokeWidth="1" width="98" x="70" y="238" />
              <text fill="#dae2fd" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" x="76" y="254">L2 -620m</text>
              {/* Refuge Chamber A */}
              <rect fill="#171f33" height="24" rx="3" stroke="#62df7d" strokeWidth="1.5" width="118" x="395" y="257" />
              <text fill="#62df7d" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="bold" x="402" y="273">REFUGE CHAMBER A</text>
              <rect fill="#131b2e" height="20" rx="3" stroke="#3f4850" strokeWidth="1" width="120" x="215" y="240" />
              <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11.5" x="222" y="254">Mid Crosscut Safe</text>
            </g>

            {/* LEVEL 3: -850m Sub-Surface Drift C (ACTIVE ROVER TELEMETRY FOCUS) */}
            <g id="level-850m">
              <path d="M 198 385 L 290 385 L 340 405 L 540 405 L 720 405" opacity="0.2" stroke="#3198dc" strokeLinecap="round" strokeWidth="24" />
              <path d="M 198 385 L 290 385 L 340 405 L 540 405 L 720 405" stroke="#2d3449" strokeLinecap="round" strokeWidth="22" />
              <path d="M 198 385 L 290 385 L 340 405 L 540 405 L 720 405" stroke="#060e20" strokeLinecap="round" strokeWidth="18" />

              {/* METHANE GAS ADVISORY ZONE HIGHLIGHT */}
              <rect fill="url(#ch4-cloud)" height="34" rx="4" stroke="#d97707" strokeDasharray="4 3" strokeWidth="1.5" width="220" x="415" y="387" />
              <text fill="#ffb77d" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" x="422" y="383">⚠️ ADVISORY: CH4 1.15% (STATION 14A)</text>

              {/* Level Marker Focus Pill */}
              <rect fill="#004b73" height="24" rx="3" stroke="#93ccff" strokeWidth="1.5" width="98" x="70" y="373" />
              <text fill="#cce5ff" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" x="76" y="389">L3 -850m ★</text>

              {/* Active Rover R-01 (Manual Teleop) with Sensor Sweep Cone */}
              <path d="M 480 405 L 420 385 L 420 425 Z" fill="#93ccff" fillOpacity="0.15" stroke="#93ccff" strokeDasharray="2 2" strokeWidth="0.8" />
              <circle cx="480" cy="405" fill="#3198dc" r="6" stroke="#93ccff" strokeWidth="1.5" />
              <rect fill="#002c47" height="22" rx="3" stroke="#93ccff" strokeWidth="1.2" width="144" x="490" y="394" />
              <text fill="#93ccff" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" x="496" y="409">🤖 ROVER R-01 [MANUAL]</text>

              {/* Refuge Chamber B */}
              <rect fill="#171f33" height="24" rx="3" stroke="#62df7d" strokeWidth="1.5" width="118" x="270" y="372" />
              <text fill="#62df7d" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="bold" x="276" y="388">REFUGE CHAMBER B</text>

              {/* AMG8833 THERMAL SENSOR MAP OVERLAY */}
              {thermalOverlay && (
                <g id="thermal-map-overlay" className="pointer-events-none transition-opacity duration-300">
                  {/* Thermal Radiation Halo */}
                  <ellipse cx="435" cy="405" rx="95" ry="26" fill="url(#amg-thermal-glow)" />

                  {/* AMG8833 IR Scan Sweep Cone */}
                  <path d="M 480 405 L 375 375 L 375 435 Z" fill="url(#thermal-scan-cone)" stroke="#ea580c" strokeDasharray="3 2" strokeWidth="1" />

                  {/* Projected 8x8 AMG8833 IR Sensor Grid Footprint */}
                  <g transform="translate(378, 383)">
                    {amg8833ThermalGrid.map((row, r) =>
                      row.map((val, c) => (
                        <rect
                          key={`amg-svg-${r}-${c}`}
                          x={c * 9.5}
                          y={r * 5.5}
                          width={8.5}
                          height={4.5}
                          rx={1}
                          fill={getThermalCellColor(val)}
                          fillOpacity={val >= 30 ? 0.85 : 0.45}
                          stroke={val >= 34 ? '#ffffff' : '#000000'}
                          strokeWidth={val >= 34 ? 0.8 : 0.2}
                          strokeOpacity={val >= 34 ? 0.9 : 0.3}
                        />
                      ))
                    )}
                  </g>

                  {/* Hotspot Target Marker & Callout Badge */}
                  <line stroke="#ef4444" strokeDasharray="2 2" strokeWidth="1.2" x1="425" x2="425" y1="365" y2="395" />
                  <rect fill="#7f1d1d" height="22" rx="3" stroke="#ef4444" strokeWidth="1.2" width="205" x="325" y="343" />
                  <circle cx="337" cy="354" fill="#ef4444" r="4" />
                  <text fill="#fee2e2" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="bold" x="348" y="358">
                    🔥 AMG8833: 35.8°C HOTSPOT
                  </text>
                </g>
              )}
            </g>

            {/* LEVEL 4: -900m DRAINAGE SUMP */}
            <g id="level-sump">
              <path d="M 198 470 L 330 470 L 360 485 L 540 485" stroke="#2d3449" strokeLinecap="round" strokeWidth="16" />
              <path d="M 198 470 L 330 470 L 360 485 L 540 485" stroke="#060e20" strokeLinecap="round" strokeWidth="12" />
              <rect fill="#171f33" height="24" rx="3" stroke="#3f4850" strokeWidth="1" width="98" x="70" y="458" />
              <text fill="#dae2fd" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold" x="76" y="474">SUMP -900m</text>
              <rect fill="#002c47" height="18" rx="2" stroke="#3198dc" strokeWidth="1" width="105" x="420" y="476" />
              <text fill="#93ccff" fontFamily="JetBrains Mono, monospace" fontSize="11.5" x="426" y="489">⚡ SUMP PUMP ON</text>
            </g>

            {/* DEPTH RULER ELEVATION SCALE (Left Edge) */}
            <line stroke="#3f4850" strokeWidth="1.5" x1="65" x2="65" y1="45" y2="495" />
            <line stroke="#89929b" strokeWidth="1.5" x1="58" x2="65" y1="45" y2="45" />
            <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="12" x="18" y="49">0.0m</text>
            <line stroke="#89929b" strokeWidth="1" x1="58" x2="65" y1="135" y2="135" />
            <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="12" x="10" y="139">-350m</text>
            <line stroke="#89929b" strokeWidth="1" x1="58" x2="65" y1="250" y2="250" />
            <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="12" x="10" y="254">-620m</text>
            <line stroke="#93ccff" strokeWidth="2" x1="56" x2="65" y1="385" y2="385" />
            <text fill="#93ccff" fontFamily="JetBrains Mono, monospace" fontSize="12.5" fontWeight="bold" x="8" y="389">-850m</text>
            <line stroke="#89929b" strokeWidth="1" x1="58" x2="65" y1="470" y2="470" />
            <text fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="12" x="10" y="474">-900m</text>
          </svg>

          {/* BOTTOM-LEFT HUD / COORDINATES */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 font-mono text-[12.5px] pointer-events-auto">
            <div className="bg-[#060e20]/90 backdrop-blur px-3.5 py-2 rounded-lg border border-outline-variant/40 flex items-center gap-2.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span className="text-outline">ROVER COORDS:</span>
              <span className="text-on-surface font-semibold">STA 14A</span>
              <span className="text-primary font-bold">DEPTH: -850.4m</span>
            </div>
          </div>

          {/* AMG8833 LIVE THERMAL OVERLAY HUD PANEL */}
          {thermalOverlay && (
            <div
              id="thermal-hud-panel"
              className="absolute top-3 right-3 bg-[#060e20]/95 backdrop-blur border border-orange-500/50 rounded-lg p-3 shadow-2xl z-20 font-mono text-[12px] max-w-[285px] pointer-events-auto transition-opacity duration-300"
            >
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-orange-400 text-[18px]">device_thermostat</span>
                  <span className="text-on-surface font-bold text-[12px] uppercase">AMG8833 Thermal IR</span>
                </div>
                <span className="text-[10.5px] font-bold text-orange-300 bg-orange-950/60 border border-orange-500/50 px-2 py-0.5 rounded">
                  HEAT ANOMALY
                </span>
              </div>

              {/* 8x8 IR Grid + Readout */}
              <div className="flex items-center gap-3">
                <div
                  className="grid grid-cols-8 gap-0.5 p-1 bg-[#0b1326] rounded border border-outline-variant/30 aspect-square w-[104px] shrink-0"
                  title="AMG8833 8x8 Infrared Matrix"
                >
                  {amg8833ThermalGrid.map((row, r) =>
                    row.map((temp, c) => (
                      <div
                        key={`hud-amg-px-${r}-${c}`}
                        className="rounded-[1px]"
                        style={{ backgroundColor: getThermalCellColor(temp) }}
                        title={`(${r},${c}): ${temp}°C`}
                      />
                    ))
                  )}
                </div>

                <div className="flex flex-col gap-1 text-[11px] leading-tight">
                  <div>
                    <span className="text-outline block text-[10px] uppercase font-semibold">Max Hotspot</span>
                    <span className="text-red-400 font-bold text-[15px] leading-none">35.8°C</span>
                    <span className="text-orange-300/80 text-[10px] block mt-0.5">&Delta; +15.8°C above wall</span>
                  </div>
                  <div className="mt-1 pt-1 border-t border-outline-variant/20">
                    <span className="text-outline block text-[10px] uppercase font-semibold">Sensor Frame</span>
                    <span className="text-on-surface font-medium">8&times;8 IR (64 px)</span>
                  </div>
                </div>
              </div>

              {/* Temperature Scale Legend */}
              <div className="mt-2.5 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[10.5px] text-outline">
                <span>18°C [Wall]</span>
                <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-[#1e40af] via-[#0284c7] via-[#d97707] via-[#ea580c] to-[#ef4444]"></div>
                <span className="text-red-400 font-semibold">36°C [Hotspot]</span>
              </div>
            </div>
          )}

          {/* BOTTOM-RIGHT MAP LEGEND OVERLAY (Jury Safe) */}
          <div className="absolute bottom-3 right-3 bg-[#060e20]/90 backdrop-blur px-3.5 py-2 rounded-lg border border-outline-variant/40 flex items-center gap-4 font-mono text-[12px] shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-primary"></span>
              <span className="text-primary font-medium">Rover R-01</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm border border-secondary bg-secondary-container/40"></span>
              <span className="text-secondary font-medium">Gas Advisory</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded border border-tertiary bg-tertiary-container/30"></span>
              <span className="text-tertiary font-medium">Refuge Shelter</span>
            </div>
            {thermalOverlay && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm border border-orange-500 bg-orange-500/50"></span>
                <span className="text-orange-300 font-medium">Thermal Overlay</span>
              </div>
            )}
          </div>
        </div>

        {/* ACTIVE SUB-SURFACE TELEMETRY STRIP (Bottom of Center Column - Sensor Supported) */}
        <div className="grid grid-cols-3 gap-3 font-mono shrink-0">
          <div className="bg-surface-container-low/90 p-3 rounded-lg border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-secondary">warning</span>
              <span className="text-outline uppercase text-[12px] font-semibold">MQ-4 Methane (Station 14A)</span>
            </div>
            <span className="text-secondary font-bold text-[18px]">1.15% <span className="text-[12px] font-normal text-outline">(Limit 1.50%)</span></span>
          </div>

          <div className="bg-surface-container-low/90 p-3 rounded-lg border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-primary">device_thermostat</span>
              <span className="text-outline uppercase text-[12px] font-semibold">DHT22 Ambient Temp / RH</span>
            </div>
            <span className="text-on-surface font-bold text-[18px]">26.8°C <span className="text-[12px] font-normal text-outline">&bull; 68% RH</span></span>
          </div>

          <div className="bg-surface-container-low/90 p-3 rounded-lg border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-tertiary">cell_tower</span>
              <span className="text-outline uppercase text-[12px] font-semibold">LoRa Telemetry Link</span>
            </div>
            <span className="text-tertiary font-bold text-[18px]">SX1278 <span className="text-[12px] font-normal text-outline">&bull; 18ms Latency</span></span>
          </div>
        </div>
      </main>

      {/* 3. RIGHT TELEMETRY COLUMN (Comfortable Width 360px - Generous Readability) */}
      <aside className="w-[360px] shrink-0 bg-[#060e20] border-l border-outline-variant/30 flex flex-col h-full overflow-hidden z-20 select-none">
        {/* Column Header (Height: 48px) */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-outline-variant/30 bg-[#060e20] shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">layers</span>
            <div className="flex flex-col">
              <h3 className="font-bold text-[14px] tracking-wider uppercase text-on-surface leading-none">SECTOR &amp; SENSOR TELEMETRY</h3>
              <span className="font-mono text-[11.5px] text-outline uppercase mt-0.5">LORA SENSOR PAYLOAD READOUTS</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-tertiary bg-tertiary-container/20 px-2.5 py-0.5 rounded border border-tertiary/20 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>ACTIVE
          </span>
        </div>

        {/* Upper Scrollable Content */}
        <div className="flex-1 overflow-y-auto industrial-scrollbar p-3.5 space-y-3.5 min-h-0 font-mono text-[12px]">
          {/* Selected Sector Sensor Grid Card */}
          <div className="bg-surface-container-low/90 border border-primary/40 rounded-lg p-3 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                <span className="font-semibold text-on-surface uppercase text-[14px]">Sector 4 Drift C</span>
              </div>
              <span className="text-[11.5px] text-primary bg-primary/15 px-2.5 py-0.5 rounded border border-primary/25 font-bold">-850m Sub-Surface</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20">
                <span className="text-outline text-[12px] block uppercase font-medium">MQ-4 Methane</span>
                <span className="text-secondary font-bold text-[18px] leading-tight block my-0.5">1.15% CH4</span>
                <span className="text-outline text-[11.5px] block">Threshold 1.50%</span>
              </div>
              <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20">
                <span className="text-outline text-[12px] block uppercase font-medium">Dedicated O2</span>
                <span className="text-on-surface font-bold text-[18px] leading-tight block my-0.5">20.8% O2</span>
                <span className="text-tertiary text-[11.5px] block font-semibold">Nominal Safe</span>
              </div>
              <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20">
                <span className="text-outline text-[12px] block uppercase font-medium">MQ-7 Carbon Mon</span>
                <span className="text-tertiary font-bold text-[18px] leading-tight block my-0.5">14 PPM</span>
                <span className="text-outline text-[11.5px] block">Safe (&lt; 35 PPM)</span>
              </div>
              <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20">
                <span className="text-outline text-[12px] block uppercase font-medium">DHT22 Temp</span>
                <span className="text-primary font-bold text-[18px] leading-tight block my-0.5">26.8°C</span>
                <span className="text-outline text-[11.5px] block">68% Humidity</span>
              </div>
            </div>
          </div>

          {/* Active Rover Specification & Teleoperation Card (Single Real Rover) */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">precision_manufacturing</span>
                <span className="text-[14px] font-semibold text-on-surface uppercase">Rescue Rover R-01</span>
              </div>
              <span className="text-[11.5px] text-tertiary bg-tertiary-container/20 px-2 py-0.5 rounded font-semibold">MANUAL TELEOP</span>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="bg-surface-container/60 p-2.5 rounded border border-primary/30 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-outline">Chassis &amp; Motors:</span>
                  <span className="text-on-surface font-semibold">Tracked Tank &bull; DC Geared</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Motor Driver:</span>
                  <span className="text-on-surface font-semibold">TB6612FNG Dual H-Bridge</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Battery Pack:</span>
                  <span className="text-tertiary font-semibold">18650 Li-ion 88% (~4h)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Sonar Clearance:</span>
                  <span className="text-primary font-semibold">HC-SR04 &bull; 1.85m Forward Clear</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Transceiver:</span>
                  <span className="text-on-surface">SX1278 LoRa (433MHz)</span>
                </div>
              </div>

              {/* Refuge B Status */}
              <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface flex items-center gap-1.5 text-[12.5px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>Refuge Shelter B (-850m)
                  </span>
                  <span className="text-tertiary text-[11.5px] font-semibold">SEALED</span>
                </div>
                <div className="flex justify-between text-outline text-[11.5px]">
                  <span>Position: Station 12 Gallery</span>
                  <span>Direct Route Clear</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Operator Teleoperation Safety Controls (SIH Defendable) */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-on-surface uppercase pb-1.5 border-b border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary text-[18px]">emergency</span>
              <span>Operator Safety Controls</span>
            </div>
            <div className="space-y-2">
              <button className="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest border border-tertiary/30 rounded text-tertiary text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm" type="button">
                <span className="material-symbols-outlined text-[17px]">campaign</span> Trigger Acoustic Speaker Beacon
              </button>
              <button className="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest border border-red-500/40 rounded text-red-300 text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm" type="button">
                <span className="material-symbols-outlined text-[17px]">pan_tool</span> Send Deadman Immediate Stop
              </button>
              <button className="w-full py-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface text-[12.5px] flex items-center justify-center gap-2 transition-colors shadow-sm" type="button">
                <span className="material-symbols-outlined text-[17px]">refresh</span> Query LoRa Telemetry Packet
              </button>
            </div>
          </div>
        </div>

        {/* AI SAFETY AGENT / ADVISORY (Bottom of Right Column - Realistic Telemetry Co-Pilot) */}
        <div className="p-3 border-t border-outline-variant/30 bg-[#060e20] shrink-0">
          <div className="bg-surface-container-low/95 border border-primary/25 rounded-lg p-3 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[16px]">psychology</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[13.5px] font-semibold text-on-surface leading-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>AI Telemetry Co-Pilot
                  </span>
                  <span className="font-mono text-[11.5px] text-outline uppercase mt-0.5">Multi-Sensor Trend Advisor</span>
                </div>
              </div>
              <span className="font-mono text-[11.5px] text-outline bg-surface-container px-2 py-0.5 rounded border border-outline-variant/30">LORA EDGE</span>
            </div>
            <div className="bg-surface-container/60 rounded p-2.5 border border-outline-variant/15 font-mono text-[12.5px]">
              <div className="text-on-surface-variant flex items-start gap-1.5">
                <span className="text-primary font-bold shrink-0">AI:</span>
                <p className="leading-relaxed text-on-surface-variant/90">
                  Methane in Drift C is elevated at 1.15% (warning threshold 1.00%). AMG8833 heat signature detected ahead. Maintain rover standby; operator verification required.
                </p>
              </div>
            </div>
            <div className="relative flex items-center w-full">
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-3 py-2 text-[12.5px] text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary font-mono pr-8"
                placeholder="Send command to Rover R-01..."
                type="text"
              />
              <button
                className="absolute right-2 text-primary hover:text-sky-300 transition-colors flex items-center justify-center"
                title="Send Command"
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">send</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}