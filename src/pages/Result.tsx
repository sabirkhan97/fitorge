'use client';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS (colours)
───────────────────────────────────────────────────────────────────────────── */
const MUSCLE_COLORS: Record<string, { primary: string; bg: string; border: string }> = {
  'Chest':       { primary: '#D4F53C', bg: 'rgba(212,245,60,0.08)',   border: 'rgba(212,245,60,0.2)' },
  'Upper Chest': { primary: '#D4F53C', bg: 'rgba(212,245,60,0.08)',   border: 'rgba(212,245,60,0.2)' },
  'Shoulders':   { primary: '#38BDF8', bg: 'rgba(56,189,248,0.08)',   border: 'rgba(56,189,248,0.2)' },
  'Back':        { primary: '#A78BFA', bg: 'rgba(167,139,250,0.08)',  border: 'rgba(167,139,250,0.2)' },
  'Biceps':      { primary: '#FB923C', bg: 'rgba(251,146,60,0.08)',   border: 'rgba(251,146,60,0.2)' },
  'Triceps':     { primary: '#F87171', bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.2)' },
  'Legs':        { primary: '#FBBF24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.2)' },
  'Glutes':      { primary: '#F472B6', bg: 'rgba(244,114,182,0.08)',  border: 'rgba(244,114,182,0.2)' },
  'Hamstrings':  { primary: '#FBBF24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.2)' },
  'Calves':      { primary: '#FBBF24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.2)' },
  'Core':        { primary: '#34D399', bg: 'rgba(52,211,153,0.08)',   border: 'rgba(52,211,153,0.2)' },
  'Forearms':    { primary: '#FB923C', bg: 'rgba(251,146,60,0.08)',   border: 'rgba(251,146,60,0.2)' },
};
const getMuscle = (m: string) =>
  MUSCLE_COLORS[m] ?? { primary: '#D4F53C', bg: 'rgba(212,245,60,0.08)', border: 'rgba(212,245,60,0.2)' };

const DIFF_CFG = {
  Beginner:     { color: '#34D399', bg: 'rgba(52,211,153,0.10)',   border: 'rgba(52,211,153,0.28)',  dots: 1 },
  Intermediate: { color: '#FBBF24', bg: 'rgba(251,191,36,0.10)',   border: 'rgba(251,191,36,0.28)',  dots: 2 },
  Advanced:     { color: '#F87171', bg: 'rgba(248,113,113,0.10)',  border: 'rgba(248,113,113,0.28)', dots: 3 },
};

const WEIGHT_CFG = {
  bodyweight: { label: 'Bodyweight', color: '#34D399' },
  light:      { label: 'Light',      color: '#D4F53C' },
  moderate:   { label: 'Moderate',   color: '#FBBF24' },
  heavy:      { label: 'Heavy',      color: '#F87171' },
};

const INTENSITY_PCT = { Low: 33, Moderate: 66, High: 100 };

