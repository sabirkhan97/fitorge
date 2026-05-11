import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Program {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  sessionsPerWeek: number;
  focus: string[];
  popular: boolean;
  imageIcon: string;
}

const PROGRAMS: Program[] = [
  {
    id: 'foundation',
    title: 'Foundation Builder',
    description: 'Perfect for beginners. Learn proper form, build consistency, and establish a strong base.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    focus: ['Full Body', 'Form', 'Consistency'],
    popular: true,
    imageIcon: '🏗️',
  },
  {
    id: 'strength',
    title: 'Strength Protocol',
    description: 'Heavy compounds, linear progression. Build raw strength with squat, bench, deadlift.',
    difficulty: 'Intermediate',
    durationWeeks: 6,
    sessionsPerWeek: 4,
    focus: ['Strength', 'Compound Lifts', 'Power'],
    popular: true,
    imageIcon: '🏋️',
  },
  {
    id: 'hypertrophy',
    title: 'Muscle Forge',
    description: 'High volume, moderate reps. Maximise muscle growth with targeted splits.',
    difficulty: 'Intermediate',
    durationWeeks: 8,
    sessionsPerWeek: 5,
    focus: ['Hypertrophy', 'Pump', 'Aesthetics'],
    popular: false,
    imageIcon: '💪',
  },
  {
    id: 'fat-loss',
    title: 'Shred Cycle',
    description: 'Circuit training, metabolic conditioning, and high‑rep work to burn fat while keeping muscle.',
    difficulty: 'Intermediate',
    durationWeeks: 6,
    sessionsPerWeek: 5,
    focus: ['Fat Loss', 'Metabolic', 'Endurance'],
    popular: false,
    imageIcon: '🔥',
  },
  {
    id: 'advanced-strength',
    title: 'Advanced Power',
    description: 'Periodised peak program. For experienced lifters only.',
    difficulty: 'Advanced',
    durationWeeks: 8,
    sessionsPerWeek: 5,
    focus: ['Strength Peaking', 'Periodization', 'Power'],
    popular: true,
    imageIcon: '⚡',
  },
  {
    id: 'home-hero',
    title: 'Home Hero',
    description: 'Minimal equipment, maximum results. Bodyweight and resistance band workouts.',
    difficulty: 'Beginner',
    durationWeeks: 4,
    sessionsPerWeek: 4,
    focus: ['Bodyweight', 'No Gym', 'Functional'],
    popular: false,
    imageIcon: '🏠',
  },
];

const DIFFICULTY_COLORS = {
  Beginner: '#47FFB4',
  Intermediate: '#C8F135',
  Advanced: '#FF6B6B',
};

export default function Programs() {
  const navigate = useNavigate();
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filteredPrograms, setFilteredPrograms] = useState(PROGRAMS);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (filterDifficulty === 'All') {
      setFilteredPrograms(PROGRAMS);
    } else {
      setFilteredPrograms(PROGRAMS.filter((p) => p.difficulty === filterDifficulty));
    }
  }, [filterDifficulty]);

  // Intersection observer for fade‑up animations
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

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLDivElement | null, idx: number) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current[idx] = el;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Spacer for fixed header (announcement bar + navbar) */}
      <div className="pt-[120px] md:pt-[120px]" />

      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10">
        {/* Hero */}
        <div
          ref={(el) => addToRefs(el, 0)}
          className="text-center mb-12 transition-all duration-700 opacity-0 translate-y-8"
        >
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-3 tracking-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            TRAINING <span className="text-[#C8F135]">PROGRAMS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Choose a science‑backed plan, follow the AI‑generated workouts, and level up.
            All programs adapt to your equipment and goals.
          </p>
        </div>

        {/* Filter tabs */}
        <div
          ref={(el) => addToRefs(el, 1)}
          className="flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700 opacity-0 translate-y-8"
        >
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterDifficulty(level)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                filterDifficulty === level
                  ? 'bg-[#C8F135] text-black font-bold'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Programs grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program, idx) => {
            const diffColor = DIFFICULTY_COLORS[program.difficulty];
            return (
              <div
                key={program.id}
                ref={(el) => addToRefs(el, idx + 2)}
                className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden hover:border-[#C8F135]/30 transition-all duration-300 hover:-translate-y-1 group opacity-0 translate-y-8"
                style={{ transitionDelay: `${idx * 0.05}s` }}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-4xl">{program.imageIcon}</span>
                    {program.popular && (
                      <span className="text-[9px] font-mono bg-[#C8F135]/20 text-[#C8F135] px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{program.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {program.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                      style={{ color: diffColor, borderColor: `${diffColor}30`, backgroundColor: `${diffColor}08` }}
                    >
                      {program.difficulty}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                      {program.durationWeeks} weeks
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                      {program.sessionsPerWeek}× / week
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {program.focus.map((f) => (
                      <span key={f} className="text-[9px] font-mono text-gray-400 bg-gray-800/50 px-2 py-0.5 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate('/workout', { state: { programId: program.id } })}
                    className="w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition bg-gray-800 text-gray-300 hover:bg-[#C8F135] hover:text-black"
                  >
                    Start Program →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No programs found for this level.</p>
          </div>
        )}

        {/* CTA banner */}
        <div
          ref={(el) => addToRefs(el, 99)}
          className="mt-16 bg-gradient-to-r from-[#C8F135]/10 to-transparent rounded-2xl p-6 md:p-8 border border-[#C8F135]/20 text-center transition-all duration-700 opacity-0 translate-y-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Don't see your perfect match?</h2>
          <p className="text-gray-400 mb-5 max-w-md mx-auto text-sm">
            Generate a completely custom workout – tell the AI your goals, equipment, and schedule.
          </p>
          <button
            onClick={() => navigate('/workout')}
            className="bg-[#C8F135] text-black font-bold px-6 py-2.5 rounded-full text-sm uppercase tracking-wider hover:bg-[#d4ff3e] transition inline-flex items-center gap-2"
          >
            Create Custom Workout <span>→</span>
          </button>
        </div>
      </main>

      {/* You can reuse the same footer as other pages */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-xs font-mono">
        © 2025 FORGE — Built to be forged.
      </footer>
    </div>
  );
}