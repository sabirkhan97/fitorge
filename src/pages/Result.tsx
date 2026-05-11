'use client';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ── Types (keep your existing type definition) ──────────────────────────────
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

// ── Color helpers ────────────────────────────────────────────────────────────
const MUSCLE_COLORS: Record<string, string> = {
  Chest: '#C8F135', 'Upper Chest': '#C8F135',
  Shoulders: '#47C8FF', Back: '#B47CFF',
  Biceps: '#FF7C47', Triceps: '#FF4747',
  Legs: '#FFD147', Glutes: '#FF6BE8',
  Hamstrings: '#FFD147', Calves: '#FFD147',
  Core: '#47FFB4', Forearms: '#FF9F47',
};

const WEIGHT_LABEL: Record<string, string> = {
  bodyweight: 'BW', light: 'Light', moderate: 'Mod', heavy: 'Heavy',
};

const DIFF_COLOR: Record<string, string> = {
  Beginner: '#47FFB4', Intermediate: '#C8F135', Advanced: '#FF6B6B',
};

const getMuscleColor = (m: string) => MUSCLE_COLORS[m] || '#C8F135';

// ── Reusable UI components ───────────────────────────────────────────────────
const StatCard = ({ label, value }: { label: string; value: string | number }) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{label}</div>
    <div className="text-xl font-bold text-white">{value}</div>
  </div>
);

const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-base">{icon}</span>
    <h2 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h2>
    <div className="flex-1 h-px bg-gray-800" />
  </div>
);

