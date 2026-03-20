import React from 'react';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  'AI Tools': [
    { label: 'AI Writing Tools', to: '/tools?category=AI Writing' },
    { label: 'AI Coding Tools', to: '/tools?category=AI Coding' },
    { label: 'AI Image Tools', to: '/tools?category=AI Image Generation' },
    { label: 'AI Video Tools', to: '/tools?category=AI Video' },
  ],
  'Developer Tools': [
    { label: 'Password Generator', to: '/dev-tools#password' },
    { label: 'JSON Formatter', to: '/dev-tools#json' },
    { label: 'Word Counter', to: '/dev-tools#word-counter' },
    { label: 'Resume Builder', to: '/dev-tools#resume' },
  ],
  'Resources': [
    { label: 'Blog', to: '/blog' },
    { label: 'Analytics Dashboard', to: '/analytics' },
    { label: 'Bookmarks', to: '/bookmarks' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold">AI</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                <span className="gradient-text">AI</span>Hub
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Your one-stop platform for AI tool discovery, free developer utilities,
              tech analytics dashboards, and expert blog content.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { name: 'Twitter', url: 'https://twitter.com' },
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/vipin-kaushik006/' },
                { name: 'GitHub', url: 'https://github.com/vipinkaushik006' },
                { name: 'YouTube', url: 'https://youtube.com' },
              ].map(s => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/50 transition-all text-xs font-semibold"
                >
                  {s.name[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AIHub. Built with ❤️ for developers & creators.
          </p>

          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/sitemap" className="text-slate-500 hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}