/* ─────────────────────────────────────────────────────────────────────────────
   SVGs (unchanged)
───────────────────────────────────────────────────────────────────────────── */
const ArrowLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3L5 8L10 13" />
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 2L11 4.5L9 7M11 4.5H5a3 3 0 000 6h1" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M7 2v10M2 7h10" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" />
  </svg>
);
const ChevronDown = () => (
  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3.5L5 6.5L8 3.5" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS (converted to Tailwind)
───────────────────────────────────────────────────────────────────────────── */
const SHead = ({ icon, title }: { icon: string; title: string }) => (
  <div className="flex items-center gap-2.5 mb-3.5">
    <span className="text-sm shrink-0">{icon}</span>
    <span className="font-mono text-[9px] font-semibold tracking-[0.16em] text-white/30 uppercase whitespace-nowrap">
      {title}
    </span>
    <div className="flex-1 h-px bg-white/5" />
  </div>
);

const SRow = ({ name, duration }: { name: string; duration: string }) => (
  <div className="flex justify-between items-center p-3 bg-black/10 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition">
    <span className="text-sm font-medium text-white/85">{name}</span>
    <span className="font-mono text-[10px] text-white/30 bg-white/5 px-2.5 py-1 rounded-md">{duration}</span>
  </div>
);

const ExCard = ({
  exercise, index, expanded, onToggle,
}: {
  exercise: WorkoutPlan['exercises'][0];
  index: number; expanded: boolean; onToggle: () => void;
}) => {
  const muscle = getMuscle(exercise.muscle_group);
  const wt = WEIGHT_CFG[exercise.weight] ?? WEIGHT_CFG.moderate;

  return (
    <div
      className={`bg-black/10 border rounded-2xl overflow-hidden transition-all ${
        expanded ? 'bg-white/5' : ''
      }`}
      style={{ borderColor: expanded ? muscle.border : 'rgba(255,255,255,0.05)' }}
    >
      <button
        className="w-full flex items-center gap-3 p-3.5 text-left focus:outline-none hover:bg-white/5 transition"
        onClick={onToggle}
      >
        {/* Number */}
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-[11px] font-semibold transition-all shrink-0"
          style={{
            background: expanded ? muscle.primary : 'rgba(255,255,255,0.06)',
            color: expanded ? '#000' : 'rgba(255,255,255,0.32)',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate mb-1">
            {exercise.name}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <span
              className="font-mono text-[9px] font-semibold uppercase px-2 py-0.5 rounded-md"
              style={{ color: muscle.primary, background: muscle.bg }}
            >
              {exercise.muscle_group}
            </span>
            <span className="font-mono text-[9px] text-white/30 uppercase">
              {exercise.category}
            </span>
          </div>
        </div>

        {/* Right metrics */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="text-right">
            <div className="font-mono text-sm font-semibold text-white">
              {exercise.sets}×{exercise.reps}
            </div>
            <div className="font-mono text-[8px] text-white/30 uppercase tracking-wide">
              sets × reps
            </div>
          </div>
          <div
            className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
              expanded ? 'bg-opacity-15' : ''
            }`}
            style={{
              borderColor: expanded ? muscle.primary : 'rgba(255,255,255,0.1)',
              background: expanded ? muscle.bg : 'transparent',
              color: expanded ? muscle.primary : 'rgba(255,255,255,0.32)',
            }}
          >
            <ChevronDown />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-3.5 pb-3.5 border-t border-white/5 animate-in slide-in-from-top-1 duration-200">
          {/* Divider */}
          <div className="h-px my-3" style={{ background: `linear-gradient(90deg,${muscle.primary}55,transparent)` }} />

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
            {[
              { lbl: 'Rest', val: exercise.rest },
              { lbl: 'Tempo', val: exercise.tempo },
              { lbl: 'Weight', val: wt.label, color: wt.color },
              { lbl: 'Level', val: exercise.intensity_label },
            ].map(s => (
              <div key={s.lbl} className="bg-white/5 rounded-lg p-2 text-center">
                <div className="font-mono text-[8px] text-white/30 uppercase tracking-wider mb-1.5">
                  {s.lbl}
                </div>
                <div className="font-mono text-[11px] font-semibold" style={{ color: s.color ?? '#fff' }}>
                  {s.val}
                </div>
              </div>
            ))}
          </div>

          {/* Tips & Mistakes */}
          {(exercise.tips.length > 0 || exercise.mistakes.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {exercise.tips.length > 0 && (
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: 'rgba(212,245,60,0.05)',
                    border: '1px solid rgba(212,245,60,0.12)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-[#D4F53C] font-mono text-[9px] font-semibold tracking-wide mb-2">
                    <span>💡</span> Tips
                  </div>
                  <ul className="list-none space-y-1">
                    {exercise.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-white/55 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-[#D4F53C]">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {exercise.mistakes.length > 0 && (
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: 'rgba(248,113,113,0.05)',
                    border: '1px solid rgba(248,113,113,0.12)',
                  }}
                >
                  <div className="flex items-center gap-1.5 text-[#F87171] font-mono text-[9px] font-semibold tracking-wide mb-2">
                    <span>⚠</span> Avoid
                  </div>
                  <ul className="list-none space-y-1">
                    {exercise.mistakes.map((mistake, i) => (
                      <li key={i} className="text-xs text-white/55 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-[#F87171]">
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   ROOT COMPONENT (Tailwind)
───────────────────────────────────────────────────────────────────────────── */
export default function WorkoutResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [expandedId, setExpand] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const s = (location.state as any)?.workout;
    if (s) { setPlan(s); return; }
    try {
      const ls = localStorage.getItem('fitforge:lastWorkout');
      if (ls) setPlan(JSON.parse(ls));
    } catch {}
  }, [location.state]);

  const share = useCallback(async () => {
    if (!plan) return;
    const t = `${plan.title} — ${plan.estimated_duration}min · ~${plan.calories_estimate}kcal`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'FitForge Workout', text: t });
        return;
      }
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  }, [plan]);

  const toggle = useCallback((id: string) => setExpand(p => (p === id ? null : id)), []);

  // Empty state
  if (!plan) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center gap-4 text-center p-6">
        <div className="font-['Bebas_Neue'] text-8xl tracking-wide text-[#D4F53C] leading-tight">NO PLAN</div>
        <p className="text-sm text-white/30">Generate a workout to get started.</p>
        <button
          onClick={() => navigate('/workout')}
          className="h-11 px-7 rounded-xl bg-[#D4F53C] text-black font-['DM_Sans'] font-bold text-xs uppercase tracking-wide shadow-[0_0_24px_rgba(212,245,60,0.22)] hover:shadow-[0_0_36px_rgba(212,245,60,0.32)] hover:-translate-y-px active:scale-97 transition"
        >
          Generate workout
        </button>
      </div>
    );
  }

  const diff = DIFF_CFG[plan.difficulty] ?? DIFF_CFG.Intermediate;
  const intensityPct = INTENSITY_PCT[plan.hero_stats?.intensity ?? 'Moderate'];
  const uniqueMuscles = [...new Set(plan.exercises.map(e => e.muscle_group))];

  return (
    <>
      {/* Minimal keyframes for fade-up animation – only for UX, no layout CSS */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) forwards; }
        .anim-delay-00 { animation-delay: 0.00s; }
        .anim-delay-07 { animation-delay: 0.07s; }
        .anim-delay-14 { animation-delay: 0.14s; }
        .anim-delay-21 { animation-delay: 0.21s; }
        .anim-delay-28 { animation-delay: 0.28s; }
        .anim-delay-35 { animation-delay: 0.35s; }
        .anim-delay-42 { animation-delay: 0.42s; }
      `}</style>

      <div className="min-h-screen bg-[#080808] text-white font-['DM_Sans']">
        {/* Spacer for fixed navbar (adjust if your global navbar height differs) */}
        <div className="pt-[120px]" />

        {/* Main grid: sidebar + content */}
        <div className="max-w-[1600px] mx-auto lg:grid lg:grid-cols-[380px_1fr] 2xl:grid-cols-[460px_1fr]">
          {/* SIDEBAR (sticky on desktop) */}
          <aside className="px-4 pb-32 pt-5 sm:px-6 md:px-8 lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:border-r lg:border-white/5 lg:pb-10 animate-fade-up anim-delay-00">
            {/* Diff + split */}
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="inline-flex items-center gap-1.5 h-6 px-3 rounded-full font-mono text-[9px] font-semibold tracking-[0.1em] uppercase border"
                style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
              >
                <div className="flex gap-1">
                  {[1, 2, 3].map(n => (
                    <div
                      key={n}
                      className="w-1 h-1 rounded-full"
                      style={{ background: n <= diff.dots ? diff.color : 'rgba(255,255,255,0.12)' }}
                    />
                  ))}
                </div>
                {plan.difficulty}
              </div>
              {plan.hero_stats?.training_split && (
                <span className="font-mono text-[9px] text-white/30 tracking-[0.1em] uppercase">
                  {plan.hero_stats.training_split}
                </span>
              )}
            </div>

            <h1 className="font-['Bebas_Neue'] text-[clamp(44px,7vw,72px)] leading-[0.93] tracking-wide text-white mb-3">
              {plan.title}
            </h1>
            <p className="text-sm leading-relaxed text-white/55 mb-6 max-w-md">{plan.subtitle}</p>

            {/* Quick pills */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 border border-white/5 font-mono text-[11px] text-white/55">
                <span>⏱</span> {plan.estimated_duration} min
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 border border-white/5 font-mono text-[11px] text-white/55">
                <span>🔥</span> ~{plan.calories_estimate} kcal
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 border border-white/5 font-mono text-[11px] text-white/55">
                <span>🎯</span> {plan.focus?.primary}
              </div>
            </div>

            {/* Metric grid */}
            <div className="grid grid-cols-2 gap-2 mb-5 sm:grid-cols-4">
              {[
                { lbl: 'Duration', val: plan.estimated_duration, unit: 'min', color: '#D4F53C' },
                { lbl: 'Calories', val: plan.calories_estimate, unit: 'kcal', color: '#FB923C' },
                { lbl: 'Exercises', val: plan.hero_stats?.total_exercises ?? 0, unit: '', color: '#38BDF8' },
                { lbl: 'Total sets', val: plan.hero_stats?.total_sets ?? 0, unit: '', color: '#A78BFA' },
              ].map(s => (
                <div key={s.lbl} className="relative bg-black/10 border border-white/5 rounded-2xl p-4 overflow-hidden group hover:bg-white/5 transition">
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: s.color }} />
                  <div className="font-mono text-[9px] text-white/30 uppercase tracking-[0.12em] mt-1 mb-2">
                    {s.lbl}
                  </div>
                  <div className="font-['Bebas_Neue'] text-4xl leading-none" style={{ color: s.color }}>
                    {s.val}
                    {s.unit && <span className="text-lg opacity-60">{s.unit}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Intensity */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider">Intensity</span>
                <span className="font-mono text-[10px] text-[#D4F53C] font-semibold">
                  {plan.hero_stats?.intensity ?? 'Moderate'}
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4F53C] rounded-full" style={{ width: `${intensityPct}%` }} />
              </div>
            </div>

            {/* Focus */}
            {plan.focus && (
              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(212,245,60,0.1)] border border-[rgba(212,245,60,0.2)] text-xs font-semibold text-[#D4F53C] mb-2">
                  🎯 {plan.focus.primary}
                </div>
                {plan.focus.secondary?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {plan.focus.secondary.map(s => (
                      <span key={s} className="text-[11px] text-white/30 bg-white/5 border border-white/5 rounded-md px-2 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="h-px bg-white/5 my-5" />

            {/* Equipment (desktop) */}
            {plan.equipment?.length > 0 && (
              <>
                <SHead icon="🏋️" title="Equipment" />
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {plan.equipment.map(eq => (
                    <span key={eq} className="font-mono text-[10px] font-medium text-white/55 bg-black/10 border border-white/5 rounded-lg px-3 py-1 uppercase tracking-wide">
                      {eq}
                    </span>
                  ))}
                </div>
                <div className="h-px bg-white/5 my-5" />
              </>
            )}

            {/* Desktop actions */}
            <div className="hidden lg:flex gap-2 mt-2">
              <button
                className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 text-white/55 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-white/10 hover:text-white transition"
                onClick={() => navigate(-1)}
              >
                <EditIcon /> Edit
              </button>
              <button
                className="flex-[2] h-11 rounded-xl bg-[#D4F53C] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_28px_rgba(212,245,60,0.18)] hover:shadow-[0_0_40px_rgba(212,245,60,0.3)] hover:-translate-y-px transition"
                onClick={() => navigate('/workout')}
              >
                <PlusIcon /> New workout
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="px-4 pt-2 pb-20 sm:px-6 md:px-8 lg:pt-6 lg:pb-32">
            {/* Warmup */}
            {plan.warmup?.length > 0 && (
              <div className="mb-8 animate-fade-up anim-delay-07">
                <SHead icon="🔥" title="Warm-up" />
                <div className="space-y-1.5">
                  {plan.warmup.map((w, i) => <SRow key={i} name={w.name} duration={w.duration} />)}
                </div>
              </div>
            )}

            {/* Exercises */}
            <div className="mb-8 animate-fade-up anim-delay-14">
              <SHead icon="💪" title={`Exercises · ${plan.exercises.length}`} />
              <div className="flex flex-wrap gap-1.5 mb-3">
                {uniqueMuscles.map(m => {
                  const c = getMuscle(m);
                  return (
                    <span
                      key={m}
                      className="font-mono text-[9px] font-semibold uppercase px-2 py-1 rounded-md border"
                      style={{ color: c.primary, background: c.bg, borderColor: c.border }}
                    >
                      {m}
                    </span>
                  );
                })}
              </div>
              <div className="space-y-1.5 xl:grid xl:grid-cols-2 xl:gap-2 xl:space-y-0">
                {plan.exercises.map((ex, idx) => (
                  <ExCard
                    key={ex.id}
                    exercise={ex}
                    index={idx}
                    expanded={expandedId === ex.id}
                    onToggle={() => toggle(ex.id)}
                  />
                ))}
              </div>
            </div>

            {/* Finisher */}
            {plan.finisher && (
              <div className="mb-8 animate-fade-up anim-delay-21">
                <SHead icon="⚡" title="Finisher" />
                <div className="relative bg-black/10 border border-[rgba(212,245,60,0.2)] rounded-2xl p-5 overflow-hidden">
                  <div className="absolute right-0 top-0 text-8xl font-['Bebas_Neue'] text-[rgba(212,245,60,0.04)] pointer-events-none select-none">
                    ⚡
                  </div>
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <span className="text-lg font-bold text-white tracking-tight">{plan.finisher.name}</span>
                    <span className="shrink-0 bg-[rgba(212,245,60,0.1)] border border-[rgba(212,245,60,0.2)] rounded-md px-3 py-1 font-mono text-[10px] text-[#D4F53C] font-semibold">
                      {plan.finisher.duration}
                    </span>
                  </div>
                  <p className="text-sm text-white/55 leading-relaxed">{plan.finisher.description}</p>
                </div>
              </div>
            )}

            {/* Cooldown */}
            {plan.cooldown?.length > 0 && (
              <div className="mb-8 animate-fade-up anim-delay-28">
                <SHead icon="🧘" title="Cool-down" />
                <div className="space-y-1.5">
                  {plan.cooldown.map((c, i) => <SRow key={i} name={c.name} duration={c.duration} />)}
                </div>
              </div>
            )}

            {/* Summary */}
            {plan.summary && (
              <div className="mb-8 animate-fade-up anim-delay-35">
                <SHead icon="📋" title="Coach summary" />
                <div className="space-y-2">
                  {[
                    { lbl: 'Main benefit', txt: plan.summary.main_benefit, color: '#D4F53C', bg: 'rgba(212,245,60,0.08)', ic: '✦' },
                    { lbl: 'Recovery tip', txt: plan.summary.recovery_tip, color: '#38BDF8', bg: 'rgba(56,189,248,0.08)', ic: '↻' },
                    { lbl: 'Next focus', txt: plan.summary.next_focus, color: '#A78BFA', bg: 'rgba(167,139,250,0.08)', ic: '→' },
                  ].map(s => (
                    <div
                      key={s.lbl}
                      className="flex gap-3 items-start bg-black/10 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition"
                    >
                      <div
                        className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold border"
                        style={{ color: s.color, background: s.bg, borderColor: `${s.color}30` }}
                      >
                        {s.ic}
                      </div>
                      <div>
                        <div className="font-mono text-[8px] font-semibold uppercase tracking-wider mb-1" style={{ color: s.color }}>
                          {s.lbl}
                        </div>
                        <div className="text-sm text-white/55 leading-relaxed">{s.txt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment (mobile only) */}
            {plan.equipment?.length > 0 && (
              <div className="block lg:hidden animate-fade-up anim-delay-42">
                <SHead icon="🏋️" title="Equipment" />
                <div className="flex flex-wrap gap-1.5">
                  {plan.equipment.map(eq => (
                    <span key={eq} className="font-mono text-[10px] font-medium text-white/55 bg-black/10 border border-white/5 rounded-lg px-3 py-1 uppercase tracking-wide">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* MOBILE FOOTER (fixed at bottom) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-gradient-to-t from-[#080808] via-[#080808] to-transparent pt-6 pb-5">
          <div className="max-w-md mx-auto flex gap-2">
            <button
              className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-white/55 font-semibold text-xs hover:bg-white/10 hover:text-white transition"
              onClick={() => navigate(-1)}
            >
              ← Edit
            </button>
            <button
              className="flex-[2] h-12 rounded-xl bg-[#D4F53C] text-black font-bold text-xs uppercase tracking-wide shadow-[0_0_28px_rgba(212,245,60,0.2)] hover:shadow-[0_0_40px_rgba(212,245,60,0.32)] hover:-translate-y-px transition"
              onClick={() => navigate('/workout')}
            >
              + New workout
            </button>
            <button
              className={`h-12 px-4 rounded-full bg-white/5 border border-white/10 text-white/55 font-semibold text-xs flex items-center gap-1.5 transition ${
                copied ? 'bg-[#D4F53C] text-black border-[#D4F53C]' : ''
              }`}
              onClick={share}
            >
              {copied ? '✓ Copied' : <><ShareIcon />Share</>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}