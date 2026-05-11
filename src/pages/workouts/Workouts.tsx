import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface WorkoutTemplate {
  id: string;
  name: string;
  focus: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercisesCount: number;
  description: string;
  icon: string;
  color: string;
}

const WORKOUTS: WorkoutTemplate[] = [
  {
    id: 'push',
    name: 'Push Day',
    focus: 'Chest · Shoulders · Triceps',
    duration: 45,
    difficulty: 'Intermediate',
    exercisesCount: 6,
    description: 'Build upper body pressing strength with bench, overhead press, and triceps extensions.',
    icon: '💪',
    color: '#FF6B6B',
  },
  {
    id: 'pull',
    name: 'Pull Day',
    focus: 'Back · Biceps · Rear Delts',
    duration: 45,
    difficulty: 'Intermediate',
    exercisesCount: 6,
    description: 'Rows, pull‑ups, curls – develop a strong back and arms.',
    icon: '🏋️',
    color: '#8338EC',
  },
  {
    id: 'legs',
    name: 'Leg Day',
    focus: 'Quads · Glutes · Hamstrings',
    duration: 50,
    difficulty: 'Intermediate',
    exercisesCount: 7,
    description: 'Squats, lunges, deadlifts – build lower body power and mass.',
    icon: '🦵',
    color: '#FB5607',
  },
  {
    id: 'full-body',
    name: 'Full Body',
    focus: 'All major muscles',
    duration: 60,
    difficulty: 'Beginner',
    exercisesCount: 8,
    description: 'Perfect for overall fitness and frequency. Hits every muscle group.',
    icon: '🔄',
    color: '#47FFB4',
  },
  {
    id: 'upper',
    name: 'Upper Body',
    focus: 'Chest · Back · Shoulders · Arms',
    duration: 50,
    difficulty: 'Intermediate',
    exercisesCount: 7,
    description: 'Target all upper body pushing and pulling muscles.',
    icon: '💪',
    color: '#3A86FF',
  },
  {
    id: 'lower',
    name: 'Lower Body',
    focus: 'Legs · Glutes · Calves',
    duration: 45,
    difficulty: 'Intermediate',
    exercisesCount: 6,
    description: 'Build strong legs and glutes with compound and isolation moves.',
    icon: '🦵',
    color: '#FFD147',
  },
  {
    id: 'cardio',
    name: 'Cardio Burn',
    focus: 'Endurance · Fat loss',
    duration: 30,
    difficulty: 'Beginner',
    exercisesCount: 5,
    description: 'High‑energy circuit to boost heart rate and calorie burn.',
    icon: '🏃',
    color: '#FFBE0B',
  },
  {
    id: 'abs-core',
    name: 'Core Crusher',
    focus: 'Abs · Obliques · Lower back',
    duration: 20,
    difficulty: 'Beginner',
    exercisesCount: 5,
    description: 'Strengthen your midsection with planks, crunches, and leg raises.',
    icon: '🌀',
    color: '#FF006E',
  },
];

const DIFFICULTY_COLORS = {
  Beginner: '#47FFB4',
  Intermediate: '#C8F135',
  Advanced: '#FF6B6B',
};

export default function Workouts() {
  const navigate = useNavigate();
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [filteredWorkouts, setFilteredWorkouts] = useState(WORKOUTS);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (difficultyFilter === 'All') {
      setFilteredWorkouts(WORKOUTS);
    } else {
      setFilteredWorkouts(WORKOUTS.filter((w) => w.difficulty === difficultyFilter));
    }
  }, [difficultyFilter]);

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredWorkouts]);

  const addToRefs = (el: HTMLDivElement | null, idx: number) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current[idx] = el;
    }
  };

  const startWorkout = (template: WorkoutTemplate) => {
    // Navigate to the generator and pass the focus area
    const focusMap: Record<string, string> = {
      'push': 'push',
      'pull': 'pull',
      'legs': 'legs',
      'full-body': 'full_body',
      'upper': 'upper_body',
      'lower': 'lower_body',
    };
    const focus = focusMap[template.id] || 'full_body';
    navigate('/workout', { state: { focus, duration: template.duration } });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Spacer for fixed header */}
      <div className="pt-[120px] md:pt-[120px]" />

      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-3 tracking-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            WORKOUT <span className="text-[#C8F135]">LIBRARY</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Choose from proven templates or generate a fully custom workout tailored to you.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setDifficultyFilter(level)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                difficultyFilter === level
                  ? 'bg-[#C8F135] text-black font-bold'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Workout grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredWorkouts.map((workout, idx) => {
            const difficultyColor = DIFFICULTY_COLORS[workout.difficulty];
            return (
              <div
                key={workout.id}
                ref={(el) => addToRefs(el, idx)}
                className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden hover:border-[#C8F135]/40 transition-all duration-300 hover:-translate-y-1 group opacity-0 translate-y-8"
                style={{ transitionDelay: `${idx * 0.04}s` }}
              >
                {/* Color header */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: workout.color }}
                />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-3xl">{workout.icon}</span>
                    <span
                      className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                      style={{
                        color: difficultyColor,
                        backgroundColor: `${difficultyColor}15`,
                      }}
                    >
                      {workout.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{workout.name}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-2">
                    {workout.focus}
                  </p>
                  <p className="text-gray-500 text-xs mb-3 leading-relaxed min-h-[60px]">
                    {workout.description}
                  </p>
                  <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-4">
                    <span>⏱ {workout.duration} min</span>
                    <span>🏋️ {workout.exercisesCount} exercises</span>
                  </div>
                  <button
                    onClick={() => startWorkout(workout)}
                    className="w-full py-2 rounded-full text-[11px] font-mono uppercase tracking-wider transition bg-gray-800 text-gray-300 hover:bg-[#C8F135] hover:text-black"
                  >
                    Start Workout →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredWorkouts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No workouts for this difficulty level.</p>
          </div>
        )}

        {/* CTA to custom generator */}
        <div className="mt-16 bg-gradient-to-r from-[#C8F135]/10 to-transparent rounded-2xl p-6 md:p-8 border border-[#C8F135]/20 text-center">
          <h2 className="text-2xl font-bold mb-2">Need something else?</h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm mb-6">
            Tell the AI exactly what you want – your goals, equipment, available time.
          </p>
          <button
            onClick={() => navigate('/workout')}
            className="bg-[#C8F135] text-black font-bold px-6 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-[#d4ff3e] transition inline-flex items-center gap-2"
          >
            Generate Custom Workout <span>→</span>
          </button>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-xs font-mono">
        © 2025 FORGE — Built to be forged.
      </footer>
    </div>
  );
}