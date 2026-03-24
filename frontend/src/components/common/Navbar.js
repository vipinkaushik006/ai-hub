import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/tools',     label: 'AI Tools'   },
  { to: '/dev-tools', label: 'Dev Tools'  },
  { to: '/analytics', label: 'Analytics'  },
  { to: '/blog',      label: 'Blog'       },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Close mobile menu on any route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // ✅ Close mobile menu if viewport resizes to desktop width
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ✅ Passive listener — browser can optimise scroll performance
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ✅ Await logout before navigating — handles async token cleanup
  const handleLogout = useCallback(async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-900/95 backdrop-blur-md border-b border-white/10 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-400 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-display font-bold text-sm">AI</span>
            </div>
            <span className="font-display font-bold text-white text-lg hidden sm:block">
              <span className="gradient-text">AI</span>Hub
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/bookmarks"
                  className="text-slate-400 hover:text-white transition-colors text-sm"
                >
                  ⭐ Bookmarks
                </Link>

                {/* ✅ Admin link — only visible to admins */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
                  >
                    ⚙️ Admin
                  </Link>
                )}

                {/* ✅ Show real avatar if available, initial otherwise */}
                <div className="flex items-center gap-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-primary-500/30"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/30">
                      <span className="text-primary-400 text-sm font-semibold">
                        {user.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-400 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-3 py-2"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ✅ Accessible hamburger button */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {/* ✅ All three bars have consistent transition durations */}
            <div className={`w-5 h-0.5 bg-current transition-all duration-300 mb-1 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-current transition-all duration-300 mb-1 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {/* ✅ Mobile menu — animated open/close */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-4 pt-2 border-t border-white/10 mt-2">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                // ✅ No onClick needed — useEffect closes on location change
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-medium mb-1 transition-colors ${
                    isActive ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <div className="border-t border-white/10 mt-3 pt-3 flex flex-col gap-2 px-4">
              {user ? (
                <>
                  <Link
                    to="/bookmarks"
                    className="text-slate-300 text-sm py-1"
                  >
                    ⭐ Bookmarks
                  </Link>

                  {/* ✅ Admin link in mobile menu */}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-yellow-400 text-sm py-1"
                    >
                      ⚙️ Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-red-400 text-sm text-left py-1"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="text-slate-300 text-sm py-2">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}