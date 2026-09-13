import { useState, useEffect } from 'react';
import { askSafetyAgent } from '../services/ai';
import LiveMineVideoStream from '../components/LiveMineVideoStream';

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [agentInput, setAgentInput] = useState('');
  const [agentMessage, setAgentMessage] = useState('Rover R-04 confirmed CH4 vent dissipation at Station 14A. No evacuation escalation needed.');
  const [agentLoading, setAgentLoading] = useState(false);
  const [isAgentExpanded, setIsAgentExpanded] = useState(false);

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
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE_URL}/api/telemetry`);
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
        {/* TOP 4 LIVE SAFETY OVERVIEW SUMMARY CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-responsive w-full shrink-0">
          {/* Card 1: Atmospheric & Hazard Telemetry */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)]">
            <div className="flex items-start justify-between gap-1 text-outline">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[16px] text-tertiary shrink-0">air</span>
                <span className="font-mono text-[clamp(11px,0.72vw,12.5px)] tracking-wide uppercase text-on-surface font-semibold leading-tight truncate">
                  ATMOSPHERIC &amp; HAZARD
                </span>
              </div>
              <span className="font-mono text-[clamp(10px,0.6vw,11.5px)] text-amber-400 bg-amber-950/30 border border-amber-600/30 px-1.5 py-0.5 rounded shrink-0">
                CAUTION
              </span>
            </div>
            <div className="my-1 grid grid-cols-2 gap-1.5 font-mono">
              <div className="bg-surface-container/60 p-1.5 rounded border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">CH4 Methane</span>
                <span className="text-[14px] font-bold text-amber-400 block">
                  {telemetry?.ch4 ? `${telemetry.ch4.value}%` : '1.15%'}
                </span>
              </div>
              <div className="bg-surface-container/60 p-1.5 rounded border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">CO Monoxide</span>
                <span className="text-[14px] font-bold text-emerald-400 block">
                  {telemetry?.co ? `${telemetry.co.value} PPM` : '14 PPM'}
                </span>
              </div>
            </div>
            <div className="pt-1 border-t border-outline-variant/20 flex items-center justify-between font-mono text-[clamp(10px,0.6vw,11.5px)] text-outline">
              <span className="truncate">TEMP: {telemetry?.temperature ? `${telemetry.temperature.value}°C` : '26.8°C'}</span>
              <span className="text-secondary shrink-0">THERMAL: 35.2°C</span>
            </div>
          </div>

          {/* Card 2: Worker Detection & Possible Injured Alert */}
          <div className="bg-surface-container-low/90 border border-amber-500/40 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)]">
            <div className="flex items-start justify-between gap-1 text-outline">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[16px] text-amber-400 shrink-0">person_alert</span>
                <span className="font-mono text-[clamp(11px,0.72vw,12.5px)] tracking-wide uppercase text-on-surface font-semibold leading-tight truncate">
                  WORKER DETECTION ALERT
                </span>
              </div>
              <span className="font-mono text-[clamp(10px,0.6vw,11.5px)] text-amber-300 bg-amber-950/40 border border-amber-500/40 px-1.5 py-0.5 rounded shrink-0 animate-pulse">
                LOCALIZED
              </span>
            </div>
            <div className="my-1 flex items-baseline justify-between gap-1">
              <div className="flex items-baseline gap-1 shrink-0">
                <span className="text-[clamp(22px,1.6vw,28px)] font-bold tracking-tight text-amber-400">1</span>
                <span className="text-[clamp(10px,0.62vw,11.5px)] text-outline font-mono">Possible Injured</span>
              </div>
              <div className="text-right font-mono text-[clamp(10px,0.62vw,11.5px)] min-w-0">
                <span className="text-emerald-400 font-semibold block truncate">94.2% AI CONF</span>
                <div className="text-primary truncate">1 Worker Seen</div>
              </div>
            </div>
            <div className="pt-1.5 border-t border-outline-variant/20 flex items-center justify-between text-[clamp(10px,0.62vw,11.5px)] text-on-surface-variant font-mono">
              <span className="flex items-center gap-1 truncate text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>Station 14A &bull; Drift C
              </span>
              <span className="text-outline shrink-0">-850.4m</span>
            </div>
          </div>

          {/* Card 3: Evacuation & Refuge Readiness */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)]">
            <div className="flex items-start justify-between gap-1 text-outline">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[16px] text-tertiary shrink-0">alt_route</span>
                <span className="font-mono text-[clamp(11px,0.72vw,12.5px)] tracking-wide uppercase text-on-surface font-semibold leading-tight truncate">
                  EVACUATION READINESS
                </span>
              </div>
              <span className="font-mono text-[clamp(10px,0.6vw,11.5px)] text-emerald-400 bg-emerald-950/30 border border-emerald-600/30 px-1.5 py-0.5 rounded shrink-0">
                HAVENS READY
              </span>
            </div>
            <div className="my-1 grid grid-cols-2 gap-1.5">
              <div className="bg-surface-container/70 rounded p-1 border border-outline-variant/20 min-w-0">
                <div className="font-mono text-[clamp(9.5px,0.58vw,11px)] text-outline uppercase truncate">Refuge R-01 (-350m)</div>
                <div className="font-mono text-[clamp(11.5px,0.72vw,13px)] font-bold text-emerald-400 truncate">110m &bull; READY</div>
              </div>
              <div className="bg-surface-container/70 rounded p-1 border border-outline-variant/20 min-w-0">
                <div className="font-mono text-[clamp(9.5px,0.58vw,11px)] text-outline uppercase truncate">Refuge R-03 (-850m)</div>
                <div className="font-mono text-[clamp(11.5px,0.72vw,13px)] font-bold text-on-surface truncate">240m &bull; READY</div>
              </div>
            </div>
            <div className="pt-1.5 border-t border-outline-variant/20 flex items-center justify-between text-[clamp(10px,0.62vw,11.5px)] font-mono text-on-surface-variant">
              <span className="text-emerald-400 font-medium flex items-center gap-1 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>Main Shaft: CLEAR
              </span>
              <span className="text-outline shrink-0">HOIST 94s</span>
            </div>
          </div>

          {/* Card 4: Rover Connection & Fleet Status */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)]">
            <div className="flex items-start justify-between gap-1 text-outline">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[16px] text-primary shrink-0">precision_manufacturing</span>
                <span className="font-mono text-[clamp(11px,0.72vw,12.5px)] tracking-wide uppercase text-on-surface font-semibold leading-tight truncate">
                  ROVER R-01 LINK &bull; ESP32
                </span>
              </div>
              <span className="font-mono text-[clamp(10px,0.6vw,11.5px)] text-emerald-400 bg-emerald-950/30 border border-emerald-600/30 px-1.5 py-0.5 rounded shrink-0">
                LoRa ONLINE
              </span>
            </div>
            <div className="my-1 flex items-baseline justify-between gap-1 font-mono">
              <div>
                <span className="text-[clamp(20px,1.5vw,26px)] font-bold text-on-surface">
                  {telemetry?.battery ? `${telemetry.battery.level}%` : '88%'}
                </span>
                <span className="text-[10.5px] text-outline ml-1">Power</span>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-bold text-sky-400 block">
                  {telemetry?.speed ? `${telemetry.speed.current} ${telemetry.speed.unit}` : '1.4 m/s'}
                </span>
                <span className="text-[10px] text-outline">TB6612FNG</span>
              </div>
            </div>
            <div className="pt-1 border-t border-outline-variant/20 flex items-center justify-between text-[clamp(10px,0.62vw,11.5px)] font-mono text-outline">
              <span className="truncate">SX1278: -94 dBm</span>
              <span className="text-emerald-400 shrink-0">LAT: 18ms</span>
            </div>
          </div>
        </section>

        {/* DEDICATED LIVE MINE VIDEO STREAM COMPONENT */}
        <LiveMineVideoStream telemetry={telemetry} />

        {/* Integrated Telemetry Strip Below Stream */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-responsive w-full font-mono shrink-0">
          <div className="bg-surface-container/60 px-3 py-2 rounded border border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary">speed</span>
              <span className="text-[clamp(10px,0.64vw,11.5px)] text-outline uppercase font-semibold">Velocity</span>
            </div>
            <span className="text-[clamp(12.5px,0.8vw,14.5px)] text-on-surface font-bold">
              {telemetry?.speed ? `${telemetry.speed.current} ${telemetry.speed.unit} (${telemetry.speed.mode || 'AUTO'})` : '1.4 m/s (AUTO)'}
            </span>
          </div>
          <div className="bg-surface-container/60 px-3 py-2 rounded border border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">explore</span>
              <span className="text-[clamp(10px,0.64vw,11.5px)] text-outline uppercase font-semibold">Heading</span>
            </div>
            <span className="text-[clamp(12.5px,0.8vw,14.5px)] text-on-surface font-bold">164&deg; SSE (+3.5%)</span>
          </div>
          <div className="bg-surface-container/60 px-3 py-2 rounded border border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">battery_charging_full</span>
              <span className="text-[clamp(10px,0.64vw,11.5px)] text-outline uppercase font-semibold">Power Reserve</span>
            </div>
            <span className="text-[clamp(12.5px,0.8vw,14.5px)] text-secondary font-bold">
              {telemetry?.battery ? `${telemetry.battery.level}% \u2022 4h 12m` : '88% \u2022 4h 12m'}
            </span>
          </div>
        </div>
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

          {/* Right Telemetry Column Body: AI Hazard Prediction + AI Safety Agent naturally filling column */}
          <div className="flex-1 overflow-y-auto industrial-scrollbar p-card-responsive flex flex-col gap-3 min-h-0">
            {/* AI Hazard Prediction Card - Substantial & Permanently Visible */}
            <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3 shadow-sm shrink-0 h-[375px] flex flex-col justify-between">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="material-symbols-outlined text-primary text-[17px] shrink-0">troubleshoot</span>
                  <span className="font-mono text-[11.5px] font-semibold text-on-surface uppercase tracking-wider truncate">
                    AI Hazard Prediction
                  </span>
                </div>
                <span className="font-mono text-[10px] text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded border border-tertiary/20 font-semibold shrink-0">
                  CONF 97.4%
                </span>
              </div>

              {/* 3 Balanced Prediction Items */}
              <div className="flex-1 flex flex-col justify-between py-2 gap-2.5">
                {/* 1. 6-Hr Structural Forecast */}
                <div className="bg-surface-container/60 p-2.5 rounded-lg border border-outline-variant/20 flex flex-col justify-between flex-1 gap-1.5">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-outline uppercase font-semibold">6-Hr Structural Forecast</span>
                    <span className="text-tertiary font-bold px-1.5 py-0.2 rounded bg-tertiary/10 border border-tertiary/25 text-[10px]">
                      LOW STRESS
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex my-0.5">
                    <div className="bg-tertiary h-full rounded-full" style={{ width: "18%" }}></div>
                  </div>
                  <div className="flex justify-between items-center font-mono text-[10px] text-outline gap-2">
                    <span>Seismic: <span className="text-on-surface font-medium">0.04g</span></span>
                    <span>Displacement: <span className="text-on-surface font-medium">0.12mm</span></span>
                  </div>
                </div>

                {/* 2. Micro-Rockburst Risk */}
                <div className="bg-surface-container/60 p-2.5 rounded-lg border border-outline-variant/20 flex flex-col justify-between flex-1 gap-1.5">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-outline uppercase font-semibold">Micro-Rockburst Risk</span>
                    <span className="text-secondary font-bold px-1.5 py-0.2 rounded bg-secondary/10 border border-secondary/25 text-[10px]">
                      MODERATE (4C)
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex my-0.5">
                    <div className="bg-secondary h-full rounded-full" style={{ width: "32%" }}></div>
                  </div>
                  <div className="flex justify-between items-center font-mono text-[10px] text-outline gap-2">
                    <span>Acoustic: <span className="text-on-surface font-medium">14 hit/m</span></span>
                    <span>Shear: <span className="text-on-surface font-medium">Normal</span></span>
                  </div>
                </div>

                {/* 3. Gas Build Trajectory */}
                <div className="bg-surface-container/60 p-2.5 rounded-lg border border-outline-variant/20 flex flex-col justify-between flex-1 gap-1.5">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-outline uppercase font-semibold">Gas Build Trajectory</span>
                    <span className="text-sky-400 font-bold px-1.5 py-0.2 rounded bg-sky-950/40 border border-sky-500/30 text-[10px]">
                      STABILIZING
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex my-0.5">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: "28%" }}></div>
                  </div>
                  <div className="flex justify-between items-center font-mono text-[10px] text-outline gap-2">
                    <span>Vent Assist: <span className="text-on-surface font-medium">+15%</span></span>
                    <span>Peak Est: <span className="text-on-surface font-medium">&lt;1.25%</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* PINNED AI SAFETY AGENT CHAT / COMMAND DESK (COLLAPSIBLE - COMPACT CHATBOT/ICON BY DEFAULT) */}
            {!isAgentExpanded ? (
              <div className="flex-1 flex flex-col items-center justify-center py-4 my-auto">
                <button
                  type="button"
                  onClick={() => setIsAgentExpanded(true)}
                  className="w-12 h-12 rounded-full bg-primary/20 hover:bg-primary/30 border-2 border-primary/40 hover:border-primary text-primary flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 group relative cursor-pointer"
                  title="Open AI Safety Agent"
                  aria-label="Open AI Safety Agent"
                >
                  <span className="material-symbols-outlined text-primary text-[24px] group-hover:scale-110 transition-transform">
                    psychology
                  </span>
                  <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-tertiary animate-pulse border-2 border-[#060e20]"></span>
                </button>
                <span className="font-mono text-[11px] text-outline uppercase tracking-wider mt-2 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  AI Safety Agent
                </span>
                <span className="font-mono text-[9.5px] text-outline/70 mt-0.5">Click to expand co-pilot</span>
              </div>
            ) : (
              <div className="bg-surface-container-low/95 border border-primary/35 rounded-lg p-3 shadow-2xl flex-1 flex flex-col justify-between gap-2.5 min-h-[250px] transition-all animate-fadeIn">
                <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant/20">
                  <button
                    type="button"
                    onClick={() => setIsAgentExpanded(false)}
                    className="flex items-center gap-1.5 text-left hover:opacity-80 transition-opacity cursor-pointer group"
                    title="Collapse AI Safety Agent"
                  >
                    <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <span className="material-symbols-outlined text-primary text-[14px]">psychology</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[clamp(11px,0.7vw,12.5px)] font-semibold text-on-surface leading-none flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>AI Safety Agent
                      </span>
                      <span className="font-mono text-[clamp(9px,0.56vw,10.5px)] text-outline uppercase mt-0.5">Autonomous Co-Pilot</span>
                    </div>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[clamp(9px,0.56vw,10.5px)] text-outline bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/30">v4.8 CFR</span>
                    <button
                      type="button"
                      onClick={() => setIsAgentExpanded(false)}
                      className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center cursor-pointer"
                      title="Collapse AI Safety Agent"
                      aria-label="Collapse AI Safety Agent"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
                {/* Message Box */}
                <div className="bg-surface-container/60 rounded p-2.5 border border-outline-variant/15 font-mono text-[clamp(10.5px,0.65vw,12px)] flex-1 overflow-y-auto min-h-[75px]">
                  <div className="text-on-surface-variant flex items-start gap-1.5">
                    <span className="text-primary font-bold shrink-0">AI:</span>
                    <p className="leading-snug text-on-surface-variant/90">{agentLoading ? "Analyzing telemetry..." : agentMessage}</p>
                  </div>
                </div>
                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    className="flex-1 py-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface text-[clamp(10px,0.62vw,11.5px)] font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    type="button"
                    onClick={() => sendAgentCommand("Assess ventilation surge requirements for the current CH4 reading.")}
                  >
                    <span>&#9889;</span><span>Vent Surge</span>
                  </button>
                  <button
                    className="flex-1 py-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface text-[clamp(10px,0.62vw,11.5px)] font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    type="button"
                    onClick={() => sendAgentCommand("Give me a concise safety check based on the current telemetry.")}
                  >
                    <span>&#128737;&#65039;</span><span>MSHA Check</span>
                  </button>
                  <button
                    className="flex-1 py-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface text-[clamp(10px,0.62vw,11.5px)] font-mono transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
                    className="absolute right-1.5 text-primary hover:text-sky-300 transition-colors flex items-center justify-center cursor-pointer"
                    title="Send Command"
                    type="button"
                    onClick={() => sendAgentCommand()}
                  >
                    <span className="material-symbols-outlined text-[14px]">send</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
    </>
  );
}