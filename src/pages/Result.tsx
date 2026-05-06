'use client';
import { useState, useRef } from "react";
import { Share2, ChevronLeft, RotateCcw, Dumbbell, ChevronDown, ChevronUp, Zap, Target, Brain, TrendingUp, Clock, Flame, Layers } from "lucide-react";

// ─── MOCK DATA (replace with real API response / props) ───────────────────────
const MOCK = {
  day: "Tuesday",
  focus: "Upper Body Push – Chest & Shoulder Hypertrophy",
  difficulty: "Intermediate",
  meta: { confidence_score: 87, goal_alignment: "High", estimated_fatigue: "Moderate" },
  user_context: {
    goal: "Build muscle mass",
    experience: "intermediate",
    recovery_level: "normal",
    intensity_style: "pump",
    days_per_week: 4,
  },
  decision_engine: {
    primary_goal: "Chest hypertrophy with shoulder accessory volume",
    secondary_focus: "Tricep activation through compound pressing",
    fatigue_management: "Moderate intensity — normal recovery state",
    exercise_selection_logic: "Compound first, then isolation with ascending intensity",
    intensity_reason: "Pump-focused protocol with 60–90s rest windows",
    why_this_order: "Bench → Incline → Dips maximises chest pre-fatigue before isolation",
  },
  adaptation: {
    is_progression_day: true,
    load_adjustment: "+2.5 kg on main lifts",
    volume_adjustment: "Same total sets as last session",
    variation_type: "Linear progression",
    recovery_based_adjustment: "Normal load — no fatigue reduction applied",
  },
  optimization: {
    reasoning: "Compound first sequence preserves CNS for heavy sets",
    variation_applied: true,
    progression_strategy: "Add 2.5 kg when all sets hit top of rep range",
  },
  muscle_stimulation: {
    primary: "Chest",
    secondary: ["Shoulders", "Triceps", "Core"],
    focus_area: "Mid and upper chest",
    activation_level: "High",
  },
  total_duration: 58,
  calories_estimate: 420,
  time_distribution: { warmup: 8, workout: 44, cooldown: 6, per_exercise_avg: 9 },
  equipment: ["Barbell", "Dumbbells", "Flat bench", "Incline bench", "Dip bars", "Cable machine"],
  structure: { split_type: "Push/Pull/Legs", training_style: "Hypertrophy", intensity_level: "Moderate" },
  warmup: { duration: 8, steps: ["5 min light treadmill or jump rope", "Arm circles & shoulder dislocates × 10", "Push-up walkouts × 5", "Band pull-aparts × 15"] },
  cooldown: { duration: 6, steps: ["Doorway chest stretch × 30s each side", "Cross-body shoulder stretch × 30s", "Child's pose × 60s", "Slow diaphragmatic breathing × 2 min"] },
  notes: "Focus on mind-muscle connection. Don't rush the eccentric — slow it down.",
  exercises: [
    {
      id: "e1", name: "Barbell Bench Press", muscle_group: "Chest", category: "compound", priority: 1,
      sets: 4, reps: "6–8", rest: "90s", tempo: "3-1-1-0", weight: "heavy",
      intensity_hint: "90% of 1RM — controlled descent", progression_tip: "Add 2.5 kg when all 4×8 clean",
      form_cues: ["Retract scapula into bench", "Bar touches lower chest", "Drive feet into floor"],
      common_mistakes: ["Flared elbows past 75°", "Bouncing bar off chest"],
    },
    {
      id: "e2", name: "Incline Dumbbell Press", muscle_group: "Upper Chest", category: "compound", priority: 2,
      sets: 3, reps: "10–12", rest: "75s", tempo: "2-1-1-0", weight: "moderate",
      intensity_hint: "RPE 8 — slight stretch at bottom", progression_tip: "Progress 2 kg each side when form is clean",
      form_cues: ["30–45° incline angle", "Neutral grip at top", "Full stretch without losing tension"],
      common_mistakes: ["Seat angle too high (becomes shoulder press)", "Short range of motion"],
    },
    {
      id: "e3", name: "Cable Chest Flyes", muscle_group: "Chest", category: "isolation", priority: 3,
      sets: 3, reps: "12–15", rest: "60s", tempo: "2-0-2-0", weight: "light",
      intensity_hint: "Squeeze hard at peak contraction", progression_tip: "Prioritise feel over load",
      form_cues: ["Slight elbow bend throughout", "Think hugging a tree", "Lead with elbows on return"],
      common_mistakes: ["Using too much weight", "Bending elbows to 90°"],
    },
    {
      id: "e4", name: "Overhead Press", muscle_group: "Shoulders", category: "compound", priority: 4,
      sets: 3, reps: "8–10", rest: "90s", tempo: "2-1-1-0", weight: "moderate",
      intensity_hint: "Brace core, avoid lumbar overextension", progression_tip: "Strict form before adding load",
      form_cues: ["Bar starts at collarbone", "Shrug at top of ROM", "Elbows slightly forward"],
      common_mistakes: ["Leaning back excessively", "Bar path too far forward"],
    },
    {
      id: "e5", name: "Lateral Raises", muscle_group: "Shoulders", category: "isolation", priority: 5,
      sets: 4, reps: "15–20", rest: "45s", tempo: "1-0-3-0", weight: "light",
      intensity_hint: "Slow eccentric — feel the burn", progression_tip: "Drop-set last set for extra pump",
      form_cues: ["Lead with pinkies", "Slight forward torso lean", "Stop at shoulder height"],
      common_mistakes: ["Shrugging at top", "Using momentum"],
    },
    {
      id: "e6", name: "Tricep Rope Pushdown", muscle_group: "Triceps", category: "isolation", priority: 6,
      sets: 3, reps: "12–15", rest: "60s", tempo: "1-1-2-0", weight: "moderate",
      intensity_hint: "Spread rope apart at bottom for peak squeeze", progression_tip: "Slow eccentric phase",
      form_cues: ["Elbows locked at sides", "Full extension without locking joint", "Spread rope ends apart"],
      common_mistakes: ["Moving elbows away from body", "Rushing the eccentric"],
    },
  ],
  summary: { total_sets: 20, primary_muscles: ["Chest", "Upper Chest"], secondary_muscles: ["Shoulders", "Triceps", "Core"], fatigue_score: 7 },
  consistency_signal: { streak_message: "4 sessions this week — you're on fire", session_type: "Progressive overload", program_phase: "Hypertrophy block — week 3/6" },
  next_session_hint: { focus: "Pull day — Back & Biceps", adjustment: "Prioritise rows if upper back feels tight" },
  user_feedback_hook: {
    expected_feeling: "Upper chest pump with shoulder fatigue",
    difficulty_feedback_request: "Was this too hard, just right, or too easy?",
    next_adjustment_hint: "If too easy: add 5 kg to bench; if too hard: reduce to 3×6",
  },
};

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg: '#080808', surface: '#111111', surfaceHigh: '#181818',
  border: '#1F1F1F', borderHover: '#2E2E2E',
  text: '#F2F2F2', textMuted: '#666', textDim: '#999',
  lime: '#CBFF47', limeHover: '#DEFF6B',
  red: '#FF4F4F', amber: '#FFB547', green: '#3DCA7A', blue: '#4FA6FF',
};

