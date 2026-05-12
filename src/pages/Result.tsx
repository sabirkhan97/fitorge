'use client';
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ── Types ────────────────────────────────────────────────────────────────────
interface WorkoutPlan {
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_duration: number;
  calories_estimate: number;
  focus: { primary: string; secondary: string[] };
  workout_style: string;
  equipment: string[];
  hero_stats: {
    total_exercises: number;
    total_sets: number;
    intensity: 'Low' | 'Moderate' | 'High';
    training_split: string;
  };
  warmup: { name: string; duration: string }[];
  exercises: {
    id: string;
    name: string;
    muscle_group: string;
    category: 'compound' | 'isolation';
    sets: number;
    reps: string;
    rest: string;
    tempo: string;
    weight: 'bodyweight' | 'light' | 'moderate' | 'heavy';
    intensity_label: string;
    tips: string[];
    mistakes: string[];
  }[];
  finisher: { name: string; duration: string; description: string };
  cooldown: { name: string; duration: string }[];
  summary: { main_benefit: string; recovery_tip: string; next_focus: string };
}

// ── Color config ─────────────────────────────────────────────────────────────
const MUSCLE_COLORS: Record<string, string> = {
  Chest: '#C8F135', 'Upper Chest': '#C8F135',
  Shoulders: '#47C8FF', Back: '#B47CFF',
  Biceps: '#FF7C47', Triceps: '#FF4747',
  Legs: '#FFD147', Glutes: '#FF6BE8',
  Hamstrings: '#FFD147', Calves: '#FFD147',
  Core: '#47FFB4', Forearms: '#FF9F47',
};

const DIFF_CONFIG: Record<string, { color: string; label: string; bg: string }> = {
  Beginner:     { color: '#47FFB4', label: 'BEGINNER',     bg: 'rgba(71,255,180,0.1)' },
  Intermediate: { color: '#C8F135', label: 'INTERMEDIATE', bg: 'rgba(200,241,53,0.1)' },
  Advanced:     { color: '#FF6B6B', label: 'ADVANCED',     bg: 'rgba(255,107,107,0.1)' },
};

const WEIGHT_MAP: Record<string, { label: string; color: string }> = {
  bodyweight: { label: 'BODYWEIGHT', color: '#47FFB4' },
  light:      { label: 'LIGHT',      color: '#C8F135' },
  moderate:   { label: 'MODERATE',   color: '#FFD147' },
  heavy:      { label: 'HEAVY',      color: '#FF6B6B' },
};

const getMuscleColor = (m: string) => MUSCLE_COLORS[m] || '#C8F135';

