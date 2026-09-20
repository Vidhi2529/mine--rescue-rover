import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  initialDriveStatus,
  speakerPresets,
  liveSensorSnapshotData,
  mpu6050Data,
} from '../data/roverControlData';

export default function RoverControl() {
  const navigate = useNavigate();

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

  // Toggle LoRa link (simulate disconnected fail-safe)
  const handleToggleLora = () => {
    const nextState = !loraConnected;
    setLoraConnected(nextState);
    if (!nextState) {
      showToast('COMMUNICATION LOST: Telemetry heartbeat dropped.', 'danger');
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
      setSpeakerStatus('Packet Acknowledged by Rover Speaker (18ms).');
      showToast(`Speaker Broadcast Sent: "${textToSend}"`, 'success');
    }, 1200);
  };

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

  // Derived locomotion telemetry (primary control is handled on Dashboard overlay)
  const currentMovement = telemetry?.speed?.mode || 'STANDBY';
  const currentSpeedLevel = telemetry?.speed?.level || 'Medium';

  // System Health & Diagnostics data for compact overview
  const diagnosticModules = [
    {
      name: 'ESP32 Main Controller',
      sub: 'Dual-core 240MHz System MCU',
      status: 'ONLINE',
      statusClass: 'text-emerald-400',
      note: 'SPI & I2C Bus Active • Watchdog 1,500ms',
    },
    {
      name: 'Battery & Power Health',
      sub: '3S 18650 Li-ion 11.8V Pack',
      status: telemetry?.battery?.status || 'NOMINAL',
      statusClass: 'text-emerald-400',
      note: `${telemetry?.battery ? `${telemetry.battery.level}%` : '88%'} Capacity • Voltage Regulated`,
    },
    {
      name: 'Camera Subsystem',
      sub: '1080P Low-Light IR Camera',
      status: 'ACTIVE',
      statusClass: 'text-emerald-400',
      note: 'Continuous Stream • Dashboard Feed Online',
    },
    {
      name: 'AI Hazard Intelligence',
      sub: 'Edge Vision & Risk Engine',
      status: 'READY',
      statusClass: 'text-sky-400',
      note: 'Gemini Multimodal Inference Ready',
    },
    {
      name: 'Gas Sensor Array',
      sub: 'MQ-4, MQ-7, MQ-135, MQ-136, O2',
      status: 'ONLINE',
      statusClass: 'text-emerald-400',
      note: 'ADC Calibrated • Multi-Gas Telemetry Active',
    },
    {
      name: 'Sonar & IMU Subsystem',
      sub: 'HC-SR04 Sonar & MPU6050 6-Axis',
      status: 'ONLINE',
      statusClass: 'text-emerald-400',
      note: `Clearance ${obstacleDistance.toFixed(2)}m • Stability ${currentMpu.stability}`,
    },
    {
      name: 'Communication Health',
      sub: 'SX1278 433.0 MHz SPI Bus',
      status: loraConnected ? 'HEALTHY' : 'LINK LOST',
      statusClass: loraConnected ? 'text-emerald-400' : 'text-rose-400',
      note: loraConnected ? 'VSWR 1.15 • Heartbeat ACK 18ms' : 'Carrier Lost • Deadman Cutoff Active',
    },
    {
      name: 'Motor Driver Diagnostics',
      sub: 'CYTRON MDD20A Motor Driver',
      status: currentMovement === 'STOPPED' ? 'ARMED' : 'DRIVING',
      statusClass: currentMovement === 'STOPPED' ? 'text-emerald-400' : 'text-primary',
      note: `Mode: ${currentMovement} • Throttle ${currentSpeedLevel}`,
    },
  ];

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
              TELEMETRY &amp; HARDWARE SYSTEMS
            </span>
          </div>
          <p className="text-on-surface-variant text-[12.5px] mt-1">
            Rover telemetry, communication links &bull; Direct drive control managed via Dashboard teleoperation
          </p>
        </div>

        {/* Right Status Chips */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-[12px]">
          <button
            type="button"
            onClick={() => navigate('/')}
            title="Open Dashboard where Manual Teleoperation is located"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high border border-primary/40 hover:border-primary text-primary hover:text-white font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">sports_esports</span>
            <span>TELEOP: DASHBOARD</span>
          </button>
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
                SX1278 telemetry heartbeat interrupted (&gt;1,500ms). Firmware deadman safety cut CYTRON MDD20A motor power immediately.
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
      {/* 2. TOP BALANCED TWO-COLUMN SECTION                                        */}
      {/*    LEFT: COMMUNICATION & ROVER STATUS                                     */}
      {/*    RIGHT: CHASSIS & MOTOR TELEMETRY                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
        {/* LEFT COLUMN: COMMUNICATION & ROVER STATUS */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">cell_tower</span>
              <div>
                <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface leading-tight">
                  COMMUNICATION &amp; ROVER STATUS
                </h2>
                <span className="font-mono text-[11px] text-outline uppercase block mt-0.5">
                  SX1278 LoRa RF &bull; TELEMETRY HEARTBEAT
                </span>
              </div>
            </div>
            <span
              className={`font-mono text-[10.5px] px-2 py-0.5 rounded border font-semibold ${
                loraConnected
                  ? 'text-emerald-400 bg-emerald-950/30 border-emerald-600/40'
                  : 'text-rose-400 bg-rose-950/40 border-rose-600/50'
              }`}
            >
              {loraConnected ? 'ROVER ONLINE' : 'ROVER OFFLINE'}
            </span>
          </div>

          {/* Communication & Rover Status Grid */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[12px]">
            <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">Rover Status</span>
              <span
                className={`font-bold text-[13.5px] mt-0.5 block ${
                  loraConnected ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {loraConnected ? 'ONLINE' : 'OFFLINE'}
              </span>
              <span className="text-[10px] text-outline">ESP32 240MHz MCU</span>
            </div>

            <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">Control Mode</span>
              <span className="text-primary font-bold text-[13.5px] mt-0.5 block">
                REMOTE
              </span>
              <span className="text-[10px] text-outline">DASHBOARD TELEOP</span>
            </div>

            <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">LoRa Link</span>
              <span
                className={`font-bold text-[13.5px] mt-0.5 block ${
                  loraConnected ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {loraConnected ? 'CONNECTED' : 'LOST'}
              </span>
              <span className="text-[10px] text-outline">433.0 MHz SX1278</span>
            </div>

            <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">Signal / Latency</span>
              <span
                className={`font-bold text-[13.5px] mt-0.5 block truncate ${
                  loraConnected ? 'text-sky-400' : 'text-rose-400'
                }`}
              >
                {loraConnected
                  ? `${telemetry?.loraStatus?.rssi !== undefined ? telemetry.loraStatus.rssi : -94} dBm`
                  : '0 dBm'}
              </span>
              <span className="text-[10px] text-outline">
                {loraConnected ? '18ms (SNR +9.2 dB)' : 'CARRIER DROP'}
              </span>
            </div>
          </div>

          {/* Communication Fail-Safe Card */}
          <div className="p-3 rounded-lg bg-[#060e20] border border-outline-variant/25 flex flex-col gap-2 font-sans">
            <div className="flex items-center justify-between text-rose-400 font-mono text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">security</span>
                <span>FAIL-SAFE: ARMED (1,500ms)</span>
              </div>
              <span className="text-[10px] text-outline">HEARTBEAT: 1Hz</span>
            </div>
            <p className="text-[11.5px] text-on-surface-variant leading-snug">
              Firmware deadman watchdog active. If SX1278 telemetry heartbeat drops (&gt;1,500ms), ESP32 controller immediately cuts motor power.
            </p>
            <button
              type="button"
              onClick={handleToggleLora}
              className={`w-full py-2 px-3 rounded-lg font-mono font-semibold text-[11.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer mt-1 border ${
                loraConnected
                  ? 'bg-surface-container hover:bg-rose-950/40 text-outline hover:text-rose-400 border-outline-variant/40 hover:border-rose-500/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 font-bold'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {loraConnected ? 'link_off' : 'link'}
              </span>
              <span>{loraConnected ? 'Simulate Carrier Loss' : 'Reconnect LoRa Link'}</span>
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: CHASSIS & MOTOR TELEMETRY */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">electric_meter</span>
              <div>
                <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface leading-tight">
                  CHASSIS &amp; MOTOR TELEMETRY
                </h2>
                <span className="font-mono text-[11px] text-outline uppercase block mt-0.5">
                  CYTRON MDD20A MOTOR DRIVER &bull; TELEOPERATION STATUS
                </span>
              </div>
            </div>
            <span className="font-mono text-[10.5px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-600/40 font-semibold">
              H-BRIDGE ARMED
            </span>
          </div>

          {/* Chassis Status Grid */}
          <div className="grid grid-cols-2 gap-2 font-mono text-[12px]">
            <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">Motor Mode</span>
              <span className="text-emerald-400 font-bold text-[13.5px] mt-0.5 block">
                {currentMovement === 'STOPPED' ? 'STANDBY / ARMED' : currentMovement}
              </span>
              <span className="text-[10px] text-outline">CYTRON MDD20A</span>
            </div>

            <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">Control Origin</span>
              <span className="text-primary font-bold text-[13.5px] mt-0.5 block">
                DASHBOARD
              </span>
              <span className="text-[10px] text-outline">OVERLAY PAD</span>
            </div>

            <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">Throttle Profile</span>
              <span className="text-on-surface font-bold text-[13.5px] mt-0.5 block">
                {currentSpeedLevel}
              </span>
              <span className="text-[10px] text-outline">{initialDriveStatus.speedPwm[currentSpeedLevel]}</span>
            </div>

            <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">Li-ion Battery</span>
              <span className="text-secondary font-bold text-[13.5px] mt-0.5 block">
                {telemetry?.battery ? `${telemetry.battery.level}%` : '88%'}
              </span>
              <span className="text-[10px] text-outline">11.8V 3S Pack</span>
            </div>
          </div>

          {/* Teleoperation Workflow Guidance Card */}
          <div className="p-3 rounded-lg bg-[#060e20] border border-outline-variant/25 flex flex-col gap-2 font-sans">
            <div className="flex items-center gap-1.5 text-sky-400 font-mono text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">sports_esports</span>
              <span>TELEOPERATION ENTRY POINT: DASHBOARD</span>
            </div>
            <p className="text-[11.5px] text-on-surface-variant leading-snug">
              Direct manual drive control is centralized on the Dashboard. Click the Manual Teleoperation button on the Dashboard to open the drive pad and command the rover.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high border border-primary/40 hover:border-primary text-primary hover:text-white font-mono font-semibold text-[11.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer mt-1"
            >
              <span>OPEN DASHBOARD TELEOPERATION PAD</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 3. SYSTEM HEALTH & DIAGNOSTICS (FULL-WIDTH COMPACT PANEL)                 */}
      {/* ========================================================================= */}
      <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/20 pb-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">health_and_safety</span>
            <h3 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface leading-none">
              SYSTEM HEALTH &amp; DIAGNOSTICS
            </h3>
            <span className="font-mono text-[11px] text-outline uppercase hidden sm:inline">
              &bull; SUBSYSTEM TELEMETRY &bull; SENSOR BUSES &bull; PA DOWNLINK
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-600/40 font-semibold">
            ALL SYSTEMS NOMINAL
          </span>
        </div>

        {/* Diagnostic Subsystem Matrix (7 Cols) + PA Speaker Downlink (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* SUBSYSTEM HEALTH MATRIX (7 COLS) */}
          <div className="lg:col-span-7 bg-[#060e20] p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between gap-2.5 font-mono text-[11.5px]">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-emerald-400">tune</span>
                <span className="text-outline uppercase text-[12px] font-semibold">
                  HARDWARE &amp; SENSOR SUBSYSTEMS
                </span>
              </div>
              <span className="text-emerald-400 font-semibold text-[11px] bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-600/40">
                {diagnosticModules.length} MODULES MONITORED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {diagnosticModules.map((mod) => (
                <div
                  key={mod.name}
                  className="bg-surface-container/30 p-2 rounded border border-outline-variant/20 flex flex-col justify-between gap-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-on-surface text-[11.5px] truncate">{mod.name}</span>
                    <span className={`font-bold text-[10.5px] shrink-0 ${mod.statusClass}`}>
                      {mod.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-outline truncate font-sans">{mod.sub}</span>
                  <span className="text-[10px] text-on-surface-variant truncate border-t border-outline-variant/15 pt-1 mt-0.5">
                    {mod.note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PA SPEAKER DOWNLINK CONTROL (5 COLS) */}
          <div className="lg:col-span-5 bg-[#060e20] p-3 rounded-lg border border-outline-variant/30 flex flex-col justify-between gap-2.5 font-mono">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
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
            <div className="flex flex-col gap-1.5">
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
                className="w-full px-2.5 py-1.5 rounded bg-[#0b1326] border border-outline-variant/40 text-on-surface placeholder:text-outline text-[11.5px] font-sans focus:outline-none focus:border-primary"
              />
            </div>

            {/* Send Button & Status */}
            <div className="flex flex-col gap-1 mt-auto">
              <button
                type="button"
                onClick={handleSendSpeaker}
                disabled={speakerTransmitting}
                className={`w-full py-2 px-3 rounded font-mono font-semibold text-[11.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
              CYTRON MDD20A
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-[12px]">
            <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">MOTOR STATUS</span>
              <span
                className={`font-bold text-[13px] mt-0.5 block ${
                  currentMovement === 'STOPPED' ? 'text-outline' : 'text-emerald-400'
                }`}
              >
                {currentMovement === 'STOPPED' ? 'STOPPED' : 'ACTIVE (PWM)'}
              </span>
            </div>

            <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">CURRENT MOVEMENT</span>
              <span className="text-on-surface font-bold text-[13px] mt-0.5 block">{currentMovement}</span>
            </div>

            <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
              <span className="text-outline text-[10.5px] uppercase block">SPEED LEVEL / PWM</span>
              <span className="text-primary font-bold text-[13px] mt-0.5 block truncate">
                {currentSpeedLevel} &bull; {initialDriveStatus.speedPwm[currentSpeedLevel] || 'Standby'}
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