const ExerciseRow = ({
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
  return (
    <div
      className="bg-white/5 rounded-xl border border-white/10 overflow-hidden transition-all"
      style={{ borderLeftColor: color, borderLeftWidth: expanded ? '4px' : '2px' }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xs font-bold text-gray-500 w-6">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <div className="text-sm font-semibold text-white">{exercise.name}</div>
            <div className="flex flex-wrap gap-x-2 text-[10px] font-mono mt-0.5">
              <span style={{ color }}>{exercise.muscle_group}</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-500 uppercase">{exercise.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-400">{exercise.sets} × {exercise.reps}</span>
          <div className={`w-2 h-2 rounded-full transition-transform ${expanded ? 'rotate-90' : ''}`} style={{ background: color }} />
        </div>
      </button>

      {expanded && (
        <div className="p-3 sm:p-4 pt-0 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
            <div><span className="text-gray-500">Rest:</span> <span className="text-white ml-1">{exercise.rest}</span></div>
            <div><span className="text-gray-500">Tempo:</span> <span className="text-white ml-1">{exercise.tempo}</span></div>
            <div><span className="text-gray-500">Weight:</span> <span className="text-white ml-1">{WEIGHT_LABEL[exercise.weight]}</span></div>
            <div><span className="text-gray-500">Intensity:</span> <span className="text-white ml-1">{exercise.intensity_label}</span></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {exercise.tips.length > 0 && (
              <div className="bg-[#1A2A1A]/50 p-2 rounded">
                <div className="text-[#C8F135] mb-1 text-[10px] font-bold uppercase">💡 Tips</div>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                  {exercise.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}
            {exercise.mistakes.length > 0 && (
              <div className="bg-[#2A1A1A]/50 p-2 rounded">
                <div className="text-[#FF6B6B] mb-1 text-[10px] font-bold uppercase">⚠️ Avoid</div>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                  {exercise.mistakes.map((mistake, i) => <li key={i}>{mistake}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
export default function WorkoutResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fromState = (location.state as any)?.workout;
    if (fromState) {
      setPlan(fromState);
      return;
    }
    try {
      const stored = localStorage.getItem('fitforge:lastWorkout');
      if (stored) setPlan(JSON.parse(stored));
    } catch {}
  }, [location.state]);

  const handleBack = () => navigate(-1);
  const handleNew = () => navigate('/workout');

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
    } catch {}
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl font-black text-[#C8F135] mb-3">NO PLAN</div>
          <p className="text-gray-500 text-sm mb-5">Generate a workout first.</p>
          <button
            onClick={handleNew}
            className="bg-[#C8F135] text-black font-bold px-5 py-2 rounded-full text-sm uppercase tracking-wide"
          >
            Generate Workout
          </button>
        </div>
      </div>
    );
  }

  const difficultyColor = DIFF_COLOR[plan.difficulty] || '#C8F135';

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition"
        >
          ←
        </button>
        <div className="text-center">
          <div className="text-lg font-black text-[#C8F135]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>FORGE</div>
          <div className="text-[9px] font-mono text-gray-500 -mt-0.5">{plan.workout_style}</div>
        </div>
        <button
          onClick={handleShare}
          className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-gray-300 hover:text-white transition"
        >
          {copied ? 'Copied!' : 'Share'}
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
              style={{ color: difficultyColor, borderColor: `${difficultyColor}30`, backgroundColor: `${difficultyColor}10` }}
            >
              {plan.difficulty}
            </span>
            <span className="text-[10px] font-mono text-gray-500">{plan.hero_stats.training_split}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">{plan.title}</h1>
          <p className="text-sm text-gray-400 mb-4">{plan.subtitle}</p>
          <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-5">
            <span>⏱ {plan.estimated_duration} min</span>
            <span>🔥 ~{plan.calories_estimate} cal</span>
            <span>🎯 {plan.focus.primary}</span>
          </div>
          {/* Stats grid - responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            <StatCard label="Duration" value={`${plan.estimated_duration}m`} />
            <StatCard label="Calories" value={`~${plan.calories_estimate}`} />
            <StatCard label="Exercises" value={plan.hero_stats.total_exercises} />
            <StatCard label="Total Sets" value={plan.hero_stats.total_sets} />
          </div>
        </div>

        {/* Warmup */}
        <SectionHeader title="Warm-up" icon="🔥" />
        <div className="space-y-2 mb-6">
          {plan.warmup.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-sm text-gray-200">{item.name}</span>
              <span className="text-xs font-mono text-gray-500">{item.duration}</span>
            </div>
          ))}
        </div>

        {/* Exercises */}
        <SectionHeader title="Exercises" icon="💪" />
        <div className="space-y-2 mb-6">
          {plan.exercises.map((ex, idx) => (
            <ExerciseRow
              key={ex.id}
              exercise={ex}
              index={idx}
              expanded={expandedId === ex.id}
              onToggle={() => setExpandedId(expandedId === ex.id ? null : ex.id)}
            />
          ))}
        </div>

        {/* Finisher */}
        <SectionHeader title="Finisher" icon="⚡" />
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-white">{plan.finisher.name}</h3>
            <span className="text-[10px] font-mono text-gray-500">{plan.finisher.duration}</span>
          </div>
          <p className="text-sm text-gray-400">{plan.finisher.description}</p>
        </div>

        {/* Cooldown */}
        <SectionHeader title="Cool-down" icon="🧘" />
        <div className="space-y-2 mb-6">
          {plan.cooldown.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg border border-white/5">
              <span className="text-sm text-gray-200">{item.name}</span>
              <span className="text-xs font-mono text-gray-500">{item.duration}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <SectionHeader title="Coach Summary" icon="📋" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[#C8F135] text-xs font-bold mb-1">Main Benefit</div>
            <p className="text-sm text-gray-300">{plan.summary.main_benefit}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[#47C8FF] text-xs font-bold mb-1">Recovery</div>
            <p className="text-sm text-gray-300">{plan.summary.recovery_tip}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="text-[#B47CFF] text-xs font-bold mb-1">Next Focus</div>
            <p className="text-sm text-gray-300">{plan.summary.next_focus}</p>
          </div>
        </div>

        {/* Muscle tags */}
        <SectionHeader title="Muscles Trained" icon="🎯" />
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(plan.exercises.map(e => e.muscle_group))).map(muscle => {
            const color = getMuscleColor(muscle);
            return (
              <span
                key={muscle}
                className="text-xs font-mono px-2 py-1 rounded-full border"
                style={{ color, borderColor: `${color}40`, backgroundColor: `${color}08` }}
              >
                {muscle}
              </span>
            );
          })}
        </div>
      </main>

      {/* Sticky footer – fully responsive */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl py-3 text-sm font-medium text-gray-200 hover:bg-white/20 transition"
          >
            ← Edit
          </button>
          <button
            onClick={handleNew}
            className="flex-1 bg-[#C8F135] text-black rounded-xl py-3 text-sm font-bold uppercase tracking-wide hover:bg-[#d4ff3e] transition"
          >
            + New Workout
          </button>
        </div>
      </div>
    </div>
  );
}