import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HazardIntel from './pages/HazardIntel';
import EvacRefuge from './pages/EvacRefuge';
import RoverControl from './pages/RoverControl';
import Settings from './pages/Settings';
import Login from './pages/Login';

function ProtectedRoute({ children }) {
  const isAuthenticated =
    sessionStorage.getItem('understone_authenticated') === 'true' ||
    localStorage.getItem('understone_authenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/mine-map" element={<Navigate to="/hazard-intel" replace />} />
          <Route path="/hazard-intel" element={<HazardIntel />} />
          <Route path="/evac-refuge" element={<EvacRefuge />} />
          <Route path="/rover-control" element={<RoverControl />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


