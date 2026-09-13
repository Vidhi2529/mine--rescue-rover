import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initialDriveStatus,
  speakerPresets,
  liveSensorSnapshotData,
  systemHardwareModules,
  mpu6050Data,
  demoVictimDetection,
} from '../data/roverControlData';
import { analyzeFrame } from '../services/ai';

export default function RoverControl() {
  // Movement state: 'STOPPED' | 'FORWARD' | 'REVERSE' | 'LEFT' | 'RIGHT'
  const [movement, setMovement] = useState('STOPPED');
  const [speedLevel, setSpeedLevel] = useState('Medium'); // 'Low' | 'Medium' | 'High'
  const [emergencyStop, setEmergencyStop] = useState(false);

  // Communication link state (allows simulating LoRa carrier loss)
  const [loraConnected, setLoraConnected] = useState(true);

  // Obstacle distance state (HC-SR04 sonar simulation)
  const [obstacleDistance, setObstacleDistance] = useState(1.45); // in meters

  // Backend Telemetry State (fetched from GET /api/telemetry with demo fallback)
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTelemetry = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE_URL}/api/telemetry`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setTelemetry(data);
          if (data.obstacleDistance?.distance !== undefined) {
            setObstacleDistance(data.obstacleDistance.distance);
          }
          if (data.loraStatus?.connected !== undefined) {
            setLoraConnected(data.loraStatus.connected);
          }
        }
      } catch (err) {
        // Retain existing demo values gracefully if backend is unreachable
        console.warn('Backend telemetry unavailable, using demo fallback:', err);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // AI Victim Detection state
  const [aiDetectionActive, setAiDetectionActive] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [victimDetection, setVictimDetection] = useState(demoVictimDetection);
  const cameraImgRef = useRef(null);

  const handleAnalyzeFrame = async () => {
    setIsAnalyzing(true);
    try {
      const imgSource = cameraImgRef.current?.src || '/rover_control_hud.jpg';
      const result = await analyzeFrame(imgSource);
      setVictimDetection(result);
      setAiDetectionActive(true);
      if (result.isFallback) {
        showToast(`AI Analysis (Demo Fallback): ${result.possibleInjured} Possible Injured / ${result.peopleDetected} Detected (${result.confidence})`, 'info');
      } else {
        showToast(`Gemini Vision: ${result.possibleInjured} Possible Injured / ${result.peopleDetected} Detected (${result.confidence})`, 'success');
      }
    } catch (err) {
      console.error('Frame analysis failed:', err);
      setVictimDetection(demoVictimDetection);
      setAiDetectionActive(true);
      showToast('AI Frame Analyzed: Possible Victim localized (94.2% conf)', 'info');
    } finally {
      setIsAnalyzing(false);
    }
  };


  // Speaker control state
  const [selectedPresetId, setSelectedPresetId] = useState('msg-1');
  const [customSpeakerText, setCustomSpeakerText] = useState('');
  const [speakerTransmitting, setSpeakerTransmitting] = useState(false);
  const [speakerStatus, setSpeakerStatus] = useState('Ready: SX1278 1-way downlink standing by.');

  // Notification toast
  const [actionNotice, setActionNotice] = useState(null);

  const showToast = (text, type = 'info') => {
    setActionNotice({ text, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Safe drive command dispatcher
  const executeDriveCommand = useCallback(
    (cmd) => {
      if (!loraConnected) {
        showToast('FAIL-SAFE ACTIVE: LoRa link offline. Commands rejected.', 'danger');
        return;
      }
      if (emergencyStop) {
        showToast('EMERGENCY HALT ACTIVE: Release emergency stop to drive.', 'danger');
        return;
      }

      setMovement(cmd);
      if (cmd !== 'STOPPED') {
        showToast(`Teleoperation: ${cmd} (${speedLevel} Speed &bull; ${initialDriveStatus.speedPwm[speedLevel]})`, 'success');
      } else {
        showToast('Teleoperation: Rover stopped (TB6612FNG brake applied)', 'info');
      }
    },
    [loraConnected, emergencyStop, speedLevel]
  );

  // Emergency Stop toggle
  const handleToggleEmergencyStop = () => {
    const nextState = !emergencyStop;
    setEmergencyStop(nextState);
    if (nextState) {
      setMovement('STOPPED');
      showToast('EMERGENCY STOP ENGAGED: Motors cut instantly.', 'danger');
    } else {
      showToast('Emergency stop cleared. Teleoperation controls restored.', 'info');
    }
  };

  // Toggle LoRa link (simulate disconnected fail-safe)
  const handleToggleLora = () => {
    const nextState = !loraConnected;
    setLoraConnected(nextState);
    if (!nextState) {
      setMovement('STOPPED');
      showToast('COMMUNICATION LOST: Firmware deadman stopped rover instantly.', 'danger');
    } else {
      showToast('LoRa link restored (433.0 MHz SX1278 online &bull; 18ms latency).', 'success');
    }
  };

  // Speaker message transmit
  const handleSendSpeaker = () => {
    if (!loraConnected) {
      showToast('Cannot transmit: LoRa link disconnected.', 'danger');
      return;
    }

    const preset = speakerPresets.find((p) => p.id === selectedPresetId);
    const textToSend = customSpeakerText.trim() || preset?.text || '';

    setSpeakerTransmitting(true);
    setSpeakerStatus(`Transmitting packet: "${textToSend}"...`);

    setTimeout(() => {
      setSpeakerTransmitting(false);
      setSpeakerStatus(`Packet Acknowledged by R-01 Speaker (18ms).`);
      showToast(`Speaker Broadcast Sent: "${textToSend}"`, 'success');
    }, 1200);
  };

  // Keyboard navigation handler (W, A, S, D, Space)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid intercepting when user is typing in custom input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') {
        e.preventDefault();
        executeDriveCommand('FORWARD');
      } else if (key === 's' || key === 'arrowdown') {
        e.preventDefault();
        executeDriveCommand('REVERSE');
      } else if (key === 'a' || key === 'arrowleft') {
        e.preventDefault();
        executeDriveCommand('LEFT');
      } else if (key === 'd' || key === 'arrowright') {
        e.preventDefault();
        executeDriveCommand('RIGHT');
      } else if (key === ' ' || key === 'escape') {
        e.preventDefault();
        executeDriveCommand('STOPPED');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeDriveCommand]);

  // Compute clearance status
  const getObstacleStatus = (dist) => {
    if (dist <= 0.35) {
      return {
        label: 'STOP RECOMMENDED',
        badge: 'CRITICAL PROXIMITY',
        color: 'text-rose-400 bg-rose-950/40 border-rose-600/50',
        barColor: 'bg-rose-500',
        textColor: 'text-rose-400',
      };
    }
    if (dist <= 0.8) {
      return {
        label: 'CAUTION',
        badge: 'PROXIMITY WARNING',
        color: 'text-amber-400 bg-amber-950/40 border-amber-600/50',
        barColor: 'bg-amber-500',
        textColor: 'text-amber-400',
      };
    }
    return {
      label: 'CLEAR',
      badge: 'SAFE PASSAGE',
      color: 'text-emerald-400 bg-emerald-950/40 border-emerald-600/50',
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-400',
    };
  };

  const obstacleStatus = getObstacleStatus(obstacleDistance);

  // Dynamic IMU values from backend or static MPU6050 fallback
  const currentMpu = {
    pitch: telemetry?.pitch?.value !== undefined ? `${telemetry.pitch.value > 0 ? '+' : ''}${telemetry.pitch.value}°` : mpu6050Data.pitch,
    roll: telemetry?.roll?.value !== undefined ? `${telemetry.roll.value > 0 ? '+' : ''}${telemetry.roll.value}°` : mpu6050Data.roll,
    tilt: mpu6050Data.tilt,
    impact: mpu6050Data.impact,
    rolloverRisk: mpu6050Data.rolloverRisk,
    stability: telemetry?.pitch?.stability || mpu6050Data.stability,
  };

  // Dynamic Live Sensor Snapshot from backend or static fallback
  const currentSensorSnapshot = liveSensorSnapshotData.map((s) => {
    if (!telemetry) return s;
    if (s.id === 'ch4' && telemetry.ch4) {
      return { ...s, value: `${telemetry.ch4.value}${telemetry.ch4.unit}`, status: telemetry.ch4.status };
    }
    if (s.id === 'co' && telemetry.co) {
      return { ...s, value: `${telemetry.co.value} ${telemetry.co.unit}`, status: telemetry.co.status };
    }
    if (s.id === 'temp' && telemetry.temperature) {
      return { ...s, value: `${telemetry.temperature.value}${telemetry.temperature.unit}`, status: telemetry.temperature.status };
    }
    if (s.id === 'humidity' && telemetry.humidity) {
      return { ...s, value: `${telemetry.humidity.value}${telemetry.humidity.unit}`, status: telemetry.humidity.status };
    }
    if (s.id === 'lora' && telemetry.loraStatus) {
      return { ...s, value: `${telemetry.loraStatus.rssi} ${telemetry.loraStatus.rssiUnit}` };
    }
    return s;
  });

  return (
    <main className="flex-1 min-w-0 bg-[#0b1326] p-3.5 flex flex-col gap-3 overflow-y-auto industrial-scrollbar">
      {/* ========================================================================= */}
      {/* 1. PAGE BANNER HEADER & TOP STATUS INFORMATION                            */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/25 pb-3 gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[24px]">precision_manufacturing</span>
            <h1 className="font-bold text-[17px] md:text-[18px] tracking-wider uppercase text-on-surface">
              ROVER CONTROL
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-mono text-[12px] font-semibold">
              MANUAL TELEOPERATION
            </span>
          </div>
          <p className="text-on-surface-variant text-[12.5px] mt-1">
            Manual teleoperation and live rover status &bull; Non-autonomous direct operator control
          </p>
        </div>

        {/* Right Status Chips */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-[12px]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            MANUAL CONTROL
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border font-semibold shadow-sm ${
              loraConnected
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/50 border-rose-500/60 text-rose-300 animate-pulse'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${loraConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
            {loraConnected ? 'LoRa LINK ACTIVE' : 'LoRa LINK LOST'}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-950/40 border border-rose-500/50 text-rose-300 font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            FAIL-SAFE ARMED
          </span>
        </div>
      </div>

      {/* TOAST / ACTION BANNER */}
      {actionNotice && (
        <div
          className={`px-3.5 py-2 rounded-lg border flex items-center justify-between text-[12.5px] font-mono transition-all animate-fadeIn shrink-0 ${
            actionNotice.type === 'danger'
              ? 'bg-rose-950/60 border-rose-500 text-rose-200'
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

      {/* CRITICAL DISCONNECTED ALERT (WHEN LORA IS LOST) */}
      {!loraConnected && (
        <div className="bg-rose-950/80 border-2 border-rose-500 p-3 rounded-lg flex items-center justify-between gap-3 text-rose-200 shadow-xl animate-pulse shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[28px] text-rose-400">link_off</span>
            <div>
              <h4 className="font-mono font-bold text-[14.5px] text-white uppercase tracking-wider">
                COMMUNICATION LOST — ROVER STOPPED
              </h4>
              <p className="text-[12px] text-rose-200 font-sans mt-0.5">
                SX1278 telemetry heartbeat interrupted (&gt;1,500ms). Firmware deadman safety cut TB6612FNG H-bridge power immediately.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleLora}
            className="px-3.5 py-1.5 rounded bg-rose-700 hover:bg-rose-600 text-white font-mono text-[12px] font-semibold border border-rose-400 shadow transition-colors shrink-0"
          >
            RESTORE LoRa LINK
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN TWO-COLUMN WORKSPACE:                                             */}
      {/*    LEFT: ROVER IMAGE / VISUAL                                             */}
      {/*    RIGHT: MANUAL DRIVE / TELEOPERATION                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* LEFT COLUMN — ROVER IMAGE / VISUAL (7 COLS) */}
        <section className="lg:col-span-7 bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col justify-between gap-2.5">
          <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/20 pb-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">videocam</span>
              <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                LIVE ROVER POV FEED &bull; FORWARD RESCUE CAMERA
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-[12px]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ROVER R-01 &bull; 1080P IR
              </span>
            </div>
          </div>

          {/* AI VICTIM DETECTION BAR */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#060e20] border border-outline-variant/30 font-mono text-[12px]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-400">psychology</span>
              <span className="font-bold uppercase text-on-surface tracking-wider">AI VICTIM DETECTION</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                  aiDetectionActive
                    ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                    : 'bg-surface-container text-outline border-outline-variant/30'
                }`}
              >
                {aiDetectionActive ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-outline text-[11px] uppercase">People:</span>
                <span className="font-bold text-on-surface">{aiDetectionActive ? victimDetection.peopleDetected : 0}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-outline text-[11px] uppercase">Injured:</span>
                <span className={`font-bold ${aiDetectionActive ? 'text-amber-400' : 'text-outline'}`}>
                  {aiDetectionActive ? victimDetection.possibleInjured : 0}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-outline text-[11px] uppercase">Conf:</span>
                <span className="font-bold text-emerald-400">{aiDetectionActive ? victimDetection.confidence : '--'}</span>
              </div>
              <button
                type="button"
                onClick={handleAnalyzeFrame}
                disabled={isAnalyzing}
                className="px-2.5 py-1 rounded bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-bold transition-all text-[11px] flex items-center gap-1 active:scale-95"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isAnalyzing ? 'sync' : 'search_check'}
                </span>
                <span>{isAnalyzing ? 'ANALYZING...' : 'ANALYZE FRAME'}</span>
              </button>
            </div>
          </div>

          {/* Video Container with Overlays */}
          <div className="relative w-full aspect-video max-h-[380px] rounded-lg overflow-hidden border border-outline-variant/40 bg-black shadow-2xl ring-1 ring-primary/20 mx-auto select-none">
            <img
              ref={cameraImgRef}
              alt="Live Rover POV Telemetry HUD Feed"
              className="w-full h-full object-cover"
              src="/rover_control_hud.jpg"
            />

            {/* AI Victim Bounding Box Overlay */}
            {aiDetectionActive && (victimDetection.possibleInjured > 0 || victimDetection.peopleDetected > 0) && (
              <div
                className="absolute border-2 border-amber-400 bg-amber-500/10 rounded pointer-events-none transition-all animate-pulse"
                style={{ top: '22%', left: '38%', width: '24%', height: '54%' }}
              >
                <div className="absolute -top-6 left-0 bg-[#060e20]/95 backdrop-blur border border-amber-500/60 px-1.5 py-0.5 rounded text-[10.5px] font-mono text-amber-300 font-bold whitespace-nowrap flex items-center gap-1 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  POSSIBLE VICTIM [{victimDetection.confidence}]
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN — MANUAL DRIVE / TELEOPERATION (5 COLS) */}
        <section className="lg:col-span-5 bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">sports_esports</span>
              <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                MANUAL DRIVE TELEOPERATION PAD
              </h2>
            </div>
            <span className="font-mono text-[11px] text-outline uppercase hidden sm:inline">
              KEYBOARD: W / A / S / D &bull; SPACE
            </span>
          </div>

          {/* D-Pad Layout */}
          <div className="flex flex-col items-center justify-center gap-2 py-2 my-auto">
            {/* Row 1: Forward */}
            <button
              type="button"
              onClick={() => executeDriveCommand('FORWARD')}
              className={`w-28 py-2.5 rounded-lg border font-mono font-bold text-[13px] flex flex-col items-center justify-center transition-all shadow-md ${
                movement === 'FORWARD'
                  ? 'bg-primary text-black border-primary ring-2 ring-primary/50'
                  : 'bg-[#060e20] hover:bg-surface-container border-outline-variant/40 text-on-surface active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
              <span>FORWARD</span>
              <span className="text-[10px] text-outline font-normal mt-0.5">[ W ]</span>
            </button>

            {/* Row 2: Left, Stop, Right */}
            <div className="flex items-center gap-2.5">
              {/* Turn Left */}
              <button
                type="button"
                onClick={() => executeDriveCommand('LEFT')}
                className={`w-28 py-2.5 rounded-lg border font-mono font-bold text-[13px] flex flex-col items-center justify-center transition-all shadow-md ${
                  movement === 'LEFT'
                    ? 'bg-primary text-black border-primary ring-2 ring-primary/50'
                    : 'bg-[#060e20] hover:bg-surface-container border-outline-variant/40 text-on-surface active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                <span>TURN LEFT</span>
                <span className="text-[10px] text-outline font-normal mt-0.5">[ A ]</span>
              </button>

              {/* Stop */}
              <button
                type="button"
                onClick={() => executeDriveCommand('STOPPED')}
                className={`w-28 py-2.5 rounded-lg border font-mono font-bold text-[13px] flex flex-col items-center justify-center transition-all shadow-md ${
                  movement === 'STOPPED'
                    ? 'bg-surface-container-highest border-primary text-primary ring-1 ring-primary/40'
                    : 'bg-[#060e20] hover:bg-surface-container border-outline-variant/40 text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">stop</span>
                <span>STOP</span>
                <span className="text-[10px] text-outline font-normal mt-0.5">[ SPACE ]</span>
              </button>

              {/* Turn Right */}
              <button
                type="button"
                onClick={() => executeDriveCommand('RIGHT')}
                className={`w-28 py-2.5 rounded-lg border font-mono font-bold text-[13px] flex flex-col items-center justify-center transition-all shadow-md ${
                  movement === 'RIGHT'
                    ? 'bg-primary text-black border-primary ring-2 ring-primary/50'
                    : 'bg-[#060e20] hover:bg-surface-container border-outline-variant/40 text-on-surface active:scale-95'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                <span>TURN RIGHT</span>
                <span className="text-[10px] text-outline font-normal mt-0.5">[ D ]</span>
              </button>
            </div>

            {/* Row 3: Backward */}
            <button
              type="button"
              onClick={() => executeDriveCommand('REVERSE')}
              className={`w-28 py-2.5 rounded-lg border font-mono font-bold text-[13px] flex flex-col items-center justify-center transition-all shadow-md ${
                movement === 'REVERSE'
                  ? 'bg-primary text-black border-primary ring-2 ring-primary/50'
                  : 'bg-[#060e20] hover:bg-surface-container border-outline-variant/40 text-on-surface active:scale-95'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">arrow_downward</span>
              <span>BACKWARD</span>
              <span className="text-[10px] text-outline font-normal mt-0.5">[ S ]</span>
            </button>
          </div>

          {/* Speed Level Selector & Prominent Emergency STOP */}
          <div className="pt-2.5 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Speed Level */}
            <div className="flex items-center gap-2 font-mono text-[12px]">
              <span className="text-outline uppercase font-semibold">SPEED:</span>
              <div className="flex items-center bg-[#060e20] p-0.5 rounded border border-outline-variant/30">
                {['Low', 'Medium', 'High'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setSpeedLevel(lvl);
                      showToast(`Speed set to ${lvl} (${initialDriveStatus.speedPwm[lvl]})`);
                    }}
                    className={`px-3 py-1 rounded text-[11.5px] font-semibold transition-all ${
                      speedLevel === lvl
                        ? 'bg-primary/20 text-primary border border-primary/40'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* EMERGENCY STOP BUTTON */}
            <button
              type="button"
              onClick={handleToggleEmergencyStop}
              className={`py-2 px-4 rounded-lg font-mono font-bold text-[12.5px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                emergencyStop
                  ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse ring-2 ring-amber-400'
                  : 'bg-rose-600 hover:bg-rose-500 text-white ring-1 ring-rose-400/50'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">
                {emergencyStop ? 'refresh' : 'emergency'}
              </span>
              <span>{emergencyStop ? 'RELEASE E-STOP' : 'EMERGENCY STOP'}</span>
            </button>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 3. DIRECTLY BELOW BOTH COLUMNS — COMMS & SYSTEM (FULL-WIDTH)              */}
      {/* ========================================================================= */}
      <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/20 pb-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">cell_tower</span>
            <h3 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface leading-none">
              COMMS &amp; SYSTEMS
            </h3>
            <span className="font-mono text-[11px] text-outline uppercase hidden sm:inline">
              &bull; SX1278 LoRa &bull; SPEAKER DOWNLINK &bull; HARDWARE HEALTH
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-600/40 font-semibold">
            433.0 MHz SX1278
          </span>
        </div>

        {/* 3-Column Grid inside the full-width card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* LoRa COMM STATUS (SX1278) */}
          <div className="bg-[#060e20] p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between gap-2.5 font-mono text-[12px]">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-1.5">
              <span className="text-outline uppercase text-[11.5px] font-semibold">
                LoRa COMM STATUS (SX1278)
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${
                  loraConnected
                    ? 'text-emerald-400 bg-emerald-950/30 border-emerald-600/40'
                    : 'text-rose-400 bg-rose-950/40 border-rose-600/50'
                }`}
              >
                {loraConnected ? 'CONNECTED' : 'LOST'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-outline">RF MODULE:</span>
                <span className="text-on-surface font-semibold">SX1278 (433.0 MHz)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline">SIGNAL RSSI:</span>
                <span className={loraConnected ? 'text-sky-400 font-bold' : 'text-rose-400 font-bold'}>
                  {loraConnected ? `${telemetry?.loraStatus?.rssi !== undefined ? telemetry.loraStatus.rssi : -94} dBm (SNR +9.2 dB)` : '0 dBm (CARRIER DROP)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline">LAST PACKET:</span>
                <span className="text-on-surface">14:35:02 UTC (18ms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline">FAIL-SAFE STATUS:</span>
                <span className="text-rose-400 font-bold">ARMED (1,500ms Timeout)</span>
              </div>
            </div>

            {/* Fail-Safe Explanation Banner */}
            <div className="bg-rose-950/30 p-2 rounded border border-rose-500/40 text-[11px] leading-snug font-sans text-rose-200">
              <strong className="font-mono text-rose-300 block text-[10.5px] uppercase">
                CRITICAL HARDWARE FAIL-SAFE:
              </strong>
              If LoRa telemetry heartbeat is lost (&gt;1,500ms), ESP32 firmware instantly halts motors.
            </div>

            {/* Simulate Carrier Loss Button */}
            <button
              type="button"
              onClick={handleToggleLora}
              className={`w-full py-1.5 px-3 rounded font-semibold text-[11.5px] uppercase tracking-wider transition-colors border mt-auto ${
                loraConnected
                  ? 'bg-surface-container-high hover:bg-rose-950/40 text-outline hover:text-rose-400 border-outline-variant/40'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 font-bold'
              }`}
            >
              {loraConnected ? 'Simulate Carrier Loss' : 'Reconnect LoRa Link'}
            </button>
          </div>

          {/* SPEAKER DOWNLINK CONTROL */}
          <div className="bg-[#060e20] p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between gap-2 font-mono">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">volume_up</span>
                <span className="font-mono text-[12px] uppercase text-outline font-semibold">
                  SPEAKER DOWNLINK CONTROL
                </span>
              </div>
              <span className="font-mono text-[11px] text-sky-400 bg-sky-950/30 px-1.5 py-0.5 rounded border border-sky-600/40">
                1-WAY AUDIO
              </span>
            </div>

            <p className="text-[11.5px] text-on-surface-variant leading-tight font-sans">
              Select preset or enter custom message to broadcast through rover PA speaker:
            </p>

            {/* Preset Radio List */}
            <div className="flex flex-col gap-1">
              {speakerPresets.map((preset) => (
                <label
                  key={preset.id}
                  className={`p-1.5 rounded border cursor-pointer flex items-start gap-2 transition-colors ${
                    selectedPresetId === preset.id
                      ? 'bg-sky-950/40 border-primary text-on-surface'
                      : 'bg-surface-container/30 border-outline-variant/30 text-on-surface-variant hover:bg-surface-container/60'
                  }`}
                >
                  <input
                    type="radio"
                    name="rover-speaker-preset"
                    value={preset.id}
                    checked={selectedPresetId === preset.id}
                    onChange={() => {
                      setSelectedPresetId(preset.id);
                      setCustomSpeakerText('');
                    }}
                    className="mt-0.5 text-primary focus:ring-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-mono text-[10.5px] text-primary font-bold">{preset.code}</span>
                    <span className="text-[11.5px] italic text-on-surface line-clamp-1 font-sans">
                      &ldquo;{preset.text}&rdquo;
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Custom Text Input */}
            <div className="flex flex-col gap-1 font-mono text-[11px]">
              <input
                type="text"
                value={customSpeakerText}
                onChange={(e) => setCustomSpeakerText(e.target.value)}
                placeholder="Enter custom operator announcement..."
                className="w-full px-2.5 py-1 rounded bg-[#0b1326] border border-outline-variant/40 text-on-surface placeholder:text-outline text-[11.5px] font-sans focus:outline-none focus:border-primary"
              />
            </div>

            {/* Send Button & Status */}
            <div className="flex flex-col gap-1 mt-auto">
              <button
                type="button"
                onClick={handleSendSpeaker}
                disabled={speakerTransmitting}
                className={`w-full py-1.5 px-3 rounded font-mono font-semibold text-[11.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  speakerTransmitting
                    ? 'bg-sky-800 text-sky-200 cursor-not-allowed'
                    : 'bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 shadow-sm'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {speakerTransmitting ? 'sync' : 'volume_up'}
                </span>
                <span>{speakerTransmitting ? 'TRANSMITTING VIA LoRa...' : 'SEND MESSAGE'}</span>
              </button>

              <span className="font-mono text-[10.5px] text-outline leading-tight truncate">
                {speakerStatus}
              </span>
            </div>
          </div>

          {/* SYSTEM HARDWARE HEALTH */}
          <div className="bg-[#060e20] p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between gap-2 font-mono text-[11.5px]">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-1.5">
              <span className="text-outline uppercase text-[11.5px] font-semibold">
                SYSTEM HARDWARE HEALTH
              </span>
              <span className="text-emerald-400 font-semibold">{systemHardwareModules.length} MODULES</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {systemHardwareModules.map((mod) => (
                <div
                  key={mod.name}
                  className="bg-surface-container/30 px-2.5 py-1.5 rounded border border-outline-variant/20 flex items-center justify-between"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-on-surface text-[11.5px] truncate">{mod.name}</span>
                    <span className="text-[10px] text-outline truncate font-sans">{mod.role}</span>
                  </div>
                  <span className={`font-bold text-[11px] shrink-0 ${mod.color}`}>
                    {mod.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LOWER SECTIONS: DRIVE STATUS, SONAR & IMU TELEMETRY                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* DRIVE STATUS & PRESETS */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">electric_meter</span>
              <h3 className="font-bold text-[13.5px] tracking-wider uppercase text-on-surface">
                DRIVE STATUS
              </h3>
            </div>
            <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-600/40 font-semibold">
              TB6612FNG
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[12px]">
            <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">MOTOR STATUS</span>
              <span
                className={`font-bold text-[13px] mt-0.5 block ${
                  movement === 'STOPPED' ? 'text-outline' : 'text-emerald-400'
                }`}
              >
                {movement === 'STOPPED' ? 'STOPPED' : 'ACTIVE (PWM)'}
              </span>
            </div>

            <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">CURRENT MOVEMENT</span>
              <span className="text-on-surface font-bold text-[13px] mt-0.5 block">{movement}</span>
            </div>

            <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">SPEED LEVEL / PWM</span>
              <span className="text-primary font-bold text-[13px] mt-0.5 block truncate">
                {speedLevel} &bull; {initialDriveStatus.speedPwm[speedLevel]}
              </span>
            </div>

            <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">BATTERY (3S Li-ion)</span>
              <span className="text-emerald-400 font-bold text-[13px] mt-0.5 block truncate">
                {telemetry?.battery ? `${telemetry.battery.level}% (11.8V)` : '88% (11.8V)'}
              </span>
            </div>
          </div>
        </section>

        {/* HC-SR04 SONAR CLEARANCE / AWARENESS */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">radar</span>
              <h3 className="font-bold text-[13.5px] tracking-wider uppercase text-on-surface">
                SONAR CLEARANCE
              </h3>
            </div>
            <span className={`text-[10.5px] px-2 py-0.5 rounded border font-semibold font-mono ${obstacleStatus.color}`}>
              {obstacleStatus.badge}
            </span>
          </div>

          <div className="bg-[#060e20] p-2.5 rounded-lg border border-outline-variant/30 flex flex-col gap-2 font-mono">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className={`text-[22px] font-bold leading-none ${obstacleStatus.textColor}`}>
                  {obstacleDistance.toFixed(2)} m
                </span>
                <span className="text-[11px] text-outline">Clearance</span>
              </div>
              <span className={`text-[12px] font-bold ${obstacleStatus.textColor}`}>
                {obstacleStatus.label}
              </span>
            </div>

            {/* Clearance Range Bar */}
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className={`h-full ${obstacleStatus.barColor} transition-all duration-300`}
                style={{ width: `${Math.min(100, (obstacleDistance / 2.5) * 100)}%` }}
              ></div>
            </div>

            {/* Demo Obstacle Presets */}
            <div className="flex items-center justify-between pt-0.5 text-[10.5px] text-outline">
              <span>SIMULATE:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setObstacleDistance(1.8)}
                  className="px-2 py-0.5 rounded bg-surface-container-high hover:text-emerald-400 border border-outline-variant/30"
                >
                  1.8m
                </button>
                <button
                  type="button"
                  onClick={() => setObstacleDistance(0.6)}
                  className="px-2 py-0.5 rounded bg-surface-container-high hover:text-amber-400 border border-outline-variant/30"
                >
                  0.6m
                </button>
                <button
                  type="button"
                  onClick={() => setObstacleDistance(0.25)}
                  className="px-2 py-0.5 rounded bg-surface-container-high hover:text-rose-400 border border-outline-variant/30"
                >
                  0.25m
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MPU6050 IMU TELEMETRY */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">screen_rotation</span>
              <h3 className="font-bold text-[13.5px] tracking-wider uppercase text-on-surface">
                MPU6050 IMU TELEMETRY
              </h3>
            </div>
            <span className="text-[10.5px] px-2 py-0.5 rounded border font-semibold text-emerald-400 bg-emerald-950/30 border-emerald-600/40 font-mono">
              {mpu6050Data.stability}
            </span>
          </div>

          <div className="bg-[#060e20] p-2.5 rounded-lg border border-outline-variant/30 flex flex-col gap-1.5 font-mono">
            <div className="grid grid-cols-3 gap-1.5 text-center text-[11.5px]">
              <div className="bg-surface-container/40 p-1.5 rounded border border-outline-variant/20">
                <span className="text-outline text-[10px] uppercase block">Pitch</span>
                <span className="font-bold text-on-surface mt-0.5 block">{currentMpu.pitch}</span>
              </div>
              <div className="bg-surface-container/40 p-1.5 rounded border border-outline-variant/20">
                <span className="text-outline text-[10px] uppercase block">Roll</span>
                <span className="font-bold text-on-surface mt-0.5 block">{currentMpu.roll}</span>
              </div>
              <div className="bg-surface-container/40 p-1.5 rounded border border-outline-variant/20">
                <span className="text-outline text-[10px] uppercase block">Tilt</span>
                <span className="font-bold text-on-surface mt-0.5 block">{currentMpu.tilt}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
              <div className="bg-surface-container/40 p-1.5 rounded border border-outline-variant/20">
                <span className="text-outline text-[10px] uppercase block">Impact</span>
                <span className="font-bold text-sky-400 mt-0.5 block truncate">{currentMpu.impact}</span>
              </div>
              <div className="bg-surface-container/40 p-1.5 rounded border border-outline-variant/20">
                <span className="text-outline text-[10px] uppercase block">Rollover Risk</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">{currentMpu.rolloverRisk}</span>
              </div>
              <div className="bg-surface-container/40 p-1.5 rounded border border-outline-variant/20">
                <span className="text-outline text-[10px] uppercase block">Stability</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">{currentMpu.stability}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 5. LIVE SENSOR SNAPSHOT (10 METRICS)                                      */}
      {/* ========================================================================= */}
      <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">sensors</span>
            <h3 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
              LIVE ROVER SENSOR SNAPSHOT &bull; TELEMETRY OVERVIEW
            </h3>
          </div>
          <span className="font-mono text-[11px] text-outline uppercase">
            ESP32 PAYLOAD UPLINK &bull; CONTINUOUS REFRESH
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono text-[12px]">
          {currentSensorSnapshot.map((s) => (
            <div
              key={s.id}
              className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex flex-col justify-between min-h-[85px]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-outline uppercase font-semibold truncate">{s.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${s.statusClass}`}>
                  {s.status}
                </span>
              </div>
              <span className="text-[18px] font-bold text-on-surface mt-1">
                {s.value}
              </span>
              <span className="text-[10.5px] text-outline truncate">{s.sensor}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