const MUSCLE_HUE = {
  Chest: '#FF5F5F', 'Upper Chest': '#FF8040',
  Shoulders: '#FFC340', Triceps: '#4FA6FF', Back: '#9775FA',
  Biceps: '#36C7A0', Legs: '#FF6B35', Core: '#FF3E8E',
  Glutes: '#A855F7', Hamstrings: '#F97316', Calves: '#22D3EE', Forearms: '#A3E635',
};

const DIFF_CFG = {
  Beginner:     { c: '#36C7A0', bg: 'rgba(54,199,160,0.08)',  b: 'rgba(54,199,160,0.25)'  },
  Intermediate: { c: '#FFB547', bg: 'rgba(255,181,71,0.08)',  b: 'rgba(255,181,71,0.25)'  },
  Advanced:     { c: '#FF5F5F', bg: 'rgba(255,95,95,0.08)',   b: 'rgba(255,95,95,0.25)'   },
};

const WEIGHT_CFG = {
  bodyweight: { l: 'BW',    c: '#888',    bg: 'rgba(136,136,136,0.08)', b: 'rgba(136,136,136,0.22)' },
  light:      { l: 'Light', c: '#36C7A0', bg: 'rgba(54,199,160,0.08)',  b: 'rgba(54,199,160,0.22)'  },
  moderate:   { l: 'Mod',   c: '#FFB547', bg: 'rgba(255,181,71,0.08)',  b: 'rgba(255,181,71,0.22)'  },
  heavy:      { l: 'Heavy', c: '#FF5F5F', bg: 'rgba(255,95,95,0.08)',   b: 'rgba(255,95,95,0.22)'   },
};

