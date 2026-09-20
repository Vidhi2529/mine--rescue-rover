// Rover Manual Teleoperation & Hardware Data
// Underground Mine Rescue Rover Teleoperation System
// Hardware: ESP32 + CYTRON MDD20A Motor Driver + Tracked Tank Chassis + SX1278 LoRa (433MHz)

export const initialDriveStatus = {
  driveMode: 'MANUAL',
  motorDriver: 'CYTRON MDD20A',
  motorStatus: 'STOPPED',
  currentMovement: 'STOPPED',
  speedLevel: 'Medium', // Low | Medium | High
  speedPwm: {
    Low: '35% PWM',
    Medium: '65% PWM',
    High: '90% PWM',
  },
  heading: '164° SSE',
  pitch: '-2.1°',
  roll: '+0.8°',
};

export const speakerPresets = [
  {
    id: 'msg-1',
    code: 'INST-01',
    label: 'Rescue Approaching',
    text: 'Remain calm. Rescue team is approaching.',
  },
  {
    id: 'msg-2',
    code: 'INST-02',
    label: 'Move to Refuge',
    text: 'Move toward the marked refuge point.',
  },
  {
    id: 'msg-3',
    code: 'INST-03',
    label: 'Avoid Hazard Zone',
    text: 'Avoid the hazardous tunnel section.',
  },
  {
    id: 'msg-4',
    code: 'INST-04',
    label: 'Hold in Place',
    text: 'Stay in your current safe location.',
  },
];

export const liveSensorSnapshotData = [
  {
    id: 'ch4',
    label: 'CH4 METHANE',
    sensor: 'MQ-4 Gas Sensor',
    value: '1.15%',
    status: 'WARNING',
    statusClass: 'text-amber-400 bg-amber-950/30 border-amber-600/40',
    threshold: 'Warn >1.00%, Crit >1.50%',
  },
  {
    id: 'co',
    label: 'CARBON MONOXIDE',
    sensor: 'MQ-7 Gas Sensor',
    value: '14 PPM',
    status: 'NORMAL',
    statusClass: 'text-emerald-400 bg-emerald-950/30 border-emerald-600/40',
    threshold: 'Safe <25 PPM',
  },
  {
    id: 'h2s',
    label: 'HYDROGEN SULFIDE',
    sensor: 'MQ-136 Gas Sensor',
    value: '1.8 PPM',
    status: 'NORMAL',
    statusClass: 'text-emerald-400 bg-emerald-950/30 border-emerald-600/40',
    threshold: 'Safe <5.0 PPM',
  },
  {
    id: 'o2',
    label: 'OXYGEN CONTENT',
    sensor: 'Dedicated Electrochemical',
    value: '20.5%',
    status: 'SAFE',
    statusClass: 'text-emerald-400 bg-emerald-950/30 border-emerald-600/40',
    threshold: 'Min 19.5%',
  },
  {
    id: 'smoke',
    label: 'SMOKE / PARTICLES',
    sensor: 'MQ-2 Sensor',
    value: '42 AQI',
    status: 'NOMINAL',
    statusClass: 'text-emerald-400 bg-emerald-950/30 border-emerald-600/40',
    threshold: 'Baseline 30-50',
  },
  {
    id: 'air_quality',
    label: 'AIR QUALITY / NH3',
    sensor: 'MQ-135 Multi-Gas',
    value: '0.24 PPM',
    status: 'SAFE',
    statusClass: 'text-emerald-400 bg-emerald-950/30 border-emerald-600/40',
    threshold: 'Safe <0.50 PPM',
  },
  {
    id: 'temp',
    label: 'AMBIENT TEMP',
    sensor: 'DHT22 Digital',
    value: '26.8°C',
    status: 'NORMAL',
    statusClass: 'text-sky-400 bg-sky-950/30 border-sky-600/40',
    threshold: 'Gallery Drift C',
  },
  {
    id: 'humidity',
    label: 'RELATIVE HUMIDITY',
    sensor: 'DHT22 Digital',
    value: '68% RH',
    status: 'NORMAL',
    statusClass: 'text-sky-400 bg-sky-950/30 border-sky-600/40',
    threshold: 'Moisture baseline',
  },
  {
    id: 'thermal',
    label: 'THERMAL MAX',
    sensor: 'AMG8833 8x8 IR Array',
    value: '35.2°C',
    status: 'ANOMALY',
    statusClass: 'text-orange-400 bg-orange-950/30 border-orange-600/40',
    threshold: 'Hotspot Δ +15.8°C',
  },
  {
    id: 'lora',
    label: 'LoRa SIGNAL RSSI',
    sensor: 'SX1278 433.0 MHz',
    value: '-94 dBm',
    status: 'STABLE',
    statusClass: 'text-sky-400 bg-sky-950/30 border-sky-600/40',
    threshold: 'SNR +9.2 dB',
  },
];

