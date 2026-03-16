'use client';
import { useLocation, useNavigate } from 'react-router-dom';
import { Share2, ChevronLeft, RotateCcw, Dumbbell } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  sets: number;
  reps: string;
  rest: string;
  weight: 'bodyweight' | 'light' | 'moderate' | 'heavy';
  tips: string;
}

interface WorkoutData {
  day: string;
  focus: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  total_duration: number;
  calories_estimate: number;
  equipment: string[];
  warmup: string;
  cooldown: string;
  notes: string;
  exercises: Exercise[];
}

const T = {
  bg: '#0E0E0E', card: '#161616', card2: '#1E1E1E', card3: '#242424',
  ink: '#FFFFFF', muted: '#555', muted2: '#888', border: '#2A2A2A', lime: '#C8F135',
} as const;

const MUSCLE_COLORS: Record<string, string> = {
  Chest: '#FF6B6B', 'Upper Chest': '#FF8E53', Shoulders: '#FFBE0B',
  Triceps: '#3A86FF', Back: '#8338EC', Biceps: '#06D6A0', Legs: '#FB5607',
  Core: '#FF006E', Glutes: '#8B5CF6', Hamstrings: '#F97316',
  Calves: '#14B8A6', Forearms: '#84CC16',
};

const DIFF_CFG: Record<string, { color: string; bg: string; border: string }> = {
  Beginner:     { color: '#34D399', bg: 'rgba(52,211,153,0.09)',   border: 'rgba(52,211,153,0.3)'  },
  Intermediate: { color: '#FBBF24', bg: 'rgba(251,191,36,0.09)',  border: 'rgba(251,191,36,0.3)'  },
  Advanced:     { color: '#F87171', bg: 'rgba(248,113,113,0.09)', border: 'rgba(248,113,113,0.3)' },
};

const WEIGHT_CFG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  bodyweight: { label: 'BW',       color: '#888',    bg: 'rgba(136,136,136,0.09)', border: 'rgba(136,136,136,0.3)' },
  light:      { label: 'Light',    color: '#34D399', bg: 'rgba(52,211,153,0.09)',  border: 'rgba(52,211,153,0.3)'  },
  moderate:   { label: 'Moderate', color: '#FBBF24', bg: 'rgba(251,191,36,0.09)', border: 'rgba(251,191,36,0.3)'  },
  heavy:      { label: 'Heavy',    color: '#F87171', bg: 'rgba(248,113,113,0.09)',border: 'rgba(248,113,113,0.3)' },
};

