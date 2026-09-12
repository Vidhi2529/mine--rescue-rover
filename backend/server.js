import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// ---------------------------------------------------------------------------
// MIDDLEWARE
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: [FRONTEND_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// ---------------------------------------------------------------------------
// IN-MEMORY STATE (DEMO / SIMULATION DEFAULTS)
// Note: ESP32 hardware is not connected yet; all values are marked as DEMO.
// ---------------------------------------------------------------------------
let currentTelemetry = {
  isDemo: true,
  source: 'SIMULATED_DEMO_DATA',
  timestamp: new Date().toISOString(),
  roverId: 'ROVER-R01',
  ch4: {
    value: 1.15,
    unit: '%',
    sensor: 'MQ-4 Analog',
    status: 'WARNING',
    threshold: 1.0,
  },
  co: {
    value: 14,
    unit: 'PPM',
    sensor: 'MQ-7 Sensor',
    status: 'SAFE',
    limit: 35,
  },
  temperature: {
    value: 26.8,
    unit: '°C',
    sensor: 'DHT22 Digital',
    status: 'NORMAL',
  },
  humidity: {
    value: 68,
    unit: '% RH',
    sensor: 'DHT22 Digital',
    status: 'NORMAL',
  },
  battery: {
    level: 88,
    voltage: 12.1,
    unit: '%',
    status: 'OPTIMAL',
  },
  speed: {
    current: 0.8,
    unit: 'm/s',
    mode: 'MANUAL TELEOP',
  },
  pitch: {
    value: -2.1,
    unit: 'deg',
    sensor: 'MPU6050 6-DOF IMU',
    stability: 'STABLE',
  },
  roll: {
    value: 0.8,
    unit: 'deg',
    sensor: 'MPU6050 6-DOF IMU',
    stability: 'STABLE',
  },
  gps: {
    lat: 23.7957,
    lng: 86.4304,
    altitude: -142,
    unit: 'm (Sub-Surface Est)',
    fix: '3D-DGPS',
  },
  obstacleDistance: {
    distance: 1.8,
    unit: 'm',
    sensor: 'HC-SR04 Forward Sonar',
    warningThreshold: 0.6,
    status: 'CLEAR',
  },
  loraStatus: {
    connected: true,
    frequency: '433.0 MHz (Ch 01)',
    transceiver: 'SX1278',
    rssi: -94,
    rssiUnit: 'dBm',
    packetRate: '1.0 Hz',
    failSafe: 'ARMED',
    deadmanTimeoutMs: 1500,
  },
};

let victimDetectionData = {
  isDemo: true,
  source: 'SIMULATED_DEMO_DATA',
  timestamp: new Date().toISOString(),
  peopleDetected: 1,
  possibleInjured: 1,
  confidence: '94.2%',
  status: 'POSSIBLE_VICTIM',
  notes: 'AI Vision thermal/pose correlation flags possible immobile survivor. Operator verification advised.',
};

const alertHistory = [];

// ---------------------------------------------------------------------------
// 1. HEALTH CHECK ENDPOINT
// ---------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mode: 'DEMO',
    service: 'Mine Rescue Rover Telemetry Gateway',
    version: '1.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// 2. TELEMETRY READ ENDPOINT
// ---------------------------------------------------------------------------
app.get('/api/telemetry', (req, res) => {
  res.json({
    ...currentTelemetry,
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// 3. VICTIM DETECTION READ ENDPOINT
// ---------------------------------------------------------------------------
app.get('/api/victims', (req, res) => {
  res.json({
    ...victimDetectionData,
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// 4. TELEMETRY INGESTION ENDPOINT
// ===========================================================================
// FUTURE ESP32 + LORA HARDWARE INTEGRATION POINT:
//
// When physical hardware is deployed:
// 1. The base-station receiver (ESP32 + SX1278 LoRa 433MHz module) receives
//    sub-GHz RF packets transmitted from the rover in the mine shaft.
// 2. An edge gateway script (e.g. Serial-to-HTTP or ESP32 Wi-Fi HTTP client)
//    unpacks the binary telemetry struct and issues HTTP POST /api/telemetry.
// 3. Incoming values update `currentTelemetry` in real time, switching
//    `isDemo: false` and `source: 'ESP32_LORA_GATEWAY'`.
// ===========================================================================
app.post('/api/telemetry', (req, res) => {
  const payload = req.body;

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({
      error: 'Invalid telemetry payload. Expected JSON object.',
    });
  }

  // Update in-memory telemetry with live or simulated incoming data
  currentTelemetry = {
    ...currentTelemetry,
    ...payload,
    isDemo: payload.isDemo !== undefined ? payload.isDemo : false,
    source: payload.source || 'EXTERNAL_INGESTION_GATEWAY',
    timestamp: new Date().toISOString(),
  };

  res.status(200).json({
    status: 'SUCCESS',
    message: 'Telemetry data ingested successfully.',
    updatedTimestamp: currentTelemetry.timestamp,
  });
});

// ---------------------------------------------------------------------------
// 5. ALERTS INGESTION ENDPOINT
// Accepts hazard, threshold breach, or victim alert events.
// ---------------------------------------------------------------------------
app.post('/api/alerts', (req, res) => {
  const alert = req.body;

  if (!alert || !alert.type) {
    return res.status(400).json({
      error: 'Invalid alert payload. Requires at least an alert "type".',
    });
  }

  const alertRecord = {
    id: `ALERT-${Date.now()}`,
    isDemo: alert.isDemo !== undefined ? alert.isDemo : true,
    type: alert.type,
    severity: alert.severity || 'WARNING',
    message: alert.message || 'Hazard alert detected',
    source: alert.source || 'TELEMETRY_ENGINE',
    timestamp: new Date().toISOString(),
    acknowledged: false,
  };

  alertHistory.unshift(alertRecord);
  // Keep last 50 alerts in volatile buffer
  if (alertHistory.length > 50) alertHistory.pop();

  res.status(201).json({
    status: 'SUCCESS',
    message: 'Alert registered successfully.',
    alert: alertRecord,
  });
});

// ---------------------------------------------------------------------------
// START SERVER
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[ROVER BACKEND] Server running on http://localhost:${PORT}`);
  console.log(`[ROVER BACKEND] Mode: DEMO / SIMULATION`);
  console.log(`[ROVER BACKEND] CORS enabled for: ${FRONTEND_ORIGIN}`);
});
