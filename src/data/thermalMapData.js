/**
 * Thermal Map Data Source
 * Provides simulated AMG8833 8x8 IR Grid & DHT22 thermal zones and hotspot markers.
 * Designed with a clean adapter pattern so real sensor hardware telemetry can seamlessly
 * replace the simulated readings when connected.
 */

export const thermalScale = [
  {
    level: 'COOL',
    label: 'COOL',
    range: '< 25°C',
    minTemp: 16,
    maxTemp: 25,
    color: '#38bdf8',
    bgBadge: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    description: 'Fresh air intake / Nominal cooling zone',
  },
  {
    level: 'MODERATE',
    label: 'MODERATE',
    range: '25°C – 30°C',
    minTemp: 25,
    maxTemp: 30,
    color: '#10b981',
    bgBadge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Nominal gallery ambient / Acceptable thermal condition',
  },
  {
    level: 'HIGH',
    label: 'HIGH',
    range: '30°C – 35°C',
    minTemp: 30,
    maxTemp: 35,
    color: '#f97316',
    bgBadge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'Machinery heat buildup / Elevated heat strain zone',
  },
  {
    level: 'CRITICAL',
    label: 'CRITICAL',
    range: '> 35°C',
    minTemp: 35,
    maxTemp: 40,
    color: '#ef4444',
    bgBadge: 'bg-red-500/20 text-red-400 border-red-500/30',
    description: 'Thermal anomaly / Human signature or ignition risk threshold',
  },
];

export const simulatedThermalTelemetry = {
  isSimulated: true,
  source: 'AMG8833_SIMULATED_DEMO',
  hardwareConnected: false,
  timestamp: new Date().toISOString(),
  sensorGrid: 'Panasonic AMG8833 (8x8 IR Array, I2C 0x69)',
  ambientSensor: 'DHT22 Digital Temperature / RH',
  summary: {
    minTemp: 18.9,
    maxTemp: 35.8,
    ambientTemp: 26.8,
    hotspotTemp: 35.2,
    hotspotLocation: 'Sector 4 Drift C (Station 14A)',
  },

  // Hotspots for 2D Cross-Section View (SVG viewBox 0 0 760 520)
  hotspots2D: [
    {
      id: 'hotspot-st14a-2d',
      level: 'CRITICAL',
      temperature: 35.2,
      sensor: 'AMG8833 IR',
      title: 'Station 14A Anomaly',
      location: 'Drift C (-850m)',
      levelKey: 'L3',
      cx: 480,
      cy: 405,
      radius: 55,
      tagX: 430,
      tagY: 368,
      isPrimaryHotspot: true,
    },
    {
      id: 'hotspot-sump-2d',
      level: 'HIGH',
      temperature: 31.4,
      sensor: 'Thermal RTD',
      title: 'Sump Pump Motor',
      location: 'Drainage (-900m)',
      levelKey: 'SUMP',
      cx: 420,
      cy: 476,
      radius: 40,
      tagX: 435,
      tagY: 460,
    },
    {
      id: 'hotspot-hoist-2d',
      level: 'MODERATE',
      temperature: 29.8,
      sensor: 'Shaft Monitor',
      title: 'Hoist Drive Station',
      location: 'Shaft 1 (-620m)',
      levelKey: 'L2',
      cx: 184,
      cy: 240,
      radius: 35,
      tagX: 202,
      tagY: 228,
    },
    {
      id: 'hotspot-refuge-2d',
      level: 'COOL',
      temperature: 22.4,
      sensor: 'Chamber Life-Support',
      title: 'Refuge Chamber B',
      location: 'Station 12 (-850m)',
      levelKey: 'L3',
      cx: 320,
      cy: 385,
      radius: 35,
      tagX: 280,
      tagY: 355,
    },
    {
      id: 'hotspot-surface-2d',
      level: 'COOL',
      temperature: 19.4,
      sensor: 'Portal Weatherhead',
      title: 'Surface Cap Air Intake',
      location: 'Surface (0.0m)',
      levelKey: 'SURFACE',
      cx: 552,
      cy: 80,
      radius: 45,
      tagX: 565,
      tagY: 95,
    },
  ],

  // Hotspots for Top-Down Plan View (SVG viewBox 0 0 760 520)
  hotspotsPlan: [
    {
      id: 'hotspot-st14a-plan',
      level: 'CRITICAL',
      temperature: 35.2,
      sensor: 'AMG8833 IR',
      title: 'Station 14A Methane Face',
      location: 'Drift C Gallery',
      cx: 540,
      cy: 260,
      radius: 65,
      tagX: 475,
      tagY: 215,
      isPrimaryHotspot: true,
    },
    {
      id: 'hotspot-rover-plan',
      level: 'MODERATE',
      temperature: 28.5,
      sensor: 'Onboard MCU Telemetry',
      title: 'Rover R-01 Motor Driver',
      location: 'Heading East (1.8m/s)',
      cx: 410,
      cy: 260,
      radius: 38,
      tagX: 375,
      tagY: 305,
    },
    {
      id: 'hotspot-refuge-plan',
      level: 'COOL',
      temperature: 21.8,
      sensor: 'Chamber Life-Support',
      title: 'Refuge Shelter B Air-lock',
      location: 'Station 12 Stub',
      cx: 220,
      cy: 160,
      radius: 35,
      tagX: 225,
      tagY: 135,
    },
    {
      id: 'hotspot-intake-plan',
      level: 'COOL',
      temperature: 19.6,
      sensor: 'Vent Plenum',
      title: 'Fresh Air Crosscut Intake',
      location: 'West Portal Feed',
      cx: 140,
      cy: 260,
      radius: 45,
      tagX: 130,
      tagY: 225,
    },
  ],
};

/**
 * Adapter to retrieve current thermal dataset.
 * If backend hardware data becomes available in live telemetry, this merges it cleanly.
 */
export function getThermalData(liveTelemetry = null) {
  if (liveTelemetry?.amg8833 && !liveTelemetry.isDemo) {
    return {
      ...simulatedThermalTelemetry,
      isSimulated: false,
      hardwareConnected: true,
      summary: {
        ...simulatedThermalTelemetry.summary,
        ambientTemp: liveTelemetry.temperature?.value ?? 26.8,
        hotspotTemp: liveTelemetry.amg8833.maxTemp ?? 35.2,
      },
    };
  }
  return simulatedThermalTelemetry;
}
