import { useEffect, useRef } from 'react';
import { FitOrge } from '../image/Icons';


const MUSCLE_COLORS = {
  Chest: '#FF6B6B',
  'Upper Chest': '#FF8E53',
  Shoulders: '#FFBE0B',
  Triceps: '#3A86FF',
  Back: '#8338EC',
  Biceps: '#06D6A0',
  Legs: '#FB5607',
  Core: '#FF006E',
  Glutes: '#8B5CF6',
  Hamstrings: '#F97316',
  Calves: '#14B8A6',
  Forearms: '#84CC16',
};

const EXERCISE_COUNTS = {
  Chest: 18, 'Upper Chest': 9, Shoulders: 22, Triceps: 14,
  Back: 20, Biceps: 12, Legs: 24, Core: 16,
  Glutes: 11, Hamstrings: 8, Calves: 7, Forearms: 6,
};

const FEATURES = [
  { num: '01', title: 'AI Workout Generation', desc: 'Answer a few questions, get a science-backed program built for your exact body, goals, and schedule. Every time.' },
  { num: '02', title: 'Muscle Targeting', desc: 'Visualize exactly which muscles each exercise activates. Track volume per group and eliminate imbalances.' },
  { num: '03', title: 'Progressive Overload', desc: 'Auto-adjusting difficulty curves that keep you in the optimal training zone — not too easy, never reckless.' },
  { num: '04', title: 'Difficulty Scaling', desc: 'Beginner to Advanced. The system meets you where you are and evolves as your strength grows.' },
  { num: '05', title: 'Equipment Aware', desc: 'Bodyweight, dumbbells, full gym — Forge optimizes for whatever you have. No excuses, no barriers.' },
  { num: '06', title: 'Instant Programs', desc: 'Zero waiting. Your full personalized workout appears in seconds — ready to load, save, and crush.' },
];

const STEPS = [
  { num: '01', title: 'Tell us about yourself', desc: 'Fitness level, available equipment, weekly schedule, and which muscles you want to target.' },
  { num: '02', title: 'AI builds your program', desc: 'Our engine selects and sequences exercises for optimal muscle activation, recovery, and progression.' },
  { num: '03', title: 'Train. Adapt. Repeat.', desc: 'Follow the plan, log your performance, and let Forge evolve the program to keep you progressing.' },
];

const SAMPLE_WORKOUT = [
  { name: 'Barbell Bench Press', muscles: 'Chest · Upper Chest', sets: '4 × 8', color: '#FF6B6B' },
  { name: 'Incline Dumbbell Press', muscles: 'Upper Chest · Shoulders', sets: '3 × 10', color: '#FF8E53' },
  { name: 'Lateral Raises', muscles: 'Shoulders', sets: '4 × 15', color: '#FFBE0B' },
  { name: 'Tricep Pushdown', muscles: 'Triceps', sets: '3 × 12', color: '#3A86FF' },
  { name: 'Cable Flyes', muscles: 'Chest', sets: '3 × 15', color: '#06D6A0' },
];

const STATS = [
  { num: '120+', label: 'Exercises in Library' },
  { num: '12', label: 'Muscle Groups' },
  { num: '3', label: 'Difficulty Levels' },
  { num: '<5s', label: 'Generation Time' },
];

const MARQUEE_ITEMS = Object.keys(MUSCLE_COLORS);

