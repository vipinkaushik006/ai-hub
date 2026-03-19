import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/tools', label: 'AI Tools' },
  { to: '/dev-tools', label: 'Dev Tools' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/blog', label: 'Blog' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-white/10 shadow-2xl' : 'bg-transparent'}`}>
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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`
                }
              >{l.label}</NavLink>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/bookmarks" className="text-slate-400 hover:text-white transition-colors text-sm">
                  ⭐ Bookmarks
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center border border-primary-500/30">
                    <span className="text-primary-400 text-sm font-semibold">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors text-sm">Logout</button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-3 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
            <div className={`w-5 h-0.5 bg-current transition-all mb-1 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-current transition-all mb-1 ${mobileOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-current transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-white/10 mt-2">
            {NAV_LINKS.map(l => (
              <NavLink key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `block px-4 py-3 rounded-lg text-sm font-medium mb-1 ${isActive ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white'}`}
              >{l.label}</NavLink>
            ))}
            <div className="border-t border-white/10 mt-3 pt-3 flex gap-3 px-4">
              {user ? (
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-red-400 text-sm">Logout</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="text-slate-300 text-sm">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm py-2 px-4">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
