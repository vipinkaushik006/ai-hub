import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import api from '../utils/api';
import { mockTools } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ToolDetailPage() {
  const { slug } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/tools/${slug}`)
      .then(res => setTool(res.data))
      .catch(() => setTool(mockTools.find(t => t.slug === slug) || null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleRate = async (rating) => {
    if (!user) { toast.error('Please login to rate tools'); return; }
    try {
      await api.post(`/tools/${tool._id}/rate`, { rating });
      setUserRating(rating);
      toast.success('Rating submitted!');
    } catch { toast.error('Failed to submit rating'); }
  };

  if (loading) return <div className="pt-24 text-center text-slate-400">Loading...</div>;
  if (!tool) return <div className="pt-24 text-center"><h2 className="text-white text-2xl">Tool not found</h2><Link to="/tools" className="btn-primary mt-4 inline-flex">Back to Tools</Link></div>;

  return (
    <>
      <SEO title={`${tool.name} - AI Tool Review`} description={tool.description} keywords={`${tool.name}, ${tool.category}, AI tools`} />
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/tools" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 mb-8 transition-colors">← Back to Tools</Link>

        <div className="card p-8 mb-8">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center text-3xl border border-white/10 flex-shrink-0">
              {tool.logoUrl ? <img src={tool.logoUrl} alt={tool.name} className="w-10 h-10 rounded-xl" /> : '🤖'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="font-display font-extrabold text-3xl text-white">{tool.name}</h1>
                {tool.trending && <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/20">🔥 Trending</span>}
                <span className="badge bg-primary-500/20 text-primary-300 border border-primary-500/20">{tool.category}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.round(tool.rating) ? '#fbbf24' : '#374151' }}>★</span>)}
                  <span className="ml-1">{tool.rating?.toFixed(1)} ({tool.totalRatings || 0} reviews)</span>
                </div>
                <span className="badge bg-green-500/15 text-green-400">{tool.pricing}</span>
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-lg leading-relaxed mb-6">{tool.description}</p>
          {tool.longDescription && <p className="text-slate-400 leading-relaxed mb-6">{tool.longDescription}</p>}

          {(tool.tags || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tool.tags.map(tag => (
                <span key={tag} className="text-sm bg-white/5 text-slate-400 px-3 py-1 rounded-lg border border-white/5">#{tag}</span>
              ))}
            </div>
          )}

          <a href={tool.websiteLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-base px-8 py-4">
            Visit {tool.name} ↗
          </a>
        </div>

        {/* Rate this tool */}
        <div className="card p-6">
          <h3 className="font-display font-bold text-white text-xl mb-4">Rate This Tool</h3>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => handleRate(i)}
                  className={`text-3xl transition-transform hover:scale-110 ${i <= userRating ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'}`}>★</button>
              ))}
            </div>
            {userRating > 0 && <span className="text-slate-400 text-sm">You rated: {userRating}/5</span>}
          </div>
          {!user && <p className="text-slate-500 text-sm mt-2"><Link to="/login" className="text-primary-400 hover:underline">Login</Link> to rate this tool</p>}
        </div>
      </div>
    </>
  );
}
