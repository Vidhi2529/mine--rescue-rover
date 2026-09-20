import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import sampleLoginMineBg from '../assets/sample_login_mine_bg.png';

const UNDERSTONE_LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1XPwq0TOPvCz3--wSH2KdxwBVm0TBHzPSktGOl12gF9zuzED0oy1PTsZ03hkg-Kn3hvZ-K__mJ2SvhYeU6q_PUijEoy1u2xLbe-4yiiULbYs5qZxwKycG7f2DQ9F1wM9dwrmSuFqk0mG7kH1S0Lw7IO2rUBA93J2cKcHSCj_k6iR-IP9AEKE-ruqboSmG8NhPQo6R0ACod_FbNf4tnbxcxcLKTeb_fr1cSOxk_049lO-oUDI62PNDHOH3M';

export default function Login() {
  const navigate = useNavigate();
  const [operatorId, setOperatorId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    const isAuth =
      sessionStorage.getItem('understone_authenticated') === 'true' ||
      localStorage.getItem('understone_authenticated') === 'true';
    if (isAuth) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e?.preventDefault();

    const trimmedId = operatorId.trim();
    const trimmedPass = password.trim();

    if (!trimmedId) {
      setErrorMessage('Please enter your Operator ID');
      return;
    }
    if (!trimmedPass) {
      setErrorMessage('Please enter your password');
      return;
    }

    setErrorMessage('');
    sessionStorage.setItem('understone_authenticated', 'true');
    sessionStorage.setItem('understone_operator_id', trimmedId);

    if (rememberMe) {
      localStorage.setItem('understone_authenticated', 'true');
      localStorage.setItem('understone_operator_id', trimmedId);
    } else {
      localStorage.removeItem('understone_authenticated');
      localStorage.removeItem('understone_operator_id');
    }

    navigate('/', { replace: true });
  };

  return (
    <div className="relative w-screen min-h-screen h-screen flex flex-col justify-between items-center bg-[#001224] font-sans text-on-surface antialiased overflow-hidden select-none px-4 py-6">
      
      {/* 1. Exact Sample Underground Coal Mine Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${sampleLoginMineBg})` }}
      />

      {/* Dark Navy Vignette & Overlay so the existing login card remains the crisp visual focus */}
      <div className="absolute inset-0 bg-[#001224]/35 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,18,36,0.65)_0%,_rgba(0,18,36,0.15)_55%,_rgba(0,18,36,0.85)_100%)] pointer-events-none" />

      {/* Subtle Technical Grid / HUD Effect on top of background */}
      <div className="absolute inset-0 hud-grid-bg pointer-events-none opacity-85" />

      {/* Subtle Corner HUD Brackets */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-cyan-500/30 pointer-events-none" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-cyan-500/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-cyan-500/30 pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-cyan-500/30 pointer-events-none" />

      {/* Top Spacer to balance the layout */}
      <div className="w-full max-w-[440px] h-4" />

      {/* 2. Single Centered Login Card */}
      <main className="w-full max-w-[440px] z-10 my-auto">
        <div className="w-full bg-[#060e20]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.85),0_0_35px_rgba(6,182,212,0.14)] space-y-6 relative hud-glow-card">
          
          {/* Card Header: Logo, Title, Subtitle, Tagline */}
          <div className="flex flex-col items-center text-center space-y-2.5 pb-5 border-b border-outline-variant/25">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0a162e] to-[#060e20] border border-cyan-400/40 flex items-center justify-center p-2.5 shadow-[0_0_20px_rgba(6,182,212,0.22)]">
              <img
                src={UNDERSTONE_LOGO_URL}
                alt="UnderStone Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/favicon.svg';
                }}
              />
            </div>
            
            <div className="space-y-1">
              <h1 className="text-[23px] sm:text-[25px] font-bold text-white tracking-widest uppercase font-sans leading-tight">
                UNDERSTONE
              </h1>
              <div className="font-mono text-[11px] sm:text-[11.5px] font-semibold text-cyan-400 tracking-[0.16em] uppercase">
                INDIAN MINE SAFETY &amp; RESCUE SYSTEM
              </div>
              <p className="font-mono text-[10px] text-on-surface-variant/85 tracking-widest uppercase pt-0.5">
                SAFER MINES. SMARTER OPERATIONS.
              </p>
            </div>
          </div>

          {/* Login Form Section */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-[13px] font-bold text-white tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <span>OPERATOR LOGIN</span>
              </div>
              <p className="text-[12px] text-on-surface-variant/90 leading-relaxed">
                Enter your credentials to access the mine safety command center.
              </p>
            </div>

            {/* Validation / Error Banner */}
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 font-mono text-[11.5px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-red-400 shrink-0">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Field 1: OPERATOR ID */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="operator-id-input" 
                  className="block font-mono text-[11px] font-semibold text-outline uppercase tracking-wider"
                >
                  OPERATOR ID
                </label>
                <div className="relative rounded-lg bg-[#040914]/90 border border-outline-variant/40 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-cyan-400/70 pointer-events-none">
                    person
                  </span>
                  <input
                    id="operator-id-input"
                    type="text"
                    value={operatorId}
                    onChange={(e) => {
                      setOperatorId(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter Operator ID"
                    autoComplete="username"
                    className="w-full bg-transparent pl-10 pr-4 py-2.5 text-[13.5px] font-mono text-white placeholder:text-outline/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Field 2: PASSWORD */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="password-input" 
                  className="block font-mono text-[11px] font-semibold text-outline uppercase tracking-wider"
                >
                  PASSWORD
                </label>
                <div className="relative rounded-lg bg-[#040914]/90 border border-outline-variant/40 focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-cyan-400/70 pointer-events-none">
                    lock
                  </span>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="Enter Password"
                    autoComplete="current-password"
                    className="w-full bg-transparent pl-10 pr-10 py-2.5 text-[13.5px] font-mono text-white placeholder:text-outline/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-white transition-colors p-1 flex items-center justify-center cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="pt-0.5">
                <label className="inline-flex items-center gap-2 text-on-surface-variant hover:text-white cursor-pointer select-none font-mono text-[12px] transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#040914] border-outline-variant/60 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-cyan-500"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Primary Action LOGIN Button with shield icon */}
              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:from-cyan-600 active:to-blue-700 text-white font-mono font-semibold text-[14px] tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_32px_rgba(6,182,212,0.55)] border border-cyan-300/30 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">shield</span>
                <span>LOGIN</span>
              </button>
            </form>
          </div>

        </div>
      </main>

      {/* 3. Minimal Footer: Subtle and Clean - AUTHORIZED PERSONNEL ONLY */}
      <footer className="w-full text-center py-2 font-mono text-[11px] tracking-widest text-outline/70 uppercase z-10">
        AUTHORIZED PERSONNEL ONLY
      </footer>

    </div>
  );
}
