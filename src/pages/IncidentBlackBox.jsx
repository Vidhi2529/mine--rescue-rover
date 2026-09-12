import { useState, useMemo } from 'react';
import {
  incidentSummaryStats,
  incidentEvents,
} from '../data/incidentData';

export default function IncidentBlackBox() {
  // Selected event id for inspector and snapshot
  const [selectedEventId, setSelectedEventId] = useState('evt-02'); // Default to Critical fail-safe event

  // Filter category
  const [activeFilter, setActiveFilter] = useState('All');

  // Sort order: 'latest' | 'oldest'
  const [sortOrder, setSortOrder] = useState('latest');

  // Export notification toast
  const [exportNotice, setExportNotice] = useState(null);

  // Filtered and sorted events
  const filteredEvents = useMemo(() => {
    let list = [...incidentEvents];

    if (activeFilter === 'Critical') {
      list = list.filter((e) => e.severity === 'CRITICAL');
    } else if (activeFilter === 'Warning') {
      list = list.filter((e) => e.severity === 'WARNING' || e.severity === 'CAUTION');
    } else if (activeFilter === 'Sensor') {
      list = list.filter((e) => e.category === 'SENSOR');
    } else if (activeFilter === 'Thermal') {
      list = list.filter((e) => e.category === 'THERMAL');
    } else if (activeFilter === 'Operator') {
      list = list.filter((e) => e.category === 'OPERATOR');
    } else if (activeFilter === 'Communication') {
      list = list.filter((e) => e.category === 'COMMUNICATION');
    }

    if (sortOrder === 'oldest') {
      list.reverse();
    }

    return list;
  }, [activeFilter, sortOrder]);

  const selectedEvent =
    incidentEvents.find((e) => e.id === selectedEventId) || incidentEvents[0];

  // Export handler (client-side demo log download)
  const handleExportLog = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(incidentEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'session_04_blackbox_log.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice('Incident Log Exported: session_04_blackbox_log.json (34 Events)');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <>
      {/* 2. CENTER COLUMN: INCIDENT BLACK BOX TIMELINE & LOGS */}
      <main className="flex-1 min-w-0 bg-[#0b1326] p-3.5 flex flex-col gap-3 overflow-y-auto industrial-scrollbar">
        {/* PAGE BANNER HEADER */}
        <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/25 pb-3 gap-2 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[24px]">history</span>
              <h1 className="font-bold text-[17px] md:text-[18px] tracking-wider uppercase text-on-surface">
                INCIDENT BLACK BOX
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-mono text-[12px] font-semibold">
                EVENT RECORDER
              </span>
            </div>
            <p className="text-on-surface-variant text-[12.5px] mt-1">
              Chronological record of rover telemetry, hazards and operator actions &bull; Non-volatile session storage
            </p>
          </div>

          {/* Right Status Badges */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-[12px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-950/40 border border-rose-500/50 text-rose-300 font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              RECORDING ACTIVE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              LoRa LINK ACTIVE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold shadow-sm">
              MISSION LOG &bull; SESSION 04
            </span>
          </div>
        </div>

        {/* EXPORT TOAST BANNER */}
        {exportNotice && (
          <div className="px-3.5 py-2 rounded-lg border bg-emerald-950/60 border-emerald-500 text-emerald-200 flex items-center justify-between text-[12.5px] font-mono transition-all animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download_done</span>
              <span>{exportNotice}</span>
            </div>
            <span className="text-[11px] opacity-75 uppercase">JSON PAYLOAD DISPATCHED</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. INCIDENT SUMMARY (4 COMPACT CARDS) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full shrink-0">
          {[
            { stat: incidentSummaryStats.totalEvents, sub: 'Flash Ring Buffer • ESP32', color: 'text-sky-400' },
            { stat: incidentSummaryStats.criticalAlerts, sub: 'Failsafe Deadman • Sonar Halt', color: 'text-rose-400' },
            { stat: incidentSummaryStats.operatorActions, sub: 'Joystick Teleop • Audio Dispatch', color: 'text-emerald-400' },
            { stat: incidentSummaryStats.commEvents, sub: 'SX1278 433MHz • Heartbeat', color: 'text-amber-400' },
          ].map(({ stat, sub, color }) => (
            <div key={stat.label} className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3 shadow-sm flex flex-col justify-between min-h-[108px]">
              <div className="flex items-start justify-between gap-1">
                <div>
                  <span className="font-mono text-[12.5px] font-bold text-on-surface uppercase block">
                    {stat.label}
                  </span>
                  <span className="font-mono text-[11px] text-outline block mt-0.5">
                    {sub}
                  </span>
                </div>
                <span className={`font-mono text-[11px] px-2 py-0.5 rounded border font-semibold ${stat.badgeColor}`}>
                  {stat.badge}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className={`font-mono text-[24px] font-bold ${color} leading-none`}>
                  {stat.count}
                </span>
                <span className="text-[12px] text-on-surface-variant text-right">
                  {stat.detail}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* ========================================================================= */}
        {/* 3. SENSOR SNAPSHOT AT TIME OF EVENT */}
        {/* ========================================================================= */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/20 pb-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">sensors</span>
              <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                SENSOR SNAPSHOT &bull; STATE AT {selectedEvent.time} UTC
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11.5px]">
              <span className="text-outline uppercase">FROZEN TELEMETRY FRAME:</span>
              <span className="px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/40 font-semibold">
                {selectedEvent.seq} &bull; {selectedEvent.event}
              </span>
            </div>
          </div>

          {/* 10 Realistic Prototype Sensors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono">
            {[
              { label: 'CH4 (MQ-4)', val: selectedEvent.snapshot.ch4, color: 'text-amber-400', sub: 'Warn >1.00%' },
              { label: 'CO (MQ-7)', val: selectedEvent.snapshot.co, color: 'text-on-surface', sub: 'Safe <25 PPM' },
              { label: 'H2S (MQ-136)', val: selectedEvent.snapshot.h2s, color: 'text-on-surface', sub: 'Safe <5.0 PPM' },
              {
                label: 'O2 SENSOR',
                val: selectedEvent.snapshot.o2,
                color: parseFloat(selectedEvent.snapshot.o2) < 20.0 ? 'text-amber-400' : 'text-emerald-400',
                sub: 'Min 19.5%',
              },
              { label: 'SMOKE (MQ-2)', val: selectedEvent.snapshot.smoke, color: 'text-on-surface', sub: 'Baseline 30-50' },
              { label: 'TEMP (DHT22)', val: selectedEvent.snapshot.temp, color: 'text-on-surface', sub: 'Ambient Drift' },
              { label: 'RH (DHT22)', val: selectedEvent.snapshot.humidity, color: 'text-on-surface', sub: 'Ambient Moisture' },
              {
                label: 'THERMAL MAX',
                val: selectedEvent.snapshot.thermalMax,
                color: parseFloat(selectedEvent.snapshot.thermalMax) >= 34.0 ? 'text-orange-400 font-extrabold' : 'text-on-surface',
                sub: 'AMG8833 8x8 IR',
              },
              {
                label: 'SONAR DISTANCE',
                val: selectedEvent.snapshot.obstacleDistance,
                color: parseFloat(selectedEvent.snapshot.obstacleDistance) < 0.5 ? 'text-rose-400 font-extrabold' : 'text-sky-400',
                sub: 'HC-SR04 Ranging',
              },
              {
                label: 'LoRa RSSI',
                val: selectedEvent.snapshot.loraRssi,
                color: selectedEvent.snapshot.loraRssi.includes('DROP') ? 'text-rose-400' : selectedEvent.snapshot.loraRssi.includes('-108') ? 'text-amber-400' : 'text-emerald-400',
                sub: 'SX1278 433MHz',
              },
            ].map((s) => (
              <div key={s.label} className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex flex-col justify-between">
                <span className="text-[11px] text-outline uppercase font-semibold">{s.label}</span>
                <span className={`text-[17px] font-bold mt-1 ${s.color}`}>
                  {s.val}
                </span>
                <span className="text-[10.5px] text-outline">{s.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. EVENT TIMELINE (PRIMARY SECTION) */}
        {/* ========================================================================= */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
          {/* Controls Bar: Filters + Sort + Export */}
          <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/20 pb-2.5 gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[12px]">
              <span className="text-outline uppercase text-[11.5px] font-semibold mr-1">
                FILTER:
              </span>
              {['All', 'Critical', 'Warning', 'Sensor', 'Thermal', 'Operator', 'Communication'].map(
                (filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2.5 py-1 rounded transition-colors text-[11.5px] ${
                      activeFilter === filter
                        ? 'bg-primary/20 text-primary border border-primary/40 font-semibold shadow-sm'
                        : 'bg-[#060e20] text-outline hover:text-on-surface border border-outline-variant/30'
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-2.5 font-mono text-[12px]">
              {/* Sort Order Toggle */}
              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
                className="px-2.5 py-1 rounded bg-[#060e20] border border-outline-variant/30 text-outline hover:text-on-surface flex items-center gap-1.5 transition-colors text-[11.5px]"
              >
                <span className="material-symbols-outlined text-[15px]">swap_vert</span>
                <span>{sortOrder === 'latest' ? 'Latest First' : 'Oldest First'}</span>
              </button>

              {/* 7. EVENT EXPORT BUTTON */}
              <button
                type="button"
                onClick={handleExportLog}
                className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-on-surface flex items-center gap-1.5 transition-colors text-[11.5px] font-semibold"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                <span>Export Incident Log</span>
              </button>
            </div>
          </div>

          {/* Vertical Chronological Timeline */}
          <div className="relative pl-6 pr-2 py-1 flex flex-col gap-3">
            {/* Timeline Vertical Axis Line */}
            <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-outline-variant/30"></div>

            {filteredEvents.map((evt) => {
              const isSelected = evt.id === selectedEventId;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`relative flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-sky-950/40 border-primary ring-1 ring-primary/40 shadow-md'
                      : 'bg-[#060e20]/90 hover:bg-surface-container/60 border-outline-variant/25'
                  }`}
                >
                  {/* Timeline Node Bullet */}
                  <div
                    className={`absolute -left-[19px] top-4 w-3 h-3 rounded-full border-2 border-[#0b1326] ${evt.dotColor} shadow-sm`}
                  ></div>

                  {/* Left: Timestamp & Sequence */}
                  <div className="flex flex-col shrink-0 font-mono text-[12px] min-w-[70px]">
                    <span className="font-bold text-on-surface">{evt.time}</span>
                    <span className="text-outline text-[11px]">{evt.seq}</span>
                  </div>

                  {/* Center: Event Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-outline uppercase font-semibold">
                        {evt.category}
                      </span>
                      <h3 className="font-bold text-[13.5px] text-on-surface truncate">
                        {evt.event}
                      </h3>
                      <span className={`font-mono text-[10.5px] px-2 py-0.5 rounded border font-semibold ml-auto ${evt.severityClass}`}>
                        {evt.severity}
                      </span>
                    </div>

                    <p className="text-[12px] text-on-surface-variant font-sans leading-snug">
                      {evt.details}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-outline mt-1 pt-1 border-t border-outline-variant/15">
                      <span>Source: <strong className="text-on-surface font-medium">{evt.source}</strong></span>
                      <span>&bull;</span>
                      <span>Reading: <strong className="text-primary font-medium">{evt.reading}</strong></span>
                      <span>&bull;</span>
                      <span>Action: <strong className="text-on-surface font-medium">{evt.action}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. INCIDENT LOG TABLE */}
        {/* ========================================================================= */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">table_rows</span>
              <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                INCIDENT EVENT LOG &bull; STRUCTURED SESSION ARCHIVE
              </h2>
            </div>
            <span className="font-mono text-[11px] text-outline uppercase">
              CLICK ROW TO INSPECT SNAPSHOT
            </span>
          </div>

          <div className="overflow-x-auto industrial-scrollbar">
            <table className="w-full text-left font-mono text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 text-outline text-[11.5px] uppercase">
                  <th className="py-2 px-3 font-semibold">Time</th>
                  <th className="py-2 px-3 font-semibold">Category</th>
                  <th className="py-2 px-3 font-semibold">Event</th>
                  <th className="py-2 px-3 font-semibold">Source</th>
                  <th className="py-2 px-3 font-semibold">Reading</th>
                  <th className="py-2 px-3 font-semibold">Severity</th>
                  <th className="py-2 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredEvents.map((row) => {
                  const isSelected = row.id === selectedEventId;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedEventId(row.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-950/40 text-on-surface font-medium'
                          : 'hover:bg-surface-container/60 text-on-surface-variant'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-on-surface font-bold whitespace-nowrap">
                        {row.time}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline text-[11px]">
                          {row.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-on-surface font-medium max-w-[220px] truncate">
                        {row.event}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap text-outline">
                        {row.source}
                      </td>
                      <td className="py-2.5 px-3 text-primary font-semibold whitespace-nowrap">
                        {row.reading}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${row.severityClass}`}>
                          {row.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-on-surface whitespace-nowrap">
                        {row.action}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 4. EVENT DETAILS / INSPECTOR (RIGHT COLUMN: Width 360px) */}
      {/* ========================================================================= */}
      <aside className="w-[360px] shrink-0 bg-[#060e20] border-l border-outline-variant/30 flex flex-col h-full overflow-y-auto industrial-scrollbar z-20 select-none">
        {/* Column Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-outline-variant/30 bg-[#060e20] shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">search_insights</span>
            <div className="flex flex-col">
              <h3 className="font-bold text-[14px] tracking-wider uppercase text-on-surface leading-none">
                EVENT INSPECTOR
              </h3>
              <span className="font-mono text-[11px] text-outline uppercase mt-0.5">
                TELEMETRY BLACK BOX DETAIL
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] text-primary bg-primary/20 px-2 py-0.5 rounded border border-primary/30 font-semibold">
            {selectedEvent.seq}
          </span>
        </div>

        <div className="p-3.5 flex flex-col gap-4">
          {/* Main Inspection Card */}
          <section className="bg-surface-container-low/90 p-3.5 rounded-lg border border-outline-variant/30 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2 border-b border-outline-variant/20 pb-2.5">
              <div>
                <span className="font-mono text-[11px] text-outline uppercase block">
                  CATEGORY: {selectedEvent.category}
                </span>
                <h4 className="font-mono font-bold text-[15px] text-on-surface mt-0.5">
                  {selectedEvent.event}
                </h4>
              </div>
              <span className={`font-mono text-[11px] px-2 py-0.5 rounded border font-semibold shrink-0 ${selectedEvent.severityClass}`}>
                {selectedEvent.severity}
              </span>
            </div>

            {/* Event Description */}
            <p className="text-[12.5px] text-on-surface-variant leading-relaxed">
              {selectedEvent.details}
            </p>

            {/* Detailed Key-Value Attributes */}
            <div className="flex flex-col gap-2 font-mono text-[12px] border-t border-outline-variant/20 pt-2.5">
              <div className="flex items-center justify-between">
                <span className="text-outline text-[11.5px]">TIMESTAMP:</span>
                <span className="text-on-surface font-semibold">{selectedEvent.time} UTC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline text-[11.5px]">SOURCE PAYLOAD:</span>
                <span className="text-on-surface font-medium">{selectedEvent.source}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline text-[11.5px]">HARDWARE MODULE:</span>
                <span className="text-on-surface font-medium">{selectedEvent.module}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline text-[11.5px]">MEASURED VALUE:</span>
                <span className="text-primary font-bold">{selectedEvent.reading}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline text-[11.5px]">ROVER STATE:</span>
                <span className="text-on-surface font-semibold">{selectedEvent.roverState}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-outline text-[11.5px]">COMMUNICATION:</span>
                <span className="text-on-surface font-medium">{selectedEvent.commStatus}</span>
              </div>
              <div className="flex flex-col gap-1 pt-1 border-t border-outline-variant/15">
                <span className="text-outline text-[11.5px]">OPERATOR RESPONSE:</span>
                <span className="text-on-surface font-sans text-[12px] leading-snug">
                  {selectedEvent.operatorResponse}
                </span>
              </div>
            </div>
          </section>

          {/* FAIL-SAFE REALISM CALLOUT */}
          {selectedEvent.category === 'COMMUNICATION' && selectedEvent.severity === 'CRITICAL' && (
            <section className="bg-rose-950/40 p-3 rounded-lg border border-rose-500/50 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-rose-300 font-mono text-[12px] font-bold">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                <span>FIRMWARE DEADMAN FAIL-SAFE TRIGGERED</span>
              </div>
              <p className="text-[12px] text-rose-200 font-sans leading-snug">
                SX1278 LoRa carrier loss exceeded 1,500ms heartbeat interval. ESP32 firmware deadman safety cut TB6612FNG H-bridge motor PWM outputs to 0%, executing immediate fail-safe chassis halt.
              </p>
            </section>
          )}

          {/* SESSION METADATA & INTEGRITY */}
          <section className="bg-surface-container-low/90 p-3 rounded-lg border border-outline-variant/30 flex flex-col gap-2 font-mono text-[11.5px]">
            <span className="text-outline uppercase text-[11px] font-semibold">
              SESSION LOG RECORD SPECIFICATIONS
            </span>
            <div className="flex items-center justify-between">
              <span className="text-outline">CONTROLLER:</span>
              <span className="text-on-surface">ESP32-WROOM-32D</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-outline">STORAGE BUFFER:</span>
              <span className="text-on-surface">Internal Flash SPIFFS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-outline">RF LINK PROTOCOL:</span>
              <span className="text-on-surface">SX1278 433.0 MHz (LoRa)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-outline">FAIL-SAFE TIMEOUT:</span>
              <span className="text-rose-400 font-semibold">1,500 ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-outline">CHASSIS LOCOMOTION:</span>
              <span className="text-emerald-400 font-semibold">Manual Teleoperation</span>
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
