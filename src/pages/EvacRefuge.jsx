import { useState } from 'react';
import {
  evacuationOverview,
  tunnelPathConditions,
  suggestedOperatorPaths,
} from '../data/evacuationData';

// Underground LoRa Mesh Fixed Network Nodes (Non-GPS Reference)
const loraNodes = [
  {
    id: 'node-01',
    label: 'NODE 01',
    role: 'SURFACE GW',
    level: 'Surface (0.0m)',
    cx: 194,
    cy: 60,
    tagX: 216,
    tagY: 50,
  },
  {
    id: 'node-02',
    label: 'NODE 02',
    role: 'LVL -350 RELAY',
    level: 'Upper Haulage (-350m)',
    cx: 380,
    cy: 135,
    tagX: 346,
    tagY: 96,
  },
  {
    id: 'node-03',
    label: 'NODE 03',
    role: 'RAMP RELAY',
    level: 'Incline Ramp (-620m)',
    cx: 360,
    cy: 245,
    tagX: 326,
    tagY: 205,
  },
  {
    id: 'node-04',
    label: 'NODE 04',
    role: 'LVL -850 HUB',
    level: 'Drift C Base (-850m)',
    cx: 330,
    cy: 375,
    tagX: 296,
    tagY: 400,
  },
  {
    id: 'node-05',
    label: 'NODE 05',
    role: 'BYPASS NODE',
    level: 'Sector 4 East (-850m)',
    cx: 560,
    cy: 350,
    tagX: 526,
    tagY: 306,
  },
];