function WeightBadge({ weight }: { weight: string }) {
  const cfg = WEIGHT_CFG[weight] ?? WEIGHT_CFG.moderate;
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
      padding: '4px 10px', borderRadius: 100, letterSpacing: '0.1em',
      textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <span style={{
        fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: T.muted2,
        whiteSpace: 'nowrap',
      }}>
        {text}
      </span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const muscleColor = MUSCLE_COLORS[exercise.muscle_group] ?? T.lime;
  return (
    <div
      className="ex-card"
      style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 16,
        overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        animation: `slideUp 0.4s ${index * 60}ms both`,
        WebkitTapHighlightColor: 'transparent',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'rgba(200,241,53,0.28)';
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = T.border;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ width: 3, flexShrink: 0, background: muscleColor, alignSelf: 'stretch' }} />
        <div style={{ flex: 1, minWidth: 0, padding: '14px 16px 12px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', gap: 10, marginBottom: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Space Mono', monospace", fontSize: 10,
                color: T.muted, letterSpacing: '0.15em', marginBottom: 4,
              }}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
                color: T.ink, lineHeight: 1.3, marginBottom: 3, wordBreak: 'break-word',
              }}>
                {exercise.name}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                fontWeight: 600, color: muscleColor,
              }}>
                {exercise.muscle_group}
              </div>
            </div>
            <WeightBadge weight={exercise.weight} />
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            background: T.card2, borderRadius: 12, overflow: 'hidden',
          }}>
            {[
              { val: exercise.sets, label: 'Sets' },
              { val: exercise.reps, label: 'Reps' },
              { val: exercise.rest, label: 'Rest' },
            ].map(({ val, label }, i) => (
              <div key={label} style={{ position: 'relative', padding: '12px 8px', textAlign: 'center' }}>
                {i > 0 && (
                  <div style={{
                    position: 'absolute', left: 0, top: '18%', height: '64%',
                    width: 1, background: T.border,
                  }} />
                )}
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: 28,
                  lineHeight: 1, color: T.ink, letterSpacing: '0.02em',
                }}>
                  {val}
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 9,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: T.muted, marginTop: 3,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {exercise.tips && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          padding: '10px 16px 10px 19px',
          background: 'rgba(200,241,53,0.03)',
          borderTop: '1px solid rgba(200,241,53,0.08)',
        }}>
          <span style={{ color: T.lime, fontSize: 10, flexShrink: 0, marginTop: 2 }}>▸</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
            color: T.muted2, lineHeight: 1.65, fontStyle: 'italic',
          }}>
            {exercise.tips}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const workout: WorkoutData | null =
    (location.state as { workout?: WorkoutData } | null)?.workout ?? null;

  const handleShare = async () => {
    const text = workout
      ? `${workout.day} — ${workout.focus} • ${workout.total_duration} min`
      : 'FORGE Workout';
    if (navigator.share) {
      await navigator.share({ title: 'FORGE Workout', text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  if (!workout) {
    return (
      <div style={{
        minHeight: '100svh', background: T.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 20, padding: '0 24px', fontFamily: "'DM Sans', sans-serif",
      }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');`}</style>
        <Dumbbell style={{ color: T.lime, width: 52, height: 52 }} />
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', color: T.ink, letterSpacing: '0.06em', textAlign: 'center' }}>
          NO WORKOUT DATA
        </div>
        <div style={{ fontSize: 15, color: T.muted2, textAlign: 'center', maxWidth: 300, lineHeight: 1.7 }}>
          Something went wrong loading your workout. Generate a new one to get started.
        </div>
        <button
          onClick={() => navigate('/workout')}
          style={{
            background: T.lime, color: '#000', fontWeight: 800, fontSize: 13,
            padding: '15px 36px', borderRadius: 100, border: 'none', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase',
          }}
        >
          Generate Workout
        </button>
      </div>
    );
  }

  const diff = DIFF_CFG[workout.difficulty] ?? DIFF_CFG.Intermediate;
  const totalSets = workout.exercises.reduce((s, e) => s + e.sets, 0);
  const focusShort = workout.focus.split(/[–—-]/)[0].trim().toUpperCase();

  return (
    <div style={{ minHeight: '100svh', background: T.bg, color: T.ink, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #161616; }
        ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 2px; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* ── Outer shell: full bleed dark sidebar on desktop ── */
        .result-shell {
          display: grid;
          grid-template-columns: 1fr;
          min-height: 100svh;
        }
        @media (min-width: 900px) {
          .result-shell {
            grid-template-columns: 280px 1fr;
          }
        }

        /* ── Left sidebar (desktop only) ── */
        .result-sidebar {
          display: none;
        }
        @media (min-width: 900px) {
          .result-sidebar {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 40px 32px;
            border-right: 1px solid #242424;
            position: sticky;
            top: 0;
            height: 100svh;
            overflow: hidden;
          }
        }

        /* ── Main content column ── */
        .result-main {
          max-width: 680px;
          width: 100%;
          margin: 0 auto;
          padding-bottom: 56px;
        }
        @media (min-width: 900px) {
          .result-main {
            padding: 0 48px 56px;
            margin: 0;
            max-width: 100%;
          }
        }

        /* ── Sticky navbar ── */
        .result-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(14,14,14,0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #242424;
          padding: 0 20px;
        }
        @media (min-width: 900px) {
          .result-nav { display: none; }
        }

        /* ── Content padding ── */
        .result-body { padding: 0 20px; }
        @media (min-width: 640px) { .result-body { padding: 0 32px; } }
        @media (min-width: 900px) { .result-body { padding: 0; } }

        /* ── Prep grid ── */
        .prep-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        @media (max-width: 380px) {
          .prep-grid { grid-template-columns: 1fr; }
        }

        /* ── Exercise list: 2-col on wide screens ── */
        .exercise-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        @media (min-width: 1100px) {
          .exercise-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
        }

        /* ── Stats grid big numbers on desktop ── */
        .stat-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(26px, 4vw, 40px);
          line-height: 1;
          color: #FFFFFF;
          letter-spacing: 0.02em;
        }
        .stat-lbl {
          font-family: 'Space Mono', monospace;
          font-size: clamp(8px, 1.2vw, 10px);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #555;
          margin-top: 4px;
        }

        /* Touch feedback */
        @media (hover: none) {
          .ex-card:active {
            border-color: rgba(200,241,53,0.28) !important;
            transform: scale(0.99) !important;
          }
        }

        .equip-chip {
          font-family: 'Space Mono', monospace; font-size: 11px;
          color: #888; background: #1E1E1E; border: 1px solid #2A2A2A;
          padding: 6px 12px; border-radius: 100px; letter-spacing: 0.06em;
          text-transform: capitalize; white-space: nowrap;
        }
      `}</style>

      <div className="result-shell">

        {/* ══ DESKTOP SIDEBAR ══ */}
        <aside className="result-sidebar">
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 28,
              letterSpacing: '0.1em', color: T.lime, marginBottom: 40,
            }}>
              FORGE
            </div>

            {/* Workout meta */}
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 10, color: T.muted2,
              letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8,
            }}>
              {workout.day}
            </div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.4rem, 3vw, 3.2rem)',
              lineHeight: 0.88, letterSpacing: '0.02em',
              color: T.ink, marginBottom: 10, wordBreak: 'break-word',
            }}>
              {focusShort}
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              color: T.muted2, fontStyle: 'italic', lineHeight: 1.55, marginBottom: 20,
            }}>
              {workout.focus}
            </p>

            {/* Difficulty badge */}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
              fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em',
              color: diff.color, background: diff.bg, border: `1px solid ${diff.border}`,
              marginBottom: 24,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: diff.color }} />
              {workout.difficulty}
            </span>

            {/* Lime divider */}
            <div style={{ width: 40, height: 2, background: T.lime, borderRadius: 1, marginBottom: 28 }} />

            {/* Stats vertical */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { val: `${workout.total_duration}`, unit: 'MIN',  label: 'Duration'   },
                { val: `${workout.calories_estimate}`, unit: 'KCAL', label: 'Est. Calories' },
                { val: `${workout.exercises.length}`, unit: '',   label: 'Exercises'  },
                { val: `${totalSets}`, unit: '',   label: 'Total Sets' },
              ].map(({ val, unit, label }) => (
                <div key={label} style={{ borderLeft: `2px solid ${T.border}`, paddingLeft: 14 }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 32,
                    lineHeight: 1, color: T.ink, letterSpacing: '0.02em',
                  }}>
                    {val}
                    {unit && <span style={{ fontSize: 14, color: T.muted2, marginLeft: 4, fontFamily: "'Space Mono', monospace", letterSpacing: '0.1em' }}>{unit}</span>}
                  </div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 9,
                    letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted, marginTop: 2,
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleShare}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '11px 0', borderRadius: 12,
                background: 'rgba(200,241,53,0.07)', border: '1px solid rgba(200,241,53,0.25)',
                cursor: 'pointer', color: T.lime, fontSize: 12, fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,241,53,0.13)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(200,241,53,0.07)'; }}
            >
              <Share2 size={14} /> Share
            </button>
            <button
              onClick={() => navigate('/workout')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 0', borderRadius: 12,
                background: T.lime, border: 'none',
                cursor: 'pointer', color: '#000', fontSize: 12, fontWeight: 900,
                fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em', textTransform: 'uppercase',
                transition: 'background 0.15s',
                boxShadow: '0 4px 20px rgba(200,241,53,0.2)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#d6ff40'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = T.lime; }}
            >
              <RotateCcw size={14} /> New Workout
            </button>
          </div>
        </aside>

        {/* ══ MAIN COLUMN ══ */}
        <div>

          {/* ── Mobile-only sticky nav ── */}
          <div className="result-nav">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
              <button
                onClick={() => navigate(-1)}
                style={{
                  width: 36, height: 36, background: T.card2, border: `1px solid ${T.border}`,
                  borderRadius: 10, cursor: 'pointer', color: T.ink,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  WebkitTapHighlightColor: 'transparent', flexShrink: 0,
                }}
              >
                <ChevronLeft size={17} />
              </button>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.08em', color: T.lime }}>
                FORGE
              </span>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 100,
                  background: 'rgba(200,241,53,0.08)', border: '1px solid rgba(200,241,53,0.3)',
                  cursor: 'pointer', color: T.lime, fontSize: 11, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.05em',
                  WebkitTapHighlightColor: 'transparent', flexShrink: 0,
                }}
              >
                <Share2 size={12} /> Share
              </button>
            </div>
          </div>

          <div className="result-main">

            {/* ── HERO (mobile/tablet only — hidden on desktop since sidebar has it) ── */}
            <div style={{ padding: '24px 0 0', animation: 'fadeIn 0.5s ease' }} className="result-body">
              {/* Mobile hero title */}
              <div className="desktop-hide" style={{ marginBottom: 20 }}>
                <style>{`.desktop-hide { display: block; } @media (min-width: 900px) { .desktop-hide { display: none; } }`}</style>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.muted2,
                  letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 5,
                }}>
                  {workout.day}
                </div>
                <h1 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(2.6rem, 9vw, 4rem)',
                  lineHeight: 0.88, letterSpacing: '0.02em', color: T.ink,
                  marginBottom: 6, wordBreak: 'break-word',
                }}>
                  {focusShort}
                </h1>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                  color: T.muted2, fontStyle: 'italic', marginBottom: 14, lineHeight: 1.55,
                }}>
                  {workout.focus}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '5px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                    fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em',
                    color: diff.color, background: diff.bg, border: `1px solid ${diff.border}`,
                    whiteSpace: 'nowrap',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: diff.color, flexShrink: 0 }} />
                    {workout.difficulty}
                  </span>
                  {[
                    { icon: '⏱', val: `${workout.total_duration} min` },
                    { icon: '🔥', val: `~${workout.calories_estimate} kcal` },
                  ].map(({ icon, val }) => (
                    <span key={val} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '5px 10px', borderRadius: 100, fontSize: 10, fontWeight: 600,
                      fontFamily: "'Space Mono', monospace", letterSpacing: '0.06em',
                      color: T.muted2, background: T.card2, border: `1px solid ${T.border}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {icon} {val}
                    </span>
                  ))}
                </div>
                <div style={{ width: '28%', height: 2, background: T.lime, borderRadius: 1 }} />
              </div>

              {/* Desktop page title */}
              <div className="mobile-hide" style={{ marginBottom: 28 }}>
                <style>{`.mobile-hide { display: none; } @media (min-width: 900px) { .mobile-hide { display: block; } }`}</style>
                <div style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 10, color: T.muted2,
                  letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10,
                }}>
                  // Workout Plan
                </div>
                <div style={{ width: '20%', height: 2, background: T.lime, borderRadius: 1 }} />
              </div>
            </div>

            {/* ── SUMMARY STATS (mobile only — desktop uses sidebar) ── */}
            <div className="result-body desktop-hide" style={{ marginBottom: 24 }}>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                border: `1px solid ${T.border}`, borderRadius: 16,
                overflow: 'hidden', gap: 1, background: T.border,
              }}>
                {[
                  { val: workout.exercises.length,     label: 'Exercises'  },
                  { val: totalSets,                    label: 'Total Sets' },
                  { val: `${workout.total_duration}m`, label: 'Duration'   },
                ].map(({ val, label }) => (
                  <div key={label} style={{ background: T.card, padding: '14px 6px', textAlign: 'center' }}>
                    <div className="stat-val">{val}</div>
                    <div className="stat-lbl">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── PREPARATION ── */}
            <div className="result-body" style={{ marginBottom: 24 }}>
              <SectionLabel text="Preparation" />
              <div className="prep-grid">
                {[
                  { label: '▲ Warm-up',   text: workout.warmup   },
                  { label: '▼ Cool-down', text: workout.cooldown },
                ].map(({ label, text }) => (
                  <div key={label} style={{
                    background: T.card, border: `1px solid ${T.border}`,
                    borderRadius: 14, padding: '14px 16px',
                  }}>
                    <div style={{
                      fontFamily: "'Space Mono', monospace", fontSize: 9,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: T.lime, marginBottom: 7,
                    }}>
                      {label}
                    </div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                      color: T.muted2, lineHeight: 1.65,
                    }}>
                      {text}
                    </div>
                  </div>
                ))}
              </div>

              {workout.notes && (
                <div style={{
                  background: T.card, border: `1px solid ${T.border}`,
                  borderLeft: '2px solid rgba(200,241,53,0.45)',
                  borderRadius: 14, padding: '14px 16px',
                }}>
                  <div style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 9,
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: T.lime, marginBottom: 7,
                  }}>
                    💬 Coach's Note
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                    color: T.muted2, lineHeight: 1.65,
                  }}>
                    {workout.notes}
                  </div>
                </div>
              )}
            </div>

            {/* ── EQUIPMENT ── */}
            {workout.equipment?.length > 0 && (
              <div className="result-body" style={{ marginBottom: 24 }}>
                <SectionLabel text="Equipment" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {workout.equipment.map(eq => (
                    <span key={eq} className="equip-chip">{eq}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── EXERCISES ── */}
            <div className="result-body" style={{ marginBottom: 28 }}>
              <SectionLabel text="Exercises" />
              <div className="exercise-list">
                {workout.exercises.map((ex, i) => (
                  <ExerciseCard key={ex.id} exercise={ex} index={i} />
                ))}
              </div>
            </div>

            {/* ── CTA (mobile only) ── */}
            <div className="result-body desktop-hide">
              <button
                onClick={() => navigate('/workout')}
                style={{
                  width: '100%', height: 56,
                  background: T.lime, border: 'none',
                  borderRadius: 14, color: '#000',
                  fontSize: 13, fontWeight: 900,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                  WebkitTapHighlightColor: 'transparent',
                  boxShadow: '0 6px 24px rgba(200,241,53,0.22)',
                }}
              >
                <RotateCcw size={15} />
                Generate New Workout
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}