export default function Home() {
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const musclesRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const stepsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.12 }
    );

    const targets: Element[] = [
      ...(featuresRef.current?.querySelectorAll('.feat-card') ?? []),
      ...(musclesRef.current?.querySelectorAll('.muscle-chip') ?? []),
      ...(statsRef.current?.querySelectorAll('.stat-card') ?? []),
      ...(stepsRef.current?.querySelectorAll('.step-item') ?? []),
    ] as Element[];

    (targets as HTMLElement[]).forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: '#0E0E0E', color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden', minHeight: '100vh' }}>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .display  { font-family: 'Bebas Neue', sans-serif; }
        .mono     { font-family: 'Space Mono', monospace; }

        /* fade-up hero animations */
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes marquee { from { transform:translateX(0); } to { transform:translateX(-50%); } }

        .hero-eyebrow  { animation: fadeUp .6s .2s both; }
        .hero-title    { animation: fadeUp .7s .35s both; }
        .hero-body     { animation: fadeUp .6s .5s both; }
        .hero-actions  { animation: fadeUp .6s .65s both; }
        .hero-stats    { animation: fadeUp .6s .8s both; }
        .hero-badge    { animation: fadeIn .4s 1.2s both; }
        .hero-float    { animation: fadeUp .6s 1s both; }

        .marquee-inner { display:inline-flex; animation: marquee 22s linear infinite; }

        /* nav links */
        .nav-link { color:#999; text-decoration:none; font-size:.8rem; letter-spacing:.06em; text-transform:uppercase; transition:color .2s; }
        .nav-link:hover { color:#fff; }

        /* buttons */
        .btn-primary { transition: background .2s, transform .2s; }
        .btn-primary:hover { background:#d6ff40 !important; transform:translateY(-2px); }

        .btn-ghost { transition: gap .2s; }
        .btn-ghost:hover { gap:.9rem !important; }

        .cta-btn { transition: background .2s, transform .2s; }
        .cta-btn:hover { background:#d6ff40 !important; transform:translateY(-3px); }
        .cta-btn:hover .cta-arrow { transform:translateX(4px) !important; }
        .cta-arrow { display:inline-block; transition:transform .2s; }

        /* cards */
        .feat-card { transition: background .3s; cursor:default; }
        .feat-card:hover { background:#181818 !important; }
        .feat-card:hover .feat-num { color:#C8F135 !important; }
        .feat-num { transition: color .3s; }

        .step-item { cursor:default; }
        .step-item:hover .step-num { color:#C8F135 !important; }
        .step-num { transition: color .3s; }

        .muscle-chip { transition: transform .2s, background .2s; cursor:default; }
        .muscle-chip:hover { transform:translateY(-3px); background:#0E0E0E !important; }

        .exercise-row { transition: border-color .2s; }
        .exercise-row:hover { border-color:#C8F135 !important; }

        .footer-link { color:#666; text-decoration:none; font-size:.82rem; letter-spacing:.05em; transition:color .2s; }
        .footer-link:hover { color:#fff; }

        /* responsive */
        @media (max-width:1024px) {
          .hero-layout    { grid-template-columns:1fr !important; }
          .hero-right     { height:360px !important; }
          .features-grid  { grid-template-columns:repeat(2,1fr) !important; }
          .how-grid       { grid-template-columns:1fr !important; gap:3rem !important; }
          .muscles-grid   { grid-template-columns:repeat(3,1fr) !important; }
          .stats-grid     { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media (max-width:640px) {
          .nav-links      { display:none !important; }
          .features-grid  { grid-template-columns:1fr !important; }
          .muscles-grid   { grid-template-columns:repeat(2,1fr) !important; }
          .stats-grid     { grid-template-columns:repeat(2,1fr) !important; }
          .hero-stats     { flex-wrap:wrap; gap:1.5rem !important; }
          .footer-inner   { flex-direction:column; align-items:flex-start !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(1.5rem,5vw,4rem)', height: 64,
        borderBottom: '1px solid #272727',
        background: 'rgba(14,14,14,0.88)', backdropFilter: 'blur(16px)',
      }}>
        <div className="display" style={{ fontSize: '1.8rem', letterSpacing: '.05em', color: '#C8F135' }}><FitOrge height={50}/>
        </div>

        <ul className="nav-links mono" style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
          {['Workouts', 'Programs', 'Muscles', 'About'].map(l => (
            <li key={l}><a href="#" className="nav-link mono">{l}</a></li>
          ))}
        </ul>

        <a href="/workout" className="btn-primary mono" style={{
          background: '#C8F135', color: '#000', fontWeight: 700, fontSize: '.78rem',
          padding: '.55rem 1.4rem', borderRadius: 100, textDecoration: 'none',
          letterSpacing: '.06em', textTransform: 'uppercase',
        }}>Start Training</a>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="hero-layout" style={{
        minHeight: '100svh', display: 'grid', gridTemplateColumns: '1fr 1fr', paddingTop: 64,
      }}>

        {/* Left */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(3rem,8vw,7rem) clamp(1.5rem,5vw,4rem)',
        }}>
          <p className="hero-eyebrow mono" style={{ fontSize: '.7rem', color: '#C8F135', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            // AI-Powered Training
          </p>

          <h1 className="hero-title display" style={{ fontSize: 'clamp(5rem,10vw,10rem)', lineHeight: .9, letterSpacing: '.01em' }}>
            BUILT<br />TO BE<br /><span style={{ color: '#C8F135' }}>FORGED.</span>
          </h1>

          <p className="hero-body" style={{ marginTop: '2rem', maxWidth: '38ch', fontSize: '1.05rem', color: '#999', lineHeight: 1.7, fontWeight: 300 }}>
            Generate science-backed workout programs tailored to your body, goals, and available time. No guesswork — just results.
          </p>

          <div className="hero-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
            <a href="/workout" className="btn-primary" style={{
              background: '#C8F135', color: '#000', fontWeight: 700, fontSize: '.95rem',
              padding: '.9rem 2rem', borderRadius: 100, textDecoration: 'none',
              letterSpacing: '.03em', display: 'inline-flex', alignItems: 'center', gap: '.5rem',
            }}>Generate Workout <span>→</span></a>

            <a href="#how" className="btn-ghost" style={{
              color: '#fff', fontSize: '.9rem', fontWeight: 500, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '.5rem',
            }}>See how it works <span>→</span></a>
          </div>

          <div className="hero-stats" style={{ display: 'flex', gap: '2.5rem', marginTop: '3.5rem' }}>
            {[{ num: '120+', label: 'Exercises' }, { num: '12', label: 'Muscle Groups' }, { num: '∞', label: 'Combinations' }].map(s => (
              <div key={s.label} style={{ borderLeft: '2px solid #C8F135', paddingLeft: '1rem' }}>
                <div className="display" style={{ fontSize: '2.2rem', lineHeight: 1 }}>{s.num}</div>
                <div className="mono" style={{ fontSize: '.7rem', color: '#666', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – visual panel */}
        <div className="hero-right" style={{ position: 'relative', overflow: 'hidden', background: '#181818' }}>

          {/* Grid lines */}
          <div style={{
            position: 'absolute', inset: 0, display: 'grid',
            gridTemplateColumns: 'repeat(8,1fr)', gridTemplateRows: 'repeat(10,1fr)', opacity: .06,
          }}>
            {Array.from({ length: 80 }).map((_, i) => <span key={i} style={{ border: '.5px solid #C8F135' }} />)}
          </div>

          {/* Silhouette */}
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width="260" height="400" viewBox="0 0 280 420" fill="none" style={{ opacity: .15 }}>
              <ellipse cx="140" cy="50" rx="28" ry="30" fill="#C8F135" />
              <rect x="110" y="82" width="60" height="110" rx="12" fill="#C8F135" />
              <rect x="70" y="88" width="36" height="95" rx="10" fill="#C8F135" />
              <rect x="174" y="88" width="36" height="95" rx="10" fill="#C8F135" />
              <rect x="113" y="190" width="26" height="120" rx="8" fill="#C8F135" />
              <rect x="141" y="190" width="26" height="120" rx="8" fill="#C8F135" />
              <rect x="112" y="310" width="28" height="80" rx="8" fill="#C8F135" />
              <rect x="142" y="310" width="28" height="80" rx="8" fill="#C8F135" />
            </svg>
          </div>

          {/* Badge */}
          {/* <div className="hero-badge mono" style={{
            position: 'absolute', top: '2rem', right: '2rem',
            background: '#C8F135', color: '#000', fontSize: '.65rem', fontWeight: 700,
            padding: '.4rem .8rem', borderRadius: 100, letterSpacing: '.1em',
          }}>LIVE PREVIEW</div> */}

          {/* Float card */}
          <div className="hero-float" style={{
            position: 'absolute', bottom: '2.5rem', left: '2rem', right: '2rem',
            background: 'rgba(14,14,14,0.92)', border: '1px solid #272727',
            borderRadius: 16, padding: '1.25rem 1.5rem',
            backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '1.25rem',
          }}>
            <svg width="56" height="56" viewBox="0 0 56 56" style={{ flexShrink: 0 }}>
              <circle cx="28" cy="28" r="22" fill="none" stroke="#272727" strokeWidth="3" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="#C8F135" strokeWidth="3"
                strokeLinecap="round" strokeDasharray="138" strokeDashoffset="35"
                style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }} />
            </svg>
            <div>
              <div className="mono" style={{ fontSize: '.7rem', color: '#666', textTransform: 'uppercase', letterSpacing: '.1em' }}>Today's Goal</div>
              <div className="display" style={{ fontSize: '1.5rem', lineHeight: 1.2 }}>75% Done</div>
              <div style={{ fontSize: '.78rem', color: '#999', marginTop: '.15rem' }}>3 of 4 exercises complete</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid #272727', borderBottom: '1px solid #272727', background: '#181818', padding: '.9rem 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div className="marquee-inner">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].flatMap((item, i) => [
            <span key={`item-${i}`} className="mono" style={{ fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: i % 3 === 0 ? '#C8F135' : '#666', padding: '0 2rem' }}>{item}</span>,
            <span key={`dot-${i}`} className="mono" style={{ fontSize: '.7rem', color: '#333', padding: '0 .5rem' }}>·</span>,
          ])}
        </div>
      </div>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
        <p className="mono" style={{ fontSize: '.7rem', color: '#C8F135', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '1rem' }}>// What we do</p>
        <h2 className="display" style={{ fontSize: 'clamp(2.5rem,5vw,5rem)', lineHeight: .95, letterSpacing: '.02em' }}>TRAIN<br />SMARTER.</h2>

        <div ref={featuresRef} className="features-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
          gap: '1px', background: '#272727', marginTop: '4rem', border: '1px solid #272727',
        }}>
          {FEATURES.map(f => (
            <div key={f.num} className="feat-card" style={{ background: '#0E0E0E', padding: '2.5rem 2rem' }}>
              <div className="feat-num display" style={{ fontSize: '5rem', color: '#272727', lineHeight: 1, marginBottom: '1rem' }}>{f.num}</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '.7rem' }}>{f.title}</div>
              <div style={{ fontSize: '.88rem', color: '#999', lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="how" style={{ background: '#181818', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
        <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>

          {/* Steps */}
          <div>
            <p className="mono" style={{ fontSize: '.7rem', color: '#C8F135', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '1rem' }}>// How it works</p>
            <h2 className="display" style={{ fontSize: 'clamp(2.5rem,5vw,5rem)', lineHeight: .95, letterSpacing: '.02em', marginBottom: '3rem' }}>THREE<br />STEPS.</h2>

            <div ref={stepsRef}>
              {STEPS.map((s, i) => (
                <div key={s.num} className="step-item" style={{
                  display: 'flex', gap: '2rem', padding: '2rem 0',
                  borderBottom: i < STEPS.length - 1 ? '1px solid #272727' : 'none',
                }}>
                  <div className="step-num display" style={{ fontSize: '3.5rem', color: '#272727', lineHeight: 1, flexShrink: 0, width: '3.5rem' }}>{s.num}</div>
                  <div style={{ paddingTop: '.4rem' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '.4rem' }}>{s.title}</div>
                    <div style={{ fontSize: '.85rem', color: '#999', lineHeight: 1.7 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Workout preview card */}
          <div style={{ background: '#0E0E0E', borderRadius: 24, border: '1px solid #272727', overflow: 'hidden', aspectRatio: '9/10', display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '2rem', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div className="display" style={{ fontSize: '1.6rem', letterSpacing: '.03em' }}>PUSH DAY A</div>
                <div className="mono" style={{ background: '#C8F135', color: '#000', fontSize: '.65rem', fontWeight: 700, padding: '.3rem .7rem', borderRadius: 100, letterSpacing: '.1em' }}>INTERMEDIATE</div>
              </div>
              {SAMPLE_WORKOUT.map(ex => (
                <div key={ex.name} className="exercise-row" style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '.9rem 1rem', background: '#1F1F1F', borderRadius: 12,
                  marginBottom: '.7rem', border: '1px solid transparent',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: ex.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '.88rem', fontWeight: 500 }}>{ex.name}</div>
                    <div className="mono" style={{ fontSize: '.72rem', color: '#666', marginTop: '.1rem' }}>{ex.muscles}</div>
                  </div>
                  <div className="mono" style={{ fontSize: '.78rem', color: '#999' }}>{ex.sets}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MUSCLE GROUPS
      ══════════════════════════════════════ */}
      <section style={{ background: '#0E0E0E', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
        <p className="mono" style={{ fontSize: '.7rem', color: '#C8F135', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '1rem' }}>// Muscle targeting</p>
        <h2 className="display" style={{ fontSize: 'clamp(2.5rem,5vw,5rem)', lineHeight: .95, letterSpacing: '.02em' }}>EVERY<br />MUSCLE.</h2>

        <div ref={musclesRef} className="muscles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginTop: '3rem' }}>
          {Object.entries(MUSCLE_COLORS).map(([name, color]) => (
            <div key={name} className="muscle-chip" style={{ background: '#181818', border: '1px solid #272727', borderRadius: 12, padding: '1.25rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, marginBottom: '.75rem' }} />
              <div style={{ fontSize: '.88rem', fontWeight: 600 }}>{name}</div>
              <div className="mono" style={{ fontSize: '.7rem', color: '#666', marginTop: '.2rem' }}>{(EXERCISE_COUNTS as any)[name]} exercises</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section style={{ background: '#1F1F1F', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
        <p className="mono" style={{ fontSize: '.7rem', color: '#C8F135', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: '1rem' }}>// By the numbers</p>
        <h2 className="display" style={{ fontSize: 'clamp(2.5rem,5vw,5rem)', lineHeight: .95, letterSpacing: '.02em' }}>THE<br />PROOF.</h2>

        <div ref={statsRef} className="stats-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
          gap: '1px', background: '#272727', border: '1px solid #272727', marginTop: '3rem',
        }}>
          {STATS.map(s => (
            <div key={s.label} className="stat-card" style={{ background: '#1F1F1F', padding: '3rem 2rem', textAlign: 'center' }}>
              <div className="display" style={{ fontSize: 'clamp(3rem,5vw,5.5rem)', color: '#C8F135', lineHeight: 1 }}>{s.num}</div>
              <div className="mono" style={{ fontSize: '.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '.12em', marginTop: '.5rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section style={{ textAlign: 'center', padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)', position: 'relative', overflow: 'hidden' }}>
        {/* Background watermark */}
        <div className="display" style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'clamp(8rem,20vw,22rem)', color: 'rgba(255,255,255,0.025)',
          pointerEvents: 'none', letterSpacing: '.05em', lineHeight: 1, zIndex: 0,
        }}>FORGE</div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="display" style={{ fontSize: 'clamp(3.5rem,8vw,9rem)', lineHeight: .9, letterSpacing: '.02em', marginBottom: '1.5rem' }}>
            READY TO<br /><span style={{ color: '#C8F135' }}>FORGE?</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#999', maxWidth: '45ch', margin: '0 auto 3rem', fontWeight: 300 }}>
            Stop guessing, start building. Generate your personalized workout in seconds — completely free.
          </p>
          <a href="/workout" className="cta-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: '.75rem',
            background: '#C8F135', color: '#000', fontWeight: 700, fontSize: '1rem',
            padding: '1.1rem 2.5rem', borderRadius: 100, textDecoration: 'none', letterSpacing: '.03em',
          }}>
            Generate Your Workout <span className="cta-arrow">→</span>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid #272727', padding: '3rem clamp(1.5rem,5vw,4rem)' }}>
        <div className="footer-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="display" style={{ fontSize: '1.6rem', letterSpacing: '.05em', color: '#C8F135' }}>FORGE</div>
          <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
            {['Workouts', 'Programs', 'Muscles', 'Privacy', 'Terms'].map(l => (
              <li key={l}><a href="#" className="footer-link">{l}</a></li>
            ))}
          </ul>
          <div className="mono" style={{ fontSize: '.7rem', color: '#666', letterSpacing: '.08em' }}>© 2025 FORGE — Built to be forged.</div>
        </div>
      </footer>

    </div>
  );
}