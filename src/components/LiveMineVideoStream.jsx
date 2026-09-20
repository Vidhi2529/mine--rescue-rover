import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import roverLiveVideo from '../assets/rover_live_camera.mp4';
import roverFrontCameraImg from '../assets/rover_front_camera.jpg';

export default function LiveMineVideoStream({ telemetry, onOpenTeleop }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [testPatternActive, setTestPatternActive] = useState(false);
  const [irFilter, setIrFilter] = useState(true);

  // Continuously updating surveillance timestamp (local time HH:mm:ss)
  const getFormattedLocalTime = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const h = pad(now.getHours());
    const min = pad(now.getMinutes());
    const s = pad(now.getSeconds());
    return `${h}:${min}:${s}`;
  };

  const [currentTime, setCurrentTime] = useState(getFormattedLocalTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getFormattedLocalTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ensure seamless autoplay on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: muted video autoplay is typically allowed
      });
    }
  }, []);

  return (
    <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-xl p-3.5 shadow-lg flex flex-col shrink-0 font-sans">
      {/* Stream Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-2 border-b border-outline-variant/25 gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
            videocam
          </span>
          <div className="flex flex-col">
            <h2 className="font-bold text-[13.5px] md:text-[14.5px] tracking-wider uppercase text-on-surface leading-tight flex items-center gap-2">
              <span>LIVE ROVER CAMERA</span>
              <span className="font-mono text-[11px] font-normal text-outline">
                &bull; CAMERA 01
              </span>
            </h2>
            <span className="font-mono text-[11px] text-outline truncate">
              ZONE 4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-[11.5px]">
          {/* Subtle LIVE indicator */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_6px_rgba(244,63,94,0.7)]"></span>
            LIVE
          </span>

          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-outline">
            1080P IR &bull; 60 FPS
          </span>

          {/* Small Manual Teleoperation Button in header */}
          <button
            type="button"
            onClick={() => (onOpenTeleop ? onOpenTeleop() : navigate('/rover-control'))}
            title="Emergency Manual Teleoperation — Take direct control of Rover R-01"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/50 hover:border-rose-400 text-rose-300 hover:text-white font-mono text-[11px] font-semibold shadow-sm transition-all active:scale-95 cursor-pointer ml-1"
          >
            <span className="material-symbols-outlined text-[15px] text-rose-400">
              sports_esports
            </span>
            <span className="hidden sm:inline">MANUAL TELEOP</span>
            <span className="sm:hidden">MANUAL</span>
          </button>
        </div>
      </div>

      {/* Stream Display Canvas: Realistic Rover First-Person CCTV Feed */}
      <div className="relative w-full aspect-video max-h-[380px] rounded-lg overflow-hidden border border-outline-variant/40 mt-2 bg-[#030712] shadow-2xl ring-1 ring-primary/20 mx-auto select-none flex items-center justify-center group">
        {/* Realistic First-Person Underground Coal-Mine Rover CCTV Video Feed */}
        <video
          ref={videoRef}
          src={roverLiveVideo || '/rover_live_camera.mp4'}
          poster={roverFrontCameraImg || '/rover_front_camera.jpg'}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`w-full h-full object-cover transition-all duration-300 ${
            irFilter
              ? 'brightness-[1.02] contrast-[1.06] saturate-[0.92]'
              : 'grayscale contrast-[1.12] brightness-[0.98]'
          }`}
        />

        {/* Subtle CRT Scanlines Texture */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02))',
            backgroundSize: '100% 3px, 6px 100%',
          }}
        />

        {/* Subtle Surveillance Camera Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 65%, rgba(0, 0, 0, 0.5) 100%)',
          }}
        />

        {/* Animated Horizontal Scanline Overlay */}
        <div className="cctv-scanline-beam z-10" />

        {/* Test Pattern Overlay (if enabled) */}
        {testPatternActive && (
          <div className="absolute inset-0 z-15 pointer-events-none bg-sky-950/20 flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                backgroundSize: '40px 40px, 40px 40px, 40px 40px',
              }}
            />
            <span className="font-mono text-sky-400/80 bg-black/60 px-3 py-1 rounded border border-sky-400/30 text-[12px]">
              CALIBRATION GRID &bull; 1080P IR
            </span>
          </div>
        )}

        {/* Upper Left HUD Overlay: CCTV Live, Rec & Camera ID */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-2 bg-[#060e20]/85 backdrop-blur px-2.5 py-1 rounded border border-outline-variant/40 font-mono text-[11px] pointer-events-none shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse shadow-[0_0_8px_rgba(225,29,72,0.8)]"></span>
          <span className="text-rose-400 font-bold tracking-wider">LIVE</span>
          <span className="text-outline/60">|</span>
          <div className="flex items-center gap-1 text-rose-300/90">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-semibold text-[10px] tracking-wider">REC</span>
          </div>
          <span className="text-outline/60">|</span>
          <span className="text-on-surface font-semibold">CAM-01</span>
          <span className="text-outline/60">&bull;</span>
          <span className="text-primary font-medium">ZONE 4</span>
        </div>

        {/* Upper Right HUD Overlay: Surveillance Timestamp & Small Manual Teleoperation Quick Button */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-2 font-mono text-[11px]">
          <div className="bg-[#060e20]/85 backdrop-blur px-2.5 py-1 rounded border border-outline-variant/40 text-emerald-300 font-semibold shadow-md pointer-events-none tracking-wider drop-shadow-sm">
            {currentTime}
          </div>
          {/* Small Corner Teleoperation Icon Button */}
          <button
            type="button"
            onClick={() => (onOpenTeleop ? onOpenTeleop() : navigate('/rover-control'))}
            title="Emergency Situation: Operator can manually take control of the rover"
            className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 hover:text-white backdrop-blur px-2.5 py-1 rounded border border-rose-500/50 hover:border-rose-400 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-rose-400">
              sports_esports
            </span>
            <span className="hidden md:inline font-bold">MANUAL CONTROL</span>
          </button>
        </div>

        {/* Lower Left HUD Overlay: Live Atmospheric Snapshot */}
        <div className="absolute bottom-2.5 left-2.5 z-20 flex flex-wrap items-center gap-1.5 font-mono text-[11px] pointer-events-none">
          <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-amber-300 font-semibold shadow">
            CH4: {telemetry?.ch4 ? `${telemetry.ch4.value}%` : '1.15% [WARN]'}
          </span>
          <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-emerald-300 shadow">
            CO: {telemetry?.co ? `${telemetry.co.value} PPM` : '14 PPM'}
          </span>
          <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-sky-300 shadow">
            TEMP: {telemetry?.temperature ? `${telemetry.temperature.value}°C` : '26.8°C'}
          </span>
        </div>

        {/* Lower Right HUD Overlay: Rover Battery & Mode */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 font-mono text-[11px] pointer-events-none">
          <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-secondary font-semibold shadow">
            ROVER BATT: {telemetry?.battery ? `${telemetry.battery.level}%` : '88%'}
          </span>
          <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 font-semibold shadow">
            LoRa: LINK OK
          </span>
        </div>
      </div>

      {/* Stream Controls Footer */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/20 font-mono text-[11.5px]">
        <div className="flex items-center gap-2 text-outline">
          <span className="material-symbols-outlined text-[16px] text-primary">sensors</span>
          <span>FORWARD ROVER MOUNTED IR CAMERA &bull; DUAL 1200LM HEADLIGHTS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIrFilter(!irFilter)}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
              irFilter
                ? 'bg-primary/20 border-primary/40 text-primary'
                : 'bg-surface-container border-outline-variant/30 text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">night_sight</span>
            <span>IR ENHANCE</span>
          </button>
          <button
            type="button"
            onClick={() => setTestPatternActive(!testPatternActive)}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
              testPatternActive
                ? 'bg-sky-950/40 border-sky-500/40 text-sky-300'
                : 'bg-surface-container border-outline-variant/30 text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">grid_4x4</span>
            <span>GRID OVERLAY</span>
          </button>
        </div>
      </div>
    </section>
  );
}
