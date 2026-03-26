import { Link } from 'react-router-dom';
import React from 'react';

// ✅ Both maps keyed to the same categories for consistency
const CATEGORY_CONFIG = {
  'AI Tools':    { color: 'text-violet-400 bg-violet-400/10', icon: '🤖', gradient: 'from-violet-900/50 to-indigo-900/50' },
  'Programming': { color: 'text-cyan-400 bg-cyan-400/10',     icon: '💻', gradient: 'from-cyan-900/50 to-blue-900/50'    },
  'Career':      { color: 'text-green-400 bg-green-400/10',   icon: '🚀', gradient: 'from-green-900/50 to-emerald-900/50'},
  'Tutorials':   { color: 'text-yellow-400 bg-yellow-400/10', icon: '📚', gradient: 'from-yellow-900/50 to-amber-900/50' },
  'News':        { color: 'text-red-400 bg-red-400/10',       icon: '📰', gradient: 'from-pink-900/50 to-rose-900/50'    },
  'Analytics':   { color: 'text-blue-400 bg-blue-400/10',     icon: '📊', gradient: 'from-blue-900/50 to-indigo-900/50'  },
};

const DEFAULT_CONFIG = {
  color: 'text-slate-400 bg-slate-400/10',
  icon: '📝',
  gradient: 'from-slate-900/50 to-slate-800/50',
};

// ✅ Stable date formatter — created once, not on every render
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

// ✅ Format date safely — returns fallback if value is missing or invalid
const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return isNaN(d.getTime()) ? '' : dateFormatter.format(d);
};

export default function BlogCard({ blog }) {
  // ✅ Gradient derived from category — stable regardless of render position
  const config   = CATEGORY_CONFIG[blog.category] ?? DEFAULT_CONFIG;
  const date     = formatDate(blog.createdAt);
  const authorInitial = blog.author?.name?.[0]?.toUpperCase() ?? 'A';

  return (
    <Link
      to={`/blog/${blog.slug}`}
      title={blog.title}  // ✅ Accessibility + hover tooltip
      className="card group block hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover image / gradient placeholder */}
      <div
        className={`h-44 bg-gradient-to-br ${config.gradient} rounded-t-2xl flex items-center justify-center relative overflow-hidden`}
      >
        {blog.coverImage ? (
          <CoverImage src={blog.coverImage} alt={blog.title} fallbackIcon={config.icon} />
        ) : (
          <PlaceholderIcon icon={config.icon} />
        )}

        <span className={`absolute top-3 left-3 badge text-xs font-semibold ${config.color}`}>
          {blog.category}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3 className="font-display font-bold text-white text-base leading-tight mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500">
          {/* Author */}
          <div className="flex items-center gap-2">
            {blog.author?.avatar ? (
              // ✅ Show real avatar when available
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-6 h-6 rounded-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
                <span className="text-primary-400 text-xs font-bold">{authorInitial}</span>
              </div>
            )}
            <span>{blog.author?.name ?? 'Admin'}</span>
          </div>

          {/* Meta — views removed: always 0 in dev, misleading in prod */}
          <div className="flex items-center gap-3">
            <span>📖 {blog.readTime} min</span>
            {date && <span>{date}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ✅ Isolated sub-component — handles image error with graceful fallback
function CoverImage({ src, alt, fallbackIcon }) {
  const [errored, setErrored] = React.useState(false);

  if (errored) return <PlaceholderIcon icon={fallbackIcon} />;

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"        // ✅ Defer off-screen images
      decoding="async"      // ✅ Don't block main thread while decoding
      onError={() => setErrored(true)} // ✅ Show icon on 404, not an empty box
    />
  );
}

function PlaceholderIcon({ icon }) {
  return <div className="text-6xl opacity-20 select-none">{icon}</div>;
}