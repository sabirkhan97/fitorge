'use client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const T = {
  bg: '#0E0E0E',
  card: '#161616',
  card2: '#1E1E1E',
  card3: '#242424',
  ink: '#FFFFFF',
  muted: '#555',
  muted2: '#888',
  border: '#2A2A2A',
  lime: '#C8F135',
  warn: '#FF6B6B',
} as const;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0E0E0E; }
  input { caret-color: #C8F135; }
  input::placeholder { color: #555; }
  input:focus { outline: none; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #161616; }
  ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes spin     { to { transform:rotate(360deg); } }
  @keyframes pulse    { 0%,100% { opacity:.6; } 50% { opacity:1; } }
  @keyframes gridMove { from { transform:translateY(0); } to { transform:translateY(40px); } }

  .login-shell {
    min-height: 100svh;
    display: grid;
    grid-template-columns: 1fr;
    background: #0E0E0E;
  }
  @media (min-width: 900px) {
    .login-shell { grid-template-columns: 1fr 1fr; }
  }

  /* Left panel */
  .login-left {
    display: none;
    position: relative;
    overflow: hidden;
    background: #111;
    border-right: 1px solid #1F1F1F;
  }
  @media (min-width: 900px) { .login-left { display: flex; flex-direction: column; justify-content: space-between; padding: 48px; } }

  /* Right panel */
  .login-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100svh;
    padding: 40px 20px;
  }
  @media (min-width: 640px) { .login-right { padding: 48px 40px; } }

  .form-card {
    width: 100%;
    max-width: 420px;
    animation: fadeUp 0.5s 0.1s both;
  }

  .input-wrap { position: relative; margin-bottom: 14px; }
  .styled-input {
    width: 100%; height: 54px;
    padding: 0 48px 0 16px;
    background: #1E1E1E;
    border: 1.5px solid #2A2A2A;
    border-radius: 14px;
    font-size: 15px; font-weight: 500;
    color: #FFF;
    font-family: "'DM Sans', sans-serif";
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .styled-input:focus {
    border-color: #C8F135;
    box-shadow: 0 0 0 3px rgba(200,241,53,0.08);
  }
  .styled-input.error {
    border-color: #FF6B6B;
    box-shadow: 0 0 0 3px rgba(255,107,107,0.08);
  }
  .input-icon {
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
    color: #555; cursor: pointer; transition: color 0.15s;
    display: flex; align-items: center;
  }
  .input-icon:hover { color: #888; }

  .btn-primary {
    width: 100%; height: 56px;
    background: #C8F135; border: none; border-radius: 14px;
    color: #000; font-size: 14px; font-weight: 900;
    letter-spacing: 0.1em; text-transform: uppercase;
    font-family: "'DM Sans', sans-serif";
    cursor: pointer; transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    box-shadow: 0 6px 28px rgba(200,241,53,0.22);
    -webkit-tap-highlight-color: transparent;
  }
  .btn-primary:hover:not(:disabled) { background: #d6ff40; transform: translateY(-2px); box-shadow: 0 10px 36px rgba(200,241,53,0.3); }
  .btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .btn-primary:disabled { background: #2A2A2A; color: #555; box-shadow: none; cursor: not-allowed; }

  .btn-ghost {
    width: 100%; height: 52px;
    background: transparent;
    border: 1.5px solid #2A2A2A; border-radius: 14px;
    color: #FFF; font-size: 13px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    font-family: "'DM Sans', sans-serif";
    cursor: pointer; transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    -webkit-tap-highlight-color: transparent;
  }
  .btn-ghost:hover { border-color: #444; background: rgba(255,255,255,0.04); }
  .btn-ghost:active { transform: scale(0.98); }

  .divider {
    display: flex; align-items: center; gap: 12px; margin: 20px 0;
  }
  .divider-line { flex: 1; height: 1px; background: #2A2A2A; }
  .divider-text { font-family: 'Space Mono', monospace; font-size: 10px; color: #444; letter-spacing: 0.12em; }

  .error-msg {
    display: flex; align-items: center; gap: 6px;
    padding: 11px 14px;
    background: rgba(255,107,107,0.08);
    border: 1px solid rgba(255,107,107,0.25);
    border-radius: 10px;
    margin-bottom: 16px;
    animation: fadeUp 0.25s ease;
  }

  /* Left panel grid bg */
  .grid-bg {
    position: absolute; inset: 0;
    display: grid; grid-template-columns: repeat(8,1fr); grid-template-rows: repeat(12,1fr);
    opacity: 0.04;
    animation: gridMove 8s linear infinite alternate;
  }
  .grid-bg span { border: 0.5px solid #C8F135; }

  /* Floating workout card on left */
  .float-card {
    background: rgba(14,14,14,0.92);
    border: 1px solid #272727; border-radius: 16px;
    padding: 18px 20px; backdrop-filter: blur(12px);
    animation: fadeIn 0.6s 0.8s both;
  }

  /* Social login buttons */
  .btn-social {
    flex: 1; height: 48px;
    background: #1E1E1E; border: 1.5px solid #2A2A2A; border-radius: 12px;
    color: #FFF; font-size: 12px; font-weight: 600;
    font-family: "'DM Sans', sans-serif";
    cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-social:hover { border-color: #444; background: #242424; }

  /* Pill stat on left panel */
  .stat-pill {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 14px; background: rgba(200,241,53,0.07);
    border: 1px solid rgba(200,241,53,0.2); border-radius: 100px;
  }
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ id: false, pw: false });

  const identifierEmpty = touched.id && !identifier.trim();
  const passwordEmpty = touched.pw && !password.trim();

  const canSubmit = identifier.trim().length > 0 && password.trim().length > 0;

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setTouched({ id: true, pw: true });
  //   if (!canSubmit) return;

  //   setLoading(true);
  //   setError('');

  //   try {
  //     // Replace with your actual auth call
  //     await new Promise(res => setTimeout(res, 1400));
  //     // On success:
  //     navigate('/workout');
  //   } catch {
  //     setError('Invalid credentials. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ id: true, pw: true });

    if (!canSubmit) return;

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,   // ⚠️ this must be EMAIL (not username)
        password: password
      });

      if (error) {
        setError(error.message);
        return;
      }

      // ✅ success
      navigate('/workout');

    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ minHeight: '100svh', background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{CSS}</style>

      <div className="login-shell">

        {/* ══ LEFT PANEL (desktop only) ══ */}
        <div className="login-left">
          {/* Animated grid bg */}
          <div className="grid-bg">
            {Array.from({ length: 96 }).map((_, i) => <span key={i} />)}
          </div>

          {/* Top — brand */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Logo mark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 56 }}>
              <svg viewBox="0 0 56 56" width="44" height="44">
                <rect width="56" height="56" rx="10" fill="#0E0E0E" />
                <rect x="10" y="10" width="5" height="36" rx="2" fill="#C8F135" />
                <rect x="10" y="10" width="22" height="5" rx="2" fill="#C8F135" />
                <rect x="10" y="24" width="16" height="5" rx="2" fill="#C8F135" />
                <line x1="32" y1="10" x2="42" y2="46" stroke="#C8F135" strokeWidth="4" strokeLinecap="round" />
                <rect x="52" y="0" width="4" height="56" rx="2" fill="#C8F135" />
              </svg>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: '0.08em', color: T.lime }}>
                FITORGE
              </span>
            </div>

            {/* Hero text */}
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,4vw,5rem)', lineHeight: 0.88, letterSpacing: '0.02em', color: T.ink, marginBottom: 20 }}>
              FORGE YOUR<br />
              <span style={{ color: T.lime }}>BEST SELF.</span>
            </h1>
            <p style={{ fontSize: 15, color: T.muted2, lineHeight: 1.7, maxWidth: '34ch', fontWeight: 300, marginBottom: 32 }}>
              AI-powered workouts built around your body, goals, and schedule. No guesswork. Just results.
            </p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { num: '120+', label: 'Exercises' },
                { num: '12', label: 'Muscle Groups' },
                { num: '<5s', label: 'Generation' },
              ].map(s => (
                <div key={s.label} className="stat-pill">
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: T.lime, lineHeight: 1 }}>{s.num}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.muted2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — floating workout preview */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="float-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: '0.04em', color: T.ink }}>PUSH DAY A</span>
                <span style={{ fontFamily: "'Space Mono', monospace", background: T.lime, color: '#000', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 100, letterSpacing: '0.1em' }}>ADVANCED</span>
              </div>
              {[
                { name: 'Barbell Bench Press', meta: 'Chest · 4 × 8', color: '#FF6B6B' },
                { name: 'Lateral Raises', meta: 'Shoulders · 4 × 15', color: '#FFBE0B' },
                { name: 'Tricep Pushdown', meta: 'Triceps · 3 × 12', color: '#3A86FF' },
              ].map(ex => (
                <div key={ex.name} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', background: T.card2, borderRadius: 10,
                  marginBottom: 7, border: '1px solid transparent',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: ex.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{ex.name}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: T.muted, marginTop: 1 }}>{ex.meta}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.lime, animation: 'pulse 2s ease-in-out infinite' }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: T.lime, letterSpacing: '0.08em' }}>Generated in 2.3s</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL — FORM ══ */}
        <div className="login-right">
          <div className="form-card">

            {/* Mobile logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
              <svg viewBox="0 0 56 56" width="36" height="36">
                <rect width="56" height="56" rx="10" fill="#0E0E0E" stroke="#2A2A2A" strokeWidth="1" />
                <rect x="10" y="10" width="5" height="36" rx="2" fill="#C8F135" />
                <rect x="10" y="10" width="22" height="5" rx="2" fill="#C8F135" />
                <rect x="10" y="24" width="16" height="5" rx="2" fill="#C8F135" />
                <line x1="32" y1="10" x2="42" y2="46" stroke="#C8F135" strokeWidth="4" strokeLinecap="round" />
                <rect x="52" y="0" width="4" height="56" rx="2" fill="#C8F135" />
              </svg>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.08em', color: T.lime }}>
                FITORGE
              </span>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.2rem,6vw,3rem)', lineHeight: 0.9, letterSpacing: '0.02em', color: T.ink, marginBottom: 8 }}>
                WELCOME BACK
              </h2>
              <p style={{ fontSize: 14, color: T.muted2, fontWeight: 400 }}>
                Sign in to continue your training.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="error-msg">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke="#FF6B6B" />
                  <path d="M7 4v3.5M7 9.5v.5" stroke="#FF6B6B" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 12, color: T.warn, fontFamily: "'DM Sans', sans-serif" }}>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} noValidate>

              {/* Email / Username */}
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted2, marginBottom: 8 }}>
                  Email or Username
                </div>
                <div className="input-wrap" style={{ marginBottom: identifierEmpty ? 4 : 14 }}>
                  <input
                    type="text"
                    className={`styled-input${identifierEmpty ? ' error' : ''}`}
                    placeholder="you@example.com"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, id: true }))}
                    autoComplete="username"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <span className="input-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
                {identifierEmpty && (
                  <span style={{ fontSize: 11, color: T.warn, fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: 10, marginLeft: 4 }}>
                    Please enter your email or username
                  </span>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted2 }}>
                    Password
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.lime, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', padding: 0, transition: 'opacity 0.15s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="input-wrap" style={{ marginBottom: passwordEmpty ? 4 : 0 }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`styled-input${passwordEmpty ? ' error' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, pw: true }))}
                    autoComplete="current-password"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <span className="input-icon" onClick={() => setShowPass(s => !s)}>
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" />
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                        <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" />
                        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    )}
                  </span>
                </div>
                {passwordEmpty && (
                  <span style={{ fontSize: 11, color: T.warn, fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: 4, marginLeft: 4 }}>
                    Please enter your password
                  </span>
                )}
              </div>

              {/* Submit */}
              <div style={{ marginTop: 24 }}>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <div style={{ width: 18, height: 18, border: `2px solid rgba(0,0,0,0.2)`, borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      Signing in…
                    </>
                  ) : (
                    <>Sign In →</>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">OR</span>
              <div className="divider-line" />
            </div>

            {/* Sign Up CTA */}
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate('/signup')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
                <path d="M2 14c0-3 2.686-4 6-4s6 1 6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M13 2v4M11 4h4" stroke="#C8F135" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Create an Account
            </button>

            {/* Terms */}
            <p style={{ marginTop: 24, fontSize: 11, color: T.muted, textAlign: 'center', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
              By signing in you agree to our{' '}
              <span style={{ color: T.muted2, cursor: 'pointer', textDecoration: 'underline' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: T.muted2, cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}