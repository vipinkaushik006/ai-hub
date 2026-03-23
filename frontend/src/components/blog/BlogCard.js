import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  'AI Tools': 'text-violet-400 bg-violet-400/10',
  'Programming': 'text-cyan-400 bg-cyan-400/10',
  'Career': 'text-green-400 bg-green-400/10',
  'Tutorials': 'text-yellow-400 bg-yellow-400/10',
  'News': 'text-red-400 bg-red-400/10',
  'Analytics': 'text-blue-400 bg-blue-400/10',
};

const BG_GRADIENTS = [
  'from-violet-900/50 to-indigo-900/50',
  'from-cyan-900/50 to-blue-900/50',
  'from-pink-900/50 to-rose-900/50',
  'from-green-900/50 to-emerald-900/50',
  'from-orange-900/50 to-amber-900/50',
];

const CATEGORY_ICONS = {
  'AI Tools': '🤖',
  'Programming': '💻',
  'Career': '🚀',
  'Tutorials': '📚',
  'News': '📰',
  'Analytics': '📊',
};

export default function BlogCard({ blog, index = 0 }) {
  const catColor = CATEGORY_COLORS[blog.category] || 'text-slate-400 bg-slate-400/10';
  const gradient = BG_GRADIENTS[index % BG_GRADIENTS.length];
  const icon = CATEGORY_ICONS[blog.category] || '📝';
  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="card group block hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover image / gradient placeholder */}
      <div
        className={`h-44 bg-gradient-to-br ${gradient} rounded-t-2xl flex items-center justify-center relative overflow-hidden`}
      >
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="text-6xl opacity-20 select-none">{icon}</div>
        )}
        <span
          className={`absolute top-3 left-3 badge text-xs font-semibold ${catColor}`}
        >
          {blog.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display font-bold text-white text-base leading-tight mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
              <span className="text-primary-400 text-xs font-bold">
                {blog.author?.name?.[0] || 'A'}
              </span>
            </div>
            <span>{blog.author?.name || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>📖 {blog.readTime} min</span>
            <span>👁 {(blog.views || 0).toLocaleString()}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}