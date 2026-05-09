import { useEffect, useState } from "react";
import { Share2, ChevronLeft, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";



// Simplified mock data
const MOCK = {
  day: "Tuesday",
  focus: "Upper Body Push – Chest & Shoulder Hypertrophy",
  difficulty: "Intermediate",
  meta: { confidence_score: 87 },
  total_duration: 58,
  calories_estimate: 420,
  equipment: ["Barbell", "Dumbbells", "Flat bench", "Incline bench", "Dip bars", "Cable machine"],
  warmup: { duration: 8, steps: ["5 min light treadmill", "Arm circles × 10", "Push-up walkouts × 5"] },
  cooldown: { duration: 6, steps: ["Doorway chest stretch 30s", "Cross-body shoulder stretch 30s", "Child's pose 60s"] },
  notes: "Focus on mind-muscle connection. Don't rush the eccentric.",
  exercises: [
    {
      id: "e1", name: "Barbell Bench Press", muscle_group: "Chest", category: "compound",
      sets: 4, reps: "6–8", rest: "90s", tempo: "3-1-1-0", weight: "heavy",
      intensity_hint: "90% of 1RM — controlled descent",
      form_cues: ["Retract scapula", "Bar touches lower chest", "Drive feet into floor"],
      common_mistakes: ["Flared elbows", "Bouncing bar"],
    },
    {
      id: "e2", name: "Incline Dumbbell Press", muscle_group: "Upper Chest", category: "compound",
      sets: 3, reps: "10–12", rest: "75s", tempo: "2-1-1-0", weight: "moderate",
      intensity_hint: "RPE 8 — slight stretch at bottom",
      form_cues: ["30–45° incline", "Neutral grip", "Full stretch"],
      common_mistakes: ["Angle too high", "Short range of motion"],
    },
    {
      id: "e3", name: "Cable Chest Flyes", muscle_group: "Chest", category: "isolation",
      sets: 3, reps: "12–15", rest: "60s", tempo: "2-0-2-0", weight: "light",
      intensity_hint: "Squeeze hard at peak",
      form_cues: ["Slight elbow bend", "Think hugging a tree"],
      common_mistakes: ["Too much weight", "Bending elbows too much"],
    },
    {
      id: "e4", name: "Overhead Press", muscle_group: "Shoulders", category: "compound",
      sets: 3, reps: "8–10", rest: "90s", tempo: "2-1-1-0", weight: "moderate",
      intensity_hint: "Brace core, avoid leaning back",
      form_cues: ["Bar at collarbone", "Shrug at top", "Elbows forward"],
      common_mistakes: ["Leaning back", "Bar path too forward"],
    },
    {
      id: "e5", name: "Lateral Raises", muscle_group: "Shoulders", category: "isolation",
      sets: 4, reps: "15–20", rest: "45s", tempo: "1-0-3-0", weight: "light",
      intensity_hint: "Slow eccentric — feel the burn",
      form_cues: ["Lead with pinkies", "Slight forward lean", "Stop at shoulder height"],
      common_mistakes: ["Shrugging", "Using momentum"],
    },
    {
      id: "e6", name: "Tricep Rope Pushdown", muscle_group: "Triceps", category: "isolation",
      sets: 3, reps: "12–15", rest: "60s", tempo: "1-1-2-0", weight: "moderate",
      intensity_hint: "Spread rope at bottom for peak squeeze",
      form_cues: ["Elbows locked at sides", "Full extension", "Spread rope ends"],
      common_mistakes: ["Moving elbows", "Rushing eccentric"],
    },
  ],
  next_session_hint: { focus: "Pull day — Back & Biceps", adjustment: "Prioritize rows if back feels tight" },
};

// Design tokens
const T = {
  bg: '#080808', surface: '#111111', surfaceHigh: '#181818',
  border: '#1F1F1F', text: '#F2F2F2', textMuted: '#666',
  lime: '#CBFF47', amber: '#FFB547', blue: '#4FA6FF',
};

// Simple components
function Pill({ text, color }: { text: string; color?: string }) {
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
      textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100,
      color: color || T.textMuted, background: T.surfaceHigh,
      border: `1px solid ${T.border}`, whiteSpace: 'nowrap',
    }}>{text}</span>
  );
}

