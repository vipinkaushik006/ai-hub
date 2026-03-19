import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/common/SEO';
import ToolCard from '../components/tools/ToolCard';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    api.get('/users/bookmarks')
      .then(res => setBookmarks(res.data))
      .catch(() => setBookmarks([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleRemove = async (toolId) => {
    try {
      await api.post(`/users/bookmarks/${toolId}`);
      setBookmarks(prev => prev.filter(b => b._id !== toolId));
      toast.success('Removed from bookmarks');
    } catch { toast.error('Failed to remove'); }
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="font-display font-bold text-white text-2xl mb-3">Login to see your bookmarks</h2>
          <p className="text-slate-400 mb-6">Save your favourite AI tools and access them anytime.</p>
          <Link to="/login" className="btn-primary">Sign In →</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="My Bookmarks" description="Your saved AI tools collection." />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h1 className="font-display font-extrabold text-4xl text-white mb-2">⭐ My Bookmarks</h1>
            <p className="text-slate-400">Your saved AI tools — {bookmarks.length} tool{bookmarks.length !== 1 ? 's' : ''}</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => <div key={i} className="card h-52 skeleton" />)}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔖</div>
              <h3 className="font-display font-bold text-white text-2xl mb-3">No bookmarks yet</h3>
              <p className="text-slate-400 mb-6">Start exploring AI tools and bookmark your favourites.</p>
              <Link to="/tools" className="btn-primary">Browse AI Tools →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookmarks.map(tool => (
                <ToolCard
                  key={tool._id}
                  tool={tool}
                  onBookmark={handleRemove}
                  isBookmarked={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
