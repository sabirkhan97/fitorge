'use client';
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase'

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
    ok: '#34D399',
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

  @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes spin    { to { transform:rotate(360deg); } }
  @keyframes pulse   { 0%,100%{opacity:.5;} 50%{opacity:1;} }
  @keyframes gridMove{ from{transform:translateY(0);} to{transform:translateY(40px);} }
  @keyframes barFill { from{width:0%;} to{width:var(--target);} }

  /* ── Shell ── */
  .su-shell {
    min-height: 100svh;
    display: grid;
    grid-template-columns: 1fr;
    background: #0E0E0E;
  }
  @media (min-width: 900px) { .su-shell { grid-template-columns: 1fr 1fr; } }

  /* ── Left panel ── */
  .su-left {
    display: none;
    position: relative;
    overflow: hidden;
    background: #111;
    border-right: 1px solid #1F1F1F;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
  }
  @media (min-width: 900px) { .su-left { display: flex; } }

  /* ── Right panel ── */
  .su-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100svh;
    padding: 40px 20px;
  }
  @media (min-width: 640px) { .su-right { padding: 48px 40px; } }

  .form-card {
    width: 100%;
    max-width: 420px;
    animation: fadeUp 0.45s 0.1s both;
  }

  /* ── Inputs ── */
  .input-wrap { position: relative; }
  .fi {
    width: 100%; height: 54px;
    padding: 0 48px 0 16px;
    background: #1E1E1E;
    border: 1.5px solid #2A2A2A;
    border-radius: 14px;
    font-size: 15px; font-weight: 500;
    color: #FFF;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .fi:focus  { border-color:#C8F135; box-shadow:0 0 0 3px rgba(200,241,53,0.08); }
  .fi.ok     { border-color:#34D399; box-shadow:0 0 0 3px rgba(52,211,153,0.07); }
  .fi.err    { border-color:#FF6B6B; box-shadow:0 0 0 3px rgba(255,107,107,0.08); }

  .fi-icon {
    position:absolute; right:14px; top:50%; transform:translateY(-50%);
    color:#555; display:flex; align-items:center; cursor:pointer;
    transition: color 0.15s;
  }
  .fi-icon:hover { color:#888; }

  /* ── Strength bar ── */
  .strength-track {
    height: 3px; background:#2A2A2A; border-radius:2px; overflow:hidden; margin-top:6px;
  }
  .strength-fill {
    height:100%; border-radius:2px; transition: width 0.4s ease, background 0.3s ease;
  }

  /* ── Buttons ── */
  .btn-lime {
    width:100%; height:56px;
    background:#C8F135; border:none; border-radius:14px;
    color:#000; font-size:14px; font-weight:900;
    letter-spacing:0.1em; text-transform:uppercase;
    font-family:'DM Sans',sans-serif;
    cursor:pointer; transition:all 0.2s ease;
    display:flex; align-items:center; justify-content:center; gap:10px;
    box-shadow:0 6px 28px rgba(200,241,53,0.22);
    -webkit-tap-highlight-color:transparent;
  }
  .btn-lime:hover:not(:disabled) { background:#d6ff40; transform:translateY(-2px); box-shadow:0 10px 36px rgba(200,241,53,0.3); }
  .btn-lime:active:not(:disabled) { transform:scale(0.98); }
  .btn-lime:disabled { background:#2A2A2A; color:#555; box-shadow:none; cursor:not-allowed; }

  .btn-ghost {
    width:100%; height:52px;
    background:transparent; border:1.5px solid #2A2A2A; border-radius:14px;
    color:#FFF; font-size:13px; font-weight:700;
    letter-spacing:0.08em; text-transform:uppercase;
    font-family:'DM Sans',sans-serif;
    cursor:pointer; transition:all 0.2s ease;
    display:flex; align-items:center; justify-content:center; gap:8px;
    -webkit-tap-highlight-color:transparent;
  }
  .btn-ghost:hover { border-color:#444; background:rgba(255,255,255,0.04); }
  .btn-ghost:active { transform:scale(0.98); }

  .btn-text {
    background:none; border:none; cursor:pointer; padding:0;
    font-family:'Space Mono',monospace; font-size:9px;
    letter-spacing:0.08em; text-transform:uppercase;
    color:#C8F135; transition:opacity 0.15s;
  }
  .btn-text:hover { opacity:0.7; }

  /* ── Divider ── */
  .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
  .div-line { flex:1; height:1px; background:#2A2A2A; }
  .div-txt  { font-family:'Space Mono',monospace; font-size:10px; color:#444; letter-spacing:0.12em; }

  /* ── Error banner ── */
  .err-banner {
    display:flex; align-items:center; gap:8px;
    padding:11px 14px;
    background:rgba(255,107,107,0.08);
    border:1px solid rgba(255,107,107,0.25);
    border-radius:10px; margin-bottom:16px;
    animation:fadeUp 0.25s ease;
  }

  /* ── Field hint ── */
  .field-hint {
    font-size:11px; font-family:'DM Sans',sans-serif;
    margin-top:4px; margin-left:4px; display:block;
  }

  /* Left grid */
  .grid-bg {
    position:absolute; inset:0;
    display:grid; grid-template-columns:repeat(8,1fr); grid-template-rows:repeat(12,1fr);
    opacity:0.04; animation:gridMove 8s linear infinite alternate;
  }
  .grid-bg span { border:0.5px solid #C8F135; }

  /* Strength labels */
  .strength-label {
    font-family:'Space Mono',monospace; font-size:9px;
    letter-spacing:0.1em; text-transform:uppercase;
    transition:color 0.3s;
  }

  /* Checklist items */
  .check-item {
    display:flex; align-items:center; gap:6px;
    font-family:'Space Mono',monospace; font-size:9px;
    letter-spacing:0.06em; transition:color 0.2s;
  }

  /* Float card on left */
  .float-card {
    background:rgba(14,14,14,0.92);
    border:1px solid #272727; border-radius:16px;
    padding:18px 20px; backdrop-filter:blur(12px);
    animation:fadeIn 0.6s 0.8s both;
  }

  .stat-pill {
    display:inline-flex; align-items:center; gap:8px;
    padding:8px 14px; background:rgba(200,241,53,0.07);
    border:1px solid rgba(200,241,53,0.2); border-radius:100px;
  }
`;

// Password strength calculator
function getStrength(pw: string): { score: number; label: string; color: string; width: string } {
    if (!pw) return { score: 0, label: '', color: T.border, width: '0%' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: 'Weak', color: T.warn, width: '20%' };
    if (score <= 2) return { score, label: 'Fair', color: '#FBBF24', width: '45%' };
    if (score <= 3) return { score, label: 'Good', color: '#60A5FA', width: '65%' };
    if (score <= 4) return { score, label: 'Strong', color: T.ok, width: '85%' };
    return { score, label: 'Excellent', color: T.lime, width: '100%' };
}

// Tiny SVG icons
const IconUser = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 14c0-3 2.686-4 6-4s6 1 6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);
const IconMail = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);
const IconEyeOn = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
);
const IconEyeOff = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
        <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);
const IconCheck = ({ ok }: { ok: boolean }) => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        {ok
            ? <><circle cx="6" cy="6" r="5.5" fill="rgba(52,211,153,0.15)" stroke="#34D399" strokeWidth="1" /><path d="M3.5 6l2 2 3-3" stroke="#34D399" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></>
            : <circle cx="6" cy="6" r="5.5" stroke="#444" strokeWidth="1" />
        }
    </svg>
);
const IconLock = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SignUpPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirm: '',
    });
    const [show, setShow] = useState({ pw: false, confirm: false });
    const [touched, setTouched] = useState({ username: false, email: false, password: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = useCallback((k: keyof typeof form, v: string) =>
        setForm(p => ({ ...p, [k]: v })), []);

    const touch = useCallback((k: keyof typeof touched) =>
        setTouched(p => ({ ...p, [k]: true })), []);

    // Validations
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const pwStrength = getStrength(form.password);
    const pwMinLen = form.password.length >= 8;
    const pwHasUpper = /[A-Z]/.test(form.password);
    const pwHasNum = /[0-9]/.test(form.password);
    const confirmMatch = form.confirm.length > 0 && form.confirm === form.password;
    const confirmWrong = touched.confirm && form.confirm.length > 0 && form.confirm !== form.password;

    const emailErr = touched.email && !emailValid && form.email.length > 0;
    const emailEmpty = touched.email && form.email.trim() === '';
    const pwErr = touched.password && form.password.length > 0 && pwStrength.score < 2;
    const pwEmpty = touched.password && form.password.trim() === '';

    const canSubmit =
        form.email.trim() !== '' && emailValid &&
        form.password.trim() !== '' && pwStrength.score >= 2 &&
        confirmMatch;

    //   const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setTouched({ username: true, email: true, password: true, confirm: true });
    //     if (!canSubmit) return;
    //     setLoading(true);
    //     setError('');
    //     try {
    //       // Replace with your actual API call
    //       await new Promise(res => setTimeout(res, 1500));
    //       navigate('/workout');
    //     } catch {
    //       setError('Could not create account. Please try again.');
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouched({ username: true, email: true, password: true, confirm: true });

        if (!canSubmit) return;

        setLoading(true);
        setError('');

        try {
            // 1️⃣ SIGN UP
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password
            });

            if (error) {
                setError(error.message);
                return;
            }

            // ❗ CRITICAL CHECK
            if (!data.session) {
                // Email confirmation is ON → no session yet
                setError('Please verify your email before continuing.');
                navigate('/login');
                return;
            }

            // 2️⃣ NOW USER IS AUTHENTICATED → SAFE FOR RLS
            const { data: userData } = await supabase.auth.getUser();

            if (!userData.user) {
                setError('User not found after signup');
                return;
            }

            // 3️⃣ INSERT PROFILE (MATCHES RLS: auth.uid() = id)
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: userData.user.id,
                    email: userData.user.email,
                    username: form.username
                });

            if (profileError) {
                setError(profileError.message);
                return;
            }

            // 4️⃣ SUCCESS
            navigate('/');

        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{ minHeight: '100svh', background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>
            <style>{CSS}</style>

            <div className="su-shell">

                {/* ══ LEFT PANEL ══ */}
                <div className="su-left">
                    <div className="grid-bg">
                        {Array.from({ length: 96 }).map((_, i) => <span key={i} />)}
                    </div>

                    {/* Top */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
                            <svg viewBox="0 0 56 56" width="42" height="42">
                                <rect width="56" height="56" rx="10" fill="#0E0E0E" />
                                <rect x="10" y="10" width="5" height="36" rx="2" fill="#C8F135" />
                                <rect x="10" y="10" width="22" height="5" rx="2" fill="#C8F135" />
                                <rect x="10" y="24" width="16" height="5" rx="2" fill="#C8F135" />
                                <line x1="32" y1="10" x2="42" y2="46" stroke="#C8F135" strokeWidth="4" strokeLinecap="round" />
                                <rect x="52" y="0" width="4" height="56" rx="2" fill="#C8F135" />
                            </svg>
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: '0.08em', color: T.lime }}>FITORGE</span>
                        </div>

                        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem,4vw,5rem)', lineHeight: 0.88, letterSpacing: '0.02em', color: T.ink, marginBottom: 18 }}>
                            START YOUR<br /><span style={{ color: T.lime }}>JOURNEY.</span>
                        </h1>
                        <p style={{ fontSize: 15, color: T.muted2, lineHeight: 1.7, maxWidth: '34ch', fontWeight: 300, marginBottom: 32 }}>
                            Join thousands forging their best body with AI-powered workouts built around their exact goals.
                        </p>

                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {[{ num: '120+', label: 'Exercises' }, { num: '12', label: 'Muscle Groups' }, { num: 'Free', label: 'Forever' }].map(s => (
                                <div key={s.label} className="stat-pill">
                                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: T.lime, lineHeight: 1 }}>{s.num}</span>
                                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.muted2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom — perks list */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className="float-card">
                            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.muted2, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
                                What you get
                            </div>
                            {[
                                'Personalized AI workout plans',
                                'Muscle group targeting & tracking',
                                'Progressive overload built-in',
                                'Equipment-aware programming',
                                'Unlimited workout generation',
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 4 ? `1px solid ${T.border}` : 'none' }}>
                                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(200,241,53,0.1)', border: `1px solid rgba(200,241,53,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                            <path d="M2 5l2.5 2.5 4-4" stroke="#C8F135" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span style={{ fontSize: 13, color: T.muted2, fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ RIGHT PANEL — FORM ══ */}
                <div className="su-right">
                    <div className="form-card">

                        {/* Mobile logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                            <svg viewBox="0 0 56 56" width="34" height="34">
                                <rect width="56" height="56" rx="10" fill="#0E0E0E" stroke="#2A2A2A" strokeWidth="1" />
                                <rect x="10" y="10" width="5" height="36" rx="2" fill="#C8F135" />
                                <rect x="10" y="10" width="22" height="5" rx="2" fill="#C8F135" />
                                <rect x="10" y="24" width="16" height="5" rx="2" fill="#C8F135" />
                                <line x1="32" y1="10" x2="42" y2="46" stroke="#C8F135" strokeWidth="4" strokeLinecap="round" />
                                <rect x="52" y="0" width="4" height="56" rx="2" fill="#C8F135" />
                            </svg>
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.08em', color: T.lime }}>FITORGE</span>
                        </div>

                        {/* Heading */}
                        <div style={{ marginBottom: 28 }}>
                            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.2rem,6vw,3rem)', lineHeight: 0.9, letterSpacing: '0.02em', color: T.ink, marginBottom: 8 }}>
                                CREATE ACCOUNT
                            </h2>
                            <p style={{ fontSize: 14, color: T.muted2, fontWeight: 400 }}>
                                Start forging in under 60 seconds.
                            </p>
                        </div>

                        {/* Error banner */}
                        {error && (
                            <div className="err-banner">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <circle cx="7" cy="7" r="6.5" stroke="#FF6B6B" />
                                    <path d="M7 4v3.5M7 9.5v.5" stroke="#FF6B6B" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                <span style={{ fontSize: 12, color: T.warn, fontFamily: "'DM Sans', sans-serif" }}>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate>

                            {/* ── Username (optional) ── */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted2 }}>
                                        Username
                                    </span>
                                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.muted, background: T.card3, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.06em' }}>
                                        optional
                                    </span>
                                </div>
                                <div className="input-wrap">
                                    <input
                                        className="fi"
                                        type="text"
                                        placeholder="e.g. ironmike"
                                        value={form.username}
                                        onChange={e => set('username', e.target.value)}
                                        autoComplete="username"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    />
                                    <span className="fi-icon"><IconUser /></span>
                                </div>
                                {form.username.length > 0 && form.username.length < 3 && (
                                    <span className="field-hint" style={{ color: T.muted2 }}>Minimum 3 characters</span>
                                )}
                            </div>

                            {/* ── Email ── */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted2, marginBottom: 8 }}>
                                    Email <span style={{ color: T.warn, fontSize: 11 }}>*</span>
                                </div>
                                <div className="input-wrap">
                                    <input
                                        className={`fi${emailEmpty || emailErr ? ' err' : emailValid && form.email.length > 0 ? ' ok' : ''}`}
                                        type="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={e => set('email', e.target.value)}
                                        onBlur={() => touch('email')}
                                        autoComplete="email"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    />
                                    <span className="fi-icon" style={{ color: emailValid && form.email.length > 0 ? T.ok : '#555', pointerEvents: 'none' }}>
                                        {emailValid && form.email.length > 0
                                            ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#34D399" strokeWidth="1.2" /><path d="M5 8l2.5 2.5 4-4" stroke="#34D399" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            : <IconMail />
                                        }
                                    </span>
                                </div>
                                {emailEmpty && <span className="field-hint" style={{ color: T.warn }}>Email is required</span>}
                                {emailErr && <span className="field-hint" style={{ color: T.warn }}>Enter a valid email address</span>}
                            </div>

                            {/* ── Password ── */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted2 }}>
                                        Password <span style={{ color: T.warn, fontSize: 11 }}>*</span>
                                    </span>
                                    <button type="button" className="btn-text" onClick={() => navigate('/forgot-password')}>
                                        Forgot Password?
                                    </button>
                                </div>

                                <div className="input-wrap">
                                    <input
                                        className={`fi${pwEmpty || pwErr ? ' err' : form.password.length > 0 && pwStrength.score >= 3 ? ' ok' : ''}`}
                                        type={show.pw ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={e => set('password', e.target.value)}
                                        onBlur={() => touch('password')}
                                        autoComplete="new-password"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    />
                                    <span className="fi-icon" onClick={() => setShow(s => ({ ...s, pw: !s.pw }))}>
                                        {show.pw ? <IconEyeOff /> : <IconEyeOn />}
                                    </span>
                                </div>

                                {/* Strength bar */}
                                {form.password.length > 0 && (
                                    <div style={{ marginTop: 8 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <div key={i} style={{
                                                        width: 28, height: 3, borderRadius: 2,
                                                        background: i <= pwStrength.score ? pwStrength.color : T.card3,
                                                        transition: 'background 0.3s',
                                                    }} />
                                                ))}
                                            </div>
                                            <span className="strength-label" style={{ color: pwStrength.color }}>
                                                {pwStrength.label}
                                            </span>
                                        </div>
                                        {/* Checklist */}
                                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
                                            {[
                                                { ok: pwMinLen, label: '8+ chars' },
                                                { ok: pwHasUpper, label: 'Uppercase' },
                                                { ok: pwHasNum, label: 'Number' },
                                            ].map(({ ok, label }) => (
                                                <div key={label} className="check-item" style={{ color: ok ? T.ok : T.muted }}>
                                                    <IconCheck ok={ok} />
                                                    {label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {pwEmpty && <span className="field-hint" style={{ color: T.warn }}>Password is required</span>}
                                {pwErr && <span className="field-hint" style={{ color: T.warn }}>Password is too weak</span>}
                            </div>

                            {/* ── Confirm Password ── */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted2, marginBottom: 8 }}>
                                    Re-enter Password <span style={{ color: T.warn, fontSize: 11 }}>*</span>
                                </div>
                                <div className="input-wrap">
                                    <input
                                        className={`fi${confirmWrong ? ' err' : confirmMatch ? ' ok' : ''}`}
                                        type={show.confirm ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={form.confirm}
                                        onChange={e => set('confirm', e.target.value)}
                                        onBlur={() => touch('confirm')}
                                        autoComplete="new-password"
                                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                                    />
                                    <span className="fi-icon" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}>
                                        {confirmMatch
                                            ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: T.ok }}><circle cx="8" cy="8" r="7" stroke="#34D399" strokeWidth="1.2" /><path d="M5 8l2.5 2.5 4-4" stroke="#34D399" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            : show.confirm ? <IconEyeOff /> : <IconEyeOn />
                                        }
                                    </span>
                                </div>
                                {confirmWrong && <span className="field-hint" style={{ color: T.warn }}>Passwords do not match</span>}
                                {confirmMatch && <span className="field-hint" style={{ color: T.ok }}>Passwords match ✓</span>}
                            </div>

                            {/* Submit */}
                            <button type="submit" className="btn-lime" disabled={loading || !canSubmit}>
                                {loading ? (
                                    <>
                                        <div style={{ width: 18, height: 18, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                        Creating account…
                                    </>
                                ) : (
                                    <>Create Account →</>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="divider">
                            <div className="div-line" />
                            <span className="div-txt">ALREADY HAVE AN ACCOUNT?</span>
                            <div className="div-line" />
                        </div>

                        {/* Back to Login */}
                        <button type="button" className="btn-ghost" onClick={() => navigate('/login')}>
                            <IconLock />
                            Sign In Instead
                        </button>

                        {/* Terms */}
                        <p style={{ marginTop: 22, fontSize: 11, color: T.muted, textAlign: 'center', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                            By creating an account you agree to our{' '}
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