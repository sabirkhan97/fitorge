import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FitOrge } from '../image/Icons';
import { supabase } from '../lib/supabase';
import { useAuthContext } from '../context/AuthContext';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';

// ── Data (same as before) ────────────────────────────────────────────────────
const MUSCLE_COLORS: Record<string, string> = {
  Chest: '#FF6B6B', 'Upper Chest': '#FF8E53', Shoulders: '#FFBE0B',
  Triceps: '#3A86FF', Back: '#8338EC', Biceps: '#06D6A0',
  Legs: '#FB5607', Core: '#FF006E', Glutes: '#8B5CF6',
  Hamstrings: '#F97316', Calves: '#14B8A6', Forearms: '#84CC16',
};

const EXERCISE_COUNTS: Record<string, number> = {
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
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuthContext();
  const featuresRef = useRef<HTMLDivElement>(null);
  const musclesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!session;
  const userName = user?.user_metadata?.username || user?.user_metadata?.name || null;

  // IntersectionObserver animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.12 }
    );

    const targets = [
      ...(featuresRef.current?.querySelectorAll('.feat-card') || []),
      ...(musclesRef.current?.querySelectorAll('.muscle-chip') || []),
      ...(statsRef.current?.querySelectorAll('.stat-card') || []),
      ...(stepsRef.current?.querySelectorAll('.step-item') || []),
    ];

    targets.forEach((el, i) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(24px)';
      (el as HTMLElement).style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Fixed Navbar – adjusted for announcement bar (top: 56px) */}
      <Navbar />

      {/* Main content – adds padding top to account for fixed header (56px bar + 64px nav = 120px) */}
      <main className="pt-[120px] md:pt-[120px]">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 min-h-[calc(100vh-120px)] items-center px-6 md:px-12 lg:px-20 py-12">
          {/* Left */}
          <div className="space-y-6">
            <div className="text-xs font-mono text-[#C8F135] tracking-widest uppercase">// AI-Powered Training</div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tight" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              BUILT<br />TO BE<br />
              <span className="text-[#C8F135]">FORGED.</span>
            </h1>
            <p className="text-gray-400 max-w-md text-base">
              Generate science-based workout programs tailored to your body, goals, and available time. No guesswork — just results.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/workout" className="bg-[#C8F135] text-black font-bold px-6 py-3 rounded-full text-sm hover:bg-[#d4ff3e] transition inline-flex items-center gap-2">
                Generate Workout <span>→</span>
              </a>
              <a href="#how" className="border border-gray-700 px-6 py-3 rounded-full text-sm hover:bg-gray-900 transition inline-flex items-center gap-2">
                See how it works <span>→</span>
              </a>
            </div>
            <div className="flex gap-8 pt-4">
              {[{ num: '120+', label: 'Exercises' }, { num: '12', label: 'Muscle Groups' }, { num: '∞', label: 'Combinations' }].map((s) => (
                <div key={s.label} className="border-l-2 border-[#C8F135] pl-4">
                  <div className="text-3xl font-black">{s.num}</div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – visual placeholder */}
          <div className="hidden md:block relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden aspect-square max-w-md mx-auto w-full border border-gray-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,241,53,0.08),transparent)]" />
            <div className="flex items-center justify-center h-full">
              <svg width="200" height="300" viewBox="0 0 280 420" fill="none" className="opacity-20">
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
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur p-3 rounded-xl border border-gray-800">
              <div className="text-[10px] font-mono text-gray-500 uppercase">Today's Goal</div>
              <div className="text-lg font-black">75% Done</div>
              <div className="text-xs text-gray-500">3 of 4 exercises complete</div>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="border-y border-gray-800 bg-gray-950 py-3 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="mx-4 text-xs font-mono text-gray-500 uppercase tracking-wider">
                {item} •
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <section className="px-6 md:px-12 lg:px-20 py-20">
          <div className="text-xs font-mono text-[#C8F135] uppercase tracking-wider mb-2">// What we do</div>
          <h2 className="text-5xl md:text-6xl font-black leading-[0.95]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            TRAIN<br />SMARTER.
          </h2>
          <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800 mt-12 border border-gray-800">
            {FEATURES.map((f) => (
              <div key={f.num} className="bg-black p-6 md:p-8 feat-card">
                <div className="text-5xl font-black text-gray-800 mb-4">{f.num}</div>
                <div className="font-bold text-lg mb-2">{f.title}</div>
                <div className="text-gray-400 text-sm">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="bg-gray-950 px-6 md:px-12 lg:px-20 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono text-[#C8F135] uppercase tracking-wider mb-2">// How it works</div>
              <h2 className="text-5xl md:text-6xl font-black leading-[0.95] mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                THREE<br />STEPS.
              </h2>
              <div ref={stepsRef}>
                {STEPS.map((s, i) => (
                  <div key={s.num} className={`flex gap-6 py-6 ${i < STEPS.length - 1 ? 'border-b border-gray-800' : ''} step-item`}>
                    <div className="text-5xl font-black text-gray-800 leading-none">{s.num}</div>
                    <div>
                      <div className="font-bold text-lg">{s.title}</div>
                      <div className="text-gray-400 text-sm mt-1">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-black rounded-2xl border border-gray-800 p-6 aspect-[9/10] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="text-2xl font-black">PUSH DAY A</div>
                <div className="text-[10px] font-mono bg-[#C8F135] text-black px-2 py-1 rounded-full">INTERMEDIATE</div>
              </div>
              {SAMPLE_WORKOUT.map((ex) => (
                <div key={ex.name} className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl mb-2 border border-transparent hover:border-[#C8F135] transition">
                  <div className="w-2 h-2 rounded-full" style={{ background: ex.color }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{ex.name}</div>
                    <div className="text-[10px] font-mono text-gray-500">{ex.muscles}</div>
                  </div>
                  <div className="text-xs font-mono text-gray-500">{ex.sets}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Muscle Groups */}
        <section className="px-6 md:px-12 lg:px-20 py-20">
          <div className="text-xs font-mono text-[#C8F135] uppercase tracking-wider mb-2">// Muscle targeting</div>
          <h2 className="text-5xl md:text-6xl font-black leading-[0.95]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            EVERY<br />MUSCLE.
          </h2>
          <div ref={musclesRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-12">
            {Object.entries(MUSCLE_COLORS).map(([name, color]) => (
              <div key={name} className="bg-gray-900 border border-gray-800 rounded-xl p-4 muscle-chip">
                <div className="w-2 h-2 rounded-full mb-2" style={{ background: color }} />
                <div className="font-semibold text-sm">{name}</div>
                <div className="text-[10px] font-mono text-gray-500 mt-1">{EXERCISE_COUNTS[name] || 0} exercises</div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gray-950 px-6 md:px-12 lg:px-20 py-20">
          <div className="text-xs font-mono text-[#C8F135] uppercase tracking-wider mb-2">// By the numbers</div>
          <h2 className="text-5xl md:text-6xl font-black leading-[0.95]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            THE<br />PROOF.
          </h2>
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-800 mt-12 border border-gray-800">
            {STATS.map((s) => (
              <div key={s.label} className="bg-gray-950 p-6 text-center stat-card">
                <div className="text-4xl md:text-5xl font-black text-[#C8F135]">{s.num}</div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center px-6 py-24 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-8xl md:text-9xl font-black text-white/5 pointer-events-none select-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            FORGE
          </div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black leading-[0.9]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              READY TO<br />
              <span className="text-[#C8F135]">FORGE?</span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mt-4 mb-8">
              Stop guessing, start building. Generate your personalized workout in seconds — completely free.
            </p>
            <a href="/workout" className="inline-flex items-center gap-2 bg-[#C8F135] text-black font-bold px-8 py-3 rounded-full hover:bg-[#d4ff3e] transition">
              Generate Your Workout <span>→</span>
            </a>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>

      {/* Add keyframes for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 22s linear infinite;
          display: inline-flex;
          width: fit-content;
        }
        .feat-card, .muscle-chip, .stat-card, .step-item {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}