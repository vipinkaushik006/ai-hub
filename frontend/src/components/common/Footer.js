import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ✅ Move to src/config/site.js and import from there in a real app
const SITE_CONFIG = {
  name: 'AIHub',
  description: 'Your one-stop platform for AI tool discovery, free developer utilities, tech analytics dashboards, and expert blog content.',
  socials: [
    {
      name: 'Twitter',
      url: process.env.REACT_APP_TWITTER_URL || '',   // ✅ From env — not hardcoded
      icon: <TwitterIcon />,
    },
    {
      name: 'LinkedIn',
      url: process.env.REACT_APP_LINKEDIN_URL || '',
      icon: <LinkedInIcon />,
    },
    {
      name: 'GitHub',
      url: process.env.REACT_APP_GITHUB_URL || '',
      icon: <GitHubIcon />,
    },
    {
      name: 'YouTube',
      url: process.env.REACT_APP_YOUTUBE_URL || '',
      icon: <YouTubeIcon />,
    },
  ].filter(s => s.url), // ✅ Only render socials that have a URL configured
};

// ✅ Year computed once at module load — not on every render
const CURRENT_YEAR = new Date().getFullYear();

// ✅ Use search params correctly — avoids space-encoding issues in Link
const FOOTER_LINKS = {
  'AI Tools': [
    { label: 'AI Writing Tools',   to: { pathname: '/tools', search: '?category=AI+Writing'           } },
    { label: 'AI Coding Tools',    to: { pathname: '/tools', search: '?category=AI+Coding'            } },
    { label: 'AI Image Tools',     to: { pathname: '/tools', search: '?category=AI+Image+Generation'  } },
    { label: 'AI Video Tools',     to: { pathname: '/tools', search: '?category=AI+Video'             } },
    { label: 'AI Audio Tools',     to: { pathname: '/tools', search: '?category=AI+Audio'             } },
  ],
  'Developer Tools': [
    { label: 'Password Generator', to: '/dev-tools#password'     },
    { label: 'JSON Formatter',     to: '/dev-tools#json'         },
    { label: 'Word Counter',       to: '/dev-tools#word-counter' },
    { label: 'Resume Builder',     to: '/dev-tools#resume'       },
  ],
  'Resources': [
    { label: 'Blog',               to: '/blog'       },
    { label: 'Analytics',          to: '/analytics'  },
  ],
};

export default function Footer() {
  const { user } = useAuth();

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
              {SITE_CONFIG.description}
            </p>

            {/* ✅ Only renders socials with configured URLs, with proper aria-labels */}
            {SITE_CONFIG.socials.length > 0 && (
              <div className="flex gap-3">
                {SITE_CONFIG.socials.map((s) => (
                  
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${s.name} page`} // ✅ Screen reader label
                    className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-primary-500/50 transition-all"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((l) => (
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

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {CURRENT_YEAR} AIHub. Built with ❤️ for developers & creators.
          </p>

          <div className="flex gap-6 text-sm">
            {/* ✅ Bookmarks only shown to logged-in users */}
            {user && (
              <Link to="/bookmarks" className="text-slate-500 hover:text-white transition-colors">
                Bookmarks
              </Link>
            )}
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

// ✅ Proper SVG icons — recognisable at small sizes, no external dependency needed
function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.213 5.573zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}