export default function EvacRefuge() {
  // Selected refuge chamber for map highlighting
  const [selectedRefugeId, setSelectedRefugeId] = useState('R-01');

  // Selected operator path inspection
  const [selectedPathId, setSelectedPathId] = useState('path-r01');

  // Operator manual tunnel marking states
  const [tunnelConditions, setTunnelConditions] = useState(tunnelPathConditions);
  const [actionNotice, setActionNotice] = useState(null);

  // Mark tunnel blocked / caution quick action
  const handleMarkTunnel = (id, newStatus, newType) => {
    setTunnelConditions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: newStatus, statusType: newType } : t
      )
    );
    setActionNotice({
      type: 'warning',
      text: `Sector status updated: ${newStatus}`,
    });
    setTimeout(() => setActionNotice(null), 3500);
  };

  const activePath = suggestedOperatorPaths.find((p) => p.id === selectedPathId) || suggestedOperatorPaths[0];

  return (
    <main className="flex-1 min-w-0 bg-[#0b1326] p-3.5 flex flex-col gap-3 overflow-y-auto industrial-scrollbar">
        {/* PAGE BANNER HEADER */}
        <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/25 pb-3 gap-2 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[24px]">alt_route</span>
              <h1 className="font-bold text-[17px] md:text-[18px] tracking-wider uppercase text-on-surface">
                EVACUATION &amp; REFUGE
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-mono text-[12px] font-semibold">
                SITUATIONAL AWARENESS
              </span>
            </div>
            <p className="text-on-surface-variant text-[12.5px] mt-1">
              Operator-assisted evacuation support and refuge awareness &bull; Manually teleoperated rescue rover
            </p>
          </div>

          {/* Right Status Indicators */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-[12px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950/40 border border-amber-500/50 text-amber-300 font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              RESCUE MODE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              LoRa LINK ACTIVE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold shadow-sm">
              ACTIVE HAZARD ZONES: <span className="text-secondary font-bold">02</span>
            </span>
          </div>
        </div>

        {/* ACTION / NOTIFICATION TOAST BANNER (IF ACTIVE) */}
        {actionNotice && (
          <div
            className={`px-3.5 py-2 rounded-lg border flex items-center justify-between text-[12.5px] font-mono transition-all animate-fadeIn shrink-0 ${
              actionNotice.type === 'danger'
                ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                : actionNotice.type === 'warning'
                ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                : actionNotice.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-sky-950/60 border-sky-500 text-sky-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                {actionNotice.type === 'danger' ? 'report' : 'info'}
              </span>
              <span>{actionNotice.text}</span>
            </div>
            <span className="text-[11px] opacity-75 uppercase">TELEMETRY ACK</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. SEARCH & RESCUE FOCUS: WHO, WHERE & WHAT DIRECTIVE */}
        {/* ========================================================================= */}
        <section className="bg-surface-container-low/90 border-2 border-amber-500/50 rounded-lg p-3.5 shadow-md flex flex-col gap-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/30 pb-2.5 gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[24px] animate-pulse">person_alert</span>
              <div>
                <h2 className="font-bold text-[15px] md:text-[16px] tracking-wider uppercase text-on-surface">
                  PRIMARY SEARCH &amp; RESCUE DIRECTIVE
                </h2>
                <span className="font-mono text-[11px] text-amber-300">
                  CRITICAL S&amp;R MISSION AM-07 &bull; HUMAN LOCATED IN SECTOR 4
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11.5px]">
              <span className="px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/60 text-amber-300 font-bold animate-pulse">
                1 VICTIM LOCALIZED
              </span>
              <span className="px-2.5 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-emerald-400 font-semibold">
                94.2% AI CONFIDENCE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[12px]">
            {/* WHO needs help? */}
            <div className="bg-[#060e20] p-3 rounded-lg border border-amber-500/30 flex flex-col justify-between">
              <div>
                <span className="text-amber-400 font-bold uppercase text-[11px] tracking-wider block">
                  1. WHO NEEDS HELP?
                </span>
                <span className="text-on-surface font-bold text-[14px] mt-1 block">
                  1 Worker &bull; 1 Possible Injured
                </span>
                <p className="text-[11.5px] text-on-surface-variant font-sans mt-1 leading-snug">
                  Telemetry confirms stationary worker located near Drift C crosscut. Victim awaits operator rescue guidance.
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                <span className="text-outline">VICTIM STATUS:</span>
                <span className="text-amber-300 font-bold">STATIONARY / AWAITS RESCUE</span>
              </div>
            </div>

            {/* WHERE are they? */}
            <div className="bg-[#060e20] p-3 rounded-lg border border-sky-500/30 flex flex-col justify-between">
              <div>
                <span className="text-sky-400 font-bold uppercase text-[11px] tracking-wider block">
                  2. WHERE ARE THEY?
                </span>
                <span className="text-on-surface font-bold text-[14px] mt-1 block">
                  Drift C East Crosscut (Station 14A)
                </span>
                <p className="text-[11.5px] text-on-surface-variant font-sans mt-1 leading-snug">
                  Sub-sea depth -850.4m, approximately 12 meters ahead of Rover R-01. Directly adjacent to blocked haulage drift.
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                <span className="text-outline">COORDINATES:</span>
                <span className="text-sky-300 font-bold">-850.4m &bull; STN 14A</span>
              </div>
            </div>

            {/* WHAT action is required? */}
            <div className="bg-[#060e20] p-3 rounded-lg border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <span className="text-emerald-400 font-bold uppercase text-[11px] tracking-wider block">
                  3. WHAT ACTION IS REQUIRED?
                </span>
                <span className="text-on-surface font-bold text-[14px] mt-1 block">
                  Divert to Refuge R-01 (110m)
                </span>
                <p className="text-[11.5px] text-on-surface-variant font-sans mt-1 leading-snug">
                  Forward drift blocked by rubble (0.38m sonar). Broadcast evacuation audio via PA speaker directing worker up North Ramp to Refuge R-01.
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                <span className="text-outline">RECOMMENDED HAVEN:</span>
                <span className="text-emerald-300 font-bold">R-01 (-350m, 110m)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. EVACUATION OVERVIEW (4 COMPACT SUMMARY CARDS) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full shrink-0">
          {/* Card 1: Active Hazard Zones */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3 shadow-sm flex flex-col justify-between min-h-[108px]">
            <div className="flex items-start justify-between gap-1">
              <div>
                <span className="font-mono text-[12.5px] font-bold text-on-surface uppercase block">
                  {evacuationOverview.activeHazardZones.label}
                </span>
                <span className="font-mono text-[11px] text-outline block mt-0.5">
                  MQ-4 &bull; Multi-Gas Surveillance
                </span>
              </div>
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded border font-semibold ${evacuationOverview.activeHazardZones.badgeColor}`}>
                {evacuationOverview.activeHazardZones.badge}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-[24px] font-bold text-amber-400 leading-none">
                {evacuationOverview.activeHazardZones.count}
              </span>
              <span className="text-[12px] text-on-surface-variant text-right truncate max-w-[180px]">
                {evacuationOverview.activeHazardZones.detail}
              </span>
            </div>
          </div>

          {/* Card 2: Blocked Tunnel Sections */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3 shadow-sm flex flex-col justify-between min-h-[108px]">
            <div className="flex items-start justify-between gap-1">
              <div>
                <span className="font-mono text-[12.5px] font-bold text-on-surface uppercase block">
                  {evacuationOverview.blockedSections.label}
                </span>
                <span className="font-mono text-[11px] text-outline block mt-0.5">
                  HC-SR04 Sonar Detection
                </span>
              </div>
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded border font-semibold ${evacuationOverview.blockedSections.badgeColor}`}>
                {evacuationOverview.blockedSections.badge}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-[24px] font-bold text-rose-400 leading-none">
                {evacuationOverview.blockedSections.count}
              </span>
              <span className="text-[12px] text-on-surface-variant text-right truncate max-w-[180px]">
                Level -850 Drift (0.38m blockage)
              </span>
            </div>
          </div>

          {/* Card 3: Available Refuge Points */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3 shadow-sm flex flex-col justify-between min-h-[108px]">
            <div className="flex items-start justify-between gap-1">
              <div>
                <span className="font-mono text-[12.5px] font-bold text-on-surface uppercase block">
                  {evacuationOverview.availableRefuges.label}
                </span>
                <span className="font-mono text-[11px] text-outline block mt-0.5">
                  Sub-surface Shelters
                </span>
              </div>
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded border font-semibold ${evacuationOverview.availableRefuges.badgeColor}`}>
                {evacuationOverview.availableRefuges.badge}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-[24px] font-bold text-emerald-400 leading-none">
                {evacuationOverview.availableRefuges.count}
              </span>
              <span className="text-[12px] text-on-surface-variant text-right truncate max-w-[180px]">
                R-01 (110m) &bull; R-02 &bull; R-03
              </span>
            </div>
          </div>

          {/* Card 4: Rover Communication Status */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3 shadow-sm flex flex-col justify-between min-h-[108px]">
            <div className="flex items-start justify-between gap-1">
              <div>
                <span className="font-mono text-[12.5px] font-bold text-on-surface uppercase block">
                  {evacuationOverview.roverCommStatus.label}
                </span>
                <span className="font-mono text-[11px] text-outline block mt-0.5">
                  SX1278 Transceiver
                </span>
              </div>
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded border font-semibold ${evacuationOverview.roverCommStatus.badgeColor}`}>
                {evacuationOverview.roverCommStatus.badge}
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[20px] font-bold text-sky-400 leading-none">
                  -94 dBm
                </span>
                <span className="text-[12px] text-emerald-400 font-mono">18ms</span>
              </div>
              <span className="text-[12px] text-on-surface-variant text-right">
                433.0 MHz &bull; 0% Loss
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. MINE EVACUATION MAP (MAIN VISUAL SECTION) */}
        {/* ========================================================================= */}
        <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
          {/* Map Section Title Bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/20 pb-2.5 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
              <div>
                <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                  MINE NETWORK &amp; LoRa NODE LOCATIONS &bull; SECTOR 4
                </h2>
                <span className="font-mono text-[11px] text-outline uppercase block mt-0.5">
                  CONCEPTUAL UNDERGROUND MESH &bull; NON-GPS REFERENCE GRID &bull; 433 MHz MULTI-HOP
                </span>
              </div>
            </div>

            {/* Toolbar Controls: Operator Path Selector */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-[12px]">
              <div className="flex items-center gap-1.5">
                <span className="text-outline uppercase text-[11px] font-medium hidden md:inline">
                  PATH:
                </span>
                <div className="flex items-center bg-[#060e20] p-0.5 rounded border border-outline-variant/40">
                  {suggestedOperatorPaths.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPathId(p.id)}
                      className={`px-2.5 py-1 rounded text-[11.5px] font-medium transition-all ${
                        selectedPathId === p.id
                          ? 'bg-primary/20 text-primary border border-primary/40 font-semibold'
                          : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      {p.id === 'path-r01' ? 'Path → R-01 (110m)' : p.id === 'path-r03' ? 'Path → R-03 (240m)' : 'Shaft Egress (310m)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive SVG Cross-Section Mine Evacuation Map */}
          <div className="relative w-full h-[400px] md:h-[450px] bg-[#060e20] rounded-lg border border-outline-variant/30 overflow-hidden select-none">
            {/* Background Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="evac-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#171f33" strokeWidth="0.75" />
                </pattern>
                {/* Danger zone hatch pattern */}
                <pattern id="hatch-danger" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#f59e0b" strokeWidth="2.5" strokeOpacity="0.4" />
                </pattern>
                {/* Blocked tunnel hatch pattern */}
                <pattern id="hatch-blocked" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="2.5" strokeOpacity="0.5" />
                </pattern>
                {/* Path pulse gradient */}
                <linearGradient id="path-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#evac-grid)" />
            </svg>

            {/* Main SVG Schematic */}
            <svg
              className="w-full h-full"
              viewBox="0 0 880 500"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* DEPTH ELEVATION SCALE (Left Margin) */}
              <line x1="60" y1="35" x2="60" y2="480" stroke="#3f4850" strokeWidth="1.5" />
              
              {/* Elevation Ticks */}
              <line x1="52" y1="45" x2="60" y2="45" stroke="#89929b" strokeWidth="1.5" />
              <text x="12" y="49" fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11.5">0.0m</text>
              <text x="75" y="49" fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11">SURFACE HEADFRAME</text>

              <line x1="52" y1="135" x2="60" y2="135" stroke="#89929b" strokeWidth="1" />
              <text x="10" y="139" fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11.5">-350m</text>

              <line x1="52" y1="245" x2="60" y2="245" stroke="#89929b" strokeWidth="1" />
              <text x="10" y="249" fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11.5">-620m</text>

              <line x1="50" y1="375" x2="60" y2="375" stroke="#38bdf8" strokeWidth="2" />
              <text x="8" y="379" fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="bold">-850m</text>

              <line x1="52" y1="460" x2="60" y2="460" stroke="#89929b" strokeWidth="1" />
              <text x="10" y="464" fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11.5">-900m</text>

              {/* VERTICAL HOIST SHAFT (Primary Escape Route / Ventilation) */}
              <rect x="180" y="35" width="28" height="430" fill="#091326" stroke="#2d3449" strokeWidth="2" />
              <line x1="187" y1="35" x2="187" y2="465" stroke="#3f4850" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="201" y1="35" x2="201" y2="465" stroke="#3f4850" strokeDasharray="4 4" strokeWidth="1" />

              {/* Surface Headframe Structure */}
              <polygon points="170,45 194,15 218,45" fill="#171f33" stroke="#89929b" strokeWidth="1.5" />
              <rect x="186" y="20" width="16" height="15" fill="#002c47" stroke="#38bdf8" strokeWidth="1" />
              <text x="230" y="38" fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="bold">
                MAIN SHAFT HOIST (SURFACE EGRESS)
              </text>

              {/* Underground LoRa Mesh Network Indicator Tag */}
              <g id="network-badge" transform="translate(860, 32)">
                <text x="0" y="0" fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="bold" textAnchor="end">
                  LoRa 433 MHz UNDERGROUND MULTI-HOP
                </text>
                <text x="0" y="14" fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="9" textAnchor="end">
                  NON-GPS LOCAL REFERENCE &bull; DRIFT PROPAGATION
                </text>
              </g>

              {/* =================================================== */}
              {/* LEVEL -350m: UPPER HAULAGE & REFUGE R-01 */}
              {/* =================================================== */}
              <g id="level-350">
                {/* Tunnel path */}
                <path d="M 208 135 L 560 135 L 610 115 L 720 115" fill="none" stroke="#2d3449" strokeWidth="22" strokeLinecap="round" />
                <path d="M 208 135 L 560 135 L 610 115 L 720 115" fill="none" stroke="#091326" strokeWidth="16" strokeLinecap="round" />
                
                {/* Level Tag */}
                <rect x="220" y="123" width="90" height="22" rx="3" fill="#171f33" stroke="#3f4850" strokeWidth="1" />
                <text x="226" y="138" fill="#dae2fd" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="bold">
                  LEVEL -350
                </text>

                {/* Tunnel Label */}
                <text x="325" y="139" fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11">
                  EAST DRIFT (CLEAR &bull; FRESH AIR SPLIT)
                </text>

                {/* REFUGE R-01 BAY */}
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedRefugeId('R-01')}
                >
                  <rect
                    x="680"
                    y="95"
                    width="120"
                    height="42"
                    rx="4"
                    fill={selectedRefugeId === 'R-01' ? '#064e3b' : '#022c22'}
                    stroke="#10b981"
                    strokeWidth={selectedRefugeId === 'R-01' ? '2' : '1.5'}
                  />
                  <circle cx="700" cy="116" r="6" fill="#10b981" className="animate-pulse" />
                  <text x="715" y="112" fill="#6ee7b7" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="bold">
                    REFUGE R-01
                  </text>
                  <text x="715" y="127" fill="#a7f3d0" fontFamily="JetBrains Mono, monospace" fontSize="10">
                    AVAILABLE (110m)
                  </text>
                </g>
              </g>

              {/* =================================================== */}
              {/* LEVEL -620m: SOUTH PASSAGE & METHANE HAZARD ZONE */}
              {/* =================================================== */}
              <g id="level-620">
                {/* Tunnel path */}
                <path d="M 208 245 L 430 245 L 490 265 L 680 265" fill="none" stroke="#2d3449" strokeWidth="22" strokeLinecap="round" />
                <path d="M 208 245 L 430 245 L 490 265 L 680 265" fill="none" stroke="#091326" strokeWidth="16" strokeLinecap="round" />

                {/* Level Tag */}
                <rect x="220" y="233" width="90" height="22" rx="3" fill="#171f33" stroke="#3f4850" strokeWidth="1" />
                <text x="226" y="248" fill="#dae2fd" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="bold">
                  LEVEL -620
                </text>

                {/* METHANE HAZARD OVERLAY (CAUTION ZONE) */}
                <rect x="420" y="235" width="130" height="42" rx="4" fill="url(#hatch-danger)" stroke="#f59e0b" strokeWidth="1.5" />
                <rect x="430" y="247" width="110" height="18" rx="2" fill="#451a03" stroke="#d97706" strokeWidth="1" />
                <text x="436" y="260" fill="#fde68a" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="bold">
                  ⚠️ CH4 CAUTION 1.05%
                </text>

                {/* REFUGE R-02 BAY (Caution Proximity) */}
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedRefugeId('R-02')}
                >
                  <rect
                    x="640"
                    y="245"
                    width="120"
                    height="42"
                    rx="4"
                    fill={selectedRefugeId === 'R-02' ? '#451a03' : '#271202'}
                    stroke="#f59e0b"
                    strokeWidth={selectedRefugeId === 'R-02' ? '2' : '1.5'}
                  />
                  <circle cx="658" cy="266" r="6" fill="#f59e0b" />
                  <text x="672" y="262" fill="#fde68a" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="bold">
                    REFUGE R-02
                  </text>
                  <text x="672" y="277" fill="#fed7aa" fontFamily="JetBrains Mono, monospace" fontSize="10">
                    CAUTION (185m)
                  </text>
                </g>
              </g>

              {/* INCLINE RAMP (Connecting -850m to -350m & -620m) */}
              <path d="M 330 375 L 360 245 L 380 135" fill="none" stroke="#2d3449" strokeWidth="18" strokeLinecap="round" />
              <path d="M 330 375 L 360 245 L 380 135" fill="none" stroke="#091326" strokeWidth="12" strokeLinecap="round" />
              <text x="365" y="195" fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="10" transform="rotate(-70 365 195)">
                NORTH ESCAPE RAMP
              </text>

              {/* =================================================== */}
              {/* LEVEL -850m: DRIFT C, ROVER R-01, BLOCKED TUNNEL & R-03 */}
              {/* =================================================== */}
              <g id="level-850">
                {/* Main Drift C Path */}
                <path d="M 208 375 L 500 375 L 560 350 L 730 350" fill="none" stroke="#2d3449" strokeWidth="22" strokeLinecap="round" />
                <path d="M 208 375 L 500 375 L 560 350 L 730 350" fill="none" stroke="#091326" strokeWidth="16" strokeLinecap="round" />

                {/* Level Tag */}
                <rect x="220" y="363" width="90" height="22" rx="3" fill="#171f33" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="226" y="378" fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="bold">
                  LEVEL -850
                </text>

                {/* Drift C Methane Rising Plume (Behind Rover) */}
                <rect x="390" y="360" width="85" height="30" rx="3" fill="url(#hatch-danger)" stroke="#f59e0b" strokeWidth="1" />
                <text x="395" y="380" fill="#fcd34d" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="bold">
                  CH4: 1.15%
                </text>

                {/* BLOCKED ACCESS DRIFT (Physical obstruction detected by HC-SR04) */}
                <g id="blocked-segment">
                  <path d="M 500 375 L 580 405 L 670 405" fill="none" stroke="#2d3449" strokeWidth="20" strokeLinecap="round" />
                  <path d="M 500 375 L 580 405 L 670 405" fill="none" stroke="#091326" strokeWidth="14" strokeLinecap="round" />
                  
                  {/* Blockage Hatch & Barrier */}
                  <rect x="540" y="390" width="70" height="30" rx="3" fill="url(#hatch-blocked)" stroke="#ef4444" strokeWidth="1.5" />
                  <line x1="575" y1="388" x2="575" y2="422" stroke="#ef4444" strokeWidth="4" />
                  
                  {/* Sonar Blockage Callout Tag */}
                  <rect x="525" y="425" width="135" height="20" rx="2" fill="#450a0a" stroke="#f87171" strokeWidth="1" />
                  <text x="530" y="439" fill="#fca5a5" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="bold">
                    ⛔ SONAR BLOCKED (0.38m)
                  </text>
                </g>

                {/* NORTH BYPASS DRIFT (Clear detour leading to R-03) */}
                <path d="M 500 375 L 560 350 L 710 350" fill="none" stroke="#091326" strokeWidth="14" strokeLinecap="round" />
                
                {/* REFUGE R-03 (North Deep Seam Haven) */}
                <g
                  className="cursor-pointer transition-transform hover:opacity-90"
                  onClick={() => setSelectedRefugeId('R-03')}
                >
                  <rect
                    x="690"
                    y="330"
                    width="120"
                    height="42"
                    rx="4"
                    fill={selectedRefugeId === 'R-03' ? '#064e3b' : '#022c22'}
                    stroke="#10b981"
                    strokeWidth={selectedRefugeId === 'R-03' ? '2' : '1.5'}
                  />
                  <circle cx="708" cy="351" r="6" fill="#10b981" />
                  <text x="722" y="347" fill="#6ee7b7" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="bold">
                    REFUGE R-03
                  </text>
                  <text x="722" y="362" fill="#a7f3d0" fontFamily="JetBrains Mono, monospace" fontSize="10">
                    AVAILABLE (240m)
                  </text>
                </g>

                {/* =================================================== */}
                {/* LOCALIZED WORKER / INJURED VICTIM MARKER */}
                <g id="worker-victim" transform="translate(420, 365)">
                  {/* Warning Radar Ping */}
                  <circle cx="10" cy="10" r="16" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.85" className="animate-ping" />
                  {/* Person Icon Circle */}
                  <circle cx="10" cy="10" r="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="10" cy="7" r="3" fill="#fde68a" />
                  <path d="M 6 15 Q 10 11 14 15" stroke="#fde68a" strokeWidth="2" fill="none" />
                  {/* Tag */}
                  <rect x="-42" y="-24" width="104" height="18" rx="2" fill="#060e20" stroke="#f59e0b" strokeWidth="1.2" />
                  <text x="-38" y="-11" fill="#fde68a" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fontWeight="bold">
                    WORKER [STATION 14A]
                  </text>
                </g>
              </g>

              {/* =================================================== */}
              {/* UNDERGROUND LoRa MESH COMMUNICATION BACKBONE (433 MHz) */}
              {/* Multi-hop: Node 01 → Node 02 → Node 03 → Node 04 → Node 05 */}
              {/* =================================================== */}
              <g id="lora-mesh-backbone">
                {/* Multi-Hop Glow Background */}
                <path
                  d="M 194 65 L 194 135 L 380 135 L 360 245 L 330 375 L 500 375 L 560 350"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.25"
                />
                {/* Multi-Hop Dashed Link Line */}
                <path
                  d="M 194 65 L 194 135 L 380 135 L 360 245 L 330 375 L 500 375 L 560 350"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Directional Hop Indicators & Labels */}
                {/* Hop 1: Surface Headframe down Shaft to Level -350 */}
                <g transform="translate(194, 98)">
                  <polygon points="-3,-4 3,-4 0,3" fill="#38bdf8" />
                  <rect x="8" y="-7" width="38" height="14" rx="2" fill="#060e20" stroke="#38bdf8" strokeWidth="0.75" />
                  <text x="27" y="3" fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" textAnchor="middle">
                    HOP 1
                  </text>
                </g>

                {/* Hop 2: Level -350 down North Ramp to Node 03 */}
                <g transform="translate(370, 190)">
                  <polygon points="-2,-4 3,0 -1,4" fill="#38bdf8" transform="rotate(-65)" />
                  <rect x="8" y="-7" width="38" height="14" rx="2" fill="#060e20" stroke="#38bdf8" strokeWidth="0.75" />
                  <text x="27" y="3" fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" textAnchor="middle">
                    HOP 2
                  </text>
                </g>

                {/* Hop 3: Node 03 down Ramp to Node 04 */}
                <g transform="translate(345, 310)">
                  <polygon points="-2,-4 3,0 -1,4" fill="#38bdf8" transform="rotate(-65)" />
                  <rect x="8" y="-7" width="38" height="14" rx="2" fill="#060e20" stroke="#38bdf8" strokeWidth="0.75" />
                  <text x="27" y="3" fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" textAnchor="middle">
                    HOP 3
                  </text>
                </g>

                {/* Hop 4: Node 04 along Drift C to Node 05 */}
                <g transform="translate(465, 375)">
                  <polygon points="-4,-3 3,0 -4,3" fill="#38bdf8" />
                  <rect x="-19" y="-19" width="38" height="14" rx="2" fill="#060e20" stroke="#38bdf8" strokeWidth="0.75" />
                  <text x="0" y="-9" fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="8" fontWeight="bold" textAnchor="middle">
                    HOP 4
                  </text>
                </g>
              </g>

              {/* =================================================== */}
              {/* FIXED LoRa NODES / BEACONS (NON-GPS REFERENCE POINTS) */}
              {/* =================================================== */}
              <g id="lora-fixed-nodes">
                {loraNodes.map((node) => (
                  <g key={node.id} id={node.id}>
                    {/* Subtle radio signal propagation wave arcs */}
                    <path
                      d={`M ${node.cx - 8} ${node.cy - 17} A 10 10 0 0 1 ${node.cx + 8} ${node.cy - 17}`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.8"
                    />
                    <path
                      d={`M ${node.cx - 13} ${node.cy - 20} A 16 16 0 0 1 ${node.cx + 13} ${node.cy - 20}`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="0.9"
                      strokeLinecap="round"
                      strokeDasharray="2 2"
                      opacity="0.45"
                    />

                    {/* Vertical Antenna Mast */}
                    <line
                      x1={node.cx}
                      y1={node.cy - 3}
                      x2={node.cx}
                      y2={node.cy - 14}
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {/* Antenna Beacon Tip */}
                    <circle cx={node.cx} cy={node.cy - 14} r="2.5" fill="#38bdf8" />

                    {/* Wall/Corridor Mounting Plate Bracket */}
                    <line
                      x1={node.cx - 9}
                      y1={node.cy + 9}
                      x2={node.cx + 9}
                      y2={node.cy + 9}
                      stroke="#475569"
                      strokeWidth="1.5"
                    />

                    {/* Fixed Transceiver Enclosure Box */}
                    <rect
                      x={node.cx - 7}
                      y={node.cy - 3}
                      width="14"
                      height="12"
                      rx="2"
                      fill="#061e38"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />
                    {/* Heartbeat Status LED */}
                    <circle cx={node.cx} cy={node.cy + 3} r="2" fill="#10b981" />

                    {/* Identification Badge / Plate */}
                    <g>
                      <rect
                        x={node.tagX}
                        y={node.tagY}
                        width="68"
                        height="19"
                        rx="3"
                        fill="#060e20"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <text
                        x={node.tagX + 34}
                        y={node.tagY + 10}
                        fill="#38bdf8"
                        fontFamily="JetBrains Mono, monospace"
                        fontSize="9.5"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                      <text
                        x={node.tagX + 34}
                        y={node.tagY + 17}
                        fill="#89929b"
                        fontFamily="JetBrains Mono, monospace"
                        fontSize="7"
                        fontWeight="medium"
                        textAnchor="middle"
                      >
                        {node.role}
                      </text>
                    </g>
                  </g>
                ))}
              </g>

              {/* =================================================== */}
              {/* OPERATOR SELECTED EVACUATION PATH (DYNAMIC OVERLAY) */}
              {/* =================================================== */}
              {selectedPathId === 'path-r01' && (
                <g id="selected-path-r01">
                  {/* Evacuation Path: Node 04 (330, 375) -> North Ramp (380, 135) -> Refuge R-01 (680, 115) */}
                  <path
                    d="M 330 375 L 360 245 L 380 135 L 560 135 L 610 115 L 680 115"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  {/* Waypoint Nodes */}
                  <circle cx="330" cy="375" r="4.5" fill="#10b981" />
                  <circle cx="380" cy="135" r="4.5" fill="#10b981" />
                  <circle cx="680" cy="115" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                </g>
              )}

              {selectedPathId === 'path-r03' && (
                <g id="selected-path-r03">
                  {/* Evacuation Path: Node 04 (330, 375) -> North Bypass (560, 350) -> Refuge R-03 (690, 350) */}
                  <path
                    d="M 330 375 L 500 375 L 560 350 L 690 350"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  <circle cx="330" cy="375" r="4.5" fill="#38bdf8" />
                  <circle cx="560" cy="350" r="4.5" fill="#38bdf8" />
                  <circle cx="690" cy="350" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                </g>
              )}

              {selectedPathId === 'path-shaft' && (
                <g id="selected-path-shaft">
                  {/* Evacuation Path: Node 04 (330, 375) -> Shaft base (200, 375) -> Vertical Shaft Hoist (200, 50) */}
                  <path
                    d="M 330 375 L 200 375 L 200 50"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeDasharray="8 6"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  <circle cx="330" cy="375" r="4.5" fill="#f59e0b" />
                  <circle cx="200" cy="375" r="4.5" fill="#f59e0b" />
                  <circle cx="200" cy="50" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
                </g>
              )}

              {/* LEVEL -900m: DRAINAGE SUMP */}
              <g id="level-900">
                <path d="M 208 460 L 380 460 L 440 475 L 620 475" fill="none" stroke="#2d3449" strokeWidth="18" strokeLinecap="round" />
                <path d="M 208 460 L 380 460 L 440 475 L 620 475" fill="none" stroke="#091326" strokeWidth="12" strokeLinecap="round" />
                <rect x="220" y="448" width="90" height="22" rx="3" fill="#171f33" stroke="#3f4850" strokeWidth="1" />
                <text x="226" y="463" fill="#dae2fd" fontFamily="JetBrains Mono, monospace" fontSize="11.5" fontWeight="bold">
                  SUMP -900
                </text>
                <text x="325" y="464" fill="#89929b" fontFamily="JetBrains Mono, monospace" fontSize="11">
                  DRAINAGE SUMP &bull; PUMP STATION ACTIVE
                </text>
              </g>
            </svg>

            {/* Bottom-Left HUD: Underground Network Architecture Status */}
            <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 font-mono text-[11.5px] pointer-events-auto">
              <div className="bg-[#060e20]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant/40 flex items-center gap-2.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-400 font-semibold">LoRa MESH ONLINE</span>
                <span className="text-outline">|</span>
                <span className="text-outline">TOPOLOGY:</span>
                <span className="text-on-surface font-medium">5 FIXED NODES</span>
                <span className="text-outline">|</span>
                <span className="text-sky-300 font-medium">NON-GPS REFERENCE</span>
              </div>
            </div>

            {/* Bottom-Right HUD: Map Legend Overlay */}
            <div className="absolute bottom-3 right-3 bg-[#060e20]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant/40 flex flex-wrap items-center gap-3.5 font-mono text-[11.5px] shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm border border-sky-400 bg-sky-950/80 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-sky-400"></span>
                </span>
                <span className="text-sky-300 font-medium">Fixed LoRa Node</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0 border-t-2 border-dashed border-sky-400"></span>
                <span className="text-sky-300 font-medium">Multi-Hop Link</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full border border-amber-400 bg-amber-500"></span>
                <span className="text-amber-300 font-medium">Worker Location</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm border border-emerald-500 bg-emerald-950/40"></span>
                <span className="text-emerald-400 font-medium">Refuge Bay</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm border border-rose-500 bg-rose-950/40"></span>
                <span className="text-rose-400 font-medium">Sonar Blockage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm border border-amber-500 bg-amber-950/40"></span>
                <span className="text-amber-400 font-medium">Hazard Zone</span>
              </div>
            </div>
          </div>

          {/* Active Suggested Operator Path Details Card */}
          <div className="bg-[#060e20] p-3 rounded-lg border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] uppercase text-outline font-semibold">INSPECTED PATH:</span>
                <span className="font-bold text-[13.5px] text-on-surface">{activePath.title}</span>
                <span className={`font-mono text-[11px] px-2 py-0.5 rounded border font-semibold ${activePath.statusColor}`}>
                  {activePath.status}
                </span>
              </div>
              <p className="text-[12.5px] text-on-surface-variant leading-normal">
                {activePath.summary}
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0 font-mono text-[12px] border-t md:border-t-0 md:border-l border-outline-variant/30 pt-2 md:pt-0 md:pl-4">
              <div>
                <span className="text-outline text-[11px] block">EGRESS DISTANCE</span>
                <span className="text-on-surface font-bold text-[15px]">{activePath.distance}</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block">HAZARD PROXIMITY</span>
                <span className="text-amber-400 font-medium text-[12px]">{activePath.hazardProximity.split('—')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. HAZARD-AWARE EVACUATION SUPPORT (LOGIC PANEL) */}
        {/* ========================================================================= */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">account_tree</span>
              <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                HAZARD-AWARE SITUATIONAL LOGIC PIPELINE
              </h2>
            </div>
            <span className="font-mono text-[11px] text-outline uppercase">
              OPERATOR-IN-THE-LOOP &bull; NO AUTONOMOUS DECISIONS
            </span>
          </div>

          {/* Visual Sensor-to-Decision Pipeline Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center font-mono text-[12px]">
            {/* Step 1: Raw Sensor Payload */}
            <div className="bg-[#060e20] p-3 rounded border border-outline-variant/30 flex flex-col items-center justify-center gap-1.5">
              <span className="text-primary font-bold text-[12.5px] uppercase">1. SENSOR PAYLOAD CORRELATION</span>
              <p className="text-[11.5px] text-on-surface-variant font-sans leading-tight">
                Gas (MQ-4, MQ-7, O2) + Smoke (MQ-2) + Temp/RH (DHT22) + Sonar (HC-SR04)
              </p>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-outline text-[11px]">
                Continuous LoRa Uplink
              </span>
            </div>

            {/* Step 2: Hazard Identification */}
            <div className="bg-[#060e20] p-3 rounded border border-amber-500/30 flex flex-col items-center justify-center gap-1.5">
              <span className="text-amber-400 font-bold text-[12.5px] uppercase">2. HAZARD IDENTIFICATION</span>
              <p className="text-[11.5px] text-on-surface-variant font-sans leading-tight">
                Drift C Methane Spike (1.15%) + Level -850 Rubble Obstacle (0.38m Forward Sonar)
              </p>
              <span className="px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 text-[11px] border border-amber-600/40 font-semibold">
                Zones Flagged on Map
              </span>
            </div>

            {/* Step 3: Operator Decision */}
            <div className="bg-[#060e20] p-3 rounded border border-emerald-500/30 flex flex-col items-center justify-center gap-1.5">
              <span className="text-emerald-400 font-bold text-[12.5px] uppercase">3. OPERATOR EVACUATION DECISION</span>
              <p className="text-[11.5px] text-on-surface-variant font-sans leading-tight">
                Human operator selects safe refuge haven (R-01) and issues speaker advisory via LoRa
              </p>
              <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 text-[11px] border border-emerald-600/40 font-semibold">
                Operator Action Required
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. TUNNEL / PATH CONDITION LIST */}
        {/* ========================================================================= */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                MINE PASSAGE CONDITIONS &bull; ROVER SENSOR OBSERVATIONS
              </h2>
            </div>
            <span className="font-mono text-[11px] text-outline uppercase">
              HC-SR04 ULTRASONIC &bull; MQ-4 GAS SURVEILLANCE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {tunnelConditions.map((item) => (
              <div
                key={item.id}
                className="bg-[#060e20] p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-bold text-primary">{item.level}</span>
                      <span className="text-outline text-[12px]">/</span>
                      <span className="font-mono text-[12px] font-bold text-on-surface">{item.passage}</span>
                    </div>
                    <span className="font-mono text-[11px] text-outline block mt-0.5">
                      Sensor: {item.sensorSource}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[11px] px-2.5 py-0.5 rounded border font-semibold shrink-0 ${
                      item.statusType === 'clear'
                        ? 'text-emerald-400 bg-emerald-950/30 border-emerald-600/40'
                        : item.statusType === 'caution'
                        ? 'text-amber-400 bg-amber-950/30 border-amber-600/40'
                        : 'text-rose-400 bg-rose-950/30 border-rose-600/40'
                    }`}
                  >
                    {item.status.split('—')[0]}
                  </span>
                </div>

                <p className="text-[12px] text-on-surface-variant leading-snug">
                  {item.observation}
                </p>

                {/* Operator Override Quick Action */}
                <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-outline-variant/20 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleMarkTunnel(item.id, 'CLEAR', 'clear')}
                    className="px-2 py-0.5 rounded bg-surface-container-high hover:bg-emerald-950/40 text-outline hover:text-emerald-400 border border-outline-variant/30 transition-colors"
                  >
                    Mark Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkTunnel(item.id, 'CAUTION — Methane warning', 'caution')}
                    className="px-2 py-0.5 rounded bg-surface-container-high hover:bg-amber-950/40 text-outline hover:text-amber-400 border border-outline-variant/30 transition-colors"
                  >
                    Mark Caution
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkTunnel(item.id, 'BLOCKED — Obstacle detected', 'blocked')}
                    className="px-2 py-0.5 rounded bg-surface-container-high hover:bg-rose-950/40 text-outline hover:text-rose-400 border border-outline-variant/30 transition-colors"
                  >
                    Mark Blocked
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
    </main>
  );
}
