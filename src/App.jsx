import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HazardIntel from './pages/HazardIntel';
import EvacRefuge from './pages/EvacRefuge';
import RoverControl from './pages/RoverControl';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mine-map" element={<Navigate to="/hazard-intel" replace />} />
          <Route path="/hazard-intel" element={<HazardIntel />} />
          <Route path="/evac-refuge" element={<EvacRefuge />} />
          <Route path="/rover-control" element={<RoverControl />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