// ── Exercise Card (full-card tap, bold expand UX) ────────────────────────────
const ExerciseCard = ({
  exercise,
  index,
  expanded,
  onToggle,
}: {
  exercise: WorkoutPlan['exercises'][0];
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const color = getMuscleColor(exercise.muscle_group);
  const wt = WEIGHT_MAP[exercise.weight] || WEIGHT_MAP.moderate;

  return (
    <div
      className="exercise-card"
      style={{
        '--accent': color,
        background: expanded
          ? `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${expanded ? color + '40' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: expanded ? `0 0 24px ${color}15, inset 0 1px 0 rgba(255,255,255,0.05)` : 'none',
      } as React.CSSProperties}
    >
      {/* Tap target – entire row */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Number badge */}
        <div style={{
          flexShrink: 0,
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: expanded ? color : 'rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 800,
          color: expanded ? '#000' : 'rgba(255,255,255,0.4)',
          fontFamily: "'DM Mono', monospace",
          transition: 'all 0.3s ease',
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Name + tags */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.3px',
            fontFamily: "'Syne', sans-serif",
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {exercise.name}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '10px',
              fontFamily: "'DM Mono', monospace",
              color: color,
              background: color + '15',
              padding: '1px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {exercise.muscle_group}
            </span>
            <span style={{
              fontSize: '10px',
              fontFamily: "'DM Mono', monospace",
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {exercise.category}
            </span>
          </div>
        </div>

        {/* Sets×Reps + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              fontFamily: "'DM Mono', monospace",
            }}>
              {exercise.sets}×{exercise.reps}
            </div>
            <div style={{
              fontSize: '9px',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: "'DM Mono', monospace",
              textTransform: 'uppercase',
            }}>
              sets×reps
            </div>
          </div>

          {/* Animated chevron pill */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: `1.5px solid ${expanded ? color : 'rgba(255,255,255,0.15)'}`,
            background: expanded ? color + '20' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            flexShrink: 0,
          }}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <path
                d="M2 3.5L5 6.5L8 3.5"
                stroke={expanded ? color : 'rgba(255,255,255,0.4)'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Expanded detail panel */}
      {expanded && (
        <div style={{
          padding: '0 16px 16px',
          animation: 'slideDown 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* Divider */}
          <div style={{
            height: '1px',
            background: `linear-gradient(90deg, ${color}40, transparent)`,
            marginBottom: '14px',
          }} />

          {/* Quick stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '14px',
          }}>
            {[
              { label: 'REST', value: exercise.rest },
              { label: 'TEMPO', value: exercise.tempo },
              { label: 'WEIGHT', value: wt.label, color: wt.color },
              { label: 'LEVEL', value: exercise.intensity_label },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                padding: '8px 6px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{
                  fontSize: '8px',
                  fontFamily: "'DM Mono', monospace",
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.8px',
                  marginBottom: '3px',
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: stat.color || '#fff',
                  fontFamily: "'DM Mono', monospace",
                  wordBreak: 'break-word',
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Tips & Mistakes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {exercise.tips.length > 0 && (
              <div style={{
                background: 'rgba(200,241,53,0.05)',
                border: '1px solid rgba(200,241,53,0.15)',
                borderRadius: '10px',
                padding: '10px',
              }}>
                <div style={{
                  fontSize: '9px',
                  fontFamily: "'DM Mono', monospace",
                  color: '#C8F135',
                  letterSpacing: '0.8px',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <span>💡</span> TIPS
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {exercise.tips.map((tip, i) => (
                    <li key={i} style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.65)',
                      paddingLeft: '10px',
                      position: 'relative',
                      marginBottom: '4px',
                      lineHeight: '1.4',
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#C8F135',
                        fontSize: '8px',
                        top: '3px',
                      }}>▶</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {exercise.mistakes.length > 0 && (
              <div style={{
                background: 'rgba(255,107,107,0.05)',
                border: '1px solid rgba(255,107,107,0.15)',
                borderRadius: '10px',
                padding: '10px',
              }}>
                <div style={{
                  fontSize: '9px',
                  fontFamily: "'DM Mono', monospace",
                  color: '#FF6B6B',
                  letterSpacing: '0.8px',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <span>⚠️</span> AVOID
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {exercise.mistakes.map((m, i) => (
                    <li key={i} style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.65)',
                      paddingLeft: '10px',
                      position: 'relative',
                      marginBottom: '4px',
                      lineHeight: '1.4',
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#FF6B6B',
                        fontSize: '8px',
                        top: '3px',
                      }}>✕</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Section label ────────────────────────────────────────────────────────────
const Section = ({ icon, title }: { icon: string; title: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
    <span style={{ fontSize: '13px' }}>{icon}</span>
    <span style={{
      fontSize: '10px',
      fontFamily: "'DM Mono', monospace",
      color: 'rgba(255,255,255,0.4)',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    }}>
      {title}
    </span>
    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
  </div>
);

// ── Minimal row for warmup / cooldown ────────────────────────────────────────
const SimpleRow = ({ name, duration }: { name: string; duration: string }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.06)',
  }}>
    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontFamily: "'Syne', sans-serif" }}>{name}</span>
    <span style={{
      fontSize: '10px',
      fontFamily: "'DM Mono', monospace",
      color: 'rgba(255,255,255,0.3)',
      background: 'rgba(255,255,255,0.05)',
      padding: '2px 8px',
      borderRadius: '6px',
    }}>{duration}</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function WorkoutResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const fromState = (location.state as any)?.workout;
    if (fromState) { setPlan(fromState); return; }
    try {
      const stored = localStorage.getItem('fitforge:lastWorkout');
      if (stored) setPlan(JSON.parse(stored));
    } catch { }
  }, [location.state]);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleShare = async () => {
    if (!plan) return;
    const text = `${plan.title} — ${plan.estimated_duration}min · ~${plan.calories_estimate}cal — FitForge AI`;
    try {
      if (navigator.share) await navigator.share({ title: 'My FitForge Workout', text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { }
  };

  if (!plan) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px',
        fontFamily: "'Syne', sans-serif",
      }}>
        <div style={{ fontSize: '48px', fontWeight: 900, color: '#C8F135', letterSpacing: '-2px' }}>NO PLAN</div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Generate a workout first.</p>
        <button
          onClick={() => navigate('/workout')}
          style={{
            background: '#C8F135',
            color: '#000',
            border: 'none',
            borderRadius: '100px',
            padding: '10px 24px',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Generate Workout
        </button>
      </div>
    );
  }

  const diff = DIFF_CONFIG[plan.difficulty] || DIFF_CONFIG.Intermediate;
  const uniqueMuscles = Array.from(new Set(plan.exercises.map(e => e.muscle_group)));

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #000; overscroll-behavior: none; }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.1s; }
        .fade-up-3 { animation-delay: 0.15s; }
        .fade-up-4 { animation-delay: 0.2s; }
        .fade-up-5 { animation-delay: 0.25s; }

        .tap-scale:active { transform: scale(0.97); }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: "'Syne', sans-serif" }}>

        {/* ── Sticky Header ── */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: headerScrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
          backdropFilter: headerScrolled ? 'blur(16px)' : 'none',
          borderBottom: headerScrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
        }}>
          <button
            onClick={() => navigate(-1)}
            className="tap-scale"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.15s ease',
            }}
          >
            ←
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#C8F135',
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}>
              FORGE
            </div>
            <div style={{
              fontSize: '8px',
              fontFamily: "'DM Mono', monospace",
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: '1px',
            }}>
              {plan.workout_style}
            </div>
          </div>

          <button
            onClick={handleShare}
            className="tap-scale"
            style={{
              background: copied ? '#C8F135' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${copied ? '#C8F135' : 'rgba(255,255,255,0.1)'}`,
              color: copied ? '#000' : 'rgba(255,255,255,0.7)',
              borderRadius: '100px',
              padding: '6px 14px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.5px',
              transition: 'all 0.2s ease',
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {copied ? '✓ Copied' : 'Share'}
          </button>
        </header>

        <main style={{ maxWidth: '480px', margin: '0 auto', padding: '0 16px 120px' }}>

          {/* ── HERO ── */}
          <div className="fade-up" style={{ padding: '24px 0 28px' }}>
            {/* Difficulty + split */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{
                fontSize: '9px',
                fontFamily: "'DM Mono', monospace",
                letterSpacing: '1.5px',
                padding: '3px 10px',
                borderRadius: '100px',
                color: diff.color,
                background: diff.bg,
                border: `1px solid ${diff.color}30`,
                textTransform: 'uppercase',
              }}>
                {diff.label}
              </span>
              <span style={{
                fontSize: '9px',
                fontFamily: "'DM Mono', monospace",
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                {plan.hero_stats?.training_split}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(28px, 8vw, 36px)',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              lineHeight: 1.05,
              color: '#fff',
              marginBottom: '8px',
            }}>
              {plan.title}
            </h1>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: '1.5',
              marginBottom: '20px',
              fontWeight: 400,
            }}>
              {plan.subtitle}
            </p>

            {/* 3 pill stats */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[
                { icon: '⏱', val: `${plan.estimated_duration} min` },
                { icon: '🔥', val: `~${plan.calories_estimate} cal` },
                { icon: '🎯', val: plan.focus?.primary },
              ].map((p) => (
                <div key={p.val} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '100px',
                  padding: '5px 12px',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: "'DM Mono', monospace",
                }}>
                  <span style={{ fontSize: '12px' }}>{p.icon}</span>
                  {p.val}
                </div>
              ))}
            </div>

            {/* Stats grid – 2×2 on mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { label: 'DURATION',  value: `${plan.estimated_duration}m`, accent: '#C8F135' },
                { label: 'CALORIES',  value: `~${plan.calories_estimate}`, accent: '#FF7C47' },
                { label: 'EXERCISES', value: plan.hero_stats?.total_exercises, accent: '#47C8FF' },
                { label: 'TOTAL SETS',value: plan.hero_stats?.total_sets, accent: '#B47CFF' },
              ].map((s) => (
                <div key={s.label} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '3px',
                    height: '100%',
                    background: s.accent,
                    borderRadius: '0 2px 2px 0',
                  }} />
                  <div style={{
                    fontSize: '8px',
                    fontFamily: "'DM Mono', monospace",
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '1.5px',
                    marginBottom: '6px',
                  }}>
                    {s.label}
                  </div>
                  <div style={{
                    fontSize: '26px',
                    fontWeight: 900,
                    color: s.accent,
                    letterSpacing: '-1px',
                    lineHeight: 1,
                  }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── WARMUP ── */}
          {plan.warmup?.length > 0 && (
            <div className="fade-up fade-up-1" style={{ marginBottom: '28px' }}>
              <Section icon="🔥" title="Warm-up" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {plan.warmup.map((item, i) => (
                  <SimpleRow key={i} name={item.name} duration={item.duration} />
                ))}
              </div>
            </div>
          )}

          {/* ── EXERCISES ── */}
          <div className="fade-up fade-up-2" style={{ marginBottom: '28px' }}>
            <Section icon="💪" title={`Exercises · ${plan.exercises.length}`} />

            {/* Muscle chips row */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {uniqueMuscles.map((m) => {
                const c = getMuscleColor(m);
                return (
                  <span key={m} style={{
                    fontSize: '9px',
                    fontFamily: "'DM Mono', monospace",
                    color: c,
                    background: c + '12',
                    border: `1px solid ${c}30`,
                    borderRadius: '100px',
                    padding: '2px 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {m}
                  </span>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plan.exercises.map((ex, idx) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  index={idx}
                  expanded={expandedId === ex.id}
                  onToggle={() => setExpandedId(expandedId === ex.id ? null : ex.id)}
                />
              ))}
            </div>
          </div>

          {/* ── FINISHER ── */}
          {plan.finisher && (
            <div className="fade-up fade-up-3" style={{ marginBottom: '28px' }}>
              <Section icon="⚡" title="Finisher" />
              <div style={{
                background: 'linear-gradient(135deg, rgba(200,241,53,0.08) 0%, rgba(200,241,53,0.02) 100%)',
                border: '1px solid rgba(200,241,53,0.2)',
                borderRadius: '16px',
                padding: '16px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px', right: '-20px',
                  fontSize: '64px',
                  opacity: 0.06,
                  userSelect: 'none',
                }}>⚡</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                    {plan.finisher.name}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontFamily: "'DM Mono', monospace",
                    color: '#C8F135',
                    background: 'rgba(200,241,53,0.1)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}>
                    {plan.finisher.duration}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>
                  {plan.finisher.description}
                </p>
              </div>
            </div>
          )}

          {/* ── COOLDOWN ── */}
          {plan.cooldown?.length > 0 && (
            <div className="fade-up fade-up-4" style={{ marginBottom: '28px' }}>
              <Section icon="🧘" title="Cool-down" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {plan.cooldown.map((item, i) => (
                  <SimpleRow key={i} name={item.name} duration={item.duration} />
                ))}
              </div>
            </div>
          )}

          {/* ── COACH SUMMARY ── */}
          {plan.summary && (
            <div className="fade-up fade-up-5" style={{ marginBottom: '28px' }}>
              <Section icon="📋" title="Coach Summary" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'MAIN BENEFIT', text: plan.summary.main_benefit, color: '#C8F135', icon: '✦' },
                  { label: 'RECOVERY',     text: plan.summary.recovery_tip, color: '#47C8FF', icon: '↻' },
                  { label: 'NEXT FOCUS',   text: plan.summary.next_focus,   color: '#B47CFF', icon: '→' },
                ].map((s) => (
                  <div key={s.label} style={{
                    display: 'flex',
                    gap: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px',
                    padding: '14px',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: s.color + '15',
                      border: `1px solid ${s.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '13px',
                      color: s.color,
                      fontWeight: 700,
                    }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '8px',
                        fontFamily: "'DM Mono', monospace",
                        color: s.color,
                        letterSpacing: '1.5px',
                        marginBottom: '4px',
                      }}>
                        {s.label}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.5' }}>
                        {s.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── EQUIPMENT ── */}
          {plan.equipment?.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <Section icon="🏋️" title="Equipment" />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {plan.equipment.map((eq) => (
                  <span key={eq} style={{
                    fontSize: '10px',
                    fontFamily: "'DM Mono', monospace",
                    color: 'rgba(255,255,255,0.5)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* ── Sticky Footer ── */}
        <div style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          padding: '12px 16px',
          background: 'linear-gradient(to top, rgba(0,0,0,1) 60%, transparent)',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}>
          <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate(-1)}
              className="tap-scale"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '14px',
                padding: '14px',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Syne', sans-serif",
                letterSpacing: '0.3px',
                transition: 'transform 0.15s ease',
              }}
            >
              ← Edit
            </button>
            <button
              onClick={() => navigate('/workout')}
              className="tap-scale"
              style={{
                flex: 2,
                background: '#C8F135',
                border: 'none',
                borderRadius: '14px',
                padding: '14px',
                color: '#000',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontFamily: "'Syne', sans-serif",
                transition: 'transform 0.15s ease',
                boxShadow: '0 4px 20px rgba(200,241,53,0.3)',
              }}
            >
              + New Workout
            </button>
          </div>
        </div>

      </div>
    </>
  );
}