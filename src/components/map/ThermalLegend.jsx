import { thermalScale, simulatedThermalTelemetry } from '../../data/thermalMapData';

export default function ThermalLegend({ summary = simulatedThermalTelemetry.summary, isSimulated = true }) {
  return (
    <div
      className="absolute top-3 right-3 bg-[#060e20]/92 backdrop-blur-md px-3 py-2.5 rounded-lg border border-outline-variant/50 shadow-2xl font-mono text-[11px] select-none pointer-events-auto z-30 flex flex-col gap-2 w-[275px] animate-fadeIn transition-all"
      role="region"
      aria-label="Thermal Map Legend"
    >
      {/* Legend Header */}
      <div className="flex items-center justify-between gap-2 border-b border-outline-variant/30 pb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="material-symbols-outlined text-[15px] text-amber-400 shrink-0">device_thermostat</span>
          <span className="font-bold uppercase tracking-wider text-on-surface text-[10.5px] sm:text-[11px] whitespace-nowrap">
            THERMAL / HEAT RISK
          </span>
        </div>
        <span
          className="text-[9.5px] px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30 font-semibold tracking-wide shrink-0"
          title="Telemetry is currently running in simulated demo mode until physical AMG8833 I2C sensor is bound."
        >
          {isSimulated ? 'SIMULATED' : 'LIVE'}
        </span>
      </div>

      {/* Horizontal Continuous Gradient Bar */}
      <div className="space-y-1">
        <div className="h-2 w-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-amber-400 to-red-500 shadow-inner" />
        <div className="flex justify-between text-[9.5px] text-outline px-0.5 font-mono">
          <span>&lt; 25°C</span>
          <span>25°C</span>
          <span>30°C</span>
          <span>&gt; 35°C</span>
        </div>
      </div>

      {/* 4 Thermal Intensity Zones */}
      <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-0.5">
        {thermalScale.map((item) => (
          <div
            key={item.level}
            className="flex items-center gap-1.5 bg-surface-container/50 px-1.5 py-1 rounded border border-outline-variant/20"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-bold text-on-surface truncate">{item.label}</span>
              <span className="text-outline text-[9px]">{item.range}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live / Demo Peak Reading Tag */}
      <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-[10px] text-outline">
        <span>HOTSPOT:</span>
        <span className="text-red-400 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          {summary.hotspotTemp}°C (STA 14A)
        </span>
      </div>
    </div>
  );
}
