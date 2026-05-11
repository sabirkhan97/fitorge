import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Placeholder: integrate with your backend or email service
      console.log('Newsletter signup:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = [
    { name: 'Workouts', path: '/workouts' },
    { name: 'Programs', path: '/programs' },
    { name: 'Muscles', path: '/muscles' },
    { name: 'About', path: '/about' },
    { name: 'Privacy', path: '/privacy' },
    { name: 'Terms', path: '/terms' },
  ];

  const quickStats = [
    { label: 'AI-powered workouts', value: '∞' },
    { label: 'Exercises library', value: '120+' },
    { label: 'Muscle groups', value: '12' },
  ];

  return (
    <>
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 bg-[#C8F135] text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      <footer className="relative bg-black pt-12 pb-6 px-5 sm:px-8 lg:px-12 overflow-hidden">
        {/* Gradient border on top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8F135] to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto">
          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-gray-800">
            {/* Brand column */}
            <div className="md:col-span-4 space-y-4">
              <div
                className="text-3xl font-black text-[#C8F135] cursor-pointer inline-block"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                onClick={scrollToTop}
              >
                FORGE
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                AI‑powered workouts that adapt to you. Build strength, burn fat, and forge your best self – no guesswork.
              </p>
              {/* Quick stats – hidden on mobile, visible on tablet+ */}
              <div className="hidden sm:flex gap-4 pt-2">
                {quickStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-xl font-black text-white">{stat.value}</span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links column */}
            <div className="md:col-span-4">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Explore</h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                {footerLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-[#C8F135] transition text-left py-1"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter column */}
            <div className="md:col-span-4">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Stay Forged</h3>
              <p className="text-gray-500 text-xs mb-3">Get weekly workout tips and AI updates.</p>
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C8F135] transition"
                />
                <button
                  type="submit"
                  className="bg-[#C8F135] text-black font-bold px-4 py-2 rounded-full text-sm hover:bg-[#d4ff3e] transition whitespace-nowrap"
                >
                  {subscribed ? '✓ Subscribed!' : 'Subscribe'}
                </button>
              </form>
              <p className="text-[10px] text-gray-600 mt-2 font-mono">No spam, unsubscribe anytime.</p>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            {/* Social icons – enhanced hover */}
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-500 hover:text-[#C8F135] transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#C8F135] transition-all duration-200 hover:-translate-y-0.5"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-[#C8F135] transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.99 2.013 9.33 2 12 2h.315zm.021 1.802c-2.4 0-2.74.01-3.71.054-.9.041-1.38.19-1.7.317-.43.17-.74.373-1.063.696-.323.323-.526.633-.696 1.063-.128.32-.276.8-.317 1.7-.044.97-.054 1.31-.054 3.71 0 2.4.01 2.74.054 3.71.041.9.19 1.38.317 1.7.17.43.373.74.696 1.063.323.323.633.526 1.063.696.32.128.8.276 1.7.317.97.044 1.31.054 3.71.054 2.4 0 2.74-.01 3.71-.054.9-.041 1.38-.19 1.7-.317.43-.17.74-.373 1.063-.696.323-.323.526-.633.696-1.063.128-.32.276-.8.317-1.7.044-.97.054-1.31.054-3.71 0-2.4-.01-2.74-.054-3.71-.041-.9-.19-1.38-.317-1.7-.17-.43-.373-.74-.696-1.063-.323-.323-.633-.526-1.063-.696-.32-.128-.8-.276-1.7-.317-.97-.044-1.31-.054-3.71-.054zm-.133 1.8a5.08 5.08 0 015.08 5.08 5.08 5.08 0 01-5.08 5.08 5.08 5.08 0 01-5.08-5.08 5.08 5.08 0 015.08-5.08zm0 1.8a3.28 3.28 0 100 6.56 3.28 3.28 0 000-6.56zm5.507-.066a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="text-gray-500 text-xs font-mono">
              © {new Date().getFullYear()} FORGE — Built to be forged.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}