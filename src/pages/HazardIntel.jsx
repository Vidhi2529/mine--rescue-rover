import { useState } from 'react';

export default function HazardIntel() {
  // Environmental Trend Analysis active metric
  const [activeMetric, setActiveMetric] = useState('CH4');

  // Thermal grid selected cell state (row, col)
  const [selectedCell, setSelectedCell] = useState({ r: 3, c: 4, temp: 35.2 });

  // Active alerts acknowledgment state
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);

  const toggleAcknowledge = (id) => {
    setAcknowledgedAlerts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 8x8 AMG8833 thermal grid data (°C)
  // Ambient mine gallery ~ 18-22°C; Localized thermal anomaly at center-right (r: 3-4, c: 4-5) reading 34-35.8°C
  const thermalGrid = [
    [19.1, 19.4, 19.8, 20.1, 20.4, 20.2, 19.7, 19.2],
    [19.3, 19.9, 20.8, 21.5, 21.9, 21.2, 20.3, 19.5],
    [19.6, 20.4, 22.1, 26.8, 28.5, 24.1, 21.0, 19.8],
    [19.8, 20.9, 24.5, 33.4, 35.2, 29.8, 22.4, 20.1],
    [19.7, 21.2, 25.1, 34.8, 35.8, 30.6, 23.1, 20.3],
    [19.5, 20.6, 22.8, 27.9, 29.4, 25.0, 21.7, 19.9],
    [19.2, 19.8, 20.9, 22.0, 22.8, 21.6, 20.5, 19.4],
    [18.9, 19.2, 19.6, 20.2, 20.7, 20.1, 19.6, 19.0],
  ];

  // Helper for thermal cell color mapping
  const getCellBg = (t) => {
    if (t >= 34) return 'bg-[#ef4444] text-white font-bold'; // Red - Thermal Hotspot
    if (t >= 30) return 'bg-[#ea580c] text-white font-bold'; // Orange - Elevated
    if (t >= 26) return 'bg-[#d97707] text-white';           // Amber - Warm
    if (t >= 23) return 'bg-[#0284c7] text-white';           // Sky - Mild
    if (t >= 21) return 'bg-[#1e40af] text-sky-200';        // Deep Blue - Cool
    return 'bg-[#1e293b] text-outline';                      // Slate - Ambient mine wall
  };

  // Trend analysis datasets for 30-min window
  const trendData = {
    CH4: {
      name: 'CH4 Methane',
      sensor: 'MQ-4 Gas Sensor (Analog)',
      unit: '%',
      current: '1.15%',
      normal: '0.00% – 0.75%',
      warning: '1.00%',
      critical: '1.50% (Evac Threshold)',
      status: 'WARNING',
      statusColor: 'text-amber-400 bg-amber-950/20 border-amber-500/30',
      strokeColor: '#f59e0b',
      fillGradId: 'grad-ch4',
      points: [
        { x: 30, y: 110, val: '0.72%' },
        { x: 110, y: 102, val: '0.78%' },
        { x: 190, y: 92, val: '0.85%' },
        { x: 270, y: 78, val: '0.94%' },
        { x: 350, y: 64, val: '1.02%' },
        { x: 430, y: 48, val: '1.10%' },
        { x: 510, y: 38, val: '1.15%' },
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
      sensor: 'Dedicated Electrochemical O2',
      unit: '%',
      current: '20.8%',
      normal: '20.5% – 21.0%',
      warning: '< 19.8%',
      critical: '< 19.5% (Oxygen Deficient)',
      status: 'SAFE',
      statusColor: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
      strokeColor: '#93ccff',
      fillGradId: 'grad-o2',
      points: [
        { x: 30, y: 44, val: '20.9%' },
        { x: 110, y: 46, val: '20.9%' },
        { x: 190, y: 48, val: '20.8%' },
        { x: 270, y: 52, val: '20.7%' },
        { x: 350, y: 50, val: '20.8%' },
        { x: 430, y: 48, val: '20.8%' },
        { x: 510, y: 48, val: '20.8%' },
      ],
      pathD: 'M 30,44 L 110,46 L 190,48 L 270,52 L 350,50 L 430,48 L 510,48',
      areaD: 'M 30,44 L 110,46 L 190,48 L 270,52 L 350,50 L 430,48 L 510,48 L 510,140 L 30,140 Z',
      warningY: 90,
      criticalY: 115,
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
      reading: '1.15% (Warning >1.00%, Crit >1.50%)',
      timestamp: '14:31:12 UTC',
      detail: 'Gradual climb detected (+0.08%/10m). Operator advised to hold progression and observe dilution.',
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
      reading: '1.15%',
      severity: 'WARNING',
      severityBadge: 'text-amber-400 bg-amber-950/40 border border-amber-800/40',
      aiAssessment: 'Upward trend (+0.08%/10m); operator advised to hold position until level stabilizes.',
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
      sensor: 'Dedicated O2',
      reading: '19.7%',
      severity: 'CAUTION',
      severityBadge: 'text-yellow-400 bg-yellow-950/40 border border-yellow-800/40',
      aiAssessment: 'Localized O2 dip near 19.8% warning line; operator advised to track trend.',
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
  ];

  return (
    <>
      {/* 2. CENTER COLUMN: PRIMARY HAZARD WORKSPACE */}
      <main className="flex-1 min-w-0 bg-[#0b1326] p-3.5 flex flex-col gap-3 overflow-y-auto industrial-scrollbar">
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
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-tertiary-container/20 border border-tertiary/30 text-tertiary font-mono text-[12px] font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              LIVE ANALYSIS &bull; SX1278 433MHz
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. LIVE SENSOR SUMMARY (6 COMPACT CARDS) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 w-full shrink-0">
          {[
            {
              title: <>CH4 &bull; Methane</>,
              sensor: 'MQ-4 Analog',
              status: 'WARNING',
              badge: 'text-amber-400 bg-amber-950/30 border-amber-600/40',
              val: '1.15%',
              valClass: 'text-[21px] font-bold font-mono text-amber-400',
              delta: <>&Delta; +0.08%/10m &uarr;</>,
              deltaClass: 'font-mono text-[11.5px] text-amber-400 flex items-center gap-0.5',
              footL: 'Threshold: 1.00%',
              footR: 'Elevated',
              footRClass: 'text-amber-400 font-medium',
            },
            {
              title: <>CO &bull; Carbon Mon</>,
              sensor: 'MQ-7 Sensor',
              status: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '14 PPM',
              valClass: 'text-[21px] font-bold font-mono text-tertiary',
              delta: <>&Delta; -2 PPM &darr;</>,
              deltaClass: 'font-mono text-[11.5px] text-tertiary flex items-center gap-0.5',
              footL: 'Limit: 35 PPM',
              footR: 'Stable',
              footRClass: 'text-tertiary font-medium',
            },
            {
              title: <>H2S &bull; Hyd Sulfide</>,
              sensor: 'MQ-136 Sensor',
              status: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '1.8 PPM',
              valClass: 'text-[21px] font-bold font-mono text-tertiary',
              delta: <>&Delta; 0.0 &mdash;</>,
              deltaClass: 'font-mono text-[11.5px] text-outline flex items-center gap-0.5',
              footL: 'Limit: 10 PPM',
              footR: 'Nominal',
              footRClass: 'text-tertiary font-medium',
            },
            {
              title: <>O2 &bull; Oxygen Level</>,
              sensor: 'Dedicated O2 Cell',
              status: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '20.8%',
              valClass: 'text-[21px] font-bold font-mono text-primary',
              delta: <>&Delta; 0.0 &mdash;</>,
              deltaClass: 'font-mono text-[11.5px] text-outline flex items-center gap-0.5',
              footL: 'Safe: >19.5%',
              footR: 'Optimal',
              footRClass: 'text-tertiary font-medium',
            },
            {
              title: 'Smoke / AQ',
              sensor: 'MQ-2 + MQ-135',
              status: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '46 AQI',
              valClass: 'text-[21px] font-bold font-mono text-tertiary',
              delta: <>&Delta; -4 AQI &darr;</>,
              deltaClass: 'font-mono text-[11.5px] text-tertiary flex items-center gap-0.5',
              footL: 'Baseline: <50 AQI',
              footR: 'Clear',
              footRClass: 'text-tertiary font-medium',
            },
            {
              title: 'Environment',
              sensor: 'DHT22 Digital',
              status: 'SAFE',
              badge: 'text-tertiary bg-tertiary-container/20 border-tertiary/30',
              val: '26.8°C',
              valClass: 'text-[19px] font-bold font-mono text-on-surface',
              delta: '68% RH',
              deltaClass: 'font-mono text-[13.5px] text-outline',
              footL: 'Dew Point: 20.4°C',
              footR: 'Normal',
              footRClass: 'text-tertiary font-medium',
            },
          ].map((c, idx) => (
            <div
              key={idx}
              className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3 shadow-sm flex flex-col justify-between min-h-[115px]"
            >
              <div className="flex items-start justify-between gap-1">
                <div>
                  <span className="font-mono text-[13px] font-bold text-on-surface uppercase block">{c.title}</span>
                  <span className="font-mono text-[11.5px] text-outline block">{c.sensor}</span>
                </div>
                <span className={`font-mono text-[11.5px] ${c.badge} border px-2 py-0.5 rounded font-semibold`}>
                  {c.status}
                </span>
              </div>
              <div className="my-1 flex items-baseline justify-between">
                <span className={c.valClass}>{c.val}</span>
                <span className={c.deltaClass}>{c.delta}</span>
              </div>
              <div className="pt-1 border-t border-outline-variant/20 flex items-center justify-between text-[11.5px] font-mono text-outline">
                <span>{c.footL}</span>
                <span className={c.footRClass}>{c.footR}</span>
              </div>
            </div>
          ))}
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
                &ldquo;Methane concentration is gradually increasing (+0.08%/10m) while smoke and ambient temperatures remain stable. Rover is manually controlled: operator advised to hold position and monitor atmospheric dilution.&rdquo;
              </p>
            </div>

            {/* AI Trend Correlation Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-[11.5px]">
              <span className="px-2.5 py-1 rounded bg-amber-950/30 border border-amber-600/40 text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Gas Trend: +0.08%/10m Rising
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
              {['CH4', 'CO', 'H2S', 'O2', 'Temperature', 'Humidity'].map((m) => (
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
          {/* 4. THERMAL INTELLIGENCE (AMG8833 8x8 IR GRID) - 7 COLS */}
          <section className="lg:col-span-7 bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">thermostat</span>
                <div className="flex flex-col">
                  <h2 className="font-mono text-[14px] font-semibold text-on-surface uppercase tracking-wider leading-none">
                    Thermal Intelligence &bull; AMG8833 8x8 IR
                  </h2>
                  <span className="font-mono text-[11.5px] text-outline uppercase mt-0.5">
                    64-Pixel Infrared Grid Array &bull; I2C Frame
                  </span>
                </div>
              </div>
              <span className="font-mono text-[12px] text-orange-300 bg-orange-950/40 border border-orange-600/40 px-2.5 py-0.5 rounded font-semibold">
                HEAT SIGNATURE DETECTED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 my-2.5 items-center">
              {/* 8x8 Thermal Grid Visualizer */}
              <div className="sm:col-span-6 flex flex-col items-center">
                <div className="grid grid-cols-8 gap-1 p-2 bg-[#060e20] rounded-lg border border-outline-variant/40 shadow-inner w-full aspect-square max-w-[225px]">
                  {thermalGrid.map((row, rIdx) =>
                    row.map((temp, cIdx) => {
                      const isSelected = selectedCell.r === rIdx && selectedCell.c === cIdx;
                      return (
                        <button
                          key={`${rIdx}-${cIdx}`}
                          onClick={() => setSelectedCell({ r: rIdx, c: cIdx, temp })}
                          className={`rounded-sm flex items-center justify-center transition-transform hover:scale-110 font-mono text-[10.5px] ${getCellBg(
                            temp
                          )} ${isSelected ? 'ring-2 ring-white scale-105 z-10' : ''}`}
                          title={`Cell (${rIdx},${cIdx}): ${temp}°C`}
                          type="button"
                        >
                          {Math.round(temp)}
                        </button>
                      );
                    })
                  )}
                </div>
                {/* Heat Scale Legend */}
                <div className="flex items-center justify-between w-full max-w-[225px] mt-2 font-mono text-[11px] text-outline">
                  <span>18°C [Wall]</span>
                  <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-slate-800 via-sky-600 via-amber-500 to-red-500"></div>
                  <span className="text-red-400 font-semibold">36°C [Hotspot]</span>
                </div>
              </div>

              {/* Thermal Diagnostics & Selected Cell Inspector */}
              <div className="sm:col-span-6 flex flex-col gap-2 font-mono text-[12px]">
                <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-outline uppercase text-[11.5px]">Selected Pixel ({selectedCell.r}, {selectedCell.c})</span>
                  <span className="text-[14.5px] font-bold text-on-surface">{selectedCell.temp}°C</span>
                </div>
                <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-outline uppercase text-[11.5px]">Max Detected Temp</span>
                  <span className="text-red-400 font-bold text-[14.5px]">35.8°C (Δ +15.8°C)</span>
                </div>
                <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-outline uppercase text-[11.5px]">Classification</span>
                  <span className="text-orange-300 font-semibold text-[12px]">Possible Human / Heat Signature</span>
                </div>
                <div className="bg-surface-container/60 p-2.5 rounded border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-outline uppercase text-[11.5px]">Protocol Action</span>
                  <span className="text-amber-300 font-medium text-[12px]">Operator verification required</span>
                </div>

                {/* AI Rule Caution Callout */}
                <div className="bg-surface-container-high/60 p-2.5 rounded border border-primary/20 text-[11.5px] text-on-surface-variant leading-snug">
                  <span className="text-primary font-semibold block">Thermal Interpretation Rule:</span>
                  <span>Heat signatures are classified as potential human presence only with multi-sensor correlation (Smoke = 0, Temp &le; 37°C). Final identification requires manual operator inspection.</span>
                </div>
              </div>
            </div>

            {/* AI Correlation Assessment Bar */}
            <div className="bg-surface-container/70 p-2.5 rounded border border-outline-variant/25 font-mono text-[12px] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-outline">CORRELATION:</span>
                <span className="text-on-surface">Thermal (35.2°C) + Ambient (26.8°C) + Smoke (Clear) + Gas (Normal)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-outline">&rarr;</span>
                <span className="px-2 py-0.5 rounded bg-orange-950/40 text-orange-300 border border-orange-600/40 font-bold text-[11.5px]">
                  POSSIBLE HUMAN / HEAT SIGNATURE
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
                  Gas (MQ-4/7/136)
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
                  Sonar
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

      {/* 3. RIGHT HAZARD DISPATCH COLUMN (Width 360px - Generous Readability) */}
      <aside className="w-[360px] shrink-0 bg-[#060e20] border-l border-outline-variant/30 flex flex-col h-full overflow-hidden z-20 select-none">
        {/* Column Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-outline-variant/30 bg-[#060e20] shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">warning</span>
            <div className="flex flex-col">
              <h3 className="font-bold text-[14px] tracking-wider uppercase text-on-surface leading-none">
                HAZARDS &amp; DISPATCH
              </h3>
              <span className="font-mono text-[11.5px] text-outline uppercase mt-0.5">
                LoRa 433MHz REAL-TIME UPLINK
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-tertiary bg-tertiary-container/20 px-2.5 py-0.5 rounded border border-tertiary/20 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>LIVE
          </span>
        </div>

        {/* Scrollable Container for Alerts, Insights and Hardware */}
        <div className="flex-1 overflow-y-auto industrial-scrollbar p-3.5 space-y-3.5 min-h-0">
          {/* ========================================================================= */}
          {/* 6. ACTIVE HAZARD ALERTS (VERTICAL PANEL) */}
          {/* ========================================================================= */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">notifications_active</span>
                <span className="font-mono text-[14px] font-semibold text-on-surface uppercase tracking-wider">
                  Active Hazard Alerts
                </span>
              </div>
              <span className="font-mono text-[11.5px] text-outline">
                {activeAlerts.filter((a) => !acknowledgedAlerts.includes(a.id)).length} UNRESOLVED
              </span>
            </div>

            {/* Alert Items */}
            <div className="space-y-2.5">
              {activeAlerts.map((alt) => {
                const isAcked = acknowledgedAlerts.includes(alt.id);
                return (
                  <div
                    key={alt.id}
                    className={`p-3 rounded-lg bg-surface-container/60 border border-outline-variant/20 transition-opacity ${alt.severityColor
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
                        className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 font-mono text-[11.5px] font-semibold text-on-surface transition-colors shrink-0 shadow-sm"
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
                text: 'Methane is trending upward (+0.08%/10m). Rover is under manual control: operator advised to hold position until atmospheric dilution stabilizes below 0.80%.',
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

          {/* HARDWARE SPECIFICATION & TELEOPERATION FAILSAFE CARD */}
          <div className="bg-surface-container-low/90 border border-outline-variant/30 rounded-lg p-3.5 shadow-sm space-y-2 font-mono text-[12px]">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 text-outline">
              <span className="uppercase font-semibold flex items-center gap-1.5 text-[13px]">
                <span className="material-symbols-outlined text-[18px] text-tertiary">memory</span>
                HARDWARE &amp; LORA TELEMETRY
              </span>
              <span className="text-tertiary text-[11.5px] font-semibold">ESP32 &bull; SX1278</span>
            </div>
            <div className="space-y-1.5 text-on-surface-variant text-[12px]">
              <div className="flex justify-between">
                <span className="text-outline">LoRa RF Link:</span>
                <span className="text-primary font-semibold">433.0 MHz &bull; -94 dBm (Stable)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Microcontroller:</span>
                <span className="text-on-surface font-semibold">ESP32 Dual-Core (FreeRTOS)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Motor Driver:</span>
                <span className="text-on-surface">TB6612FNG &bull; Dual DC Geared</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Battery Pack:</span>
                <span className="text-tertiary font-semibold">18650 Li-ion 4S &bull; 88% (14.8V)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Sonar Clearance:</span>
                <span className="text-primary font-semibold">HC-SR04 &bull; 1.85m Ahead</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Control Mode:</span>
                <span className="text-primary font-bold">100% MANUAL TELEOPERATION</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-outline-variant/20 bg-red-950/20 p-2.5 rounded border border-red-900/30 text-red-300 text-[11.5px] leading-relaxed">
              <strong>FAILSAFE BRAKE:</strong> On LoRa link interruption (&gt;1,500ms), TB6612FNG automatically triggers immediate motor deadman STOP.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
