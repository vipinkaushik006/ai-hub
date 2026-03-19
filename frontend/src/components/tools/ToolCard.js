import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  'AI Writing': 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  'AI Coding': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20',
  'AI Image Generation': 'bg-pink-500/15 text-pink-300 border-pink-500/20',
  'AI Video': 'bg-orange-500/15 text-orange-300 border-orange-500/20',
  'AI Audio': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20',
  'AI Data': 'bg-green-500/15 text-green-300 border-green-500/20',
  'default': 'bg-slate-500/15 text-slate-300 border-slate-500/20',
};

const PRICING_COLORS = {
  'Free': 'bg-green-500/15 text-green-400',
  'Freemium': 'bg-blue-500/15 text-blue-400',
  'Paid': 'bg-orange-500/15 text-orange-400',
  'Open Source': 'bg-purple-500/15 text-purple-400',
};

const CATEGORY_ICONS = {
  'AI Writing': '✍️',
  'AI Coding': '⌨️',
  'AI Image Generation': '🎨',
  'AI Video': '🎬',
  'AI Audio': '🎵',
  'AI Data': '📊',
  'default': '🤖',
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <div className="stars">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={i <= Math.round(rating) ? 'star' : 'star-empty'} style={{ fontSize: '12px' }}>★</span>
        ))}
      </div>
      <span className="text-slate-400 text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ToolCard({ tool, onBookmark, isBookmarked }) {
  const categoryColor = CATEGORY_COLORS[tool.category] || CATEGORY_COLORS.default;
  const icon = CATEGORY_ICONS[tool.category] || CATEGORY_ICONS.default;
  const pricingColor = PRICING_COLORS[tool.pricing] || 'bg-slate-500/15 text-slate-400';

  return (
    <div className="card p-5 group hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center text-xl border border-white/10 group-hover:border-primary-500/30 transition-colors">
            {tool.logoUrl ? <img src={tool.logoUrl} alt={tool.name} className="w-7 h-7 rounded" /> : icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-sm group-hover:text-primary-400 transition-colors">{tool.name}</h3>
            <span className={`badge border text-xs mt-0.5 inline-block ${categoryColor}`}>{tool.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tool.trending && (
            <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-semibold">🔥 Hot</span>
          )}
          {onBookmark && (
            <button
              onClick={() => onBookmark(tool._id)}
              className={`p-1.5 rounded-lg transition-all ${isBookmarked ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-500 hover:text-yellow-400 hover:bg-yellow-400/10'}`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              {isBookmarked ? '★' : '☆'}
            </button>
          )}
        </div>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{tool.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {(tool.tags || []).slice(0, 3).map(tag => (
          <span key={tag} className="text-xs bg-white/5 text-slate-400 px-2 py-0.5 rounded-md border border-white/5">#{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3">
          <StarRating rating={tool.rating || 0} />
          <span className={`badge text-xs ${pricingColor}`}>{tool.pricing}</span>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/tools/${tool.slug}`}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
          >
            Details
          </Link>
          <a
            href={tool.websiteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs btn-primary py-1.5 px-3"
          >
            Visit ↗
          </a>
        </div>
      </div>
    </div>
  );
}
