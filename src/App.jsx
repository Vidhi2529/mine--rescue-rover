import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RoutePage from './pages/Route';
import HazardIntel from './pages/HazardIntel';
import EvacRefuge from './pages/EvacRefuge';
import IncidentBlackBox from './pages/IncidentBlackBox';
import RoverControl from './pages/RoverControl';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mine-map" element={<RoutePage />} />
          <Route path="/hazard-intel" element={<HazardIntel />} />
          <Route path="/evac-refuge" element={<EvacRefuge />} />
          <Route path="/incident-box" element={<IncidentBlackBox />} />
          <Route path="/incident-blackbox" element={<IncidentBlackBox />} />
          <Route path="/rover-control" element={<RoverControl />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

