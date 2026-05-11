import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

export default function About() {
  const navigate = useNavigate();
  const { session } = useAuthContext();
  const isLoggedIn = !!session;

  // Animation observer for fade‑up effects
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

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

  const addToRefs = (el: HTMLElement | null, idx: number) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current[idx] = el;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Spacer for fixed header (announcement bar + nav) */}
      <div className="pt-[120px] md:pt-[120px]" />

      <main className="max-w-6xl mx-auto px-5 md:px-8 lg:px-12 py-12">
        {/* Hero Section */}
        <section
          ref={(el) => addToRefs(el, 0)}
          className="text-center mb-20 transition-all duration-700 opacity-0 translate-y-8"
        >
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 tracking-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            ABOUT <span className="text-[#C8F135]">FORGE</span>
          </h1>
          <div className="w-20 h-1 bg-[#C8F135] mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
            We're on a mission to democratize elite fitness coaching through artificial intelligence.
            No fluff, no bro‑science — just smart, personalised training.
          </p>
        </section>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-10 mb-20">
          <section
            ref={(el) => addToRefs(el, 1)}
            className="bg-gray-900/50 rounded-2xl p-6 md:p-8 border border-gray-800 transition-all duration-700 opacity-0 translate-y-8"
          >
            <div className="text-4xl mb-3">🎯</div>
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              To empower every person to become their strongest self by removing guesswork,
              adapting to real‑life constraints, and delivering science‑backed workouts that
              evolve with you.
            </p>
          </section>

          <section
            ref={(el) => addToRefs(el, 2)}
            className="bg-gray-900/50 rounded-2xl p-6 md:p-8 border border-gray-800 transition-all duration-700 opacity-0 translate-y-8"
          >
            <div className="text-4xl mb-3">👁️</div>
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p className="text-gray-400 leading-relaxed">
              A world where world‑class fitness guidance is accessible to everyone, regardless
              of budget, equipment, or location. We want to be the AI coach you trust for life.
            </p>
          </section>
        </div>

        {/* The Problem / Solution */}
        <section
          ref={(el) => addToRefs(el, 3)}
          className="mb-20 transition-all duration-700 opacity-0 translate-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Why <span className="text-[#C8F135]">FORGE</span> ?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Generic cookie‑cutter plans?', desc: 'We build each workout from your data – age, goals, injuries, equipment.', icon: '❌' },
              { title: 'No progressive overload?', desc: 'Our AI automatically increases volume & intensity when you’re ready.', icon: '📈' },
              { title: 'Overwhelming fitness jargon?', desc: 'Simple, actionable instructions and form cues – no confusion.', icon: '🧠' },
              { title: 'One‑size‑fits‑all?', desc: 'From beginner to advanced, home to gym – we adapt to you.', icon: '🔄' },
              { title: 'No motivation tracking?', desc: 'We help you stay consistent with weekly plans and progress logs.', icon: '🔥' },
              { title: 'Free forever?', desc: 'Basic workouts are always free – upgrade only for premium features.', icon: '💸' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-black border border-gray-800 rounded-xl p-5 hover:border-[#C8F135]/30 transition group"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works (tech) */}
        <section
          ref={(el) => addToRefs(el, 4)}
          className="mb-20 bg-gray-900/30 rounded-2xl p-6 md:p-10 border border-gray-800 transition-all duration-700 opacity-0 translate-y-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">⚙️ Built for real athletes</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[#C8F135] font-mono text-sm mb-2">01 — AI Core</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We use state‑of‑the‑art language models (Mistral AI) to generate workout plans that
                consider progressive overload, muscle balance, recovery, and injury prevention.
              </p>
            </div>
            <div>
              <h3 className="text-[#C8F135] font-mono text-sm mb-2">02 — Real‑time adaptation</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your feedback (energy level, difficulty rating) refines future workouts. The AI
                learns what works for you.
              </p>
            </div>
            <div>
              <h3 className="text-[#C8F135] font-mono text-sm mb-2">03 — Privacy first</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your data stays with you. We only use it to personalise your experience, and
                you can delete it anytime.
              </p>
            </div>
            <div>
              <h3 className="text-[#C8F135] font-mono text-sm mb-2">04 — Open for feedback</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We’re constantly improving. Every rating and suggestion makes Forge better for
                everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Meet the Team (placeholder – you can replace with real profiles later) */}
        <section
          ref={(el) => addToRefs(el, 5)}
          className="mb-20 transition-all duration-700 opacity-0 translate-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">🧑‍💻 The Forge Team</h2>
          <p className="text-center text-gray-500 mb-10 max-w-md mx-auto">
            Built by developers, fitness enthusiasts, and AI researchers who believe in
            accessible excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { name: 'Sabir Khan', role: 'Founder & AI Engineer', imgInitial: 'SK' },
              { name: 'AI Coaches', role: 'Mistral, OpenAI, Supabase', imgInitial: 'AI' },
              { name: 'You', role: 'Early user & shaper', imgInitial: '💪' },
            ].map((member, i) => (
              <div key={i} className="text-center w-32">
                <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center text-2xl font-bold text-[#C8F135] border border-gray-700">
                  {member.imgInitial}
                </div>
                <div className="mt-3 font-semibold text-sm">{member.name}</div>
                <div className="text-[10px] text-gray-500 font-mono">{member.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section
          ref={(el) => addToRefs(el, 6)}
          className="text-center bg-gradient-to-r from-[#C8F135]/10 to-transparent rounded-2xl p-8 md:p-12 border border-[#C8F135]/20 transition-all duration-700 opacity-0 translate-y-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to forge your best self?</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Join thousands of athletes who train smarter with Forge.
          </p>
          <button
            onClick={() => navigate(isLoggedIn ? '/workout' : '/login')}
            className="bg-[#C8F135] text-black font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-[#d4ff3e] transition inline-flex items-center gap-2"
          >
            {isLoggedIn ? 'Start Workout →' : 'Create Free Account →'}
          </button>
        </section>
      </main>

      {/* Simple footer (optional) */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-xs font-mono">
        © 2025 FORGE — Built to be forged.
      </footer>
    </div>
  );
}