const ALIGN_CFG = {
  Low:    { c: '#FF5F5F', bg: 'rgba(255,95,95,0.08)',   b: 'rgba(255,95,95,0.22)' },
  Medium: { c: '#FFB547', bg: 'rgba(255,181,71,0.08)',  b: 'rgba(255,181,71,0.22)' },
  High:   { c: '#36C7A0', bg: 'rgba(54,199,160,0.08)', b: 'rgba(54,199,160,0.22)' },
};

const FATIGUE_CFG = {
  Low:      { c: '#36C7A0', pct: 25 },
  Moderate: { c: '#FFB547', pct: 55 },
  High:     { c: '#FF5F5F', pct: 85 },
};

const ACTIVATION_CFG = {
  Low:      { c: '#999', bars: 1 },
  Moderate: { c: '#FFB547', bars: 2 },
  High:     { c: '#CBFF47', bars: 3 },
};

// ─── SMALL HELPERS ────────────────────────────────────────────────────────────
function Pill({ text, color, bg, border }:any) {
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px',
      borderRadius: 100, color, background: bg, border: `1px solid ${border}`,
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>{text}</span>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '28px 0 16px' }}>
      <span style={{
        fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: T.textMuted, whiteSpace: 'nowrap',
      }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  );
}

function StatBox({ val, unit, label, accent }:any) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
      padding: '14px 12px', textAlign: 'center', flex: 1,
    }}>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, lineHeight: 1,
        color: accent ?? T.text, letterSpacing: '0.02em',
      }}>
        {val}<span style={{ fontSize: 14, color: T.textMuted, marginLeft: 2 }}>{unit}</span>
      </div>
      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: T.textMuted, marginTop: 4,
      }}>{label}</div>
    </div>
  );
}

function ProgressBar({ pct, color, label="" }:any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {label && <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.textMuted, width: 60 }}>{label}</span>}
      <div style={{ flex: 1, height: 4, background: T.border, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
      </div>
    </div>
  );
}

