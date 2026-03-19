import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import AdBanner from '../components/common/AdBanner';
import ToolCard from '../components/tools/ToolCard';
import BlogCard from '../components/blog/BlogCard';
import api from '../utils/api';
import { mockTools, mockBlogs } from '../data/mockData';

const STATS = [
  { value: '200+', label: 'AI Tools Listed' },
  { value: '50K+', label: 'Monthly Visitors' },
  { value: '20+', label: 'Expert Blog Posts' },
  { value: '10+', label: 'Free Dev Tools' },
];

const FEATURES = [
  { icon: '🔍', title: 'AI Tools Directory', desc: 'Browse 200+ curated AI tools across writing, coding, image, and video categories.', link: '/tools' },
  { icon: '⚙️', title: 'Free Dev Tools', desc: 'Browser-based utilities—password generator, JSON formatter, word counter & more.', link: '/dev-tools' },
  { icon: '📊', title: 'Tech Analytics', desc: 'Real-time salary insights, job demand trends, and skills analysis dashboards.', link: '/analytics' },
  { icon: '✍️', title: 'Expert Blog', desc: 'In-depth articles on AI tools, programming languages, and tech career guidance.', link: '/blog' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingTools, setTrendingTools] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toolsRes, blogsRes] = await Promise.all([
          api.get('/tools/trending'),
          api.get('/blogs?limit=3'),
        ]);
        setTrendingTools(toolsRes.data);
        setBlogs(blogsRes.data.blogs);
      } catch {
        setTrendingTools(mockTools.filter(t => t.trending).slice(0, 6));
        setBlogs(mockBlogs);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/tools?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <>
      <SEO
        title="Discover the Best AI Tools & Developer Resources"
        description="Your one-stop platform for AI tool discovery, free developer utilities, tech analytics dashboards, and expert blog content."
        keywords="best AI tools, free developer tools, AI writing tools, AI coding tools, tech analytics, resume analyzer"
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-slate-300 mb-8 animate-fade-up">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>🚀 200+ AI Tools Now Listed</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl text-white leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Discover the Best<br />
            <span className="gradient-text">AI Tools</span> &<br />
            Developer Resources
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Search 200+ AI tools, use free dev utilities, explore job market analytics, and read expert blog posts—all in one place.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="relative flex">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search AI tools... e.g. 'ChatGPT', 'image generator', 'code assistant'"
                className="input-field pl-12 pr-36 py-4 text-base rounded-2xl border-white/15"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2.5 px-5 text-sm rounded-xl">
                Search
              </button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {['ChatGPT', 'Image Generator', 'Code AI', 'Video AI', 'Writing AI'].map(tag => (
                <button key={tag} type="button" onClick={() => { setSearchQuery(tag); navigate(`/tools?search=${encodeURIComponent(tag)}`); }}
                  className="text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10 transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {STATS.map(s => (
              <div key={s.label} className="glass rounded-2xl p-4">
                <div className="font-display font-extrabold text-2xl gradient-text">{s.value}</div>
                <div className="text-slate-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense header banner */}
      <AdBanner slot="header" />

      {/* Trending Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-2">🔥 Hot Right Now</div>
            <h2 className="section-title mb-0">Trending AI Tools</h2>
            <p className="text-slate-400 mt-2">Most visited AI tools this week</p>
          </div>
          <Link to="/tools" className="btn-outline text-sm py-2.5 px-5 hidden sm:flex">View All Tools →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-5 h-52 skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingTools.slice(0, 6).map(tool => (
              <ToolCard key={tool._id || tool.slug} tool={tool} />
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/tools" className="btn-primary">Explore All AI Tools →</Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-dark-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Everything You Need in One Hub</h2>
            <p className="section-subtitle">Tools, insights, and content for developers and tech enthusiasts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <Link key={f.title} to={f.link}
                className="card p-6 group hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-display font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 text-primary-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Viral Feature: AI Resume Analyzer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900/40 via-dark-800 to-accent-500/10 border border-primary-500/20 p-8 md:p-14">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="badge bg-primary-500/20 text-primary-300 border border-primary-500/30 mb-4 inline-block">🔥 Viral Feature</span>
              <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mb-4">
                AI Resume Analyzer
              </h2>
              <p className="text-slate-400 text-lg mb-6">
                Upload your resume and instantly get your ATS score, identify missing skills, and receive actionable improvement suggestions powered by AI.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {['ATS Score Analysis', 'Missing Skills Detection', 'Keyword Optimization', 'Job Match %'].map(f => (
                  <span key={f} className="flex items-center gap-1.5 text-sm text-slate-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-green-400">✓</span> {f}
                  </span>
                ))}
              </div>
              <Link to="/dev-tools#resume" className="btn-primary">Analyze My Resume Free →</Link>
            </div>
            {/* Mock ATS result card */}
            <div className="card p-6 bg-dark-900/80">
              <div className="flex items-center justify-between mb-5">
                <span className="font-display font-bold text-white text-lg">ATS Analysis Result</span>
                <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">✓ Analyzed</span>
              </div>
              {/* Score ring */}
              <div className="flex items-center gap-6 mb-5">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="14" fill="none" stroke="url(#grad)" strokeWidth="3"
                      strokeDasharray="62 88" strokeLinecap="round" />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%">
                        <stop offset="0%" stopColor="#4f6ef7" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display font-bold text-white text-lg">72%</span>
                  </div>
                </div>
                <div>
                  <div className="text-white font-semibold mb-1">ATS Score: Good</div>
                  <div className="text-slate-400 text-sm">Your resume passes most ATS filters. See improvements below.</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Missing Skills</div>
                {['Python', 'SQL', 'Machine Learning', 'Docker'].map(skill => (
                  <div key={skill} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-orange-400">⚠</span> {skill}
                    <span className="ml-auto text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">High demand</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-dark-800/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-accent-400 font-semibold text-sm uppercase tracking-wider mb-2">📚 Expert Content</div>
              <h2 className="section-title mb-0">Latest from the Blog</h2>
            </div>
            <Link to="/blog" className="btn-outline text-sm py-2.5 px-5 hidden sm:flex">Read All Posts →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog, i) => <BlogCard key={blog._id || blog.slug} blog={blog} index={i} />)}
          </div>
        </div>
      </section>

      {/* Inline AdSense */}
      <AdBanner slot="inline" />

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-6">
          Ready to Supercharge<br />Your <span className="gradient-text">Productivity</span>?
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          Join thousands of developers and creators who use AIHub to discover tools, build faster, and stay ahead.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="btn-primary text-base px-8 py-4">Start for Free →</Link>
          <Link to="/tools" className="btn-outline text-base px-8 py-4">Browse AI Tools</Link>
        </div>
      </section>
    </>
  );
}
