import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Muscle {
  name: string;
  color: string;
  exerciseCount: number;
  description: string;
  icon: string;
}

const MUSCLES: Muscle[] = [
  { name: 'Chest', color: '#FF6B6B', exerciseCount: 18, description: 'Push movements, bench presses, flyes', icon: '🏋️' },
  { name: 'Upper Chest', color: '#FF8E53', exerciseCount: 9, description: 'Incline presses, decline push-ups', icon: '📈' },
  { name: 'Shoulders', color: '#FFBE0B', exerciseCount: 22, description: 'Overhead press, lateral raises, rear delts', icon: '🔺' },
  { name: 'Triceps', color: '#3A86FF', exerciseCount: 14, description: 'Extensions, pushdowns, close-grip bench', icon: '💪' },
  { name: 'Back', color: '#8338EC', exerciseCount: 20, description: 'Rows, pull-ups, deadlifts, pulldowns', icon: '🔱' },
  { name: 'Biceps', color: '#06D6A0', exerciseCount: 12, description: 'Curls, chin-ups, hammer curls', icon: '💪' },
  { name: 'Legs', color: '#FB5607', exerciseCount: 24, description: 'Squats, lunges, leg press, extensions', icon: '🦵' },
  { name: 'Core', color: '#FF006E', exerciseCount: 16, description: 'Planks, crunches, leg raises, Russian twists', icon: '🌀' },
  { name: 'Glutes', color: '#8B5CF6', exerciseCount: 11, description: 'Hip thrusts, bridges, kickbacks', icon: '🍑' },
  { name: 'Hamstrings', color: '#F97316', exerciseCount: 8, description: 'Deadlifts, leg curls, good mornings', icon: '🦵' },
  { name: 'Calves', color: '#14B8A6', exerciseCount: 7, description: 'Calf raises, donkey raises', icon: '🦵' },
  { name: 'Forearms', color: '#84CC16', exerciseCount: 6, description: 'Wrist curls, grip training, farmer walks', icon: '✋' },
];

export default function Muscles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMuscles, setFilteredMuscles] = useState(MUSCLES);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMuscles(MUSCLES);
    } else {
      setFilteredMuscles(
        MUSCLES.filter((m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

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

    cardsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredMuscles]);

  const addToRefs = (el: HTMLDivElement | null, idx: number) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current[idx] = el;
    }
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
            MUSCLE <span className="text-[#C8F135]">TARGETING</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Understand which muscles each exercise works. Filter, explore, and build a balanced physique.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search muscle group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#C8F135] transition"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Muscle grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMuscles.map((muscle, idx) => (
            <div
              key={muscle.name}
              ref={(el) => addToRefs(el, idx)}
              className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden hover:border-[#C8F135]/40 transition-all duration-300 hover:-translate-y-1 group opacity-0 translate-y-8"
              style={{ transitionDelay: `${idx * 0.03}s` }}
            >
              {/* Color bar */}
              <div
                className="h-1.5 w-full"
                style={{ background: muscle.color }}
              />
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl">{muscle.icon}</span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{
                      color: muscle.color,
                      backgroundColor: `${muscle.color}15`,
                      borderColor: `${muscle.color}30`,
                    }}
                  >
                    {muscle.exerciseCount} exercises
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: muscle.color }}>
                  {muscle.name}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4 min-h-[48px]">
                  {muscle.description}
                </p>
                <button
                  onClick={() => navigate('/workout', { state: { focus: muscle.name.toLowerCase() } })}
                  className="w-full py-2 rounded-full text-[11px] font-mono uppercase tracking-wider transition bg-gray-800 text-gray-300 hover:bg-[#C8F135] hover:text-black"
                >
                  Train {muscle.name} →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMuscles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No muscles found. Try another search.</p>
          </div>
        )}

        {/* Educational banner */}
        <div className="mt-16 bg-gradient-to-r from-[#C8F135]/10 to-transparent rounded-2xl p-6 md:p-8 border border-[#C8F135]/20">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Why muscle targeting matters</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Training specific muscle groups with the right exercises, volume, and frequency
                is the fastest way to build strength, correct imbalances, and avoid plateaus.
                Our AI ensures you hit every muscle appropriately.
              </p>
            </div>
            <div className="shrink-0 text-5xl">🎯</div>
          </div>
        </div>

        {/* CTA to generate workout */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/workout')}
            className="bg-[#C8F135] text-black font-bold px-6 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-[#d4ff3e] transition inline-flex items-center gap-2"
          >
            Generate Targeted Workout <span>→</span>
          </button>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-xs font-mono">
        © 2025 FORGE — Built to be forged.
      </footer>
    </div>
  );
}