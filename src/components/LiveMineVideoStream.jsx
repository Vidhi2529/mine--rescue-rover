import { useState, useEffect } from 'react';

export default function LiveMineVideoStream({ telemetry }) {
  const [activeCam, setActiveCam] = useState('CAM-01');
  const [testPatternActive, setTestPatternActive] = useState(true);
  const [irFilter, setIrFilter] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toISOString().substring(11, 19) + ' UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString().substring(11, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-xl p-3.5 shadow-lg flex flex-col shrink-0 font-sans">
      {/* Stream Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-2 border-b border-outline-variant/25 gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0">videocam</span>
          <div className="flex flex-col">
            <h2 className="font-bold text-[13.5px] md:text-[14.5px] tracking-wider uppercase text-on-surface leading-tight">
              LIVE MINE VIDEO STREAM
            </h2>
            <span className="font-mono text-[11px] text-outline">
              SECTOR 4 UNDERGROUND RECONNAISSANCE
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-surface-container-lowest p-0.5 rounded border border-outline-variant/30 text-[11px] font-mono ml-2">
            {['CAM-01', 'CAM-02', 'CAM-03'].map((cam) => (
              <button
                key={cam}
                type="button"
                onClick={() => setActiveCam(cam)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  activeCam === cam
                    ? 'bg-primary/20 text-primary font-bold border border-primary/40'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {cam}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-[11.5px]">
          {/* OFFLINE / DEMO FEED BADGE */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            STREAM OFFLINE / DEMO FEED
          </span>
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-outline">
            1080P IR &bull; 60 FPS
          </span>
        </div>
      </div>

      {/* Stream Display Canvas / CRT Monitor Simulation */}
      <div className="relative w-full aspect-video max-h-[420px] rounded-lg overflow-hidden border border-outline-variant/40 mt-2.5 bg-[#030712] shadow-2xl ring-1 ring-primary/20 mx-auto select-none flex items-center justify-center">
        {/* Subtle CRT Scanlines & Screen Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
            backgroundSize: '100% 3px, 6px 100%',
          }}
        />

        {/* Ambient Dark Grid / Night-Vision Grid Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
            backgroundSize: '40px 40px, 40px 40px, 40px 40px',
          }}
        />

        {/* Center Standby Screen Graphic */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center p-4 max-w-md">
          {/* Radar Sweep Reticle */}
          <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-sky-500/30 animate-ping opacity-25"></div>
            <div className="absolute inset-2 rounded-full border border-primary/40"></div>
            <div className="absolute inset-5 rounded-full border border-dashed border-sky-400/50"></div>
            <span className="material-symbols-outlined text-[34px] text-sky-400">
              videocam_off
            </span>
          </div>

          <h3 className="font-mono font-bold text-[14.5px] text-on-surface uppercase tracking-wider">
            LIVE CAMERA &bull; STREAM OFFLINE / DEMO FEED
          </h3>
          <p className="text-[12px] text-on-surface-variant font-sans mt-1.5 leading-relaxed">
            Direct RTSP / WebRTC video uplink is awaiting physical camera stream handshake.
            Telemetry overlay is active and bound to ESP32 sensor mesh.
          </p>

          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded bg-[#060e20] border border-outline-variant/40 text-outline">
              RTSP: <strong className="text-primary">rtsp://mine-rover:8554/live</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#060e20] border border-outline-variant/40 text-outline">
              STATUS: <strong className="text-amber-400">STANDBY</strong>
            </span>
          </div>
        </div>

        {/* Upper Left HUD Overlay */}
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-2 bg-[#060e20]/90 backdrop-blur px-2.5 py-1 rounded border border-outline-variant/40 font-mono text-[11px] pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-on-surface font-semibold">{activeCam} &bull; DRIFT C</span>
          <span className="text-outline">|</span>
          <span className="text-primary font-mono">STATION 14A</span>
        </div>

        {/* Upper Right HUD Overlay */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-2 bg-[#060e20]/90 backdrop-blur px-2.5 py-1 rounded border border-outline-variant/40 font-mono text-[11px] text-outline pointer-events-none">
          <span className="text-sky-400 font-semibold">{currentTime}</span>
          <span className="text-outline-variant">|</span>
          <span>DEMO CANVAS</span>
        </div>

        {/* Lower Left HUD Overlay: Live Atmospheric Snapshot */}
        <div className="absolute bottom-2.5 left-2.5 z-20 flex flex-wrap items-center gap-1.5 font-mono text-[11px] pointer-events-none">
          <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-amber-300 font-semibold">
            CH4: {telemetry?.ch4 ? `${telemetry.ch4.value}%` : '1.15% [WARN]'}
          </span>
          <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-emerald-300">
            CO: {telemetry?.co ? `${telemetry.co.value} PPM` : '14 PPM'}
          </span>
          <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-sky-300">
            TEMP: {telemetry?.temperature ? `${telemetry.temperature.value}°C` : '26.8°C'}
          </span>
        </div>

        {/* Lower Right HUD Overlay: Rover Battery & Mode */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5 font-mono text-[11px] pointer-events-none">
          <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-outline-variant/40 text-secondary font-semibold">
            ROVER BATT: {telemetry?.battery ? `${telemetry.battery.level}%` : '88%'}
          </span>
          <span className="bg-[#060e20]/90 backdrop-blur px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 font-semibold">
            LoRa: LINK OK
          </span>
        </div>
      </div>

      {/* Stream Controls Footer */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/20 font-mono text-[11.5px]">
        <div className="flex items-center gap-2 text-outline">
          <span className="material-symbols-outlined text-[16px] text-primary">sensors</span>
          <span>PROTOCOL: WebRTC / RTSP Low-Latency Stream</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIrFilter(!irFilter)}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
              irFilter
                ? 'bg-primary/20 border-primary/40 text-primary'
                : 'bg-surface-container border-outline-variant/30 text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">night_sight</span>
            <span>IR NIGHT-VISION</span>
          </button>
          <button
            type="button"
            onClick={() => setTestPatternActive(!testPatternActive)}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
              testPatternActive
                ? 'bg-sky-950/40 border-sky-500/40 text-sky-300'
                : 'bg-surface-container border-outline-variant/30 text-outline'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>TEST PATTERN</span>
          </button>
        </div>
      </div>
    </section>
  );
}
