import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // adjust path as needed
import { useAuthContext } from '../../context/AuthContext'; // adjust path
import { useState, useEffect } from 'react';
import { FitOrge } from '../../image/Icons';
import AnnouncementBar from '../../components/AnnouncementBar';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, session, loading: authLoading } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const announcements = [
    { id: 1, title: "🔥 Generate unlimited workouts – FREE until launch. Start now! 🔥" },
    { id: 2, title: "🧠 AI that learns you. Past workouts = better next plan. Try it! 🧠" },
    { id: 3, title: "📅 Weekly + monthly plans & diet coming soon. Stay tuned! 📅" },
  ];

  const isLoggedIn = !!session;
  const userName = user?.user_metadata?.username || user?.user_metadata?.name || null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Workouts', path: '/workouts' },
    { name: 'Programs', path: '/programs' },
    { name: 'Muscles', path: '/muscles' },
    { name: 'About', path: '/about' },

  ];

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  let authButtons;

if (authLoading) {
  authButtons = (
    <div className="text-xs text-gray-500">Loading...</div>
  );
} else if (isLoggedIn) {
  authButtons = (
    <>
      <span className="text-xs text-[#C8F135] font-mono">
        👋 {userName || 'User'}
      </span>

      <button
        onClick={() => navigate('/history')}
        className="text-xs bg-gray-800 text-gray-200 hover:bg-gray-700 px-3 py-1.5 rounded-full transition"
      >
        History
      </button>

      <button
        onClick={() => navigate('/workout')}
        className="text-xs bg-[#C8F135] text-gray-500 font-bold px-3 py-1.5 rounded-full hover:bg-[#d4ff3e] transition"
      >
        Generate
      </button>

      <button
        onClick={handleLogout}
        className="text-xs border border-gray-700 text-gray-200  px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
      >
        Logout
      </button>
    </>
  );
} else {
  authButtons = (
    <>
      <button
        onClick={() => navigate('/login')}
        className="text-xs bg-[#C8F135] text-black font-bold px-3 py-1.5 rounded-full hover:bg-[#d4ff3e] transition"
      >
        Login
      </button>

      <button
        onClick={() => navigate('/signup')}
        className="text-xs border border-gray-700 px-3 py-1.5 text-gray-200 rounded-full hover:bg-gray-800 transition"
      >
        Sign Up
      </button>
    </>
  );
}

  return (
    <>
      <AnnouncementBar
        announcements={announcements}
        intervalMs={4000}
        buttonText="Start Free Workout →"
        buttonLink="/workout"
        bgColor="#C8F135"
        textColor="#000"
        dismissible={false}
      />
      <nav className="fixed top-7 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button onClick={() => navigate('/')} className="flex-shrink-0 focus:outline-none">
              <div className="text-2xl font-black text-[#C8F135]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                <FitOrge height={40} />
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`text-sm font-mono uppercase tracking-wider transition-colors ${location.pathname === link.path
                    ? 'text-[#C8F135]'
                    : 'text-gray-400 hover:text-white'
                    }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
             {authButtons}
            </div>

            {/* Mobile right side: always show auth buttons (compact) + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              {/* Auth buttons on mobile (always visible) */}
              {!authLoading && (
                isLoggedIn ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate('/workout')}
                      className="text-[10px] bg-[#C8F135] text-black font-bold px-2 py-1 rounded-full"
                    >
                      Workout
                    </button>
                    <button onClick={handleLogout} className="text-[10px] border text-gray-200 border-gray-700 px-2 py-1 rounded-full">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button onClick={() => navigate('/login')} className="text-[10px] bg-[#C8F135] text-black font-bold px-2 py-1 rounded-full">
                      Login
                    </button>
                    <button onClick={() => navigate('/signup')} className="text-[10px] border border-gray-700 px-2 py-1 rounded-full">
                      Sign Up
                    </button>
                  </div>
                )
              )}
              {/* Hamburger menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu (only for navigation links, not auth) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
            <div className="px-4 pt-3 pb-5 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-mono uppercase tracking-wider ${location.pathname === link.path
                    ? 'bg-gray-800 text-[#C8F135]'
                    : 'text-gray-300 hover:bg-gray-800'
                    }`}
                >
                  {link.name}
                </button>
              ))}
              {/* For logged‑in users, also show History inside the dropdown (optional) */}
              {isLoggedIn && (
                <button
                  onClick={() => navigate('/history')}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800"
                >
                  History
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}