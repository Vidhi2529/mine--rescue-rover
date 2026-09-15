import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [operatorId, setOperatorId] = useState('MSHA-3842');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [timeStr, setTimeStr] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Live UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      setTimeStr(`${hours}:${mins}:${secs}Z`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e?.preventDefault();
    
    // Minimal validation to preserve robust login flow
    if (!operatorId.trim()) {
      setErrorMessage('Please enter your Operator ID');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    setErrorMessage('');
    if (keepSignedIn) {
      localStorage.setItem('understone_authenticated', 'true');
    }
    sessionStorage.setItem('understone_authenticated', 'true');
    navigate('/', { replace: true });
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-between bg-[#040914] font-sans text-on-surface antialiased overflow-hidden select-none hud-grid-bg relative p-4 md:p-6">
      
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Viewport Corner HUD Brackets */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-sky-400/40 pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-sky-400/40 pointer-events-none"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-sky-400/40 pointer-events-none"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-sky-400/40 pointer-events-none"></div>

      {/* TOP BAR */}
      <header className="w-full flex items-center justify-between font-mono text-[11.5px] z-20">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-500/40 font-semibold tracking-wider text-[10.5px]">
            FED-SEC // MSHA 30 CFR
          </span>
          <span className="text-sky-200/80 tracking-wide font-medium hidden sm:inline">
            UNITED STATES MINE SAFETY &amp; HEALTH TELEMETRY NETWORK
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11.5px]">
          <span className="text-outline">UTC:</span>
          <span className="text-sky-300 font-semibold tracking-wider">{timeStr || '14:09:05Z'}</span>
          <span className="inline-flex items-center gap-1.5 text-tertiary font-semibold ml-2">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            SYSTEM ONLINE
          </span>
        </div>
      </header>

      {/* CENTERED LOGIN CARD */}
      <main className="w-full flex-1 flex items-center justify-center z-20 py-4">
        <div className="w-full max-w-[440px] bg-[#091224]/90 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-7 md:p-8 hud-glow-card shadow-[0_0_50px_rgba(14,165,233,0.15)] flex flex-col gap-6">
          
          {/* Brand Header */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-900 to-sky-950 border border-sky-400/40 flex items-center justify-center p-2.5 shrink-0 shadow-inner">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-sky-400" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20L12 4L21 20H3Z" />
                <path d="M7.5 14L12 8L16.5 14" />
              </svg>
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-white tracking-wider font-sans leading-none uppercase">
                UNDERSTONE
              </h1>
              <p className="font-mono text-[10.5px] font-semibold text-sky-400 tracking-[0.18em] uppercase mt-1.5">
                SAFER MINES. SMARTER OPERATIONS.
              </p>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between font-mono text-[12.5px] font-semibold">
              <span className="flex items-center gap-2 text-white tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                OPERATOR LOGIN
              </span>
              <span className="text-outline text-[10.5px] tracking-wider uppercase">SECURE ACCESS</span>
            </div>
            <p className="text-[12px] text-on-surface-variant/90">
              Enter your credentials to access the command center.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Error banner if validation fails */}
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-[11.5px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Field 1: OPERATOR ID */}
            <div className="space-y-1.5">
              <label htmlFor="operator-id-input" className="block font-mono text-[11px] font-semibold text-outline uppercase tracking-wider">
                OPERATOR ID
              </label>
              <div className="relative rounded-lg bg-[#050c18] border border-sky-500/30 focus-within:border-sky-400 focus-within:shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">
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
                  placeholder="MSHA-XXXX or BADGE ID"
                  className="w-full bg-transparent pl-10 pr-4 py-2.5 text-[13.5px] font-mono text-white placeholder:text-outline/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Field 2: PASSWORD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <label htmlFor="password-input" className="font-semibold text-outline uppercase tracking-wider">
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset protocol initiated. Contact MSHA Duty Officer.')}
                  className="text-sky-400 hover:underline text-[11px]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative rounded-lg bg-[#050c18] border border-sky-500/30 focus-within:border-sky-400 focus-within:shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline">
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
                  placeholder="Enter your password"
                  className="w-full bg-transparent pl-10 pr-10 py-2.5 text-[13.5px] font-mono text-white placeholder:text-outline/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-white transition-colors p-1 flex items-center justify-center"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Checkbox Row */}
            <div className="flex items-center justify-between font-mono text-[11.5px] pt-1">
              <label className="flex items-center gap-2 text-on-surface-variant hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#050c18] border-sky-500/40 text-sky-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Keep me signed in (12hr)</span>
              </label>
              <span className="text-outline text-[10.5px] uppercase tracking-wider">SECURE SESSION</span>
            </div>

            {/* Primary Action LOGIN Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-mono font-semibold text-[14px] tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(14,165,233,0.45)] border border-sky-300/40 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span>LOGIN</span>
            </button>
          </form>

          {/* Footer Security Badges */}
          <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-sky-400/90">
              <span className="material-symbols-outlined text-[16px]">settings_suggest</span>
              <span>FIPS 140-3 COMPLIANT</span>
            </div>
            <div className="flex items-center gap-1.5 text-tertiary font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              <span>SECURE CONNECTION</span>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="w-full flex items-center justify-between font-mono text-[10.5px] text-outline z-20">
        <div>
          FEDERAL NOTICE: AUTHORIZED PERSONNEL ONLY <span className="mx-1 text-outline-variant">|</span> UNAUTHORIZED ACCESS IS PROHIBITED
        </div>
        <div>
          MSHA 30 CFR PART 75 <span className="mx-1 text-outline-variant">|</span> VERSION 4.8
        </div>
      </footer>

    </div>
  );
}
