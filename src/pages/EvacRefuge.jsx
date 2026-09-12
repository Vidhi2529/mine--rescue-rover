import { useState } from 'react';
import {
  evacuationOverview,
  refugeLocations,
  tunnelPathConditions,
  suggestedOperatorPaths,
  speakerPresets,
  recentEvacuationLogs,
} from '../data/evacuationData';

export default function EvacRefuge() {
  // Selected refuge chamber for inspector focus
  const [selectedRefugeId, setSelectedRefugeId] = useState('R-01');

  // Selected operator path inspection
  const [selectedPathId, setSelectedPathId] = useState('path-r01');

  // Selected speaker announcement preset
  const [selectedSpeakerPreset, setSelectedSpeakerPreset] = useState('spk-2');
  const [speakerTransmitting, setSpeakerTransmitting] = useState(false);
  const [speakerStatusMessage, setSpeakerStatusMessage] = useState(
    'Standby: Ready to transmit packet via LoRa 433MHz downlink.'
  );

  // Emergency stop state
  const [emergencyStopActive, setEmergencyStopActive] = useState(false);

  // Operator manual tunnel marking states
  const [tunnelConditions, setTunnelConditions] = useState(tunnelPathConditions);
  const [actionNotice, setActionNotice] = useState(null);

  // Handle speaker transmission
  const handleSendSpeaker = () => {
    const preset = speakerPresets.find((p) => p.id === selectedSpeakerPreset);
    setSpeakerTransmitting(true);
    setSpeakerStatusMessage('Broadcasting audio packet via SX1278 LoRa (433.0 MHz)...');

    setTimeout(() => {
      setSpeakerTransmitting(false);
      setSpeakerStatusMessage(`Acknowledged by R-01 Speaker: "${preset?.text}"`);
      setActionNotice({
        type: 'success',
        text: `LoRa Broadcast Sent: "${preset?.label}"`,
      });
      setTimeout(() => setActionNotice(null), 4000);
    }, 1200);
  };

  // Toggle Emergency Stop
  const handleToggleEmergencyStop = () => {
    const nextState = !emergencyStopActive;
    setEmergencyStopActive(nextState);
    if (nextState) {
      setActionNotice({
        type: 'danger',
        text: 'EMERGENCY STOP ENGAGED: Rover R-01 motor drivers halted instantly.',
      });
    } else {
      setActionNotice({
        type: 'info',
        text: 'Emergency stop cleared. Teleoperation drive controls restored.',
      });
    }
    setTimeout(() => setActionNotice(null), 4500);
  };

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

  const activeRefuge = refugeLocations.find((r) => r.id === selectedRefugeId) || refugeLocations[0];
  const activePath = suggestedOperatorPaths.find((p) => p.id === selectedPathId) || suggestedOperatorPaths[0];

  return (
    <>
      {/* 2. CENTER COLUMN: EVACUATION & REFUGE WORKSPACE */}
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
        {/* 1. EVACUATION OVERVIEW (4 COMPACT SUMMARY CARDS) */}
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
                  MQ-4 &bull; AMG8833 Thermal
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
              <span className="material-symbols-outlined text-primary text-[20px]">map</span>
              <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                UNDERGROUND EVACUATION SCHEMATIC &bull; SECTOR 4 CROSS-SECTION
              </h2>
            </div>

            {/* Operator Suggested Path Selector (No Auto-Route Claims) */}
            <div className="flex items-center gap-2 font-mono text-[12px]">
              <span className="text-outline uppercase text-[11.5px] font-medium hidden sm:inline">
                OPERATOR SUGGESTED PATH:
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
                {/* CURRENT ROVER R-01 STATION (Station 14A, -850.4m) */}
                {/* =================================================== */}
                <g id="rover-r01" transform="translate(320, 365)">
                  {/* Forward Sonar Cone Visualization (HC-SR04 60-degree beam) */}
                  <polygon points="12,10 55,-8 55,28" fill="#38bdf8" fillOpacity="0.15" stroke="#38bdf8" strokeDasharray="2 2" strokeWidth="1" />
                  
                  {/* Blinking Radar Beacon */}
                  <circle cx="10" cy="10" r="18" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                  
                  {/* Rover Chassis Body (Tank Type) */}
                  <rect x="-4" y="0" width="28" height="20" rx="3" fill="#002c47" stroke="#38bdf8" strokeWidth="2" />
                  
                  {/* Track tread indicators */}
                  <rect x="-6" y="-3" width="32" height="5" rx="1.5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                  <rect x="-6" y="18" width="32" height="5" rx="1.5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                  
                  {/* Heading Arrow */}
                  <polygon points="18,10 10,6 10,14" fill="#38bdf8" />
                  
                  {/* Rover Identifier Tag */}
                  <rect x="-24" y="-24" width="76" height="18" rx="2" fill="#060e20" stroke="#38bdf8" strokeWidth="1.2" />
                  <text x="-20" y="-11" fill="#38bdf8" fontFamily="JetBrains Mono, monospace" fontSize="10.5" fontWeight="bold">
                    ROVER R-01
                  </text>
                </g>
              </g>

              {/* =================================================== */}
              {/* OPERATOR SELECTED EVACUATION PATH (DYNAMIC OVERLAY) */}
              {/* =================================================== */}
              {selectedPathId === 'path-r01' && (
                <g id="selected-path-r01">
                  {/* Path from Rover (330, 375) -> North Ramp (380, 135) -> Refuge R-01 (680, 115) */}
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
                  {/* Path from Rover (330, 375) -> North Bypass (560, 350) -> Refuge R-03 (690, 350) */}
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
                  {/* Path from Rover (330, 375) -> Shaft base (200, 375) -> Vertical Shaft Hoist (200, 50) */}
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

            {/* Bottom-Left HUD: Rover Positional Telemetry */}
            <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 font-mono text-[12px] pointer-events-auto">
              <div className="bg-[#060e20]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant/40 flex items-center gap-2.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span className="text-outline">STATION:</span>
                <span className="text-on-surface font-semibold">14A</span>
                <span className="text-outline">|</span>
                <span className="text-primary font-bold">DEPTH: -850.4m</span>
                <span className="text-outline">|</span>
                <span className="text-on-surface">PITCH -2.1°</span>
              </div>
            </div>

            {/* Bottom-Right HUD: Map Legend Overlay */}
            <div className="absolute bottom-3 right-3 bg-[#060e20]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant/40 flex flex-wrap items-center gap-3.5 font-mono text-[11.5px] shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-primary"></span>
                <span className="text-on-surface font-medium">Rover R-01</span>
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
                Gas (MQ-4, MQ-7, O2) + Smoke (MQ-2) + Temp/RH (DHT22) + Thermal (AMG8833) + Sonar (HC-SR04)
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

          {/* Concise Operational Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div className="bg-[#060e20] p-3 rounded-lg border-l-4 border-l-amber-500 border border-outline-variant/30 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-amber-400 text-[20px] shrink-0 mt-0.5">warning</span>
              <div className="text-[12.5px] leading-relaxed">
                <span className="font-bold text-amber-300 font-mono block text-[12px] uppercase">METHANE RESTRICTION ADVISORY</span>
                South passage currently has elevated methane levels (1.05%). Operator should avoid this section until readings stabilize.
              </div>
            </div>

            <div className="bg-[#060e20] p-3 rounded-lg border-l-4 border-l-rose-500 border border-outline-variant/30 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-rose-400 text-[20px] shrink-0 mt-0.5">block</span>
              <div className="text-[12.5px] leading-relaxed">
                <span className="font-bold text-rose-300 font-mono block text-[12px] uppercase">OBSTACLE DETECTED NEAR LEVEL -850</span>
                Obstacle detected near Level -850 access tunnel (HC-SR04 Sonar: 0.38m). Alternative mine passage (North Bypass) should be assessed manually.
              </div>
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

      {/* ========================================================================= */}
      {/* 3. RIGHT TELEMETRY & CONTROL COLUMN (Width: 360px) */}
      {/* ========================================================================= */}
      <aside className="w-[360px] shrink-0 bg-[#060e20] border-l border-outline-variant/30 flex flex-col h-full overflow-y-auto industrial-scrollbar z-20 select-none">
        {/* Column Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-outline-variant/30 bg-[#060e20] shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
            <div className="flex flex-col">
              <h3 className="font-bold text-[14px] tracking-wider uppercase text-on-surface leading-none">
                REFUGE &amp; CONTROL
              </h3>
              <span className="font-mono text-[11px] text-outline uppercase mt-0.5">
                SUB-SURFACE HAVENS &bull; OPERATOR DISPATCH
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-tertiary bg-tertiary-container/20 px-2 py-0.5 rounded border border-tertiary/30 font-semibold">
            LoRa 433
          </span>
        </div>

        <div className="p-3.5 flex flex-col gap-4">
          {/* ======================================================================= */}
          {/* 3. REFUGE STATUS PANEL */}
          {/* ======================================================================= */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] uppercase text-outline font-semibold">
                REFUGE CHAMBERS (SECTOR 4)
              </span>
              <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-600/40">
                3 LOCATIONS
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {refugeLocations.map((refuge) => {
                const isSelected = refuge.id === selectedRefugeId;
                return (
                  <div
                    key={refuge.id}
                    onClick={() => setSelectedRefugeId(refuge.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-950/40 border-primary ring-1 ring-primary/40'
                        : 'bg-surface-container-low/90 hover:bg-surface-container/60 border-outline-variant/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono font-bold text-[13.5px] text-on-surface block">
                          {refuge.name}
                        </span>
                        <span className="font-mono text-[11.5px] text-outline block">
                          {refuge.level} &bull; {refuge.subGallery}
                        </span>
                      </div>
                      <span
                        className={`font-mono text-[11px] px-2 py-0.5 rounded border font-semibold ${
                          refuge.statusType === 'available'
                            ? 'text-emerald-400 bg-emerald-950/30 border-emerald-600/40'
                            : 'text-amber-400 bg-amber-950/30 border-amber-600/40'
                        }`}
                      >
                        {refuge.status}
                      </span>
                    </div>

                    {/* Defendable Telemetry Attributes */}
                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-[12px] font-mono border-t border-outline-variant/20 pt-2">
                      <div>
                        <span className="text-outline text-[11px] block">DISTANCE</span>
                        <span className="text-on-surface font-semibold text-[13px]">{refuge.distanceMeters} m</span>
                      </div>
                      <div>
                        <span className="text-outline text-[11px] block">HAZARD NEARBY</span>
                        <span className={refuge.hazardNearby.includes('Methane') ? 'text-amber-400 font-semibold' : 'text-emerald-400'}>
                          {refuge.hazardNearby.includes('Methane') ? 'Methane Warning' : 'None (Safe)'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-outline text-[11px] block">COMMUNICATION</span>
                        <span className="text-on-surface-variant text-[11.5px]">{refuge.communication}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Refuge Tactical Brief */}
            <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex flex-col gap-1 text-[11.5px]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-outline uppercase text-[11px] font-semibold">SELECTED DESTINATION</span>
                <span className="font-mono text-primary font-bold">{activeRefuge.name}</span>
              </div>
              <p className="text-on-surface-variant font-sans leading-snug">
                {activeRefuge.description}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 font-mono text-[11px]">
                <span className="text-outline">SONAR CLEARANCE:</span>
                <span className="text-on-surface font-medium">{activeRefuge.sonarObstacle}</span>
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 7. EMERGENCY CONTROLS & DEADMAN FAIL-SAFE */}
          {/* ======================================================================= */}
          <section className="bg-surface-container-low/90 p-3 rounded-lg border border-outline-variant/30 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] uppercase text-outline font-semibold">
                EMERGENCY CONTROLS
              </span>
              <span className="font-mono text-[11px] text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-700/40 font-semibold">
                HARDWARE OVERRIDE
              </span>
            </div>

            {/* Prominent Emergency STOP Button */}
            <button
              type="button"
              onClick={handleToggleEmergencyStop}
              className={`w-full py-3 px-4 rounded-lg font-mono font-bold text-[14px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                emergencyStopActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse ring-2 ring-amber-400'
                  : 'bg-rose-600 hover:bg-rose-500 text-white ring-1 ring-rose-400/50'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {emergencyStopActive ? 'refresh' : 'emergency'}
              </span>
              <span>{emergencyStopActive ? 'RESUME ROVER TELEOPERATION' : 'EMERGENCY STOP ROVER'}</span>
            </button>

            {/* Compact Secondary Controls */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[11.5px]">
              <button
                type="button"
                onClick={() => handleMarkTunnel('tp-3', 'BLOCKED — Obstacle detected', 'blocked')}
                className="p-2 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-on-surface flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <span className="material-symbols-outlined text-[16px] text-rose-400">block</span>
                <span>MARK BLOCKED</span>
              </button>
              <button
                type="button"
                onClick={() => handleMarkTunnel('tp-2', 'CAUTION — Methane warning', 'caution')}
                className="p-2 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-on-surface flex items-center justify-center gap-1.5 transition-colors text-center"
              >
                <span className="material-symbols-outlined text-[16px] text-amber-400">warning</span>
                <span>MARK CAUTION</span>
              </button>
            </div>

            {/* CRITICAL FAIL-SAFE ARMED BANNER */}
            <div className="bg-rose-950/30 p-2.5 rounded border border-rose-500/40 flex items-start gap-2 text-[11.5px]">
              <span className="material-symbols-outlined text-rose-400 text-[18px] shrink-0 mt-0.5">verified_user</span>
              <div className="leading-snug">
                <span className="font-mono font-bold text-rose-300 block text-[11px] uppercase">
                  FAIL-SAFE ARMED &bull; DEADMAN BRAKE
                </span>
                <span className="text-on-surface-variant font-sans">
                  If LoRa communication is lost (&gt;1,500ms heartbeat timeout): Rover motor drivers cut instantly.
                </span>
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 6. RESCUE COMMUNICATION (SPEAKER MODULE) */}
          {/* ======================================================================= */}
          <section className="bg-surface-container-low/90 p-3 rounded-lg border border-outline-variant/30 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] uppercase text-outline font-semibold">
                ROVER SPEAKER MODULE
              </span>
              <span className="font-mono text-[11px] text-sky-400 bg-sky-950/30 px-1.5 py-0.5 rounded border border-sky-600/40">
                1-WAY DOWNLINK
              </span>
            </div>

            <p className="text-[12px] text-on-surface-variant leading-snug">
              Transmit pre-recorded audio broadcast over SX1278 LoRa to R-01 onboard speaker:
            </p>

            {/* Preset Selector */}
            <div className="flex flex-col gap-1.5">
              {speakerPresets.map((preset) => (
                <label
                  key={preset.id}
                  className={`p-2 rounded border cursor-pointer flex items-start gap-2 transition-colors ${
                    selectedSpeakerPreset === preset.id
                      ? 'bg-sky-950/40 border-primary text-on-surface'
                      : 'bg-[#060e20] border-outline-variant/30 text-on-surface-variant hover:bg-surface-container/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="speaker-preset"
                    value={preset.id}
                    checked={selectedSpeakerPreset === preset.id}
                    onChange={() => setSelectedSpeakerPreset(preset.id)}
                    className="mt-1 text-primary focus:ring-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] text-primary font-bold">{preset.code}</span>
                      <span className="font-medium text-[12px] text-on-surface truncate">{preset.label}</span>
                    </div>
                    <span className="text-[11.5px] italic text-on-surface-variant mt-0.5">
                      &ldquo;{preset.text}&rdquo;
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Transmit Button */}
            <button
              type="button"
              onClick={handleSendSpeaker}
              disabled={speakerTransmitting}
              className={`w-full py-2.5 px-3 rounded font-mono font-semibold text-[12.5px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                speakerTransmitting
                  ? 'bg-sky-800 text-sky-200 cursor-not-allowed'
                  : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 shadow-sm'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {speakerTransmitting ? 'sync' : 'volume_up'}
              </span>
              <span>{speakerTransmitting ? 'TRANSMITTING VIA LoRa...' : 'SEND VIA ROVER SPEAKER'}</span>
            </button>

            <span className="font-mono text-[11px] text-outline leading-tight">
              {speakerStatusMessage}
            </span>
          </section>

          {/* ======================================================================= */}
          {/* 8. REFUGE / HAZARD EVENT LOG */}
          {/* ======================================================================= */}
          <section className="bg-surface-container-low/90 p-3 rounded-lg border border-outline-variant/30 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-1.5">
              <span className="font-mono text-[12px] uppercase text-outline font-semibold">
                RECENT EVACUATION &bull; ACTIVITY LOG
              </span>
              <span className="font-mono text-[11px] text-outline">UTC TODAY</span>
            </div>

            <div className="flex flex-col gap-2">
              {recentEvacuationLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#060e20] p-2 rounded border border-outline-variant/25 flex flex-col gap-1 text-[11.5px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-on-surface">{log.time}</span>
                    <span className={`font-mono text-[10.5px] px-1.5 py-0.2 rounded border font-semibold ${log.badgeClass}`}>
                      {log.severity}
                    </span>
                  </div>
                  <span className="font-medium text-on-surface text-[12px]">{log.event}</span>
                  <span className="text-on-surface-variant text-[11.5px] leading-tight font-sans">
                    {log.detail}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
