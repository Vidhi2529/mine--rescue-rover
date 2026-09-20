import { useState } from 'react';

export default function Settings() {
  // System settings state
  const [refreshRate, setRefreshRate] = useState('1s');
  const [units, setUnits] = useState('Metric');

  // LoRa communication settings
  const [loraChannel, setLoraChannel] = useState('433.0 MHz (Ch 01)');
  const [deviceId, setDeviceId] = useState('ROVER-R01');
  const [commTimeout, setCommTimeout] = useState('1500');

  // Alert settings toggles
  const [alerts, setAlerts] = useState({
    gas: true,
    smoke: true,
    thermal: true,
    lowO2: true,
    obstacle: true,
    commLoss: true,
  });

  // Display preferences toggles
  const [displayPrefs, setDisplayPrefs] = useState({
    showUnits: true,
    showTrends: true,
    showHazardMarkers: true,
    density: 'Compact', // 'Compact' | 'Comfortable'
  });

  // Data & logging settings
  const [exportFormat, setExportFormat] = useState('CSV');
  const [loggingEnabled, setLoggingEnabled] = useState(true);
  const [historyEnabled, setHistoryEnabled] = useState(true);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleAlert = (key) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast(`Alert preference updated: ${key.toUpperCase()}`);
  };

  const toggleDisplayPref = (key) => {
    setDisplayPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast(`Display preference updated: ${key}`);
  };

  // Demo actions
  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Settings saved to operator local storage.');
  };

  const handleClearLogs = () => {
    showToast('Demo incident buffer cleared from volatile cache.');
  };

  const handleExportLogs = () => {
    showToast(`Exporting current session log payload as ${exportFormat}...`);
  };

  const handleResetDefaults = () => {
    setRefreshRate('1s');
    setUnits('Metric');
    setLoraChannel('433.0 MHz (Ch 01)');
    setDeviceId('ROVER-R01');
    setCommTimeout('1500');
    setAlerts({
      gas: true,
      smoke: true,
      thermal: true,
      lowO2: true,
      obstacle: true,
      commLoss: true,
    });
    setDisplayPrefs({
      showUnits: true,
      showTrends: true,
      showHazardMarkers: true,
      density: 'Compact',
    });
    setExportFormat('CSV');
    showToast('Settings restored to factory mine-rescue defaults.');
  };

  // 10 Prototype sensors list
  const sensorModuleList = [
    { name: 'MQ-4 Gas Sensor', type: 'Methane (CH4)', status: 'ONLINE', bus: 'Analog Pin A0' },
    { name: 'MQ-7 Gas Sensor', type: 'Carbon Monoxide (CO)', status: 'ONLINE', bus: 'Analog Pin A1' },
    { name: 'MQ-135 Sensor', type: 'Air Quality / NH3', status: 'ONLINE', bus: 'Analog Pin A2' },
    { name: 'MQ-136 Gas Sensor', type: 'Hydrogen Sulfide (H2S)', status: 'ONLINE', bus: 'Analog Pin A3' },
    { name: 'O2 Sensor', type: 'Electrochemical O2', status: 'ONLINE', bus: 'Analog Pin A4' },
    { name: 'MQ-2 Gas Sensor', type: 'Smoke / Combustibles', status: 'ONLINE', bus: 'Analog Pin A5' },
    { name: 'DHT22 Sensor', type: 'Temperature & Humidity', status: 'ONLINE', bus: 'Digital Pin D4' },
    { name: 'AMG8833 Grid-EYE', type: '8x8 Thermal IR Array', status: 'ONLINE', bus: 'I2C (0x69)' },
    { name: 'Ultrasonic HC-SR04', type: 'Forward Obstacle Sonar', status: 'ONLINE', bus: 'Trig/Echo D12/D13' },
    { name: 'SX1278 LoRa', type: '433.0 MHz Transceiver', status: 'ONLINE', bus: 'SPI (NSS/SCK/MISO)' },
  ];

  return (
    <>
      {/* MAIN SETTINGS WORKSPACE */}
      <main className="flex-1 min-w-0 bg-[#0b1326] p-3.5 flex flex-col gap-3 overflow-y-auto industrial-scrollbar">
        {/* PAGE BANNER HEADER */}
        <div className="flex flex-wrap items-center justify-between border-b border-outline-variant/25 pb-3 gap-2 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[24px]">settings</span>
              <h1 className="font-bold text-[17px] md:text-[18px] tracking-wider uppercase text-on-surface">
                SETTINGS
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-mono text-[12px] font-semibold">
                SYSTEM CONFIG
              </span>
            </div>
            <p className="text-on-surface-variant text-[12.5px] mt-1">
              System, communication and monitoring preferences &bull; Operator control console parameters
            </p>
          </div>

          {/* Right Status Indicators */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-[12px]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              CONFIG ACTIVE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              LoRa LINK ACTIVE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-950/40 border border-rose-500/50 text-rose-300 font-semibold shadow-sm">
              FAIL-SAFE ARMED
            </span>
          </div>
        </div>

        {/* TOAST BANNER */}
        {toastMessage && (
          <div className="px-3.5 py-2 rounded-lg border bg-emerald-950/60 border-emerald-500 text-emerald-200 flex items-center justify-between text-[12.5px] font-mono transition-all animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{toastMessage}</span>
            </div>
            <span className="text-[11px] opacity-75 uppercase">SAVED</span>
          </div>
        )}

        {/* 2-COLUMN SETTINGS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* ======================================================================= */}
          {/* 1. SYSTEM SETTINGS */}
          {/* ======================================================================= */}
          <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                  SYSTEM SETTINGS
                </h2>
              </div>
              <span className="font-mono text-[11px] text-outline uppercase">CORE PREFERENCES</span>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-[12px]">
              {/* Control Mode (Locked to Manual) */}
              <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-on-surface font-semibold block">CONTROL MODE</span>
                  <span className="text-[11px] text-outline font-sans">
                    Autonomous control is disabled by design.
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold text-[12px]">
                  MANUAL TELEOP
                </span>
              </div>

              {/* Theme */}
              <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-on-surface font-semibold block">SYSTEM THEME</span>
                  <span className="text-[11px] text-outline font-sans">
                    High-contrast dark industrial control-room palette.
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold text-[12px]">
                  DARK INDUSTRIAL
                </span>
              </div>

              {/* Measurement Units */}
              <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-on-surface font-semibold block">MEASUREMENT UNITS</span>
                  <span className="text-[11px] text-outline font-sans">
                    Temperature (°C), Distance (m), Gas (PPM / %).
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded border border-outline-variant/30">
                  {['Metric', 'Imperial'].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        setUnits(u);
                        showToast(`Units set to ${u}`);
                      }}
                      className={`px-2.5 py-0.5 rounded text-[11.5px] font-semibold transition-colors ${
                        units === u
                          ? 'bg-primary/20 text-primary border border-primary/40'
                          : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Refresh */}
              <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-on-surface font-semibold block">DATA REFRESH INTERVAL</span>
                  <span className="text-[11px] text-outline font-sans">
                    LoRa telemetry polling rate.
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded border border-outline-variant/30">
                  {['500ms', '1s', '2s'].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => {
                        setRefreshRate(rate);
                        showToast(`Refresh interval set to ${rate}`);
                      }}
                      className={`px-2 py-0.5 rounded text-[11.5px] font-semibold transition-colors ${
                        refreshRate === rate
                          ? 'bg-primary/20 text-primary border border-primary/40'
                          : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      {rate}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 2. LORA COMMUNICATION */}
          {/* ======================================================================= */}
          <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">cell_tower</span>
                <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                  LORA COMMUNICATION
                </h2>
              </div>
              <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-600/40 font-semibold">
                SX1278 (433MHz)
              </span>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-[12px]">
              {/* Telemetry Status Summary */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
                  <span className="text-[10.5px] text-outline uppercase block">STATUS</span>
                  <span className="text-emerald-400 font-bold text-[13px] mt-0.5 block">CONNECTED</span>
                </div>
                <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
                  <span className="text-[10.5px] text-outline uppercase block">SIGNAL RSSI</span>
                  <span className="text-sky-400 font-bold text-[13px] mt-0.5 block">-94 dBm</span>
                </div>
                <div className="bg-[#060e20] p-2 rounded border border-outline-variant/30">
                  <span className="text-[10.5px] text-outline uppercase block">FAIL-SAFE</span>
                  <span className="text-rose-400 font-bold text-[13px] mt-0.5 block">ENABLED</span>
                </div>
              </div>

              {/* LoRa Channel */}
              <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-on-surface font-semibold block">LORA CHANNEL</span>
                  <span className="text-[11px] text-outline font-sans">Sub-GHz mine penetration frequency.</span>
                </div>
                <select
                  value={loraChannel}
                  onChange={(e) => {
                    setLoraChannel(e.target.value);
                    showToast(`Channel changed to ${e.target.value}`);
                  }}
                  className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant/40 text-on-surface text-[12px] font-mono focus:outline-none"
                >
                  <option value="433.0 MHz (Ch 01)">433.0 MHz (Ch 01)</option>
                  <option value="433.5 MHz (Ch 02)">433.5 MHz (Ch 02)</option>
                  <option value="434.0 MHz (Ch 03)">434.0 MHz (Ch 03)</option>
                </select>
              </div>

              {/* Device ID */}
              <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-on-surface font-semibold block">DEVICE CALLSIGN / ID</span>
                  <span className="text-[11px] text-outline font-sans">Assigned chassis identity.</span>
                </div>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="w-28 px-2 py-1 rounded bg-surface-container border border-outline-variant/40 text-on-surface font-mono text-[12px] text-right focus:outline-none"
                />
              </div>

              {/* Timeout */}
              <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-on-surface font-semibold block">DEADMAN TIMEOUT</span>
                  <span className="text-[11px] text-outline font-sans">Heartbeat loss trip threshold.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={commTimeout}
                    onChange={(e) => setCommTimeout(e.target.value)}
                    className="w-20 px-2 py-1 rounded bg-surface-container border border-outline-variant/40 text-rose-400 font-mono font-bold text-[12px] text-right focus:outline-none"
                  />
                  <span className="text-outline text-[11px]">ms</span>
                </div>
              </div>

              {/* LoRa Fail-Safe Banner */}
              <div className="bg-rose-950/30 p-2.5 rounded border border-rose-500/40 text-[11.5px] leading-snug font-sans text-rose-200">
                <strong className="font-mono text-rose-300 block text-[11px] uppercase">
                  IMPORTANT OPERATIONAL FAIL-SAFE:
                </strong>
                When LoRa connection is lost (&gt;{commTimeout}ms), the rover stops immediately. CYTRON MDD20A motor outputs are cut at hardware level.
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 3. ALERT SETTINGS */}
          {/* ======================================================================= */}
          <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
                <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                  ALERT SETTINGS
                </h2>
              </div>
              <span className="font-mono text-[11px] text-outline uppercase">THRESHOLD NOTIFICATIONS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[12px]">
              {[
                { key: 'gas', label: 'Gas Alerts (CH4 / CO / H2S)', desc: 'MQ-4, MQ-7 & MQ-136 warning limits' },
                { key: 'smoke', label: 'Smoke Alerts', desc: 'MQ-2 particulate spike notifications' },
                { key: 'thermal', label: 'Thermal Alerts', desc: 'AMG8833 heat anomaly thresholds' },
                { key: 'lowO2', label: 'Low O2 Alerts', desc: 'Electrochemical O2 < 19.8% drop' },
                { key: 'obstacle', label: 'Obstacle Proximity Alerts', desc: 'HC-SR04 sonar < 0.6m warning' },
                { key: 'commLoss', label: 'Communication Loss Alerts', desc: 'SX1278 heartbeat timeout warning' },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleAlert(item.key)}
                  className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between cursor-pointer hover:bg-surface-container/60 transition-colors select-none"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-on-surface font-semibold text-[12px]">{item.label}</span>
                    <span className="text-[10.5px] text-outline font-sans mt-0.5">{item.desc}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                      alerts[item.key]
                        ? 'text-emerald-400 bg-emerald-950/40 border-emerald-600/40'
                        : 'text-outline bg-surface-container border-outline-variant/40'
                    }`}
                  >
                    {alerts[item.key] ? 'ON' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 4. DISPLAY PREFERENCES */}
          {/* ======================================================================= */}
          <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">visibility</span>
                <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                  DISPLAY PREFERENCES
                </h2>
              </div>
              <span className="font-mono text-[11px] text-outline uppercase">CONSOLE VIEW</span>
            </div>

            <div className="flex flex-col gap-2 font-mono text-[12px]">
              {[
                { key: 'showUnits', label: 'SHOW SENSOR UNITS', desc: 'Append PPM, %, °C, and AQI labels.' },
                { key: 'showTrends', label: 'SHOW TREND INDICATORS', desc: 'Display directional gas trend arrows on cards.' },
                { key: 'showHazardMarkers', label: 'SHOW MAP HAZARD MARKERS', desc: 'Render warning overlays and caution hatchings.' },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleDisplayPref(item.key)}
                  className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between cursor-pointer hover:bg-surface-container/60 transition-colors select-none"
                >
                  <div>
                    <span className="text-on-surface font-semibold block">{item.label}</span>
                    <span className="text-[11px] text-outline font-sans">{item.desc}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${displayPrefs[item.key] ? 'text-emerald-400 bg-emerald-950/40 border-emerald-600/40' : 'text-outline bg-surface-container'}`}>
                    {displayPrefs[item.key] ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
              ))}

              {/* Density */}
              <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-on-surface font-semibold block">DATA DENSITY</span>
                  <span className="text-[11px] text-outline font-sans">Layout spacing for 1080p and 768p displays.</span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded border border-outline-variant/30">
                  {['Compact', 'Comfortable'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDisplayPrefs((prev) => ({ ...prev, density: d }));
                        showToast(`Data density set to ${d}`);
                      }}
                      className={`px-2.5 py-0.5 rounded text-[11.5px] font-semibold transition-colors ${
                        displayPrefs.density === d
                          ? 'bg-primary/20 text-primary border border-primary/40'
                          : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 6. DATA & LOGGING */}
          {/* ======================================================================= */}
          <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
                <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                  DATA &amp; LOGGING
                </h2>
              </div>
              <span className="font-mono text-[11px] text-outline uppercase">VOLATILE SESSION BUFFER</span>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-[12px]">
              {/* Incident Logging */}
              <div
                onClick={() => {
                  setLoggingEnabled(!loggingEnabled);
                  showToast(`Incident logging ${!loggingEnabled ? 'enabled' : 'disabled'}`);
                }}
                className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between cursor-pointer hover:bg-surface-container/60 transition-colors select-none"
              >
                <div>
                  <span className="text-on-surface font-semibold block">INCIDENT LOGGING</span>
                  <span className="text-[11px] text-outline font-sans">Record safety events and manual operator actions.</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${loggingEnabled ? 'text-emerald-400 bg-emerald-950/40 border-emerald-600/40' : 'text-outline bg-surface-container'}`}>
                  {loggingEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>

              {/* Sensor History */}
              <div
                onClick={() => {
                  setHistoryEnabled(!historyEnabled);
                  showToast(`Sensor history ${!historyEnabled ? 'enabled' : 'disabled'}`);
                }}
                className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between cursor-pointer hover:bg-surface-container/60 transition-colors select-none"
              >
                <div>
                  <span className="text-on-surface font-semibold block">SENSOR HISTORY BUFFER</span>
                  <span className="text-[11px] text-outline font-sans">Retain 30-minute rolling trend data.</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${historyEnabled ? 'text-emerald-400 bg-emerald-950/40 border-emerald-600/40' : 'text-outline bg-surface-container'}`}>
                  {historyEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>

              {/* Export Format */}
              <div className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-on-surface font-semibold block">EXPORT FORMAT</span>
                  <span className="text-[11px] text-outline font-sans">Log file encoding for post-mission debrief.</span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded border border-outline-variant/30">
                  {['CSV', 'JSON'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => {
                        setExportFormat(fmt);
                        showToast(`Export format set to ${fmt}`);
                      }}
                      className={`px-3 py-0.5 rounded text-[11.5px] font-semibold transition-colors ${
                        exportFormat === fmt
                          ? 'bg-primary/20 text-primary border border-primary/40'
                          : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={handleExportLogs}
                  className="flex-1 py-2 px-3 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-on-surface font-semibold text-[11.5px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">download</span>
                  <span>Export Logs ({exportFormat})</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearLogs}
                  className="py-2 px-3 rounded bg-surface-container-high hover:bg-rose-950/40 border border-outline-variant/40 text-outline hover:text-rose-400 font-semibold text-[11.5px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                  <span>Clear Buffer</span>
                </button>
              </div>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* 7. SAFETY CONFIGURATION */}
          {/* ======================================================================= */}
          <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                  SAFETY CONFIGURATION
                </h2>
              </div>
              <span className="font-mono text-[11px] text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-600/40 font-semibold">
                FAIL-SAFE ACTIVE
              </span>
            </div>

            <div className="flex flex-col gap-2 font-mono text-[12px]">
              {[
                { title: 'COMMUNICATION LOSS FAIL-SAFE', desc: 'ESP32 deadman motor trip (>1,500ms).' },
                { title: 'EMERGENCY STOP READY', desc: 'Global teleoperation brake override.' },
                { title: 'MANUAL CONTROL ONLY', desc: 'Chassis locomotion strictly teleoperated.' },
              ].map((item) => (
                <div key={item.title} className="bg-[#060e20] p-2.5 rounded border border-outline-variant/30 flex items-center justify-between">
                  <div>
                    <span className="text-on-surface font-semibold block">{item.title}</span>
                    <span className="text-[11px] text-outline font-sans">{item.desc}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-600/40">
                    ENABLED
                  </span>
                </div>
              ))}

              {/* Safety statement */}
              <div className="bg-rose-950/40 p-3 rounded border border-rose-500/50 flex items-start gap-2.5 text-[12px]">
                <span className="material-symbols-outlined text-rose-400 text-[20px] shrink-0 mt-0.5">gavel</span>
                <div className="text-rose-200 font-sans leading-relaxed">
                  <strong className="font-mono text-rose-300 block text-[11.5px] uppercase">
                    MANDATORY SAFETY PROTOCOL:
                  </strong>
                  &ldquo;Loss of LoRa communication immediately stops rover movement.&rdquo;
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* 5. SENSOR STATUS (READ-ONLY HARDWARE LIST) */}
        {/* ========================================================================= */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">developer_board</span>
              <h2 className="font-bold text-[14px] md:text-[15px] tracking-wider uppercase text-on-surface">
                PAYLOAD SENSOR &amp; MODULE STATUS (READ-ONLY)
              </h2>
            </div>
            <span className="font-mono text-[11px] text-outline uppercase">
              ESP32 HARDWARE PINS &bull; 10 MODULES VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-[11.5px]">
            {sensorModuleList.map((sensor) => (
              <div
                key={sensor.name}
                className="bg-[#060e20] p-2 rounded border border-outline-variant/25 flex flex-col justify-between min-h-[70px]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-on-surface text-[12px] truncate">{sensor.name}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{sensor.status}</span>
                  </div>
                  <span className="text-[10.5px] text-outline block truncate">{sensor.type}</span>
                </div>
                <span className="text-[10px] text-primary/80 mt-1 block truncate font-mono">
                  {sensor.bus}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/25 font-mono text-[12px]">
          <span className="text-outline text-[11.5px]">
            UNDERSTONE MINE TELEOPERATION &bull; FIRMWARE V2.4.1
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-outline hover:text-on-surface transition-colors text-[11.5px]"
            >
              Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-4 py-1.5 rounded bg-primary text-black font-bold hover:bg-primary/90 transition-colors text-[12px] shadow-sm"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
