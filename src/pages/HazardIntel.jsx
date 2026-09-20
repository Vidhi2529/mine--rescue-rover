import { useState, useEffect } from 'react';

export default function HazardIntel() {
  const [actionToast, setActionToast] = useState(null);
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTelemetry = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE_URL}/api/telemetry`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) setTelemetry(data);
      } catch {
        // Retain demo fallback telemetry gracefully
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Environmental Trend Analysis active metric
  const [activeMetric, setActiveMetric] = useState('CH4');

  // Collapsible right panel state (Hazards & Dispatch)
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  // Active alerts acknowledgment state
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);

  const toggleAcknowledge = (id) => {
    setAcknowledgedAlerts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Trend analysis datasets for 30-min window
  const trendData = {
    CH4: {
      name: 'CH4 Methane',
      sensor: 'MQ-4 Gas Sensor (Analog)',
      unit: 'ppm',
      current: '11,500 ppm',
      normal: '0 – 7,500 ppm',
      warning: '10,000 ppm',
      critical: '15,000 ppm (Evac Threshold)',
      status: 'WARNING',
      statusColor: 'text-amber-400 bg-amber-950/20 border-amber-500/30',
      strokeColor: '#f59e0b',
      fillGradId: 'grad-ch4',
      points: [
        { x: 30, y: 110, val: '7,200 ppm' },
        { x: 110, y: 102, val: '7,800 ppm' },
        { x: 190, y: 92, val: '8,500 ppm' },
        { x: 270, y: 78, val: '9,400 ppm' },
        { x: 350, y: 64, val: '10,200 ppm' },
        { x: 430, y: 48, val: '11,000 ppm' },
        { x: 510, y: 38, val: '11,500 ppm' },
      ],
      pathD: 'M 30,110 L 110,102 L 190,92 L 270,78 L 350,64 L 430,48 L 510,38',
      areaD: 'M 30,110 L 110,102 L 190,92 L 270,78 L 350,64 L 430,48 L 510,38 L 510,140 L 30,140 Z',
      warningY: 66,
      criticalY: 20,
    },
    CO: {
      name: 'CO Carbon Monoxide',
      sensor: 'MQ-7 Sensor (Analog)',
      unit: 'PPM',
      current: '14 PPM',
      normal: '< 25 PPM',
      warning: '35 PPM',
      critical: '50 PPM',
      status: 'SAFE',
      statusColor: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
      strokeColor: '#62df7d',
      fillGradId: 'grad-co',
      points: [
        { x: 30, y: 88, val: '18 PPM' },
        { x: 110, y: 94, val: '17 PPM' },
        { x: 190, y: 100, val: '15 PPM' },
        { x: 270, y: 104, val: '14 PPM' },
        { x: 350, y: 102, val: '15 PPM' },
        { x: 430, y: 108, val: '13 PPM' },
        { x: 510, y: 104, val: '14 PPM' },
      ],
      pathD: 'M 30,88 L 110,94 L 190,100 L 270,104 L 350,102 L 430,108 L 510,104',
      areaD: 'M 30,88 L 110,94 L 190,100 L 270,104 L 350,102 L 430,108 L 510,104 L 510,140 L 30,140 Z',
      warningY: 55,
      criticalY: 25,
    },
    H2S: {
      name: 'H2S Hydrogen Sulfide',
      sensor: 'MQ-136 Gas Sensor',
      unit: 'PPM',
      current: '1.8 PPM',
      normal: '< 5 PPM',
      warning: '8 PPM',
      critical: '10 PPM',
      status: 'SAFE',
      statusColor: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
      strokeColor: '#62df7d',
      fillGradId: 'grad-h2s',
      points: [
        { x: 30, y: 115, val: '1.5 PPM' },
        { x: 110, y: 112, val: '1.6 PPM' },
        { x: 190, y: 118, val: '1.4 PPM' },
        { x: 270, y: 110, val: '1.7 PPM' },
        { x: 350, y: 108, val: '1.8 PPM' },
        { x: 430, y: 106, val: '1.9 PPM' },
        { x: 510, y: 108, val: '1.8 PPM' },
      ],
      pathD: 'M 30,115 L 110,112 L 190,118 L 270,110 L 350,108 L 430,106 L 510,108',
      areaD: 'M 30,115 L 110,112 L 190,118 L 270,110 L 350,108 L 430,106 L 510,108 L 510,140 L 30,140 Z',
      warningY: 60,
      criticalY: 25,
    },
    O2: {
      name: 'O2 Oxygen Level',
      sensor: 'DFRobot SEN0322',
      unit: '%VOL',
      current: '20.8 %VOL',
      normal: '20.5% – 21.0% %VOL',
      warning: '< 19.8% %VOL',
      critical: '< 19.5% %VOL (Oxygen Deficient)',
      status: 'SAFE',
      statusColor: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
      strokeColor: '#93ccff',
      fillGradId: 'grad-o2',
      points: [
        { x: 30, y: 44, val: '20.9 %VOL' },
        { x: 110, y: 46, val: '20.9 %VOL' },
        { x: 190, y: 48, val: '20.8 %VOL' },
        { x: 270, y: 52, val: '20.7 %VOL' },
        { x: 350, y: 50, val: '20.8 %VOL' },
        { x: 430, y: 48, val: '20.8 %VOL' },
        { x: 510, y: 48, val: '20.8 %VOL' },
      ],
      pathD: 'M 30,44 L 110,46 L 190,48 L 270,52 L 350,50 L 430,48 L 510,48',
      areaD: 'M 30,44 L 110,46 L 190,48 L 270,52 L 350,50 L 430,48 L 510,48 L 510,140 L 30,140 Z',
      warningY: 90,
      criticalY: 115,
    },
    NO2: {
      name: 'NO2 Nitrogen Dioxide',
      sensor: 'EC Sensor (Simulated)',
      unit: 'PPM',
      current: '0.3 PPM',
      normal: '< 1.0 PPM',
      warning: '3.0 PPM',
      critical: '5.0 PPM',
      status: 'SAFE',
      statusColor: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
      strokeColor: '#62df7d',
      fillGradId: 'grad-no2',
      points: [
        { x: 30, y: 118, val: '0.2 PPM' },
        { x: 110, y: 115, val: '0.2 PPM' },
        { x: 190, y: 112, val: '0.3 PPM' },
        { x: 270, y: 114, val: '0.3 PPM' },
        { x: 350, y: 112, val: '0.3 PPM' },
        { x: 430, y: 110, val: '0.3 PPM' },
        { x: 510, y: 112, val: '0.3 PPM' },
      ],
      pathD: 'M 30,118 L 110,115 L 190,112 L 270,114 L 350,112 L 430,110 L 510,112',
      areaD: 'M 30,118 L 110,115 L 190,112 L 270,114 L 350,112 L 430,110 L 510,112 L 510,140 L 30,140 Z',
      warningY: 60,
      criticalY: 25,
    },
    CO2: {
      name: 'CO2 Carbon Dioxide',
      sensor: 'MH-Z19E',
      unit: 'ppm',
      current: '580 ppm',
      normal: '< 1000 ppm',
      warning: '2500 ppm',
      critical: '5000 ppm',
      status: 'SAFE',
      statusColor: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
      strokeColor: '#62df7d',
      fillGradId: 'grad-co2',
      points: [
        { x: 30, y: 105, val: '540 ppm' },
        { x: 110, y: 102, val: '550 ppm' },
        { x: 190, y: 98, val: '565 ppm' },
        { x: 270, y: 96, val: '570 ppm' },
        { x: 350, y: 95, val: '575 ppm' },
        { x: 430, y: 92, val: '580 ppm' },
        { x: 510, y: 92, val: '580 ppm' },
      ],
      pathD: 'M 30,105 L 110,102 L 190,98 L 270,96 L 350,95 L 430,92 L 510,92',
      areaD: 'M 30,105 L 110,102 L 190,98 L 270,96 L 350,95 L 430,92 L 510,92 L 510,140 L 30,140 Z',
      warningY: 60,
      criticalY: 20,
    },
    Temperature: {
      name: 'Ambient Temperature',
      sensor: 'DHT22 Digital Sensor',
      unit: '°C',
      current: '26.8°C',
      normal: '18.0°C – 28.0°C',
      warning: '32.0°C',
      critical: '38.0°C (Thermal Hazard)',
      status: 'SAFE',
      statusColor: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
      strokeColor: '#93ccff',
      fillGradId: 'grad-temp',
      points: [
        { x: 30, y: 92, val: '25.8°C' },
        { x: 110, y: 90, val: '26.0°C' },
        { x: 190, y: 86, val: '26.2°C' },
        { x: 270, y: 82, val: '26.5°C' },
        { x: 350, y: 80, val: '26.6°C' },
        { x: 430, y: 78, val: '26.7°C' },
        { x: 510, y: 76, val: '26.8°C' },
      ],
      pathD: 'M 30,92 L 110,90 L 190,86 L 270,82 L 350,80 L 430,78 L 510,76',
      areaD: 'M 30,92 L 110,90 L 190,86 L 270,82 L 350,80 L 430,78 L 510,76 L 510,140 L 30,140 Z',
      warningY: 52,
      criticalY: 22,
    },
    Humidity: {
      name: 'Relative Humidity',
      sensor: 'DHT22 Digital Sensor',
      unit: '% RH',
      current: '68% RH',
      normal: '50% – 75% RH',
      warning: '85% RH',
      critical: '95% RH',
      status: 'SAFE',
      statusColor: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
      strokeColor: '#93ccff',
      fillGradId: 'grad-hum',
      points: [
        { x: 30, y: 84, val: '65%' },
        { x: 110, y: 82, val: '66%' },
        { x: 190, y: 80, val: '67%' },
        { x: 270, y: 78, val: '68%' },
        { x: 350, y: 80, val: '67%' },
        { x: 430, y: 78, val: '68%' },
        { x: 510, y: 78, val: '68%' },
      ],
      pathD: 'M 30,84 L 110,82 L 190,80 L 270,78 L 350,80 L 430,78 L 510,78',
      areaD: 'M 30,84 L 110,82 L 190,80 L 270,78 L 350,80 L 430,78 L 510,78 L 510,140 L 30,140 Z',
      warningY: 48,
      criticalY: 20,
    },
    Water: {
      name: 'Water Ingress / Flooding',
      sensor: 'DFRobot Submersible Liquid Level',
      unit: 'cm',
      current: '0.0 cm',
      normal: '0.0 – 2.0 cm',
      warning: '5.0 cm',
      critical: '15.0 cm (Flooding Hazard)',
      status: 'SAFE',
      statusColor: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
      strokeColor: '#38bdf8',
      fillGradId: 'grad-water',
      points: [
        { x: 30, y: 130, val: '0.0 cm' },
        { x: 110, y: 130, val: '0.0 cm' },
        { x: 190, y: 130, val: '0.0 cm' },
        { x: 270, y: 130, val: '0.0 cm' },
        { x: 350, y: 130, val: '0.0 cm' },
        { x: 430, y: 130, val: '0.0 cm' },
        { x: 510, y: 130, val: '0.0 cm' },
      ],
      pathD: 'M 30,130 L 110,130 L 190,130 L 270,130 L 350,130 L 430,130 L 510,130',
      areaD: 'M 30,130 L 110,130 L 190,130 L 270,130 L 350,130 L 430,130 L 510,130 L 510,140 L 30,140 Z',
      warningY: 85,
      criticalY: 35,
    },
  };

  const currentTrend = trendData[activeMetric];

  // Active hazard alerts (purely environmental / sensor triggers - LoRa moved to hardware status)
  const activeAlerts = [
    {
      id: 'alt-1',
      severity: 'WARNING',
      severityColor: 'border-l-4 border-l-amber-500 bg-amber-950/20 text-amber-300',
      badgeColor: 'bg-amber-900/40 text-amber-300 border border-amber-700/40',
      hazard: 'Methane Concentration Rising',
      source: 'MQ-4 Gas Sensor',
      reading: '11,500 ppm (Warning >10,000 ppm, Crit >15,000 ppm)',
      timestamp: '14:31:12 UTC',
      detail: 'Gradual climb detected (+800 ppm/10m). Operator advised to hold progression and observe dilution.',
    },
    {
      id: 'alt-2',
      severity: 'THERMAL ANOMALY',
      severityColor: 'border-l-4 border-l-orange-500 bg-orange-950/20 text-orange-300',
      badgeColor: 'bg-orange-900/40 text-orange-300 border border-orange-700/40',
      hazard: 'Possible Human / Heat Signature',
      source: 'AMG8833 8x8 IR Array',
      reading: '35.2°C Hotspot (Δ +15.8°C above ambient)',
      timestamp: '14:32:05 UTC',
      detail: 'Localized heat anomaly in tunnel alcove. Smoke and CO nominal. Operator verification required.',
    },
    {
      id: 'alt-3',
      severity: 'CAUTION',
      severityColor: 'border-l-4 border-l-yellow-500 bg-yellow-950/20 text-yellow-300',
      badgeColor: 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/40',
      hazard: 'Transient Smoke Spike',
      source: 'MQ-2 Gas/Smoke Sensor',
      reading: '78 AQI (Dissipating to 46 AQI)',
      timestamp: '14:28:44 UTC',
      detail: 'Temporary smoke elevation observed. Cleared toward baseline. Operator monitoring recommended.',
    },
  ];

  // Recent hazard events log (defendable sensor observations)
  const recentEvents = [
    {
      time: '14:31:12',
      hazard: 'Methane Influx',
      sensor: 'MQ-4',
      reading: '11,500 ppm',
      severity: 'WARNING',
      severityBadge: 'text-amber-400 bg-amber-950/40 border border-amber-800/40',
      aiAssessment: 'Upward trend (+800 ppm/10m); operator advised to hold position until level stabilizes.',
    },
    {
      time: '14:30:45',
      hazard: 'Thermal Hotspot',
      sensor: 'AMG8833',
      reading: '35.2°C',
      severity: 'THERMAL',
      severityBadge: 'text-orange-400 bg-orange-950/40 border border-orange-800/40',
      aiAssessment: 'Possible Human / Heat Signature; smoke nominal. Operator verification required.',
    },
    {
      time: '14:26:10',
      hazard: 'Transient Smoke',
      sensor: 'MQ-2',
      reading: '78 AQI',
      severity: 'CAUTION',
      severityBadge: 'text-yellow-400 bg-yellow-950/40 border border-yellow-800/40',
      aiAssessment: 'Temporary smoke spike; rapid clearance confirms no continuous combustion.',
    },
    {
      time: '14:18:22',
      hazard: 'CO Fluctuation',
      sensor: 'MQ-7',
      reading: '18 PPM',
      severity: 'SAFE',
      severityBadge: 'text-tertiary bg-tertiary-container/20 border border-tertiary/30',
      aiAssessment: 'Minor reading fluctuation within safe baseline (<25 PPM).',
    },
    {
      time: '14:10:05',
      hazard: 'Low O2 Reading',
      sensor: 'DFRobot SEN0322',
      reading: '19.7 %VOL',
      severity: 'CAUTION',
      severityBadge: 'text-yellow-400 bg-yellow-950/40 border border-yellow-800/40',
      aiAssessment: 'Localized O2 dip near 19.8% %VOL warning line; operator advised to track trend.',
    },
    {
      time: '14:02:40',
      hazard: 'Sonar Obstacle',
      sensor: 'HC-SR04',
      reading: '0.38m',
      severity: 'SAFE',
      severityBadge: 'text-tertiary bg-tertiary-container/20 border border-tertiary/30',
      aiAssessment: 'Forward obstacle proximity detected by ultrasonic sonar; operator halted chassis.',
    },
    {
      time: '13:55:18',
      hazard: 'Water Ingress Check',
      sensor: 'DFRobot Level',
      reading: '0.0 cm',
      severity: 'SAFE',
      severityBadge: 'text-tertiary bg-tertiary-container/20 border border-tertiary/30',
      aiAssessment: 'Sub-surface floor dry; no water pooling or flooding hazard detected.',
    },
  ];

  return (
    <>
      {/* 2. CENTER COLUMN: PRIMARY HAZARD WORKSPACE */}
      <main className="flex-1 min-w-0 bg-[#0b1326] p-3.5 flex flex-col gap-3 overflow-y-auto industrial-scrollbar">
        {/* Toast Feedback */}
        {actionToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-surface-container-high text-primary border border-primary/40 px-4 py-2 rounded-lg font-mono text-[12px] shadow-xl animate-fadeIn z-50 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            {actionToast}
          </div>
        )}

        {/* PAGE BANNER HEADER */}
        <div className="flex items-center justify-between border-b border-outline-variant/25 pb-3 shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[24px]">psychology</span>
              <h1 className="font-bold text-[17px] md:text-[18px] tracking-wider uppercase text-on-surface">
                HAZARD INTELLIGENCE
              </h1>
              <span className="px-2.5 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-mono text-[12px] font-semibold">
                ESP32 LoRa LINK
              </span>
            </div>
            <p className="text-on-surface-variant text-[12.5px] mt-1">
              Multi-sensor risk correlation, environmental trend analysis &amp; thermal anomaly interpretation
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const dataStr =
                  'data:text/json;charset=utf-8,' +
                  encodeURIComponent(
                    JSON.stringify(
                      {
                        timestamp: new Date().toISOString(),
                        sector: 'Sector 4 Drift C',
                        roverId: 'ROVER-R01',
                        telemetry: telemetry || 'simulated_fallback',
                        metrics: {
                          CH4: '11,500 ppm',
                          CO: '14 PPM',
                          H2S: '1.8 PPM',
                          O2: '20.8 %VOL',
                          NO2: '0.3 PPM',
                          CO2: '580 ppm',
                          Temperature: '26.8°C',
                          Humidity: '78.4%',
                          Water: '0.0 cm',
                        },
                      },
                      null,
                      2
                    )
                  );
                const a = document.createElement('a');
                a.href = dataStr;
                a.download = `hazard_telemetry_log_${Date.now()}.json`;
                a.click();
                setActionToast('Hazard telemetry log exported successfully');
                setTimeout(() => setActionToast(null), 3500);
              }}
              className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 rounded text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors font-mono text-[11.5px] cursor-pointer"
              title="Export Hazard Telemetry Log"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px] text-outline">download</span>
              <span>Export Log</span>
            </button>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-tertiary-container/20 border border-tertiary/30 text-tertiary font-mono text-[12px] font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              LIVE ANALYSIS &bull; SX1278 433MHz
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. LIVE GAS & ENVIRONMENTAL SENSOR MONITORING (9 CARDS) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-9 gap-2 w-full shrink-0">
          {[
            {
              gas: 'CH4',
              name: 'Methane',
              sensor: 'MQ-4 Analog',
              status: 'WARN',
              fullStatus: 'WARNING',
              badge: 'text-amber-400 bg-amber-950/40 border-amber-600/40',
              val: '11,500 ppm',
              valClass: 'text-[18px] font-bold font-mono text-amber-400',
              delta: '+800 ppm ↑',
              deltaClass: 'font-mono text-[10.5px] text-amber-400',
              footL: 'Max 10,000 ppm',
              footR: 'Elevated',
              footRClass: 'text-amber-400 font-medium',
            },
            {
              gas: 'H2S',
              name: 'Hyd Sulfide',
              sensor: 'MQ-136 Gas',
              status: 'SAFE',
              fullStatus: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '1.8 PPM',
              valClass: 'text-[18px] font-bold font-mono text-tertiary',
              delta: '0.0 —',
              deltaClass: 'font-mono text-[10.5px] text-outline',
              footL: 'Lim 10',
              footR: 'Nominal',
              footRClass: 'text-tertiary font-medium',
            },
            {
              gas: 'O2',
              name: 'Oxygen',
              sensor: 'DFRobot SEN0322',
              status: 'SAFE',
              fullStatus: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '20.8 %VOL',
              valClass: 'text-[18px] font-bold font-mono text-primary',
              delta: '0.0 —',
              deltaClass: 'font-mono text-[10.5px] text-outline',
              footL: '> 19.5 %VOL',
              footR: 'Optimal',
              footRClass: 'text-tertiary font-medium',
            },
            {
              gas: 'CO',
              name: 'Carbon Mon',
              sensor: 'MQ-7 Sensor',
              status: 'SAFE',
              fullStatus: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '14 PPM',
              valClass: 'text-[18px] font-bold font-mono text-tertiary',
              delta: '-2 PPM ↓',
              deltaClass: 'font-mono text-[10.5px] text-tertiary',
              footL: 'Lim 35',
              footR: 'Stable',
              footRClass: 'text-tertiary font-medium',
            },
            {
              gas: 'NO2',
              name: 'Nitrogen Diox',
              sensor: 'EC (Sim)',
              status: 'SAFE',
              fullStatus: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '0.3 PPM',
              valClass: 'text-[18px] font-bold font-mono text-tertiary',
              delta: '0.0 —',
              deltaClass: 'font-mono text-[10.5px] text-outline',
              footL: 'Lim 3.0',
              footR: 'Nominal',
              footRClass: 'text-tertiary font-medium',
            },
            {
              gas: 'CO2',
              name: 'Carbon Diox',
              sensor: 'MH-Z19E',
              status: 'SAFE',
              fullStatus: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '580 ppm',
              valClass: 'text-[18px] font-bold font-mono text-tertiary',
              delta: '+12 ppm ↑',
              deltaClass: 'font-mono text-[10.5px] text-outline',
              footL: 'Lim 5000 ppm',
              footR: 'Nominal',
              footRClass: 'text-tertiary font-medium',
            },
            {
              gas: 'TEMP',
              name: 'Ambient Temp',
              sensor: 'DHT22 / IR',
              status: 'SAFE',
              fullStatus: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '26.8°C',
              valClass: 'text-[18px] font-bold font-mono text-tertiary',
              delta: '+0.2°C ↑',
              deltaClass: 'font-mono text-[10.5px] text-outline',
              footL: 'Lim 35°C',
              footR: 'Nominal',
              footRClass: 'text-tertiary font-medium',
            },
            {
              gas: 'HUMID',
              name: 'Rel Humidity',
              sensor: 'DHT22 Digital',
              status: 'SAFE',
              fullStatus: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '78.4%',
              valClass: 'text-[18px] font-bold font-mono text-primary',
              delta: '-0.5% ↓',
              deltaClass: 'font-mono text-[10.5px] text-outline',
              footL: 'Lim 90%',
              footR: 'Stable',
              footRClass: 'text-tertiary font-medium',
            },
            {
              gas: 'FLOOD',
              name: 'Water Level',
              sensor: 'DFRobot Level',
              status: 'SAFE',
              fullStatus: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '0.0 cm',
              valClass: 'text-[18px] font-bold font-mono text-sky-400',
              delta: '0.0 —',
              deltaClass: 'font-mono text-[10.5px] text-outline',
              footL: 'Lim 5.0 cm',
              footR: 'Dry Drift',
              footRClass: 'text-tertiary font-medium',
            },
          ].map((c, idx) => (
            <div
              key={idx}
              className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-2 shadow-sm flex flex-col justify-between min-h-[108px] overflow-hidden"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-[13px] font-bold text-on-surface uppercase tracking-wide">
                  {c.gas}
                </span>
                <span className={`font-mono text-[10px] ${c.badge} border px-1.5 py-0.2 rounded font-semibold shrink-0`}>
                  {c.status}
                </span>
              </div>
              <div className="font-mono text-[10.5px] text-outline truncate leading-tight">
                {c.name}
              </div>
              <div className="my-0.5 flex items-baseline justify-between gap-1">
                <span className={c.valClass}>{c.val}</span>
                <span className={c.deltaClass}>{c.delta}</span>
              </div>
              <div className="pt-1 border-t border-outline-variant/20 flex items-center justify-between text-[10px] font-mono text-outline leading-none">
                <span className="truncate">{c.footL}</span>
                <span className={c.footRClass}>{c.footR}</span>
              </div>
            </div>
          ))}
        </section>

        {/* ========================================================================= */}
        {/* 2. UNDERGROUND LORA MESH & BEACON LOCALIZATION BACKBONE */}
        {/* (Non-GPS RF Beacon Infrastructure for Underground Positioning & Uplink) */}
        {/* ========================================================================= */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 flex flex-col gap-2.5 shadow-sm font-mono shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">cell_tower</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-[13.5px] text-on-surface uppercase tracking-wider leading-tight">
                    Underground LoRa Mesh &amp; Beacon Localization Backbone
                  </h2>
                  <span className="px-2 py-0.2 rounded bg-primary/10 border border-primary/25 text-primary text-[10.5px] font-semibold">
                    SUB-SURFACE RF &bull; NO GPS
                  </span>
                </div>
                <span className="text-[11px] text-outline">
                  Multi-hop packet telemetry &bull; SX1278 433MHz &bull; Proximity beacon localization
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11.5px]">
              <div className="flex items-center gap-1.5 text-outline">
                <span>HOP COUNT:</span>
                <strong className="text-on-surface font-semibold">3 HOPS TO SURFACE</strong>
              </div>
              <span className="text-outline-variant">|</span>
              <div className="flex items-center gap-1.5 text-outline">
                <span>PACKET LOSS:</span>
                <strong className="text-tertiary font-semibold">0.0% (NOMINAL)</strong>
              </div>
            </div>
          </div>

          {/* 5-Node LoRa Backbone Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-[11.5px]">
            {[
              {
                id: 'NODE-01',
                role: 'SURFACE GATEWAY',
                depth: 'Portal (0.0m)',
                rssi: '-76 dBm',
                snr: '+9.2 dB',
                status: 'LINKED',
                badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
                active: true,
              },
              {
                id: 'NODE-02',
                role: 'LEVEL -350 RELAY',
                depth: 'Upper Drift (-350m)',
                rssi: '-82 dBm',
                snr: '+8.1 dB',
                status: 'REPEATER',
                badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
                active: true,
              },
              {
                id: 'NODE-03',
                role: 'RAMP RELAY',
                depth: 'Incline (-620m)',
                rssi: '-88 dBm',
                snr: '+6.4 dB',
                status: 'REPEATER',
                badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
                active: true,
              },
              {
                id: 'NODE-04',
                role: 'DRIFT C BASE HUB',
                depth: 'Sector 4 (-850m)',
                rssi: '-94 dBm',
                snr: '+5.0 dB',
                status: 'ROVER UPLINK',
                badge: 'text-primary bg-primary/20 border-primary/40 font-bold animate-pulse',
                active: true,
                isRoverLink: true,
              },
              {
                id: 'NODE-05',
                role: 'BYPASS NODE',
                depth: 'Sector 4 East (-850m)',
                rssi: '-98 dBm',
                snr: '+3.8 dB',
                status: 'STANDBY MESH',
                badge: 'text-outline bg-surface-container border-outline-variant/30',
                active: false,
              },
            ].map((node) => (
              <div
                key={node.id}
                className={`p-2.5 rounded-lg border flex flex-col justify-between space-y-1.5 transition-colors ${
                  node.isRoverLink
                    ? 'bg-primary/10 border-primary/40 shadow-sm'
                    : 'bg-surface-container/50 border-outline-variant/25'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-[12px] text-on-surface">{node.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border ${node.badge}`}>
                    {node.status}
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-primary truncate">{node.role}</div>
                  <div className="text-[10.5px] text-outline truncate">{node.depth}</div>
                </div>
                <div className="pt-1 border-t border-outline-variant/20 flex items-center justify-between text-[10px] text-outline">
                  <span>RSSI: <strong className="text-on-surface">{node.rssi}</strong></span>
                  <span>SNR: <strong className="text-on-surface">{node.snr}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TWO MAIN CARDS: AI HAZARD RISK CORRELATION & ENVIRONMENTAL TREND ANALYSIS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full shrink-0">
          {/* 2. AI HAZARD RISK CORRELATION (MAIN PANEL) */}
          <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">neurology</span>
                <h2 className="font-mono text-[14px] font-semibold text-on-surface uppercase tracking-wider">
                  AI Hazard Risk Correlation &amp; Trend Inference
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11.5px] text-amber-400 bg-amber-950/30 border border-amber-600/40 px-2.5 py-0.5 rounded font-semibold">
                  RISK: MODERATE
                </span>
                <span className="font-mono text-[11.5px] text-tertiary bg-tertiary-container/20 border border-tertiary/30 px-2 py-0.5 rounded">
                  STATUS: LIVE
                </span>
              </div>
            </div>

            {/* Risk Summary Metrics */}
            <div className="grid grid-cols-3 gap-2.5 my-3 font-mono text-[12px]">
              <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20">
                <span className="text-outline uppercase block text-[11.5px]">Primary Detected Risk</span>
                <span className="text-amber-400 font-bold block mt-0.5 text-[13.5px] leading-tight">
                  CH4 Influx (Sub-Surface Drift)
                </span>
              </div>
              <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20">
                <span className="text-outline uppercase block text-[11.5px]">Telemetry Uplink</span>
                <span className="text-on-surface font-semibold block mt-0.5 text-[13.5px] leading-tight">
                  14:32:40 UTC
                </span>
              </div>
              <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20">
                <span className="text-outline uppercase block text-[11.5px]">Control Protocol</span>
                <span className="text-primary font-semibold block mt-0.5 text-[13.5px] leading-tight">
                  Manual Teleoperation
                </span>
              </div>
            </div>

            {/* AI Safety Assessment Advisory */}
            <div className="bg-surface-container/75 p-3 rounded border border-outline-variant/25 font-mono text-[12.5px]">
              <div className="flex items-center gap-2 text-primary font-semibold mb-1">
                <span className="material-symbols-outlined text-[17px]">psychology</span>
                <span>AI SAFETY INFERENCE ENGINE (ADVISORY):</span>
              </div>
              <p className="text-on-surface leading-relaxed">
                &ldquo;Methane concentration is gradually increasing (+800 ppm/10m) while smoke and ambient temperatures remain stable. Rover is manually controlled: operator advised to hold position and monitor atmospheric dilution.&rdquo;
              </p>
            </div>

            {/* AI Trend Correlation Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-[11.5px]">
              <span className="px-2.5 py-1 rounded bg-amber-950/30 border border-amber-600/40 text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Gas Trend: +800 ppm/10m Rising
              </span>
              <span className="px-2.5 py-1 rounded bg-tertiary-container/20 border border-tertiary/30 text-tertiary flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                Air Quality: Nominal (46 AQI)
              </span>
              <span className="px-2.5 py-1 rounded bg-orange-950/40 border border-orange-600/40 text-orange-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                Thermal: Hotspot (35.2°C) Ahead
              </span>
              <span className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant/30 text-outline flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-outline"></span>
                Control Mode: Operator Verification Required
              </span>
            </div>
          </section>

          {/* 3. ENVIRONMENTAL TREND ANALYSIS (INTERACTIVE CHART) */}
          <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">show_chart</span>
                <h2 className="font-mono text-[14px] font-semibold text-on-surface uppercase tracking-wider">
                  Environmental Trend Analysis
                </h2>
              </div>
              <span className={`font-mono text-[12px] px-2.5 py-0.5 rounded border font-semibold ${currentTrend.statusColor}`}>
                {currentTrend.status}: {currentTrend.current}
              </span>
            </div>

            {/* Metric Switcher Tab Bar */}
            <div className="flex flex-wrap items-center gap-1.5 my-2 bg-surface-container-lowest p-1 rounded border border-outline-variant/30 font-mono text-[12px]">
              {['CH4', 'H2S', 'O2', 'CO', 'NO2', 'CO2', 'Temperature', 'Humidity', 'Water'].map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  className={`px-3 py-1 rounded transition-colors font-semibold ${activeMetric === m
                      ? 'bg-primary text-[#003351] shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  type="button"
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Threshold Labels Bar */}
            <div className="grid grid-cols-4 gap-1.5 font-mono text-[11.5px] text-outline mb-1 bg-surface-container/40 px-2.5 py-1.5 rounded border border-outline-variant/15">
              <div>
                <span className="block text-outline/70 text-[11px]">Sensor</span>
                <span className="text-on-surface font-medium truncate block">{currentTrend.sensor}</span>
              </div>
              <div>
                <span className="block text-outline/70 text-[11px]">Normal Range</span>
                <span className="text-tertiary font-medium block">{currentTrend.normal}</span>
              </div>
              <div>
                <span className="block text-outline/70 text-[11px]">Warning Level</span>
                <span className="text-amber-400 font-medium block">{currentTrend.warning}</span>
              </div>
              <div>
                <span className="block text-outline/70 text-[11px]">Critical Level</span>
                <span className="text-red-400 font-medium block">{currentTrend.critical}</span>
              </div>
            </div>

            {/* SVG Industrial Trend Chart */}
            <div className="relative w-full h-[120px] bg-[#060e20] rounded border border-outline-variant/30 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 540 145" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={currentTrend.fillGradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={currentTrend.strokeColor} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={currentTrend.strokeColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="20" y1="30" x2="520" y2="30" stroke="#2d3449" strokeWidth="0.75" strokeDasharray="3 3" />
                <line x1="20" y1="70" x2="520" y2="70" stroke="#2d3449" strokeWidth="0.75" strokeDasharray="3 3" />
                <line x1="20" y1="110" x2="520" y2="110" stroke="#2d3449" strokeWidth="0.75" strokeDasharray="3 3" />

                {/* Warning threshold dotted line */}
                <line
                  x1="20"
                  y1={currentTrend.warningY}
                  x2="520"
                  y2={currentTrend.warningY}
                  stroke="#d97707"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />

                {/* Critical threshold line */}
                <line
                  x1="20"
                  y1={currentTrend.criticalY}
                  x2="520"
                  y2={currentTrend.criticalY}
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />

                {/* Area gradient fill */}
                <path d={currentTrend.areaD} fill={`url(#${currentTrend.fillGradId})`} />

                {/* Trend line */}
                <path d={currentTrend.pathD} fill="none" stroke={currentTrend.strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Data points */}
                {currentTrend.points.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#060e20" stroke={currentTrend.strokeColor} strokeWidth="2" />
                    <text x={pt.x} y={pt.y - 7} fill="#dae2fd" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                      {pt.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Chart Time axis labels */}
            <div className="flex justify-between font-mono text-[11.5px] text-outline mt-1 px-1">
              <span>-30 MIN</span>
              <span>-20 MIN</span>
              <span>-10 MIN</span>
              <span>-5 MIN</span>
              <span className="text-on-surface font-semibold">NOW (14:32)</span>
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* 4. THERMAL INTELLIGENCE & 5. MULTI-SENSOR CORRELATION */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 w-full shrink-0">
          {/* 4. THERMAL INTELLIGENCE (AMG8833 8X8 IR ANALYTICS) - 7 COLS */}
          <section className="lg:col-span-7 bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 md:p-4 shadow-sm flex flex-col justify-between gap-2.5">
            {/* Main Header */}
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[22px]">thermostat</span>
                <div className="flex flex-col">
                  <h2 className="font-mono text-[13.5px] md:text-[14px] font-semibold text-on-surface uppercase tracking-wider leading-none">
                    THERMAL INTELLIGENCE &bull; AMG8833 8X8 IR
                  </h2>
                  <span className="font-mono text-[11px] text-outline uppercase mt-0.5">
                    64-PIXEL INFRARED GRID ARRAY &bull; I2C FRAME
                  </span>
                </div>
              </div>
              <div className="font-mono text-[10.5px] text-orange-300 bg-orange-950/40 border border-orange-500/40 px-2.5 py-1 rounded font-bold uppercase tracking-wider text-center leading-tight">
                <div>HEAT SIGNATURE</div>
                <div>DETECTED</div>
              </div>
            </div>

            {/* Sub-header: Thermal Signature Analysis */}
            <div className="flex items-center justify-between pt-0.5">
              <div>
                <h3 className="font-mono font-bold text-[13px] md:text-[13.5px] text-sky-400 tracking-wide">
                  THERMAL SIGNATURE ANALYSIS
                </h3>
                <span className="font-mono text-[10.5px] text-outline block mt-0.5">
                  AMG8833 &bull; 64-POINT IR ARRAY
                </span>
              </div>
              <span className="font-mono text-[10.5px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-2.5 py-0.5 rounded font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE
              </span>
            </div>

            {/* 1. TEMPERATURE TREND (LAST 60s) */}
            <div className="bg-[#060e20] p-2.5 rounded-lg border border-outline-variant/30 flex flex-col gap-1">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-outline uppercase tracking-wider font-semibold">
                  TEMPERATURE TREND (LAST 60s)
                </span>
                <span className="text-rose-400 font-bold text-[14px] tracking-wide">
                  35.8°C
                </span>
              </div>

              {/* Line Graph SVG */}
              <div className="relative w-full h-[95px] overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 460 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="thermalTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.32" />
                      <stop offset="55%" stopColor="#f97316" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="#060e20" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="thermalStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="60%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="38" y1="14" x2="455" y2="14" stroke="#1c283e" strokeWidth="0.75" strokeDasharray="3 3" />
                  <line x1="38" y1="38" x2="455" y2="38" stroke="#1c283e" strokeWidth="0.75" strokeDasharray="3 3" />
                  <line x1="38" y1="62" x2="455" y2="62" stroke="#1c283e" strokeWidth="0.75" strokeDasharray="3 3" />
                  <line x1="38" y1="86" x2="455" y2="86" stroke="#1c283e" strokeWidth="0.75" strokeDasharray="3 3" />

                  {/* Vertical Grid lines */}
                  <line x1="45" y1="10" x2="45" y2="90" stroke="#1c283e" strokeWidth="0.75" strokeDasharray="3 3" />
                  <line x1="145" y1="10" x2="145" y2="90" stroke="#1c283e" strokeWidth="0.75" strokeDasharray="3 3" />
                  <line x1="245" y1="10" x2="245" y2="90" stroke="#1c283e" strokeWidth="0.75" strokeDasharray="3 3" />
                  <line x1="345" y1="10" x2="345" y2="90" stroke="#1c283e" strokeWidth="0.75" strokeDasharray="3 3" />
                  <line x1="445" y1="10" x2="445" y2="90" stroke="#1c283e" strokeWidth="0.75" strokeDasharray="3 3" />

                  {/* Y-Axis Labels */}
                  <text x="32" y="17" fill="#727e96" fontSize="9.5" fontFamily="JetBrains Mono, monospace" textAnchor="end">40°C</text>
                  <text x="32" y="41" fill="#727e96" fontSize="9.5" fontFamily="JetBrains Mono, monospace" textAnchor="end">32°C</text>
                  <text x="32" y="65" fill="#727e96" fontSize="9.5" fontFamily="JetBrains Mono, monospace" textAnchor="end">24°C</text>
                  <text x="32" y="89" fill="#727e96" fontSize="9.5" fontFamily="JetBrains Mono, monospace" textAnchor="end">16°C</text>

                  {/* Area fill under curve */}
                  <path
                    d="M 45,74 C 95,71 125,66 145,64 C 185,61 215,56 245,52 C 275,48 290,40 315,40 C 330,40 340,44 355,44 C 385,42 415,34 445,26.6 L 445,86 L 45,86 Z"
                    fill="url(#thermalTrendGrad)"
                  />

                  {/* Temperature curve */}
                  <path
                    d="M 45,74 C 95,71 125,66 145,64 C 185,61 215,56 245,52 C 275,48 290,40 315,40 C 330,40 340,44 355,44 C 385,42 415,34 445,26.6"
                    fill="none"
                    stroke="url(#thermalStrokeGrad)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Current Peak Marker with Glow */}
                  <circle cx="445" cy="26.6" r="7" fill="#ef4444" fillOpacity="0.3" className="animate-pulse" />
                  <circle cx="445" cy="26.6" r="3.2" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" />
                </svg>
              </div>

              {/* X-Axis Timeline Labels */}
              <div className="flex justify-between font-mono text-[10px] text-outline px-7 -mt-1">
                <span>-60s</span>
                <span>-45s</span>
                <span>-30s</span>
                <span>-15s</span>
                <span className="text-on-surface font-semibold">Now</span>
              </div>
            </div>

            {/* 2. THERMAL METRIC CARDS */}
            <div className="grid grid-cols-3 gap-2 font-mono">
              <div className="bg-[#060e20] p-2 rounded-lg border border-outline-variant/30 flex flex-col justify-between">
                <span className="text-[10px] text-outline uppercase font-semibold">PEAK TEMP</span>
                <span className="text-[17px] md:text-[18px] font-bold text-rose-400 mt-0.5">35.8°C</span>
              </div>
              <div className="bg-[#060e20] p-2 rounded-lg border border-outline-variant/30 flex flex-col justify-between">
                <span className="text-[10px] text-outline uppercase font-semibold">AMBIENT</span>
                <span className="text-[17px] md:text-[18px] font-bold text-sky-400 mt-0.5">20.0°C</span>
              </div>
              <div className="bg-[#060e20] p-2 rounded-lg border border-outline-variant/30 flex flex-col justify-between">
                <span className="text-[10px] text-outline uppercase font-semibold">&Delta; TEMP</span>
                <span className="text-[17px] md:text-[18px] font-bold text-amber-400 mt-0.5">+15.8°C</span>
              </div>
            </div>

            {/* 3 & 4 & 5. HOTSPOT TRACKING (X,Y), HOTSPOT AGE, SIGNATURE PERSISTENCE */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-stretch font-mono">
              {/* Hotspot Tracking (X,Y) Grid + Legend (7 COLS) */}
              <div className="sm:col-span-7 bg-[#060e20] p-2.5 rounded-lg border border-outline-variant/30 flex flex-col justify-between gap-1.5">
                <span className="text-[10.5px] text-outline uppercase font-semibold block">
                  HOTSPOT TRACKING (X,Y)
                </span>
                <div className="flex items-center justify-between gap-2.5 my-auto">
                  {/* Coordinate Grid Box */}
                  <div className="w-[105px] h-[78px] shrink-0 bg-[#040813] rounded border border-outline-variant/25 overflow-hidden relative">
                    <svg className="w-full h-full" viewBox="0 0 100 75">
                      {/* Grid lines */}
                      <line x1="20" y1="0" x2="20" y2="75" stroke="#162238" strokeWidth="0.75" />
                      <line x1="40" y1="0" x2="40" y2="75" stroke="#162238" strokeWidth="0.75" />
                      <line x1="60" y1="0" x2="60" y2="75" stroke="#162238" strokeWidth="0.75" />
                      <line x1="80" y1="0" x2="80" y2="75" stroke="#162238" strokeWidth="0.75" />
                      <line x1="0" y1="18" x2="100" y2="18" stroke="#162238" strokeWidth="0.75" />
                      <line x1="0" y1="37" x2="100" y2="37" stroke="#162238" strokeWidth="0.75" />
                      <line x1="0" y1="56" x2="100" y2="56" stroke="#162238" strokeWidth="0.75" />

                      {/* Movement Path (Dotted / Dashed) */}
                      <path
                        d="M 16,62 Q 32,58 48,50 T 74,26"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1.6"
                        strokeDasharray="2.5 2.5"
                        strokeLinecap="round"
                      />

                      {/* Previous Positions */}
                      <circle cx="16" cy="62" r="2.5" fill="#f59e0b" />
                      <circle cx="34" cy="56" r="2.5" fill="#f59e0b" />
                      <circle cx="52" cy="46" r="2.5" fill="#f59e0b" />

                      {/* Current Hotspot Position with Halo Glow */}
                      <circle cx="74" cy="26" r="8" fill="#ef4444" fillOpacity="0.32" className="animate-pulse" />
                      <circle cx="74" cy="26" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col gap-1.5 text-[10px] text-outline font-mono min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                      <span className="truncate">Previous Position</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-500/30 shrink-0"></span>
                      <span className="text-on-surface truncate font-medium">Current Position</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-3.5 h-0.5 border-t border-dashed border-orange-400 shrink-0"></span>
                      <span className="truncate">Movement Path</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hotspot Age & Signature Persistence (5 COLS) */}
              <div className="sm:col-span-5 flex flex-col gap-2">
                <div className="bg-[#060e20] p-2 rounded-lg border border-outline-variant/30 flex flex-col justify-between flex-1">
                  <span className="text-[10px] text-outline uppercase font-semibold">HOTSPOT AGE</span>
                  <span className="text-[16px] md:text-[17px] font-bold text-sky-400 mt-0.5">12.4 sec</span>
                </div>
                <div className="bg-[#060e20] p-2 rounded-lg border border-outline-variant/30 flex flex-col justify-between flex-1">
                  <span className="text-[10px] text-outline uppercase font-semibold">SIGNATURE PERSISTENCE</span>
                  <span className="text-[16px] md:text-[17px] font-bold text-white mt-0.5">87%</span>
                  <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-[#22c55e] h-full rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. THERMAL WARNING PANEL */}
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-lg p-2.5 flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-400 text-[26px] shrink-0">warning</span>
              <div className="flex flex-col min-w-0">
                <span className="font-mono font-bold text-[12px] md:text-[12.5px] text-amber-400 uppercase tracking-wide">
                  PERSISTENT HEAT SOURCE
                </span>
                <span className="text-[11px] md:text-[11.5px] text-on-surface leading-tight">
                  Possible human / equipment source
                </span>
                <span className="text-[11px] md:text-[11.5px] text-amber-300 font-medium leading-tight">
                  Operator verification required
                </span>
              </div>
            </div>
          </section>

          {/* 5. MULTI-SENSOR CORRELATION PIPELINE - 5 COLS */}
          <section className="lg:col-span-5 bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">hub</span>
                <h2 className="font-mono text-[14px] font-semibold text-on-surface uppercase tracking-wider">
                  Multi-Sensor Correlation Engine
                </h2>
              </div>
              <span className="font-mono text-[11.5px] text-outline bg-surface-container px-2.5 py-0.5 rounded border border-outline-variant/30">
                ESP32 SENSOR SUITE
              </span>
            </div>

            {/* Visual Pipeline Flow */}
            <div className="my-2.5 bg-[#060e20] p-2.5 rounded border border-outline-variant/30 font-mono text-[11.5px] space-y-2">
              <div className="flex items-center justify-between gap-1 text-outline">
                <div className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/30 text-on-surface truncate">
                  Gas (MQ/MH-Z19E/SEN0322)
                </div>
                <span>+</span>
                <div className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/30 text-on-surface truncate">
                  Smoke (MQ-2)
                </div>
                <span>+</span>
                <div className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/30 text-on-surface truncate">
                  IR (AMG8833)
                </div>
                <span>+</span>
                <div className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/30 text-on-surface truncate">
                  Water / Sonar
                </div>
              </div>

              <div className="flex items-center justify-center text-primary text-[12px] font-bold">
                <span>&darr; Sensor Trend Analysis &amp; Alert Engine &darr;</span>
              </div>

              <div className="flex items-center justify-between gap-1.5">
                <div className="flex-1 text-center py-1.5 rounded bg-surface-container-high border border-primary/30 text-primary font-semibold truncate">
                  Multi-Sensor Correlation
                </div>
                <span className="text-outline">&rarr;</span>
                <div className="flex-1 text-center py-1.5 rounded bg-tertiary-container/20 border border-tertiary/30 text-tertiary font-semibold truncate">
                  Operator Alert Screen
                </div>
              </div>
            </div>

            {/* Defendable Correlation Case Studies */}
            <div className="space-y-2 font-mono text-[11.5px]">
              {/* Case 1 */}
              <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20">
                <div className="flex items-center justify-between text-tertiary font-semibold mb-1">
                  <span className="flex items-center gap-1 text-[12px]">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>CASE A &bull; POSSIBLE HUMAN / HEAT SIGNATURE
                  </span>
                  <span className="text-amber-400 font-bold text-[11.5px]">VERIFICATION REQ.</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  Thermal anomaly (35.2°C) + Smoke clear (46 AQI) + Gas normal &rarr; <strong className="text-on-surface font-semibold">Possible Human / Heat Signature</strong>. Operator verification required; acoustic hailing via speaker module advised.
                </p>
              </div>

              {/* Case 2 */}
              <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20">
                <div className="flex items-center justify-between text-secondary font-semibold mb-1">
                  <span className="flex items-center gap-1 text-[12px]">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>CASE B &bull; HIGH-RISK THERMAL HAZARD
                  </span>
                  <span className="text-outline text-[11.5px]">STANDBY</span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  Thermal anomaly (&gt;60°C) + Smoke elevated + Temp rising &rarr; <strong className="text-secondary font-semibold">High-Risk Thermal Hazard</strong>. Immediate warning dispatched to operator console.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* 7. RECENT HAZARD EVENTS TABLE */}
        {/* ========================================================================= */}
        <section className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-4 shadow-sm flex flex-col shrink-0 mb-1">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">table_rows</span>
              <h2 className="font-mono text-[14px] font-semibold text-on-surface uppercase tracking-wider">
                Recent Hazard Events &bull; Telemetry Log
              </h2>
            </div>
            <span className="font-mono text-[11.5px] text-outline">
              PAST 60 MINUTES &bull; BUFFER: 6 EVENTS
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left font-mono text-[12px]">
              <thead>
                <tr className="border-b border-outline-variant/30 text-outline text-[11.5px] uppercase bg-surface-container-lowest/50">
                  <th className="py-2.5 px-3 font-semibold">Time</th>
                  <th className="py-2.5 px-3 font-semibold">Hazard Type</th>
                  <th className="py-2.5 px-3 font-semibold">Sensor Source</th>
                  <th className="py-2.5 px-3 font-semibold">Reading</th>
                  <th className="py-2.5 px-3 font-semibold">Severity</th>
                  <th className="py-2.5 px-3 font-semibold">AI Safety Assessment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {recentEvents.map((evt, i) => (
                  <tr key={i} className="hover:bg-surface-container/50 transition-colors">
                    <td className="py-2.5 px-3 text-outline whitespace-nowrap">{evt.time}</td>
                    <td className="py-2.5 px-3 font-semibold text-on-surface whitespace-nowrap text-[12.5px]">{evt.hazard}</td>
                    <td className="py-2.5 px-3 text-primary whitespace-nowrap">{evt.sensor}</td>
                    <td className="py-2.5 px-3 font-bold text-on-surface whitespace-nowrap">{evt.reading}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded text-[11.5px] font-semibold ${evt.severityBadge}`}>
                        {evt.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-on-surface-variant truncate max-w-[380px]">{evt.aiAssessment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* 3. RIGHT HAZARD DISPATCH COLUMN (Collapsible / Expandable Panel) */}
      <aside
        className={`${
          rightPanelCollapsed ? 'w-12' : 'w-[360px]'
        } transition-all duration-300 ease-in-out shrink-0 bg-[#060e20] border-l border-outline-variant/30 flex flex-col h-full overflow-hidden z-20 select-none`}
      >
        {rightPanelCollapsed ? (
          /* COLLAPSED STATE: Slim vertical rail */
          <div
            onClick={() => setRightPanelCollapsed(false)}
            className="flex flex-col items-center justify-between py-3 px-1 h-full w-12 cursor-pointer hover:bg-surface-container-low/60 transition-colors group"
            title="Expand Hazards &amp; Dispatch panel"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setRightPanelCollapsed(false);
              }
            }}
          >
            {/* Top icon and expand button */}
            <div className="flex flex-col items-center gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setRightPanelCollapsed(false);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-surface-container/80 transition-colors border border-outline-variant/30 group-hover:border-primary/50 cursor-pointer"
                title="Expand Hazards &amp; Dispatch"
                aria-label="Expand Hazards &amp; Dispatch"
              >
                <span className="material-symbols-outlined text-[20px] leading-none">chevron_left</span>
              </button>

              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[20px]">warning</span>
                <span className="inline-flex items-center gap-1 font-mono text-[9px] text-tertiary bg-tertiary-container/20 px-1 py-0.2 rounded border border-tertiary/30 font-semibold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  LIVE
                </span>
              </div>
            </div>

            {/* Rotated text label: HAZARDS & DISPATCH */}
            <div className="my-auto py-4 flex items-center justify-center">
              <span
                className="font-mono text-[11px] font-bold tracking-widest uppercase text-outline group-hover:text-on-surface transition-colors select-none whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                HAZARDS &amp; DISPATCH
              </span>
            </div>

            {/* Bottom active count chip */}
            <div className="flex flex-col items-center gap-1.5">
              <span
                className="w-7 h-7 rounded-full bg-secondary-container/20 border border-secondary/40 flex items-center justify-center text-secondary font-mono text-[11px] font-bold"
                title="Unresolved alerts"
              >
                {activeAlerts.filter((a) => !acknowledgedAlerts.includes(a.id)).length}
              </span>
              <span className="material-symbols-outlined text-outline text-[16px] group-hover:text-primary transition-colors">
                dock_to_left
              </span>
            </div>
          </div>
        ) : (
          /* EXPANDED STATE: Full width panel with collapse toggle */
          <div className="w-[360px] flex flex-col h-full overflow-hidden">
            {/* Column Header */}
            <div className="h-12 px-3.5 flex items-center justify-between border-b border-outline-variant/30 bg-[#060e20] shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-primary text-[22px] shrink-0">warning</span>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-bold text-[14px] tracking-wider uppercase text-on-surface leading-none truncate">
                    HAZARDS &amp; DISPATCH
                  </h3>
                  <span className="font-mono text-[11px] text-outline uppercase mt-0.5 truncate">
                    LoRa 433MHz REAL-TIME UPLINK
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-tertiary bg-tertiary-container/20 px-2.5 py-0.5 rounded border border-tertiary/20 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>LIVE
                </span>
                <button
                  type="button"
                  onClick={() => setRightPanelCollapsed(true)}
                  className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container/60 transition-colors flex items-center justify-center cursor-pointer"
                  title="Collapse Hazards &amp; Dispatch panel"
                  aria-label="Collapse Hazards &amp; Dispatch panel"
                >
                  <span className="material-symbols-outlined text-[20px] leading-none">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Scrollable Container for Alerts, Insights and Hardware */}
            <div className="flex-1 overflow-y-auto industrial-scrollbar p-3.5 space-y-3.5 min-h-0">
          {/* ========================================================================= */}
          {/* 6. AI HAZARD PREDICTION & ALERTS (VERTICAL PANEL) */}
          {/* ========================================================================= */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm space-y-3">
            {/* Combined Section Header */}
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">troubleshoot</span>
                <span className="font-mono text-[13.5px] md:text-[14px] font-semibold text-on-surface uppercase tracking-wider">
                  AI HAZARD PREDICTION &amp; ALERTS
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[10px] text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded border border-tertiary/20 font-semibold">
                  CONF 97.4%
                </span>
                <span className="text-[11px] text-outline">
                  {activeAlerts.filter((a) => !acknowledgedAlerts.includes(a.id)).length} UNRESOLVED
                </span>
              </div>
            </div>

            {/* Active Real-Time Hazard Alerts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-outline uppercase font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  Active Hazard Alerts
                </span>
                <span className="text-[10px] text-outline/75 font-normal">Real-Time Sensor Triggers</span>
              </div>
              <div className="space-y-2.5">
                {activeAlerts.map((alt) => {
                  const isAcked = acknowledgedAlerts.includes(alt.id);
                  return (
                    <div
                      key={alt.id}
                      className={`p-3 rounded-lg bg-surface-container/60 border border-outline-variant/20 transition-opacity ${
                        alt.severityColor
                      } ${isAcked ? 'opacity-40 line-through' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded font-mono text-[11.5px] font-bold uppercase ${alt.badgeColor}`}>
                              {alt.severity}
                            </span>
                            <span className="font-mono text-[11.5px] text-outline">{alt.timestamp}</span>
                          </div>
                          <h4 className="font-mono text-[13.5px] font-bold text-on-surface truncate">
                            {alt.hazard}
                          </h4>
                        </div>
                        <button
                          onClick={() => toggleAcknowledge(alt.id)}
                          className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 font-mono text-[11.5px] font-semibold text-on-surface transition-colors shrink-0 shadow-sm cursor-pointer"
                          type="button"
                        >
                          {isAcked ? 'Acked' : 'Ack'}
                        </button>
                      </div>

                      <div className="mt-2 font-mono text-[12px] text-on-surface-variant/90 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-outline">Sensor: {alt.source}</span>
                          <span className="font-semibold text-on-surface">{alt.reading}</span>
                        </div>
                        <p className="text-outline/90 leading-snug text-[11.5px]">{alt.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 8. AI SAFETY INSIGHTS (CONTEXTUAL RECOMMENDATIONS - NOT A CHATBOT) */}
          {/* ========================================================================= */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
                <span className="font-mono text-[14px] font-semibold text-on-surface uppercase tracking-wider">
                  AI Safety Insights
                </span>
              </div>
              <span className="font-mono text-[11.5px] text-tertiary bg-tertiary-container/20 px-2.5 py-0.5 rounded border border-tertiary/20 font-semibold">
                ADVISORY ONLY
              </span>
            </div>

            {[
              {
                icon: 'warning',
                color: 'text-amber-400',
                title: 'Gas Concentration Monitoring',
                text: 'Methane is trending upward (+800 ppm/10m). Rover is under manual control: operator advised to hold position until atmospheric dilution stabilizes below 8,000 ppm.',
              },
              {
                icon: 'person_search',
                color: 'text-orange-400',
                title: 'Possible Human / Heat Signature',
                text: 'Localized heat anomaly (35.2°C) detected ahead. Operator verification required. Consider activating onboard acoustic speaker beacon.',
              },
              {
                icon: 'verified',
                color: 'text-primary',
                title: 'Atmospheric Clearance',
                text: 'Transient smoke spike cleared to baseline (46 AQI). Sensor correlation confirms no combustion hazard.',
              },
            ].map((rec) => (
              <div key={rec.title} className="bg-surface-container/60 p-3 rounded-lg border border-outline-variant/20 flex gap-2.5">
                <span className={`material-symbols-outlined ${rec.color} text-[20px] shrink-0 mt-0.5`}>{rec.icon}</span>
                <div className="font-mono text-[12px]">
                  <span className="font-semibold text-on-surface block text-[13px]">{rec.title}</span>
                  <p className="text-on-surface-variant mt-1 leading-relaxed">&ldquo;{rec.text}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </aside>
    </>
  );
}
