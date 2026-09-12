import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const [advisoryAck, setAdvisoryAck] = useState(false);

  // Dynamic header breadcrumbs based on route
  const getBreadcrumb = () => {
    if (location.pathname === '/mine-map') {
      return 'SECTOR 4 GALLERY / SUB-SURFACE MAP';
    }
    if (location.pathname === '/hazard-intel') {
      return 'SECTOR 4 GALLERY / HAZARD INTELLIGENCE';
    }
    if (location.pathname === '/evac-refuge') {
      return 'SECTOR 4 GALLERY / EVACUATION & REFUGE';
    }
    if (location.pathname === '/incident-box' || location.pathname === '/incident-blackbox') {
      return 'SECTOR 4 GALLERY / INCIDENT BLACK BOX';
    }
    if (location.pathname === '/rover-control') {
      return 'SECTOR 4 GALLERY / ROVER CONTROL';
    }
    if (location.pathname === '/settings') {
      return 'SECTOR 4 GALLERY / SETTINGS';
    }
    return 'SECTOR 4 GALLERY / LIVE STATUS';
  };

  // Dynamic advisory ticker content based on route - SIH Jury Safe (No autonomous claims)
  const renderAdvisoryText = () => {
    if (location.pathname === '/mine-map') {
      return (
        <p className="text-on-surface text-[12px] md:text-[13px] truncate leading-none">
          MAP TELEMETRY: Rover R-01 stationed in Drift C (-850m) &bull; Elevated methane detected (1.15%) &bull; AMG8833 thermal scan active &bull; Operator verification required.
        </p>
      );
    }
    if (location.pathname === '/hazard-intel') {
      return (
        <p className="text-on-surface text-[12px] md:text-[13px] truncate leading-none">
          HAZARD INTEL: Multi-sensor payload online &bull; MQ-4 methane trend elevated (+0.08%/10m) in Drift C &bull; AMG8833 heat signature detected &bull; Manual teleoperation hold.
        </p>
      );
    }
    if (location.pathname === '/evac-refuge') {
      return (
        <p className="text-on-surface text-[12px] md:text-[13px] truncate leading-none">
          EVACUATION PROTOCOL: Operator-guided refuge access active &bull; R-01 clear (110m) &bull; Drift C restricted (1.15% CH4) &bull; Level -850 blockage flagged.
        </p>
      );
    }
    if (location.pathname === '/incident-box' || location.pathname === '/incident-blackbox') {
      return (
        <p className="text-on-surface text-[12px] md:text-[13px] truncate leading-none">
          BLACK BOX AUDIT: 34 mission events recorded &bull; Session 04 active &bull; Fail-safe halt logged at 14:34:10 &bull; LoRa link re-established.
        </p>
      );
    }
    if (location.pathname === '/rover-control') {
      return (
        <p className="text-on-surface text-[12px] md:text-[13px] truncate leading-none">
          TELEOPERATION ENGAGED: Manual drive active &bull; TB6612FNG armed &bull; Sonar obstacle clearance monitoring &bull; LoRa heartbeat synched.
        </p>
      );
    }
    if (location.pathname === '/settings') {
      return (
        <p className="text-on-surface text-[12px] md:text-[13px] truncate leading-none">
          CONFIGURATION CONSOLE: System preferences active &bull; SX1278 LoRa 433.0 MHz locked &bull; Deadman fail-safe armed &bull; Parameters saved.
        </p>
      );
    }
    return (
      <p className="text-on-surface text-[12px] md:text-[13px] truncate leading-none">
        ENVIRONMENTAL ADVISORY: CH4 reading at <span className="text-secondary font-mono font-semibold">1.15%</span> (Warning 1.00%, Critical Limit 1.50%) in <strong className="text-on-surface font-medium">Sector 4 Drift C</strong> &bull; Telemetry synched via LoRa.
      </p>
    );
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#0b1326] font-sans text-on-surface antialiased overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* TOP HEADER / DESK BAR (Fixed Height 56px) */}
      <header className="h-14 shrink-0 bg-[#060e20] border-b border-outline-variant/30 px-4 flex items-center justify-between z-40">
        {/* Left: Active Context Breadcrumb & Sector */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded bg-surface-container-high border border-outline-variant/40 flex items-center justify-center p-1 shrink-0">
            <img
              alt="Cornerstone Logo"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XPwq0TOPvCz3--wSH2KdxwBVm0TBHzPSktGOl12gF9zuzED0oy1PTsZ03hkg-Kn3hvZ-K__mJ2SvhYeU6q_PUijEoy1u2xLbe-4yiiULbYs5qZxwKycG7f2DQ9F1wM9dwrmSuFqk0mG7kH1S0Lw7IO2rUBA93J2cKcHSCj_k6iR-IP9AEKE-ruqboSmG8NhPQo6R0ACod_FbNf4tnbxcxcLKTeb_fr1cSOxk_049lO-oUDI62PNDHOH3M"
            />
          </div>
          <div className="flex items-center gap-2.5 min-w-0 font-mono text-[12.5px] md:text-[13px]">
            <span className="font-bold text-on-surface tracking-wider uppercase text-[14px] md:text-[15.5px]">CORNERSTONE</span>
            <span className="text-outline-variant">|</span>
            <span className="text-outline uppercase tracking-wide truncate">{getBreadcrumb()}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-[11.5px] md:text-[12.5px] text-on-surface shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              GRID 4-C SUB-SURFACE
            </span>
          </div>
        </div>

        {/* Center/Right: Defendable Prototype Telemetry Feeds */}
        <div className="flex items-center gap-4 shrink-0 font-mono text-[12px] md:text-[13px]">
          <div className="flex items-center gap-1.5 text-outline">
            <span className="material-symbols-outlined text-[17px] text-primary">sensors</span>
            <span>SENSOR PAYLOAD: <strong className="text-on-surface font-semibold">ESP32 ONLINE</strong></span>
          </div>
          <div className="h-4 w-px bg-outline-variant/40"></div>
          <div className="flex items-center gap-1.5 text-outline">
            <span>LoRa LINK:</span>
            <span className="text-tertiary font-semibold">433.0 MHz (SX1278)</span>
          </div>
          <div className="h-4 w-px bg-outline-variant/40"></div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-outline-variant/30 text-on-surface-variant text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span>ROVER R-01 LINKED</span>
          </div>
        </div>
      </header>

      {/* TOP ADVISORY TICKER (Fixed Height 36px) */}
      <div className="h-9 shrink-0 bg-surface-container-low/95 border-b border-outline-variant/25 px-4 flex items-center justify-between text-[12.5px] md:text-[13px]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary-container/20 border border-secondary/30 text-secondary font-mono text-[11.5px] font-semibold uppercase shrink-0">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            ADVISORY
          </span>
          {renderAdvisoryText()}
        </div>
        <button
          onClick={() => setAdvisoryAck(!advisoryAck)}
          className={`ml-3 px-3 py-1 border text-on-surface text-[11.5px] font-mono rounded tracking-wider uppercase transition-colors shrink-0 ${
            advisoryAck
              ? 'bg-tertiary/20 text-tertiary border-tertiary/40 font-semibold'
              : 'bg-surface-container-high hover:bg-surface-container-highest border-outline-variant/40'
          }`}
          type="button"
        >
          {advisoryAck ? 'Acknowledged' : 'Acknowledge'}
        </button>
      </div>

      {/* 3-COLUMN MAIN BODY */}
      <div className="flex-1 flex min-h-0 overflow-hidden w-full">
        {/* 1. LEFT SIDEBAR (Width: 256px - comfortable 14.5px typography) */}
        <aside className="w-64 shrink-0 bg-[#060e20] border-r border-outline-variant/30 flex flex-col justify-between h-full z-20 select-none overflow-hidden">
          <div className="flex flex-col p-3 space-y-1.5">
            <div className="px-2 py-1 mb-1">
              <span className="font-mono text-[11.5px] uppercase tracking-wider text-outline font-semibold">NAVIGATION CONSOLE</span>
            </div>

            {/* Navigation Menu Links - Readable 14.5px typography */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded transition-colors text-[14.5px] ${
                  isActive
                    ? 'bg-sky-950/50 text-sky-400 border-l-2 border-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[20px] shrink-0">dashboard</span>
                <span className="truncate font-medium">Dashboard</span>
              </div>
              {location.pathname === '/' && (
                <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
              )}
            </NavLink>

            <NavLink
              to="/mine-map"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded transition-colors text-[14.5px] ${
                  isActive
                    ? 'bg-sky-950/50 text-sky-400 border-l-2 border-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[20px] shrink-0">map</span>
                <span className="truncate font-medium">Live Mine Map</span>
              </div>
              <span className={`font-mono text-[11.5px] px-2 py-0.5 rounded shrink-0 border ${
                location.pathname === '/mine-map'
                  ? 'text-primary bg-primary/20 border-primary/30 font-semibold'
                  : 'text-outline bg-surface-container-high border-transparent'
              }`}>
                -850m
              </span>
            </NavLink>

            <NavLink
              to="/hazard-intel"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded transition-colors text-[14.5px] ${
                  isActive
                    ? 'bg-sky-950/50 text-sky-400 border-l-2 border-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[20px] shrink-0">psychology</span>
                <span className="truncate font-medium">Hazard Intel</span>
              </div>
              <span className="font-mono text-[11.5px] text-secondary bg-secondary-container/20 px-2 py-0.5 rounded shrink-0 border border-secondary/30 font-semibold">
                1 Adv
              </span>
            </NavLink>

            <NavLink
              to="/evac-refuge"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded transition-colors text-[14.5px] ${
                  isActive
                    ? 'bg-sky-950/50 text-sky-400 border-l-2 border-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[20px] shrink-0">alt_route</span>
                <span className="truncate font-medium">Evac &amp; Rescue</span>
              </div>
              <span className={`font-mono text-[11.5px] px-2 py-0.5 rounded shrink-0 border ${
                location.pathname === '/evac-refuge'
                  ? 'text-primary bg-primary/20 border-primary/30 font-semibold'
                  : 'text-outline bg-surface-container-high border-transparent'
              }`}>
                Rescue
              </span>
            </NavLink>

            <NavLink
              to="/incident-box"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded transition-colors text-[14.5px] ${
                  isActive
                    ? 'bg-sky-950/50 text-sky-400 border-l-2 border-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[20px] shrink-0">history</span>
                <span className="truncate font-medium">Incident Box</span>
              </div>
              <span className={`font-mono text-[11.5px] px-2 py-0.5 rounded shrink-0 border ${
                location.pathname === '/incident-box' || location.pathname === '/incident-blackbox'
                  ? 'text-primary bg-primary/20 border-primary/30 font-semibold'
                  : 'text-outline bg-surface-container-high border-transparent'
              }`}>
                Rec
              </span>
            </NavLink>

            <NavLink
              to="/rover-control"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded transition-colors text-[14.5px] ${
                  isActive
                    ? 'bg-sky-950/50 text-sky-400 border-l-2 border-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[20px] shrink-0">precision_manufacturing</span>
                <span className="truncate font-medium">Rover Control</span>
              </div>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded transition-colors text-[14.5px] ${
                  isActive
                    ? 'bg-sky-950/50 text-sky-400 border-l-2 border-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[20px] shrink-0">settings</span>
                <span className="truncate font-medium">Settings</span>
              </div>
            </NavLink>
          </div>

          {/* Bottom: Operator Console & Hardware Link Badge (SIH Jury Safe) */}
          <div className="p-3 border-t border-outline-variant/25 bg-[#060e20] space-y-2">
            <div className="flex items-center gap-2.5 p-2 rounded bg-surface-container/50 border border-outline-variant/20">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-mono text-[13.5px] font-bold">
                  OP1
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary ring-1 ring-[#060e20]"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13.5px] font-semibold text-on-surface leading-tight truncate">Control Desk Operator</span>
                <span className="font-mono text-[11.5px] text-on-surface-variant/80 tracking-wide uppercase mt-0.5 truncate">MANUAL TELEOPERATOR</span>
              </div>
            </div>
            <div className="bg-surface-container-low/90 rounded p-2.5 border border-outline-variant/25 font-mono text-[12px]">
              <div className="flex items-center justify-between text-tertiary font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>LoRa 433MHz
                </span>
                <span className="text-outline text-[11.5px]">18ms PING</span>
              </div>
              <div className="text-on-surface-variant/80 text-[11.5px] tracking-wide mt-1">
                FAILSAFE: DEADMAN STOP ARMED
              </div>
            </div>
          </div>
        </aside>

        {/* OUTLET FOR PAGE WORKSPACES */}
        <Outlet />
      </div>

      {/* REFINED SYSTEM FOOTER (Fixed Height 36px) - SIH Defendable Telemetry */}
      <footer className="h-9 shrink-0 w-full bg-[#060e20] border-t border-outline-variant/25 px-4 flex items-center justify-between text-on-surface-variant font-mono text-[12px] z-30">
        <div className="flex items-center gap-3">
          <span>PACKET REFRESH: 200MS</span>
          <span className="text-outline-variant">|</span>
          <span>TRANSCEIVER: SX1278 LoRa (433MHz)</span>
          <span className="text-outline-variant">|</span>
          <span>CONTROLLER: ESP32 + TB6612FNG</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-tertiary font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            TELEOPERATION NOMINAL
          </span>
          <span className="text-outline-variant">|</span>
          <span>SECTOR 4 DRIFT C TELEMETRY</span>
        </div>
      </footer>
    </div>
  );
}
