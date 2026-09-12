import { useState, useEffect } from 'react';
import { askSafetyAgent } from '../services/ai';

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [agentInput, setAgentInput] = useState('');
  const [agentMessage, setAgentMessage] = useState('Rover R-04 confirmed CH4 vent dissipation at Station 14A. No evacuation escalation needed.');
  const [agentLoading, setAgentLoading] = useState(false);

  const sendAgentCommand = async (command = agentInput) => {
    const request = command.trim();
    if (!request || agentLoading) return;

    setAgentInput('');
    setAgentLoading(true);

    const result = await askSafetyAgent(request, {
      ch4: telemetry?.ch4?.value,
      co: telemetry?.co?.value,
      temperature: telemetry?.temperature?.value,
      humidity: telemetry?.humidity?.value,
      battery: telemetry?.battery?.level,
      speed: telemetry?.speed?.current,
      obstacleDistance: telemetry?.obstacleDistance?.distance,
    });

    setAgentMessage(result.text);
    setAgentLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/telemetry');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) setTelemetry(data);
      } catch (err) {
        console.warn('Dashboard backend telemetry unavailable, using demo fallback:', err);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      {/* 2. CENTER COLUMN: PRIMARY WORKSPACE */}
      <main className="flex-1 min-w-0 bg-[#0b1326] p-responsive flex flex-col gap-responsive overflow-y-auto industrial-scrollbar">
          {/* TOP 4 SUMMARY CARDS */}
          <section className="grid grid-cols-4 gap-responsive w-full shrink-0">
            {/* Card 1: Compliance Risk Index */}
            <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)]">
              <div className="flex items-start justify-between gap-1 text-outline">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="material-symbols-outlined text-[16px] text-tertiary shrink-0">shield</span>
                  <span className="font-mono text-[clamp(11px,0.72vw,12.5px)] tracking-wide uppercase text-on-surface font-semibold leading-tight truncate">COMPLIANCE RISK INDEX</span>
                </div>
                <span className="font-mono text-[clamp(10px,0.6vw,11.5px)] text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded shrink-0">&Delta; -4%</span>
              </div>
              <div className="my-1 flex items-baseline justify-between gap-1">
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-[clamp(22px,1.6vw,28px)] font-bold tracking-tight text-on-surface">34</span>
                  <span className="text-[clamp(10px,0.62vw,11.5px)] text-outline font-mono">/ 100</span>
                </div>
                <div className="text-right min-w-0">
                  <div className="font-mono text-[clamp(10px,0.62vw,11.5px)] font-semibold text-tertiary uppercase truncate">LOW-MODERATE</div>
                  <div className="font-mono text-[clamp(9.5px,0.58vw,11px)] text-outline truncate">LIMIT &le; 45</div>
                </div>
              </div>
              <div>
                <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden flex">
                  <div className="bg-tertiary h-full rounded-full" style={{ width: "34%" }}></div>
                </div>
                <div className="flex justify-between font-mono text-[clamp(9.5px,0.58vw,11px)] text-outline/80 mt-1">
                  <span>0 NOMINAL</span>
                  <span className="text-on-surface-variant font-medium">45 LIMIT</span>
                  <span>100 CRIT</span>
                </div>
              </div>
            </div>

            {/* Card 2: Workforce Dosimetry */}
            <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)]">
              <div className="flex items-start justify-between gap-1 text-outline">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0">groups</span>
                  <span className="font-mono text-[clamp(11px,0.72vw,12.5px)] tracking-wide uppercase text-on-surface font-semibold leading-tight truncate">WORKFORCE DOSIMETRY</span>
                </div>
                <span className="font-mono text-[clamp(10px,0.6vw,11.5px)] text-primary bg-primary/15 px-1.5 py-0.5 rounded shrink-0">100% LINKED</span>
              </div>
              <div className="my-1 flex items-baseline justify-between gap-1">
                <div className="flex items-baseline gap-1 shrink-0">
                  <span className="text-[clamp(22px,1.6vw,28px)] font-bold tracking-tight text-on-surface">142</span>
                  <span className="text-[clamp(10px,0.62vw,11.5px)] text-outline uppercase font-mono">Active</span>
                </div>
                <div className="text-right font-mono text-[clamp(10px,0.62vw,11.5px)] min-w-0">
                  <span className="text-tertiary font-semibold block truncate">0 CRITICAL</span>
                  <div className="text-secondary truncate">2 HEAT ADV</div>
                </div>
              </div>
              <div className="pt-1.5 border-t border-outline-variant/20 flex items-center justify-between text-[clamp(10px,0.62vw,11.5px)] text-on-surface-variant font-mono">
                <span className="flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary shrink-0"></span>Tag Mesh Synced
                </span>
                <span className="text-outline shrink-0">SEC 1-6</span>
              </div>
            </div>

            {/* Card 3: Evacuation Protocol */}
            <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)]">
              <div className="flex items-start justify-between gap-1 text-outline">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="material-symbols-outlined text-[16px] text-tertiary shrink-0">alt_route</span>
                  <span className="font-mono text-[clamp(11px,0.72vw,12.5px)] tracking-wide uppercase text-on-surface font-semibold leading-tight truncate">EVACUATION PROTOCOL</span>
                </div>
                <span className="font-mono text-[clamp(10px,0.6vw,11.5px)] text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded shrink-0">NOMINAL</span>
              </div>
              <div className="my-1 grid grid-cols-2 gap-1.5">
                <div className="bg-surface-container/70 rounded p-1 border border-outline-variant/20 min-w-0">
                  <div className="font-mono text-[clamp(9.5px,0.58vw,11px)] text-outline uppercase truncate">Refuge A (-620m)</div>
                  <div className="font-mono text-[clamp(11.5px,0.72vw,13px)] font-bold text-on-surface truncate">18/40 CAP</div>
                </div>
                <div className="bg-surface-container/70 rounded p-1 border border-outline-variant/20 min-w-0">
                  <div className="font-mono text-[clamp(9.5px,0.58vw,11px)] text-outline uppercase truncate">Refuge B (-850m)</div>
                  <div className="font-mono text-[clamp(11.5px,0.72vw,13px)] font-bold text-on-surface truncate">12/30 CAP</div>
                </div>
              </div>
              <div className="pt-1.5 border-t border-outline-variant/20 flex items-center justify-between text-[clamp(10px,0.62vw,11.5px)] font-mono text-on-surface-variant">
                <span className="text-tertiary font-medium flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary shrink-0"></span>Egress: CLEAR
                </span>
                <span className="text-outline shrink-0">HOIST 94s</span>
              </div>
            </div>

            {/* Card 4: Autonomous Fleet */}
            <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)]">
              <div className="flex items-start justify-between gap-1 text-outline">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0">precision_manufacturing</span>
                  <span className="font-mono text-[clamp(11px,0.72vw,12.5px)] tracking-wide uppercase text-on-surface font-semibold leading-tight truncate">AUTONOMOUS FLEET (3)</span>
                </div>
                <span className="font-mono text-[clamp(10px,0.6vw,11.5px)] text-on-surface-variant bg-surface-container-high/60 px-1.5 py-0.5 rounded shrink-0">DEPLOYED</span>
              </div>
              <div className="my-1 space-y-1">
                <div className="flex items-center justify-between text-[clamp(10px,0.62vw,11.5px)] bg-surface-container/50 px-1.5 py-0.5 rounded border border-outline-variant/15">
                  <span className="font-mono text-on-surface truncate">R-04 Pathfinder</span>
                  <span className="font-mono text-[clamp(9px,0.56vw,10.5px)] text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded shrink-0">Patrol</span>
                </div>
                <div className="flex items-center justify-between text-[clamp(10px,0.62vw,11.5px)] bg-surface-container/50 px-1.5 py-0.5 rounded border border-outline-variant/15">
                  <span className="font-mono text-on-surface truncate">R-07 Excav-Scan</span>
                  <span className="font-mono text-[clamp(9px,0.56vw,10.5px)] text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded shrink-0">Standby</span>
                </div>
                <div className="flex items-center justify-between text-[clamp(10px,0.62vw,11.5px)] bg-surface-container/50 px-1.5 py-0.5 rounded border border-outline-variant/15">
                  <span className="font-mono text-on-surface truncate">R-11 Heavy Haul</span>
                  <span className="font-mono text-[clamp(9px,0.56vw,10.5px)] text-primary bg-primary/15 px-1.5 py-0.5 rounded shrink-0">Hauling</span>
                </div>
              </div>
              <div className="pt-1 border-t border-outline-variant/20 flex items-center justify-between text-[clamp(10px,0.62vw,11.5px)] font-mono text-outline">
                <span className="truncate">FLEET: 100%</span>
                <span className="text-tertiary shrink-0">MESH 99.4%</span>
              </div>
            </div>
          </section>

          {/* LIVE ROVER CAMERA FEED & POV STREAM */}
          <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-xl p-card-responsive shadow-lg flex flex-col shrink-0">
            {/* Rover Feed Header Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/25 gap-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-primary text-[19px] shrink-0">videocam</span>
                <h2 className="font-bold text-[clamp(12px,0.78vw,13.5px)] tracking-wider uppercase text-on-surface truncate">ROVER POV TELEMETRY STREAM</h2>
                <div className="flex items-center gap-1 bg-surface-container-lowest p-0.5 rounded border border-outline-variant/30 text-[clamp(10px,0.6vw,11.5px)] font-mono">
                  <button className="px-2 py-0.5 rounded bg-primary text-[#003351] font-semibold flex items-center gap-1 shadow-sm" type="button">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse"></span>CAM-01 [R-04]
                  </button>
                  <button className="px-1.5 py-0.5 rounded text-on-surface-variant hover:text-on-surface transition-colors" type="button">CAM-02</button>
                  <button className="px-1.5 py-0.5 rounded text-on-surface-variant hover:text-on-surface transition-colors" type="button">CAM-03</button>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-container/20 border border-tertiary/30 text-tertiary font-mono text-[clamp(10px,0.6vw,11.5px)] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>LIVE 1080P IR
                </span>
                <div className="flex items-center gap-0.5 bg-surface-container-lowest p-0.5 rounded border border-outline-variant/30">
                  <button className="p-1 rounded text-on-surface-variant hover:text-on-surface transition-colors" title="Thermal HUD" type="button">
                    <span className="material-symbols-outlined text-[16px]">thermostat</span>
                  </button>
                  <button className="p-1 rounded bg-primary/20 text-primary" title="Gimbal Locked" type="button">
                    <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
                  </button>
                  <button className="p-1 rounded text-on-surface-variant hover:text-on-surface transition-colors" title="PTZ Controls" type="button">
                    <span className="material-symbols-outlined text-[16px]">pan_tool</span>
                  </button>
                  <button className="p-1 rounded text-on-surface-variant hover:text-on-surface transition-colors" title="Fullscreen" type="button">
                    <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Video Display Container with HUD Overlays */}
            <div className="relative w-full aspect-video max-h-[clamp(440px,50vh,580px)] max-w-[calc(clamp(440px,50vh,580px)*16/9)] rounded-lg overflow-hidden border border-outline-variant/40 mt-2 bg-black shadow-2xl ring-1 ring-primary/20 mx-auto">
              <img
                alt="Live Rover POV Night-Vision Feed"
                className="w-full h-full object-cover select-none"
                 src="/rover-cam-feed.jpg"
              />
              {/* Upper HUD Overlay */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 bg-[#060e20]/85 backdrop-blur px-2.5 py-1 rounded border border-outline-variant/40 font-mono text-[clamp(10.5px,0.65vw,12px)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping"></span>
                  <span className="text-on-surface font-semibold tracking-wide">SECTOR 4 DRIFT 3 &bull; -850M SUB-SEA</span>
                  <span className="text-outline">|</span>
                  <span className="text-primary font-mono">STATION 14A</span>
                </div>
                <div className="flex items-center gap-2 bg-[#060e20]/85 backdrop-blur px-2.5 py-1 rounded border border-outline-variant/40 font-mono text-[clamp(10.5px,0.65vw,12px)] text-tertiary">
                  <span className="text-outline">FEED:</span>
                  <span>60 FPS</span>
                  <span className="text-outline-variant">|</span>
                  <span>8.4 Mbps</span>
                  <span className="text-outline-variant">|</span>
                  <span className="text-sky-400 font-semibold">LAT: 32ms</span>
                </div>
              </div>
              {/* Lower HUD Overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                <div className="flex items-center gap-1.5 font-mono text-[clamp(10.5px,0.65vw,12px)]">
                  <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-tertiary">
                    CH4: <strong className="text-tertiary font-semibold">{telemetry?.ch4 ? `${telemetry.ch4.value}% [${telemetry.ch4.status}]` : '0.42% [SAFE]'}</strong>
                  </span>
                  <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-primary">
                    SPEED: <strong className="text-on-surface font-semibold">{telemetry?.speed ? `${telemetry.speed.current} ${telemetry.speed.unit}` : '1.4 m/s'}</strong>
                  </span>
                  <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-secondary">
                    BATT: <strong className="text-secondary font-semibold">{telemetry?.battery ? `${telemetry.battery.level}% (4h 12m)` : '88% (4h 12m)'}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[clamp(10.5px,0.65vw,12px)]">
                  <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-outline">
                    GIMBAL: <strong className="text-on-surface">PTZ-LOCKED (-4.2&deg;)</strong>
                  </span>
                  <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-tertiary/30 text-tertiary font-semibold">
                    NAV: AUTO
                  </span>
                </div>
              </div>
            </div>

            {/* Integrated Telemetry Strip Below Camera Feed */}
            <div className="mt-2 grid grid-cols-3 gap-responsive w-full max-w-[calc(clamp(440px,50vh,580px)*16/9)] mx-auto font-mono shrink-0">
              <div className="bg-surface-container/60 px-2.5 py-1.5 rounded border border-outline-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">speed</span>
                  <span className="text-[clamp(10px,0.64vw,11.5px)] text-outline uppercase font-semibold">Velocity</span>
                </div>
                <span className="text-[clamp(12.5px,0.8vw,14.5px)] text-on-surface font-bold">
                  {telemetry?.speed ? `${telemetry.speed.current} ${telemetry.speed.unit} (${telemetry.speed.mode || 'AUTO'})` : '1.4 m/s (AUTO)'}
                </span>
              </div>
              <div className="bg-surface-container/60 px-2.5 py-1.5 rounded border border-outline-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">explore</span>
                  <span className="text-[clamp(10px,0.64vw,11.5px)] text-outline uppercase font-semibold">Heading</span>
                </div>
                <span className="text-[clamp(12.5px,0.8vw,14.5px)] text-on-surface font-bold">164&deg; SSE (+3.5%)</span>
              </div>
              <div className="bg-surface-container/60 px-2.5 py-1.5 rounded border border-outline-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">battery_charging_full</span>
                  <span className="text-[clamp(10px,0.64vw,11.5px)] text-outline uppercase font-semibold">Power Reserve</span>
                </div>
                <span className="text-[clamp(12.5px,0.8vw,14.5px)] text-secondary font-bold">
                  {telemetry?.battery ? `${telemetry.battery.level}% \u2022 4h 12m` : '88% \u2022 4h 12m'}
                </span>
              </div>
            </div>
          </section>
        </main>

        {/* 3. RIGHT TELEMETRY COLUMN */}
        <aside className="w-[clamp(300px,18vw,340px)] shrink-0 bg-[#060e20] border-l border-outline-variant/30 flex flex-col h-full overflow-hidden z-20 select-none">
          {/* Column Header */}
          <div className="h-11 px-3.5 flex items-center justify-between border-b border-outline-variant/30 bg-[#060e20] shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">analytics</span>
              <div className="flex flex-col">
                <h3 className="font-bold text-[clamp(12px,0.78vw,13.5px)] tracking-wider uppercase text-on-surface leading-none">TELEMETRY &amp; HAZARD</h3>
                <span className="font-mono text-[clamp(9px,0.56vw,10.5px)] text-outline uppercase mt-0.5">MODULAR OVERSIGHT</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 font-mono text-[clamp(9.5px,0.6vw,11px)] text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded border border-tertiary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>LIVE
              </span>
              <button className="p-1 rounded text-on-surface-variant hover:text-on-surface transition-colors" title="Panel Options" type="button">
                <span className="material-symbols-outlined text-[16px]">dock_to_right</span>
              </button>
            </div>
          </div>

          {/* Upper Scrollable Telemetry Cards Container */}
          <div className="flex-1 overflow-y-auto industrial-scrollbar p-card-responsive space-y-responsive min-h-0">
            {/* AI Hazard Prediction Card */}
            <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-card-responsive shadow-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">troubleshoot</span>
                  <span className="font-mono text-[clamp(11.5px,0.72vw,13px)] font-semibold text-on-surface uppercase tracking-wider">AI Hazard Prediction</span>
                </div>
                <span className="font-mono text-[clamp(9.5px,0.6vw,11px)] text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded border border-tertiary/20">CONF 97.4%</span>
              </div>
              <div className="space-y-2">
                <div className="bg-surface-container/60 p-2 rounded border border-outline-variant/20">
                  <div className="flex justify-between items-center text-[clamp(10px,0.62vw,11.5px)] font-mono mb-1">
                    <span className="text-outline uppercase">6-Hr Structural Forecast</span>
                    <span className="text-tertiary font-semibold">LOW STRESS</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden flex">
                    <div className="bg-tertiary h-full rounded-full" style={{ width: "18%" }}></div>
                  </div>
                  <div className="flex justify-between font-mono text-[clamp(9px,0.55vw,10.5px)] text-outline mt-1">
                    <span>Seismic: 0.04g</span>
                    <span>Displacement: 0.12mm</span>
                  </div>
                </div>
                <div className="bg-surface-container/60 p-2 rounded border border-outline-variant/20">
                  <div className="flex justify-between items-center text-[clamp(10px,0.62vw,11.5px)] font-mono mb-1">
                    <span className="text-outline uppercase">Micro-Rockburst Risk</span>
                    <span className="text-secondary font-semibold">MODERATE (4C)</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden flex">
                    <div className="bg-secondary h-full rounded-full" style={{ width: "32%" }}></div>
                  </div>
                  <div className="flex justify-between font-mono text-[clamp(9px,0.55vw,10.5px)] text-outline mt-1">
                    <span>Acoustic: 14 hit/m</span>
                    <span>Shear: Normal</span>
                  </div>
                </div>
                <div className="bg-surface-container/60 p-2 rounded border border-outline-variant/20">
                  <div className="flex justify-between items-center text-[clamp(10px,0.62vw,11.5px)] font-mono mb-1">
                    <span className="text-outline uppercase">Gas Build Trajectory</span>
                    <span className="text-sky-400 font-semibold">STABILIZING</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden flex">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: "28%" }}></div>
                  </div>
                  <div className="flex justify-between font-mono text-[clamp(9px,0.55vw,10.5px)] text-outline mt-1">
                    <span>Vent Assist: +15%</span>
                    <span>Peak Est: &lt;1.25%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Atmospheric Monitoring Card (2x2 Grid) */}
            <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-card-responsive shadow-sm">
              <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">air</span>
                  <span className="font-mono text-[clamp(11.5px,0.72vw,13px)] font-semibold text-on-surface uppercase tracking-wider">Atmospheric Sensors</span>
                </div>
                <span className="font-mono text-[clamp(9.5px,0.6vw,11px)] text-outline">NODE 4-ALPHA</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-mono">
                <div className="bg-surface-container/60 p-2 rounded border border-outline-variant/20">
                  <span className="text-[clamp(9px,0.56vw,10.5px)] text-outline uppercase font-medium block">CH4 Methane</span>
                  <span className="text-[clamp(14px,0.95vw,17px)] font-bold text-secondary leading-tight block my-0.5">
                    {telemetry?.ch4 ? `${telemetry.ch4.value}${telemetry.ch4.unit}` : '1.15%'}
                  </span>
                  <span className="text-[clamp(8.5px,0.52vw,10px)] text-outline block mt-0.5">MSHA: 1.50%</span>
                </div>
                <div className="bg-surface-container/60 p-2 rounded border border-outline-variant/20">
                  <span className="text-[clamp(9px,0.56vw,10.5px)] text-outline uppercase font-medium block">CO Carbon Mon</span>
                  <span className="text-[clamp(14px,0.95vw,17px)] font-bold text-tertiary leading-tight block my-0.5">
                    {telemetry?.co ? `${telemetry.co.value} ${telemetry.co.unit}` : '12 PPM'}
                  </span>
                  <span className="text-[clamp(8.5px,0.52vw,10px)] text-outline block mt-0.5">Thresh: 50 PPM</span>
                </div>
                <div className="bg-surface-container/60 p-2 rounded border border-outline-variant/20">
                  <span className="text-[clamp(9px,0.56vw,10.5px)] text-outline uppercase font-medium block">O2 Oxygen</span>
                  <span className="text-[clamp(14px,0.95vw,17px)] font-bold text-on-surface leading-tight block my-0.5">20.8%</span>
                  <span className="text-[clamp(8.5px,0.52vw,10px)] text-outline block mt-0.5">MSHA Min: 19.5%</span>
                </div>
                <div className="bg-surface-container/60 p-2 rounded border border-outline-variant/20">
                  <span className="text-[clamp(9px,0.56vw,10.5px)] text-outline uppercase font-medium block">Air Velocity</span>
                  <span className="text-[clamp(14px,0.95vw,17px)] font-bold text-primary leading-tight block my-0.5">310 FPM</span>
                  <span className="text-[clamp(8.5px,0.52vw,10px)] text-outline block mt-0.5">Flow: Optimal</span>
                </div>
              </div>
            </div>
          </div>

          {/* PINNED AI SAFETY AGENT CHAT / COMMAND DESK */}
          <div className="p-card-responsive border-t border-outline-variant/30 bg-[#060e20] shrink-0">
            <div className="bg-surface-container-low/95 border border-primary/25 rounded-lg p-card-responsive shadow-xl space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[14px]">psychology</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[clamp(11px,0.7vw,12.5px)] font-semibold text-on-surface leading-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>AI Safety Agent
                    </span>
                    <span className="font-mono text-[clamp(9px,0.56vw,10.5px)] text-outline uppercase mt-0.5">Autonomous Co-Pilot</span>
                  </div>
                </div>
                <span className="font-mono text-[clamp(9px,0.56vw,10.5px)] text-outline bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/30">v4.8 CFR</span>
              </div>
              {/* Message Box */}
              <div className="bg-surface-container/60 rounded p-2 border border-outline-variant/15 font-mono text-[clamp(10.5px,0.65vw,12px)]">
                <div className="text-on-surface-variant flex items-start gap-1.5">
                  <span className="text-primary font-bold shrink-0">AI:</span>
                  <p className="leading-snug text-on-surface-variant/90">{agentLoading ? "Analyzing telemetry..." : agentMessage}</p>
                </div>
              </div>
              {/* Quick Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  className="flex-1 py-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface text-[clamp(10px,0.62vw,11.5px)] font-mono transition-colors flex items-center justify-center gap-1"
                  type="button"
                  onClick={() => sendAgentCommand("Assess ventilation surge requirements for the current CH4 reading.")}
                >
                  <span>&#9889;</span><span>Vent Surge</span>
                </button>
                <button
                  className="flex-1 py-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface text-[clamp(10px,0.62vw,11.5px)] font-mono transition-colors flex items-center justify-center gap-1"
                  type="button"
                  onClick={() => sendAgentCommand("Give me a concise safety check based on the current telemetry.")}
                >
                  <span>&#128737;&#65039;</span><span>MSHA Check</span>
                </button>
                <button
                  className="flex-1 py-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface text-[clamp(10px,0.62vw,11.5px)] font-mono transition-colors flex items-center justify-center gap-1"
                  type="button"
                  onClick={() => sendAgentCommand("Should Rover R-04 hold position based on current telemetry? Explain briefly.")}
                >
                  <span>&#128205;</span><span>R-04 Hold</span>
                </button>
              </div>
              {/* Input Field */}
              <div className="relative flex items-center w-full">
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded px-2.5 py-1.5 text-[clamp(10.5px,0.65vw,12px)] text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary font-mono pr-7"
                  placeholder="Ask agent or dispatch command..."
                  type="text"
                  value={agentInput}
                  onChange={(event) => setAgentInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") sendAgentCommand();
                  }}
                />
                <button
                  className="absolute right-1.5 text-primary hover:text-sky-300 transition-colors flex items-center justify-center"
                  title="Send Command"
                  type="button"
                  onClick={() => sendAgentCommand()}
                >
                  <span className="material-symbols-outlined text-[14px]">send</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
    </>
  );
}