export const systemHardwareModules = [
  { name: 'ESP32 Main MCU', role: 'Dual-core 240MHz System Controller', status: 'ONLINE', color: 'text-emerald-400' },
  { name: 'MPU6050 IMU', role: '6-Axis Gyro & Accelerometer (Pitch/Roll)', status: 'ONLINE', color: 'text-emerald-400' },
  { name: 'CYTRON MDD20A Driver', role: 'Dual Channel Motor Control', status: 'ACTIVE', color: 'text-emerald-400' },
  { name: 'Drive Motors', role: 'Twin DC Geared Tank Tracks', status: 'READY', color: 'text-emerald-400' },
  { name: 'LoRa Transceiver', role: 'SX1278 433.0 MHz RF Link', status: 'ONLINE', color: 'text-emerald-400' },
  { name: 'Gas Sensor Array', role: 'MQ-4, MQ-7, MQ-135, MQ-136, O2', status: 'ONLINE', color: 'text-emerald-400' },
  { name: 'Thermal IR Sensor', role: 'AMG8833 8x8 IR Grid (I2C)', status: 'ACTIVE', color: 'text-emerald-400' },
  { name: 'Ultrasonic Sonar', role: 'HC-SR04 Forward Ranging', status: 'ONLINE', color: 'text-emerald-400' },
  { name: 'Speaker Module', role: '1-Way Audio Downlink (PA Amp)', status: 'READY', color: 'text-emerald-400' },
  { name: '18650 Battery Pack', role: '3S Li-ion 11.8V (78% Remaining)', status: 'ACTIVE', color: 'text-emerald-400' },
];

export const mpu6050Data = {
  pitch: '-2.1°',
  roll: '+0.8°',
  tilt: '2.2°',
  impact: '0.08 G (Nominal)',
  rolloverRisk: 'Low',
  stability: 'Stable',
};

export const demoVictimDetection = {
  peopleDetected: 1,
  possibleInjured: 1,
  confidence: '94.2%',
};

// 8x8 AMG8833 thermal grid data (°C) - Ambient ~18-22°C with localized anomaly at center (34-35.8°C)
export const amg8833ThermalGrid = [
  [19.1, 19.4, 19.8, 20.1, 20.4, 20.2, 19.7, 19.2],
  [19.3, 19.9, 20.8, 21.5, 21.9, 21.2, 20.3, 19.5],
  [19.6, 20.4, 22.1, 26.8, 28.5, 24.1, 21.0, 19.8],
  [19.8, 20.9, 24.5, 33.4, 35.2, 29.8, 22.4, 20.1],
  [19.7, 21.2, 25.1, 34.8, 35.8, 30.6, 23.1, 20.3],
  [19.5, 20.6, 22.8, 27.9, 29.4, 25.0, 21.7, 19.9],
  [19.2, 19.8, 20.9, 22.0, 22.8, 21.6, 20.5, 19.4],
  [18.9, 19.2, 19.6, 20.2, 20.7, 20.1, 19.6, 19.0],
];

export const getThermalCellColor = (t) => {
  if (t >= 34) return '#ef4444'; // Red - Thermal Hotspot
  if (t >= 30) return '#ea580c'; // Orange - Elevated
  if (t >= 26) return '#d97707'; // Amber - Warm
  if (t >= 23) return '#0284c7'; // Sky - Mild
  if (t >= 21) return '#1e40af'; // Deep Blue - Cool
  return '#1e293b';             // Slate - Ambient mine wall
};


