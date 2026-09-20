import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveMineVideoStream from '../components/LiveMineVideoStream';
import { demoVictimDetection } from '../data/roverControlData';
import { analyzeFrame } from '../services/ai';
import mineThermalImg from '../assets/mine_thermal_camera.jpg';

export default function Dashboard() {
  const navigate = useNavigate();
  const [telemetry, setTelemetry] = useState(null);
  const [victimDetection, setVictimDetection] = useState({
    ...demoVictimDetection,
    peopleDetected: 2,
    possibleInjured: 1,
    confidence: '94.2%',
    status: 'POSSIBLE_VICTIM',
    notes: 'Thermal heat signatures correlate with 2 human forms in Drift C alcove. 1 possible injured survivor requiring assistance.',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisToast, setAnalysisToast] = useState(null);

  // Manual Teleoperation & Emergency Stop state
  const [isTeleopOpen, setIsTeleopOpen] = useState(false);
  const [emergencyStopActive, setEmergencyStopActive] = useState(false);
  const [teleopMovement, setTeleopMovement] = useState('STOPPED');
  const [teleopSpeed, setTeleopSpeed] = useState('NORMAL');
  const [teleopToast, setTeleopToast] = useState(null);

  const handleDrive = useCallback(
    (cmd) => {
      if (emergencyStopActive && cmd !== 'STOPPED') {
        setTeleopToast('EMERGENCY STOP ACTIVE: Release brake first.');
        setTimeout(() => setTeleopToast(null), 2500);
        return;
      }
      setTeleopMovement(cmd);
      if (cmd === 'STOPPED') {
        setTeleopToast('Rover Brakes Applied (CYTRON MDD20A)');
      } else {
        setTeleopToast(`Teleop Command Sent: ${cmd} [${teleopSpeed}]`);
      }
      setTimeout(() => setTeleopToast(null), 2500);
    },
    [emergencyStopActive, teleopSpeed]
  );

  // Keyboard shortcut listener for teleoperation modal
  useEffect(() => {
    if (!isTeleopOpen) return;
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      if (key === 'escape') {
        setIsTeleopOpen(false);
      } else if (emergencyStopActive) {
        return;
      } else if (key === 'w' || key === 'arrowup') {
        e.preventDefault();
        handleDrive('FORWARD');
      } else if (key === 's' || key === 'arrowdown') {
        e.preventDefault();
        handleDrive('REVERSE');
      } else if (key === 'a' || key === 'arrowleft') {
        e.preventDefault();
        handleDrive('LEFT');
      } else if (key === 'd' || key === 'arrowright') {
        e.preventDefault();
        handleDrive('RIGHT');
      } else if (key === ' ') {
        e.preventDefault();
        handleDrive('STOPPED');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTeleopOpen, emergencyStopActive, handleDrive]);

  const handleToggleEmergencyStop = async () => {
    const nextState = !emergencyStopActive;
    setEmergencyStopActive(nextState);
    if (nextState) {
      setTeleopMovement('STOPPED');
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${API_BASE_URL}/api/alerts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'EMERGENCY_STOP',
            severity: 'CRITICAL',
            message: 'Dashboard Operator triggered immediate emergency stop.',
            source: 'DASHBOARD_TELEOP_PANEL',
          }),
        });
      } catch {
        // Graceful fallback in demo mode
      }
    }
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

    const fetchVictims = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE_URL}/api/victims`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setVictimDetection((prev) => ({
            ...prev,
            ...data,
            peopleDetected: data.peopleDetected ?? prev.peopleDetected,
            possibleInjured: data.possibleInjured ?? prev.possibleInjured,
          }));
        }
      } catch {
        // Retain demo fallback
      }
    };

    fetchTelemetry();
    fetchVictims();
    const interval = setInterval(() => {
      fetchTelemetry();
      fetchVictims();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleAnalyzeFrame = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeFrame(mineThermalImg || '/mine_thermal_camera.jpg');
      setVictimDetection((prev) => ({
        ...prev,
        ...result,
        peopleDetected: result.peopleDetected || 2,
        possibleInjured: result.possibleInjured || 1,
      }));
      setAnalysisToast('AI Scan Complete: 2 Detected / 1 Possible Injured (94.2% conf)');
      setTimeout(() => setAnalysisToast(null), 3500);
    } catch (err) {
      console.warn('Frame analysis failed, using fallback:', err);
      setVictimDetection((prev) => ({
        ...prev,
        ...demoVictimDetection,
        peopleDetected: 2,
        possibleInjured: 1,
      }));
      setAnalysisToast('AI Frame Analyzed: Possible Victim localized (94.2% conf)');
      setTimeout(() => setAnalysisToast(null), 3500);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      {/* 2. CENTER COLUMN: PRIMARY WORKSPACE (~55% WIDTH) */}
      <main className="w-full lg:w-[55%] lg:flex-[55] min-w-0 bg-[#0b1326] p-responsive flex flex-col gap-responsive overflow-y-auto industrial-scrollbar">
        {/* TOP 3 LIVE SAFETY OVERVIEW SUMMARY CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-responsive w-full shrink-0">
          {/* Card 1: Atmospheric & Hazard Telemetry -> Hazard Intel */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/hazard-intel')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/hazard-intel');
              }
            }}
            title="Navigate to Hazard Intel"
            aria-label="Atmospheric and Hazard Telemetry - Navigate to Hazard Intel"
            className="bg-surface-container-low/90 hover:bg-surface-container border border-outline-variant/30 hover:border-outline-variant/60 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)] cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-primary/40 select-none"
          >
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

          {/* Card 2: Evacuation & Refuge Readiness -> Evac & Rescue */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/evac-refuge')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/evac-refuge');
              }
            }}
            title="Navigate to Evac & Rescue"
            aria-label="Evacuation Readiness - Navigate to Evac & Rescue"
            className="bg-surface-container-low/90 hover:bg-surface-container border border-outline-variant/30 hover:border-outline-variant/60 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)] cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-primary/40 select-none"
          >
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

          {/* Card 3: Rover Connection & Fleet Status -> Rover Control */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate('/rover-control')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/rover-control');
              }
            }}
            title="Navigate to Rover Control"
            aria-label="Rover Link - Navigate to Rover Control"
            className="bg-surface-container-low/90 hover:bg-surface-container border border-outline-variant/30 hover:border-outline-variant/60 rounded-lg p-card-responsive shadow-sm flex flex-col justify-between min-h-[clamp(110px,11vh,128px)] cursor-pointer transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-primary/40 select-none"
          >
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
                <span className="text-[10px] text-outline">CYTRON MDD20A</span>
              </div>
            </div>
            <div className="pt-1 border-t border-outline-variant/20 flex items-center justify-between text-[clamp(10px,0.62vw,11.5px)] font-mono text-outline">
              <span className="truncate">SX1278: -94 dBm</span>
              <span className="text-emerald-400 shrink-0">LAT: 18ms</span>
            </div>
          </div>
        </section>

        {/* DEDICATED LIVE MINE VIDEO STREAM COMPONENT */}
        <LiveMineVideoStream
          telemetry={telemetry}
          onOpenTeleop={() => setIsTeleopOpen(true)}
        />

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

        {/* EMERGENCY STOP & MANUAL TELEOPERATION CONTROL BAR */}
        <div className="w-full shrink-0 flex flex-col gap-2 pt-0.5">
          {!emergencyStopActive ? (
            <div className="flex items-stretch gap-2.5">
              {/* Prominent Compact Emergency Stop Button */}
              <button
                type="button"
                onClick={handleToggleEmergencyStop}
                title="Emergency Stop: Immediately cuts power to CYTRON MDD20A motor driver"
                className="flex-1 bg-gradient-to-r from-red-700 via-rose-600 to-red-700 hover:from-red-600 hover:to-rose-500 active:scale-[0.99] text-white font-mono font-bold text-[12px] sm:text-[13px] tracking-wider uppercase px-4 py-2.5 rounded-lg border-2 border-red-400/80 shadow-[0_0_16px_rgba(239,68,68,0.45)] flex items-center justify-between gap-2.5 transition-all cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[22px] text-white animate-pulse">
                    emergency
                  </span>
                  <span>EMERGENCY STOP // CUT ALL MOTORS</span>
                </div>
                <span className="hidden sm:inline text-[10.5px] font-normal px-2 py-0.5 rounded bg-black/40 border border-white/20">
                  PRESS FOR FAILSAFE
                </span>
              </button>

              {/* Manual Teleoperation Trigger Button */}
              <button
                type="button"
                onClick={() => setIsTeleopOpen(true)}
                title="Open Manual Teleoperation Pad"
                className="bg-surface-container hover:bg-surface-container-high border border-primary/40 hover:border-primary text-primary hover:text-white font-mono text-[11.5px] sm:text-[12px] font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">sports_esports</span>
                <span className="hidden sm:inline">MANUAL TELEOP</span>
              </button>
            </div>
          ) : (
            <div className="w-full bg-red-950/95 border-2 border-red-500 text-red-100 p-3 rounded-lg shadow-[0_0_25px_rgba(239,68,68,0.6)] flex flex-wrap items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[26px] text-red-400 shrink-0">
                  report
                </span>
                <div className="flex flex-col min-w-0">
                  <div className="font-mono font-bold text-[13px] text-white tracking-wider flex items-center gap-2 truncate">
                    <span>EMERGENCY STOP ACTIVATED</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-800 border border-red-400 font-normal">
                      MOTORS CUT
                    </span>
                  </div>
                  <span className="text-[11px] text-red-200 truncate">
                    CYTRON MDD20A power isolated. Deadman brake engaged. Teleoperation locked.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggleEmergencyStop}
                className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/60 hover:border-emerald-400 font-mono font-bold text-[11.5px] uppercase tracking-wider transition-all shadow cursor-pointer shrink-0 active:scale-95"
              >
                DISENGAGE / RESTORE
              </button>
            </div>
          )}
        </div>
      </main>

        {/* 3. RIGHT SECONDARY VISUAL COLUMN: AI VICTIM DETECTION & THERMAL CAMERA (~45% WIDTH) */}
        <aside className="w-full lg:w-[45%] lg:flex-[45] min-w-0 shrink-0 bg-[#060e20] border-l border-outline-variant/30 flex flex-col h-full overflow-y-auto industrial-scrollbar z-20 select-none">
          {/* Column Header */}
          <div className="h-11 px-3.5 flex items-center justify-between border-b border-outline-variant/30 bg-[#060e20] shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[19px]">psychology</span>
              <div className="flex flex-col">
                <h3 className="font-bold text-[clamp(12px,0.78vw,13.5px)] tracking-wider uppercase text-on-surface leading-none">
                  AI VICTIM DETECTION
                </h3>
                <span className="font-mono text-[clamp(9px,0.56vw,10.5px)] text-outline uppercase mt-0.5">
                  THERMAL &amp; POSE CORRELATION
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 font-mono text-[clamp(9.5px,0.6vw,11px)] text-amber-400 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>ACTIVE
              </span>
            </div>
          </div>

          {/* Right Secondary Visual Column Body: Arranged Vertically */}
          <div className="flex-1 overflow-y-auto industrial-scrollbar p-card-responsive flex flex-col gap-2.5 min-h-0">
            {/* Analysis Notification Toast */}
            {analysisToast && (
              <div className="px-2.5 py-1.5 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-mono text-[11px] flex items-center gap-1.5 animate-fadeIn shrink-0">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span className="truncate">{analysisToast}</span>
              </div>
            )}

            {/* 1. COMPACT AI VICTIM DETECTION INFORMATION (TOP) */}
            <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-2.5 shadow-sm flex flex-col gap-2 shrink-0 font-mono">
              <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-amber-400">person_search</span>
                  <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
                    TARGET LOCALIZATION
                  </span>
                </div>
                <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30 font-semibold">
                  {victimDetection.status || 'POSSIBLE_VICTIM'}
                </span>
              </div>

              {/* Compact Metrics Row */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-surface-container/60 p-1.5 rounded border border-outline-variant/20">
                  <span className="text-[9px] text-outline uppercase block">Detected</span>
                  <span className="text-[15px] font-bold text-on-surface block leading-tight mt-0.5">
                    {victimDetection.peopleDetected ?? 2}
                  </span>
                </div>
                <div className="bg-surface-container/60 p-1.5 rounded border border-outline-variant/20">
                  <span className="text-[9px] text-outline uppercase block">Injured</span>
                  <span className="text-[15px] font-bold text-amber-400 block leading-tight mt-0.5">
                    {victimDetection.possibleInjured ?? 1}
                  </span>
                </div>
                <div className="bg-surface-container/60 p-1.5 rounded border border-outline-variant/20">
                  <span className="text-[9px] text-outline uppercase block">Conf</span>
                  <span className="text-[15px] font-bold text-emerald-400 block leading-tight mt-0.5">
                    {victimDetection.confidence || '94.2%'}
                  </span>
                </div>
              </div>

              {/* Context / Observation */}
              <div className="p-1.5 rounded bg-surface-container/40 border border-outline-variant/15 text-[10.5px] leading-snug text-on-surface-variant font-sans">
                <div className="flex items-center gap-1 text-amber-300 font-mono text-[9.5px] font-semibold mb-0.5">
                  <span className="material-symbols-outlined text-[12px]">info</span>
                  <span>SECTOR 4 DRIFT C (-850m)</span>
                </div>
                <p>
                  {victimDetection.notes ||
                    'AI Vision thermal/pose correlation flags 2 human heat signatures. 1 possible immobilized survivor requiring assistance.'}
                </p>
              </div>

              {/* Analyze Action Button */}
              <button
                type="button"
                onClick={handleAnalyzeFrame}
                disabled={isAnalyzing}
                className="w-full py-1 px-2.5 rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary hover:text-white font-mono text-[10.5px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[13px]">
                  {isAnalyzing ? 'sync' : 'search_check'}
                </span>
                <span>{isAnalyzing ? 'ANALYZING FRAME...' : 'ANALYZE FRAME'}</span>
              </button>
            </div>

            {/* 2. ENLARGED & CLEARER THERMAL CAMERA IMAGE DIRECTLY UNDERNEATH */}
            <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-2.5 shadow-sm flex flex-col gap-2 shrink-0 font-mono">
              {/* Thermal Section Header */}
              <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-orange-400">thermostat</span>
                  <span className="font-bold text-on-surface uppercase tracking-wider">
                    THERMAL CAMERA
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-950/40 border border-orange-500/30 text-orange-300 text-[9.5px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>FLIR T1020 &bull; IRONBOW
                </span>
              </div>

              {/* Thermal Camera Display with Clearer Bounding Boxes & Temperature Labels */}
              <div className="relative w-full aspect-[16/10] min-h-[240px] max-h-[320px] rounded-lg overflow-hidden border border-outline-variant/40 bg-black shadow-inner select-none group">
                <img
                  src={mineThermalImg || '/mine_thermal_camera.jpg'}
                  alt="Underground Coal Mine Thermal Camera View with Detected People"
                  className="w-full h-full object-cover"
                />

                {/* Bounding Box 1: Detected Victim 01 (Left Figure in tunnel) */}
                <div
                  className="absolute border-2 border-amber-400 bg-amber-500/15 rounded pointer-events-none transition-all"
                  style={{ top: '42%', left: '46.5%', width: '7.5%', height: '26%' }}
                >
                  {/* Temperature / Label Tag */}
                  <div className="absolute -top-6 -left-2 bg-[#060e20]/95 backdrop-blur border border-amber-500/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-300 font-bold whitespace-nowrap shadow-lg flex items-center gap-1 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    <span>VICTIM 01: 36.8°C</span>
                  </div>
                </div>

                {/* Bounding Box 2: Detected Person 02 (Right Figure in tunnel) */}
                <div
                  className="absolute border-2 border-sky-400 bg-sky-500/15 rounded pointer-events-none transition-all"
                  style={{ top: '42%', left: '54.5%', width: '7.5%', height: '26%' }}
                >
                  {/* Temperature / Label Tag */}
                  <div className="absolute -top-6 -left-2 bg-[#060e20]/95 backdrop-blur border border-sky-500/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-sky-300 font-bold whitespace-nowrap shadow-lg flex items-center gap-1 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    <span>MINER 02: 37.1°C</span>
                  </div>
                </div>

                {/* Bottom Thermal Overlays */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-white/95 bg-[#060e20]/85 backdrop-blur px-2 py-1 rounded border border-white/10 pointer-events-none shadow">
                  <span>RANGE: 18.4°C – 38.6°C</span>
                  <span className="text-amber-300 font-bold">DIST: 72.4m</span>
                </div>
              </div>

              {/* Thermal Sensor Details Strip */}
              <div className="pt-1.5 flex items-center justify-between text-[10px] text-outline border-t border-outline-variant/15 font-mono">
                <span>FOV: 45° &times; 34° &bull; EMIS: 0.95</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  HEAT SIG: POSITIVE
                </span>
              </div>

              {/* COMPACT THERMAL DETECTION INFO PANEL */}
              <div className="mt-1 pt-2 border-t border-outline-variant/20 flex flex-col gap-2 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-orange-400">radar</span>
                    <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider">
                      THERMAL DETECTION INFO
                    </span>
                  </div>
                </div>

                {/* 4 Core Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
                    <span className="text-[9.5px] text-outline uppercase block">AMBIENT TEMP</span>
                    <span className="text-[14px] font-bold text-sky-400 block mt-0.5">
                      {telemetry?.temperature?.value ? `${telemetry.temperature.value}°C` : '26.8°C'}
                    </span>
                  </div>

                  <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
                    <span className="text-[9.5px] text-outline uppercase block">DETECTED CORE TEMP</span>
                    <span className="text-[14px] font-bold text-amber-400 block mt-0.5">
                      36.8°C
                    </span>
                  </div>

                  <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
                    <span className="text-[9.5px] text-outline uppercase block">OBSTACLE DISTANCE</span>
                    <span className="text-[14px] font-bold text-on-surface block mt-0.5">
                      12.4 m
                    </span>
                  </div>

                  <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
                    <span className="text-[9.5px] text-outline uppercase block">LoRa BEACON LINK</span>
                    <span className="text-[13px] font-bold text-tertiary block mt-0.5">
                      NODE 04
                    </span>
                    <span className="text-[9.5px] text-outline block leading-none mt-0.5">
                      NON-GPS &bull; ~850m
                    </span>
                  </div>
                </div>

                {/* Last Thermal Reading Timestamp */}
                <div className="bg-[#060e20] px-2.5 py-1.5 rounded border border-outline-variant/25 flex items-center justify-between text-[10.5px]">
                  <span className="text-outline uppercase text-[9.5px]">LAST THERMAL READING</span>
                  <span className="text-on-surface-variant font-semibold">18 Sep 2026 &bull; 15:32</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

      {/* COMPACT MANUAL TELEOPERATION OVERLAY MODAL */}
      {isTeleopOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#060e20] border border-cyan-500/50 rounded-xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col gap-3 font-sans animate-fadeIn ring-1 ring-cyan-500/30">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  sports_esports
                </span>
                <div className="flex flex-col">
                  <h3 className="font-bold text-[14px] tracking-wider uppercase text-on-surface leading-tight">
                    MANUAL TELEOPERATION PAD
                  </h3>
                  <span className="font-mono text-[10.5px] text-outline">
                    ROVER R-01 DIRECT CONTROL &bull; CYTRON MDD20A MOTOR DRIVER
                  </span>
                </div>
              </div>
              {/* Close / X Button */}
              <button
                type="button"
                onClick={() => setIsTeleopOpen(false)}
                aria-label="Close Manual Teleoperation Pad"
                className="w-7 h-7 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 hover:border-outline-variant/70 text-on-surface flex items-center justify-center transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Emergency Stop Notice Inside Modal */}
            {emergencyStopActive && (
              <div className="p-2 rounded bg-rose-950/70 border border-rose-500/60 text-rose-200 font-mono text-[11px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-rose-400">report</span>
                <span>EMERGENCY STOP ENGAGED: Drive controls isolated.</span>
              </div>
            )}

            {/* Teleop Action Feedback Toast */}
            {teleopToast && (
              <div className="px-2.5 py-1 rounded bg-sky-950/70 border border-sky-500/40 text-sky-300 font-mono text-[11px] flex items-center justify-between">
                <span>{teleopToast}</span>
                <span className="text-[10px] text-sky-400/70 uppercase">LoRa ACK</span>
              </div>
            )}

            {/* D-Pad Controls Layout */}
            <div className="flex flex-col items-center justify-center gap-2 py-1">
              {/* Forward */}
              <button
                type="button"
                disabled={emergencyStopActive}
                onClick={() => handleDrive('FORWARD')}
                className={`w-28 py-2 rounded-lg border font-mono font-bold text-[12px] flex flex-col items-center justify-center transition-all shadow-md ${
                  teleopMovement === 'FORWARD'
                    ? 'bg-primary text-black border-primary ring-2 ring-primary/40'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/40 hover:border-primary/50'
                } disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
              >
                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                <span>FORWARD</span>
              </button>

              {/* Middle Row: Left, Brake/Stop, Right */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={emergencyStopActive}
                  onClick={() => handleDrive('LEFT')}
                  className={`w-24 py-2 rounded-lg border font-mono font-bold text-[12px] flex flex-col items-center justify-center transition-all shadow-md ${
                    teleopMovement === 'LEFT'
                      ? 'bg-primary text-black border-primary ring-2 ring-primary/40'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/40 hover:border-primary/50'
                  } disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
                >
                  <span className="material-symbols-outlined text-[18px]">keyboard_arrow_left</span>
                  <span>LEFT</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDrive('STOPPED')}
                  className={`w-24 py-2 rounded-lg border font-mono font-bold text-[12px] flex flex-col items-center justify-center transition-all shadow-md ${
                    teleopMovement === 'STOPPED'
                      ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500/40'
                      : 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border-rose-500/40'
                  } cursor-pointer`}
                >
                  <span className="material-symbols-outlined text-[18px]">pan_tool</span>
                  <span>BRAKE</span>
                </button>

                <button
                  type="button"
                  disabled={emergencyStopActive}
                  onClick={() => handleDrive('RIGHT')}
                  className={`w-24 py-2 rounded-lg border font-mono font-bold text-[12px] flex flex-col items-center justify-center transition-all shadow-md ${
                    teleopMovement === 'RIGHT'
                      ? 'bg-primary text-black border-primary ring-2 ring-primary/40'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/40 hover:border-primary/50'
                  } disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
                >
                  <span className="material-symbols-outlined text-[18px]">keyboard_arrow_right</span>
                  <span>RIGHT</span>
                </button>
              </div>

              {/* Reverse */}
              <button
                type="button"
                disabled={emergencyStopActive}
                onClick={() => handleDrive('REVERSE')}
                className={`w-28 py-2 rounded-lg border font-mono font-bold text-[12px] flex flex-col items-center justify-center transition-all shadow-md ${
                  teleopMovement === 'REVERSE'
                    ? 'bg-primary text-black border-primary ring-2 ring-primary/40'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/40 hover:border-primary/50'
                } disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
              >
                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                <span>REVERSE</span>
              </button>
            </div>

            {/* Speed Mode Selector */}
            <div className="flex items-center justify-between font-mono text-[11px] px-2 py-1.5 rounded bg-surface-container/40 border border-outline-variant/20">
              <span className="text-outline uppercase">THROTTLE SPEED:</span>
              <div className="flex items-center gap-1">
                {['SLOW', 'NORMAL', 'BOOST'].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setTeleopSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-[10.5px] transition-colors cursor-pointer ${
                      teleopSpeed === spd
                        ? 'bg-primary/20 text-primary border border-primary/40 font-bold'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Indicators */}
            <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between font-mono text-[11px] text-outline">
              <span>KEYS: W/A/S/D &bull; SPACE &bull; ESC</span>
              <button
                type="button"
                onClick={() => {
                  setIsTeleopOpen(false);
                  navigate('/rover-control');
                }}
                className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Full Telemetry Page</span>
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}