// ─── EXERCISE CARD ────────────────────────────────────────────────────────────
function ExerciseCard({ ex, idx, expandedId, setExpandedId }:any) {
  const isOpen = expandedId === ex.id;
  const mc = MUSCLE_HUE[ex.muscle_group] ?? T.lime;
  const wc = WEIGHT_CFG[ex.weight] ?? WEIGHT_CFG.moderate;
  const ac = ACTIVATION_CFG[ex.category === 'compound' ? 'High' : 'Moderate'];

  return (
    <div
      onClick={() => setExpandedId(isOpen ? null : ex.id)}
      style={{
        background: T.surface,
        border: `1px solid ${isOpen ? 'rgba(203,255,71,0.2)' : T.border}`,
        borderRadius: 16, overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.15s',
        cursor: 'pointer',
        transform: isOpen ? 'scale(1.005)' : 'scale(1)',
        animation: `slideUp 0.35s ${idx * 55}ms both`,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ width: 3, flexShrink: 0, background: mc }} />
        <div style={{ flex: 1, minWidth: 0, padding: '14px 14px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 9,
                  color: T.textMuted, letterSpacing: '0.14em',
                }}>{String(idx + 1).padStart(2, '0')}</span>
                {ex.category === 'compound' && (
                  <span style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: T.lime, background: 'rgba(203,255,71,0.07)',
                    border: '1px solid rgba(203,255,71,0.18)', padding: '2px 6px', borderRadius: 4,
                  }}>COMPOUND</span>
                )}
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700,
                color: T.text, lineHeight: 1.25, marginBottom: 3, wordBreak: 'break-word',
              }}>{ex.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: mc }}>{ex.muscle_group}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
              <Pill text={wc.l} color={wc.c} bg={wc.bg} border={wc.b} />
              <div style={{ display: 'flex', gap: 3 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 4, height: 14, borderRadius: 2,
                    background: i < ac.bars ? ac.c : T.border,
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Sets/Reps/Rest row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            background: T.surfaceHigh, borderRadius: 10, overflow: 'hidden',
          }}>
            {[
              { val: ex.sets, label: 'Sets' },
              { val: ex.reps, label: 'Reps' },
              { val: ex.rest, label: 'Rest' },
            ].map(({ val, label }, i) => (
              <div key={label} style={{ position: 'relative', padding: '10px 8px', textAlign: 'center' }}>
                {i > 0 && <div style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: 1, background: T.border }} />}
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, lineHeight: 1, color: T.text }}>{val}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Tempo + expand toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.textMuted, letterSpacing: '0.1em' }}>TEMPO</span>
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: 11, color: T.textDim,
                background: T.surfaceHigh, border: `1px solid ${T.border}`,
                padding: '3px 8px', borderRadius: 6,
              }}>{ex.tempo}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: T.lime }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.08em' }}>
                {isOpen ? 'LESS' : 'MORE'}
              </span>
              {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
          </div>
        </div>
      </div>

      {/* Intensity hint strip */}
      <div style={{
        padding: '8px 14px 8px 17px',
        background: 'rgba(203,255,71,0.025)',
        borderTop: `1px solid rgba(203,255,71,0.07)`,
        display: 'flex', gap: 6, alignItems: 'flex-start',
      }}>
        <span style={{ color: T.lime, fontSize: 9, flexShrink: 0, marginTop: 2 }}>▸</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMuted, fontStyle: 'italic', lineHeight: 1.6 }}>
          {ex.intensity_hint}
        </span>
      </div>

      {/* Expanded details */}
      {isOpen && (
        <div style={{ borderTop: `1px solid ${T.border}`, padding: '14px 14px 16px 17px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Form cues */}
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.15em', color: T.lime, marginBottom: 8, textTransform: 'uppercase' }}>Form Cues</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {ex.form_cues.map((cue:any, i:any) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: T.lime,
                    lineHeight: 1.5, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common mistakes */}
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.15em', color: '#FF5F5F', marginBottom: 8, textTransform: 'uppercase' }}>Avoid</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {ex.common_mistakes.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: '#FF5F5F', fontSize: 10, flexShrink: 0, marginTop: 3 }}>✕</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progression tip */}
          <div style={{
            background: 'rgba(203,255,71,0.04)', border: '1px solid rgba(203,255,71,0.12)',
            borderRadius: 10, padding: '10px 12px',
            display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <TrendingUp size={12} style={{ color: T.lime, flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.lime, letterSpacing: '0.1em', marginBottom: 4 }}>PROGRESSION</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textDim, lineHeight: 1.6 }}>{ex.progression_tip}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function WorkoutResult({ workout: _workout, onBack, onNewWorkout }:any) {
  const workout = _workout ?? MOCK;
  const [expandedEx, setExpandedEx] = useState(null);
  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'intel'

  const diff = DIFF_CFG[workout.difficulty] ?? DIFF_CFG.Intermediate;
  const fatigue = FATIGUE_CFG[workout.meta?.estimated_fatigue] ?? FATIGUE_CFG.Moderate;
  const alignCfg = ALIGN_CFG[workout.meta?.goal_alignment] ?? ALIGN_CFG.High;
  const activation = ACTIVATION_CFG[workout.muscle_stimulation?.activation_level] ?? ACTIVATION_CFG.High;

  const focusShort = workout.focus.split(/[–—-]/)[0].trim().toUpperCase();
  const totalSets = workout.summary?.total_sets ?? workout.exercises.reduce((s, e) => s + e.sets, 0);

  const handleShare = async () => {
    const text = `${workout.day} — ${workout.focus} • ${workout.total_duration} min`;
    if (navigator.share) await navigator.share({ title: 'FORGE Workout', text, url: window.location.href });
    else await navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ minHeight: '100svh', background: T.bg, color: T.text, fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(203,255,71,0); } 50% { box-shadow: 0 0 18px 4px rgba(203,255,71,0.14); } }
        .tab-btn { transition: color 0.2s, background 0.2s; -webkit-tap-highlight-color: transparent; }
        .tab-btn:active { opacity: 0.7; }
        .tap-active:active { opacity: 0.85; transform: scale(0.98); }
      `}</style>

      {/* ── STICKY NAV ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(8,8,8,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 54, padding: '0 16px' }}>
          <button
            className="tap-active"
            onClick={onBack}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: T.surfaceHigh, border: `1px solid ${T.border}`,
              cursor: 'pointer', color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.15s',
            }}
          ><ChevronLeft size={16} /></button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.1em', color: T.lime, lineHeight: 1 }}>FORGE</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.18em', color: T.textMuted, textTransform: 'uppercase' }}>{workout.day}</span>
          </div>

          <button
            className="tap-active"
            onClick={handleShare}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 20,
              background: 'rgba(203,255,71,0.07)', border: '1px solid rgba(203,255,71,0.25)',
              cursor: 'pointer', color: T.lime, fontSize: 11, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.06em',
              flexShrink: 0, transition: 'background 0.15s',
            }}
          ><Share2 size={11} /> Share</button>
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{ padding: '24px 16px 20px', animation: 'fadeIn 0.5s ease' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          <Pill text={workout.difficulty} color={diff.c} bg={diff.bg} border={diff.b} />
          <Pill text={workout.structure?.training_style ?? 'Hypertrophy'} color={T.textMuted} bg={T.surfaceHigh} border={T.border} />
          <Pill text={`${workout.meta?.confidence_score ?? 0}% match`} color={T.lime} bg="rgba(203,255,71,0.07)" border="rgba(203,255,71,0.2)" />
        </div>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(2.8rem, 10vw, 4.2rem)',
          lineHeight: 0.88, letterSpacing: '0.02em', color: T.text,
          marginBottom: 8, wordBreak: 'break-word',
        }}>{focusShort}</h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textMuted,
          fontStyle: 'italic', lineHeight: 1.55, marginBottom: 18,
        }}>{workout.focus}</p>

        {/* Lime rule */}
        <div style={{ width: 40, height: 2, background: T.lime, borderRadius: 1, marginBottom: 20 }} />

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 8 }}>
          <StatBox val={workout.total_duration} unit="m" label="Duration" accent={T.lime} />
          <StatBox val={`~${workout.calories_estimate}`} unit="kcal" label="Calories" />
          <StatBox val={workout.exercises.length} label="Exercises" />
          <StatBox val={totalSets} label="Sets" />
        </div>

        {/* Mini meta strip */}
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {[
            { icon: <Target size={10} />, label: 'Goal', val: workout.meta?.goal_alignment, color: alignCfg.c },
            { icon: <Zap size={10} />, label: 'Fatigue', val: workout.meta?.estimated_fatigue, color: fatigue.c },
            { icon: <Layers size={10} />, label: 'Volume', val: workout.structure?.intensity_level },
          ].map(({ icon, label, val, color }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
              flexShrink: 0,
            }}>
              <span style={{ color: color ?? T.textMuted }}>{icon}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.textMuted, letterSpacing: '0.08em' }}>{label}:</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: color ?? T.textDim }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div style={{
        position: 'sticky', top: 54, zIndex: 90,
        background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex', padding: '0 16px',
      }}>
        {[
          { id: 'workout', label: 'Workout' },
          { id: 'intel',   label: 'AI Intel' },
        ].map(tab => (
          <button
            key={tab.id}
            className="tab-btn"
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, height: 44, border: 'none', cursor: 'pointer', background: 'transparent',
              fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: activeTab === tab.id ? T.lime : T.textMuted,
              borderBottom: `2px solid ${activeTab === tab.id ? T.lime : 'transparent'}`,
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: '0 16px', paddingBottom: 100 }}>

        {/* ════ WORKOUT TAB ════ */}
        {activeTab === 'workout' && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>

            {/* Muscle Stimulation */}
            <Divider label="Muscle Map" />
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '14px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.02em', lineHeight: 1, marginBottom: 2 }}>
                    {workout.muscle_stimulation?.primary ?? 'Chest'}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted }}>{workout.muscle_stimulation?.focus_area}</div>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 22, borderRadius: 3,
                      background: i < activation.bars ? activation.c : T.border,
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {workout.muscle_stimulation?.secondary?.map(m => (
                  <span key={m} style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                    color: MUSCLE_HUE[m] ?? T.textDim,
                    background: `${MUSCLE_HUE[m] ?? T.textDim}14`,
                    border: `1px solid ${MUSCLE_HUE[m] ?? T.textDim}33`,
                    padding: '4px 9px', borderRadius: 6,
                  }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Warmup + Cooldown */}
            <Divider label="Preparation" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              {[
                { label: '▲ WARM-UP', dur: workout.warmup?.duration, steps: workout.warmup?.steps ?? [], accent: T.amber },
                { label: '▼ COOL-DOWN', dur: workout.cooldown?.duration, steps: workout.cooldown?.steps ?? [], accent: T.blue },
              ].map(({ label, dur, steps, accent }) => (
                <div key={label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: '0.15em', color: accent }}>{label}</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: T.textMuted }}>{dur}m</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {steps.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent, flexShrink: 0, marginTop: 5 }} />
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted, lineHeight: 1.55 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Coach's Note */}
            {workout.notes && (
              <div style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderLeft: `2px solid rgba(203,255,71,0.5)`,
                borderRadius: 12, padding: '12px 14px', marginBottom: 0,
                display: 'flex', gap: 8,
              }}>
                <Brain size={13} style={{ color: T.lime, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.12em', color: T.lime, marginBottom: 4 }}>COACH NOTE</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textDim, lineHeight: 1.65, fontStyle: 'italic' }}>{workout.notes}</div>
                </div>
              </div>
            )}

            {/* Equipment */}
            {workout.equipment?.length > 0 && (
              <>
                <Divider label="Equipment" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {workout.equipment.map(eq => (
                    <span key={eq} style={{
                      fontFamily: "'Space Mono', monospace", fontSize: 11, color: T.textMuted,
                      background: T.surface, border: `1px solid ${T.border}`,
                      padding: '6px 12px', borderRadius: 100, textTransform: 'capitalize',
                      letterSpacing: '0.05em',
                    }}>{eq}</span>
                  ))}
                </div>
              </>
            )}

            {/* Exercises */}
            <Divider label={`Exercises · ${workout.exercises.length}`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {workout.exercises.map((ex, i) => (
                <ExerciseCard key={ex.id} ex={ex} idx={i} expandedId={expandedEx} setExpandedId={setExpandedEx} />
              ))}
            </div>

            {/* Next session hint */}
            {workout.next_session_hint && (
              <>
                <Divider label="Up Next" />
                <div style={{
                  background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 14, padding: '14px 14px',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(79,166,255,0.1)', border: '1px solid rgba(79,166,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Clock size={14} style={{ color: T.blue }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 3 }}>
                      {workout.next_session_hint.focus}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textMuted, lineHeight: 1.55 }}>
                      {workout.next_session_hint.adjustment}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ════ AI INTEL TAB ════ */}
        {activeTab === 'intel' && (
          <div style={{ animation: 'fadeIn 0.25s ease' }}>

            {/* Fatigue score */}
            <Divider label="Session Score" />
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '16px 14px', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.textMuted, letterSpacing: '0.14em', marginBottom: 4 }}>FATIGUE SCORE</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, lineHeight: 1, color: T.text }}>{workout.summary?.fatigue_score ?? 7}<span style={{ fontSize: 18, color: T.textMuted }}>/10</span></div>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, lineHeight: 1, color: alignCfg.c }}>{workout.meta?.goal_alignment}</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: T.textMuted, letterSpacing: '0.1em' }}>ALIGNMENT</div>
                  </div>
                  <div style={{ textAlign: 'center', marginLeft: 12 }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, lineHeight: 1, color: T.lime }}>{workout.meta?.confidence_score}%</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: T.textMuted, letterSpacing: '0.1em' }}>CONFIDENCE</div>
                  </div>
                </div>
              </div>
              <ProgressBar  pct={(workout.summary?.fatigue_score ?? 7) * 10} color={fatigue.c} />
            </div>

            {/* Time distribution */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '14px 14px' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.textMuted, letterSpacing: '0.14em', marginBottom: 12 }}>TIME SPLIT</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'WARM-UP',  val: workout.time_distribution?.warmup, total: workout.total_duration, color: T.amber },
                  { label: 'WORKOUT',  val: workout.time_distribution?.workout, total: workout.total_duration, color: T.lime },
                  { label: 'COOL-DOWN', val: workout.time_distribution?.cooldown, total: workout.total_duration, color: T.blue },
                ].map(({ label, val, total, color }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.textMuted, width: 66 }}>{label}</span>
                    <div style={{ flex: 1, height: 6, background: T.border, borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${(val/total)*100}%`, height: '100%', background: color, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color, minWidth: 28, textAlign: 'right' }}>{val}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision engine */}
            <Divider label="Decision Engine" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Primary Goal',      val: workout.decision_engine?.primary_goal,     icon: <Target size={11} /> },
                { label: 'Secondary Focus',   val: workout.decision_engine?.secondary_focus,   icon: <Zap size={11} /> },
                { label: 'Exercise Order',    val: workout.decision_engine?.why_this_order,    icon: <Layers size={11} /> },
                { label: 'Intensity Reason',  val: workout.decision_engine?.intensity_reason,  icon: <Flame size={11} /> },
              ].map(({ label, val, icon }) => (
                <div key={label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '12px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: T.lime, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.textMuted, letterSpacing: '0.1em', marginBottom: 3 }}>{label.toUpperCase()}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.textDim, lineHeight: 1.6 }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Adaptation */}
            <Divider label="Today's Adaptation" />
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '14px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                  fontFamily: "'Space Mono', monospace", letterSpacing: '0.08em',
                  ...(workout.adaptation?.is_progression_day
                    ? { color: T.lime, background: 'rgba(203,255,71,0.08)', border: '1px solid rgba(203,255,71,0.2)' }
                    : { color: T.textMuted, background: T.surfaceHigh, border: `1px solid ${T.border}` }),
                }}>
                  {workout.adaptation?.is_progression_day ? '↑ PROGRESSION DAY' : 'MAINTENANCE DAY'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Load', val: workout.adaptation?.load_adjustment },
                  { label: 'Volume', val: workout.adaptation?.volume_adjustment },
                  { label: 'Type', val: workout.adaptation?.variation_type },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: T.textMuted }}>{label}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: T.textDim }}>{val}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: T.textMuted }}>Recovery</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: T.textDim }}>{workout.adaptation?.recovery_based_adjustment}</span>
                </div>
              </div>
            </div>

            {/* Optimization */}
            <Divider label="Optimization" />
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `2px solid ${T.lime}`, borderRadius: 12, padding: '14px 14px' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textDim, lineHeight: 1.65, marginBottom: 10, fontStyle: 'italic' }}>
                "{workout.optimization?.reasoning}"
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: T.lime, lineHeight: 1.55 }}>
                {workout.optimization?.progression_strategy}
              </div>
            </div>

            {/* Consistency */}
            {workout.consistency_signal && (
              <>
                <Divider label="Consistency" />
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 14px' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: '0.04em', color: T.lime, marginBottom: 4 }}>
                    {workout.consistency_signal.streak_message}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    <Pill text={workout.consistency_signal.session_type} color={T.textMuted} bg={T.surfaceHigh} border={T.border} />
                    <Pill text={workout.consistency_signal.program_phase} color={T.blue} bg="rgba(79,166,255,0.07)" border="rgba(79,166,255,0.2)" />
                  </div>
                </div>
              </>
            )}

            {/* Feedback hook */}
            {workout.user_feedback_hook && (
              <>
                <Divider label="Feedback" />
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 14px' }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.textDim, marginBottom: 10, lineHeight: 1.55 }}>
                    {workout.user_feedback_hook.difficulty_feedback_request}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Too easy', 'Just right', 'Too hard'].map(f => (
                      <button key={f} className="tap-active" style={{
                        flex: 1, padding: '9px 4px', borderRadius: 10,
                        background: T.surfaceHigh, border: `1px solid ${T.border}`,
                        fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                        color: T.textMuted, cursor: 'pointer', transition: 'all 0.15s',
                      }}>{f}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: T.textMuted, fontStyle: 'italic', lineHeight: 1.55 }}>
                    {workout.user_feedback_hook.next_adjustment_hint}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── FLOATING CTA ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 28px',
        background: 'linear-gradient(to top, rgba(8,8,8,1) 60%, rgba(8,8,8,0))',
        pointerEvents: 'none',
      }}>
        <button
          className="tap-active"
          onClick={onNewWorkout}
          style={{
            width: '100%', height: 54,
            background: T.lime, border: 'none', borderRadius: 14,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 900,
            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            pointerEvents: 'all',
            animation: 'pulseGlow 3s ease-in-out infinite',
          }}
        >
          <RotateCcw size={14} /> Generate New Workout
        </button>
      </div>
    </div>
  );
}