function StatBox({ val, unit, label }: { val: number | string; unit?: string; label: string }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14,
      padding: '14px 12px', textAlign: 'center', flex: 1,
    }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, lineHeight: 1, color: T.text }}>
        {val}{unit && <span style={{ fontSize: 14, color: T.textMuted, marginLeft: 2 }}>{unit}</span>}
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.textMuted, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function ExerciseCard({ ex, idx, expandedId, setExpandedId }: any) {
  const isOpen = expandedId === ex.id;
  const muscleColors: Record<string, string> = { Chest: '#FF5F5F', 'Upper Chest': '#FF8040', Shoulders: '#FFC340', Triceps: '#4FA6FF' };
  const mc = muscleColors[ex.muscle_group] || T.lime;

  return (
    <div
      onClick={() => setExpandedId(isOpen ? null : ex.id)}
      style={{
        background: T.surface, border: `1px solid ${isOpen ? T.lime : T.border}`,
        borderRadius: 16, cursor: 'pointer', transition: 'border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ width: 3, background: mc, borderRadius: '16px 0 0 16px' }} />
        <div style={{ flex: 1, padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: T.textMuted }}>{String(idx + 1).padStart(2, '0')}</span>
                {ex.category === 'compound' && (
                  <span style={{ fontSize: 9, color: T.lime, background: 'rgba(203,255,71,0.07)', padding: '2px 6px', borderRadius: 4 }}>COMPOUND</span>
                )}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{ex.name}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: mc }}>{ex.muscle_group}</div>
            </div>
            <Pill text={ex.weight.toUpperCase()} color={ex.weight === 'heavy' ? '#FF5F5F' : ex.weight === 'moderate' ? '#FFB547' : '#36C7A0'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', background: T.surfaceHigh, borderRadius: 10 }}>
            {[
              { val: ex.sets, label: 'Sets' },
              { val: ex.reps, label: 'Reps' },
              { val: ex.rest, label: 'Rest' },
            ].map(({ val, label }, i) => (
              <div key={label} style={{ padding: '10px', textAlign: 'center', position: 'relative' }}>
                {i > 0 && <div style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: 1, background: T.border }} />}
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: 9, color: T.textMuted }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ display: 'flex', gap: 5 }}>
              <span style={{ fontSize: 9, color: T.textMuted }}>TEMPO</span>
              <span style={{ fontSize: 11, background: T.surfaceHigh, border: `1px solid ${T.border}`, padding: '3px 8px', borderRadius: 6 }}>{ex.tempo}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: T.lime }}>
              <span style={{ fontSize: 9 }}>{isOpen ? 'LESS' : 'MORE'}</span>
              {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '8px 14px', background: 'rgba(203,255,71,0.025)', borderTop: `1px solid rgba(203,255,71,0.07)`, display: 'flex', gap: 6 }}>
        <span style={{ color: T.lime, fontSize: 9 }}>▸</span>
        <span style={{ fontSize: 12, color: T.textMuted, fontStyle: 'italic' }}>{ex.intensity_hint}</span>
      </div>

      {isOpen && (
        <div style={{ borderTop: `1px solid ${T.border}`, padding: '14px' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: T.lime, marginBottom: 8 }}>FORM CUES</div>
            {ex.form_cues.map((cue: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: T.lime }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: T.textMuted }}>{cue}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 9, color: '#FF5F5F', marginBottom: 8 }}>AVOID</div>
            {ex.common_mistakes.map((m: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#FF5F5F', fontSize: 10 }}>✕</span>
                <span style={{ fontSize: 13, color: T.textMuted }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkoutResult({ workout = MOCK, onBack, onNewWorkout }: any) {
  // If navigating from History, we persist the selected workout into localStorage.
  const [hydratedWorkout, setHydratedWorkout] = useState<any>(workout);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem('fitforge:lastWorkout');
      if (raw) {
        const parsed = JSON.parse(raw);
        setHydratedWorkout(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const workoutToRender = hydratedWorkout ?? workout;
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const totalSets = workoutToRender.exercises.reduce((s: number, e: any) => s + e.sets, 0);

  const handleShare = async () => {
    const text = `${workoutToRender.day} — ${workoutToRender.focus} • ${workoutToRender.total_duration} min`;

    if (navigator.share) await navigator.share({ title: 'Workout', text });
    else await navigator.clipboard.writeText(text);
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${T.border}`, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 54, padding: '0 16px' }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: 10, background: T.surfaceHigh,
            border: `1px solid ${T.border}`, cursor: 'pointer', color: T.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><ChevronLeft size={16} /></button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: T.lime }}>FORGE</div>
            <div style={{ fontSize: 9, color: T.textMuted }}>{workout.day}</div>
          </div>

          <button onClick={handleShare} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 20,
            background: 'rgba(203,255,71,0.07)', border: '1px solid rgba(203,255,71,0.25)',
            cursor: 'pointer', color: T.lime, fontSize: 11, fontWeight: 700,
          }}><Share2 size={11} /> Share</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '24px 16px 20px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Pill text={workoutToRender.difficulty} />
          <Pill text="Hypertrophy" />
          <Pill text={`${workoutToRender.meta.confidence_score}% match`} color={T.lime} />
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.8rem, 10vw, 4rem)', lineHeight: 0.9, marginBottom: 8 }}>
          {workoutToRender.focus.split(/[–—-]/)[0].trim()}
        </h1>
        <p style={{ fontSize: 13, color: T.textMuted, fontStyle: 'italic', marginBottom: 20 }}>{workoutToRender.focus}</p>
        <div style={{ width: 40, height: 2, background: T.lime, marginBottom: 20 }} />

        {/* Stats */}
        <div style={{ display: 'flex', gap: 8 }}>
          <StatBox val={workoutToRender.total_duration} unit="m" label="Duration" />
          <StatBox val={`~${workoutToRender.calories_estimate}`} label="Calories" />
          <StatBox val={workoutToRender.exercises.length} label="Exercises" />
          <StatBox val={totalSets} label="Sets" />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '0 16px 120px' }}>
        {/* Muscle Map */}
        <div style={{ margin: '28px 0 16px' }}>
          <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: '0.18em', marginBottom: 12 }}>MUSCLE MAP</div>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: '14px' }}>
            <div style={{ fontSize: 24, fontFamily: "'Bebas Neue', sans-serif", marginBottom: 8 }}>Chest & Shoulders</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Shoulders', 'Triceps', 'Core'].map(m => (
                <span key={m} style={{ fontSize: 12, padding: '4px 9px', background: 'rgba(203,255,71,0.08)', borderRadius: 6 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Warmup & Cooldown */}
        <div style={{ margin: '28px 0 16px' }}>
          <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: '0.18em', marginBottom: 12 }}>PREPARATION</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'WARM-UP', data: workout.warmup, color: T.amber },
              { label: 'COOL-DOWN', data: workout.cooldown, color: T.blue },
            ].map(({ label, data, color }) => (
              <div key={label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 9, color }}>{label}</span>
                  <span style={{ fontSize: 16, color: T.textMuted }}>{data.duration}m</span>
                </div>
                {data.steps.map((s: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 4, height: 4, background: color, borderRadius: '50%', marginTop: 5 }} />
                    <span style={{ fontSize: 11, color: T.textMuted }}>{s}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Coach Note */}
        {workoutToRender.notes && (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `2px solid ${T.lime}`, borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}>
            <div style={{ fontSize: 9, color: T.lime, marginBottom: 4 }}>COACH NOTE</div>
            <div style={{ fontSize: 12, color: T.textMuted, fontStyle: 'italic' }}>{workoutToRender.notes}</div>
          </div>
        )}

        {/* Equipment */}
        <div style={{ margin: '28px 0 16px' }}>
          <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: '0.18em', marginBottom: 12 }}>EQUIPMENT</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {workoutToRender.equipment.map((eq: string) => (
              <span key={eq} style={{ fontSize: 11, background: T.surface, border: `1px solid ${T.border}`, padding: '6px 12px', borderRadius: 100 }}>{eq}</span>
            ))}
          </div>
        </div>

        {/* Exercises */}
        <div style={{ margin: '28px 0 16px' }}>
          <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: '0.18em', marginBottom: 12 }}>EXERCISES · {workout.exercises.length}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {workoutToRender.exercises.map((ex: any, i: number) => (
              <ExerciseCard key={ex.id} ex={ex} idx={i} expandedId={expandedEx} setExpandedEx={setExpandedEx} />
            ))}
          </div>
        </div>

        {/* Next Session */}
        {workoutToRender.next_session_hint && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: '0.18em', marginBottom: 12 }}>UP NEXT</div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px' }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{workoutToRender.next_session_hint.focus}</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>{workoutToRender.next_session_hint.adjustment}</div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Button */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px 28px', background: 'linear-gradient(to top, #080808 60%, transparent)', pointerEvents: 'none' }}>
        <button onClick={onNewWorkout} style={{
          width: '100%', height: 54, background: T.lime, border: 'none', borderRadius: 14,
          fontSize: 13, fontWeight: 900, letterSpacing: '0.1em', color: '#000',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          pointerEvents: 'all',
        }}>
          <RotateCcw size={14} /> Generate New Workout
        </button>
      </div>
    </div>
  );
}