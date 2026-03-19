import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import AdBanner from '../components/common/AdBanner';
import api from '../utils/api';
import { mockBlogs } from '../data/mockData';

function renderMarkdown(text) {
  return text
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^([^<].+)$/gm, (m) => m.startsWith('<') ? m : `<p>${m}</p>`);
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blogs/${slug}`)
      .then(res => setBlog(res.data))
      .catch(() => setBlog(mockBlogs.find(b => b.slug === slug) || null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-24 text-center text-slate-400 py-20">Loading article...</div>;
  if (!blog) return (
    <div className="pt-24 text-center py-20">
      <h2 className="text-white text-2xl mb-4">Article not found</h2>
      <Link to="/blog" className="btn-primary">Back to Blog</Link>
    </div>
  );

  const date = new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      <SEO
        title={blog.metaTitle || blog.title}
        description={blog.metaDescription || blog.excerpt}
        keywords={blog.tags?.join(', ')}
      />
      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link to="/blog" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 mb-8 transition-colors">← Back to Blog</Link>

          {/* Article header */}
          <div className="mb-8">
            <span className="badge bg-primary-500/20 text-primary-300 border border-primary-500/20 mb-4 inline-block">{blog.category}</span>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white leading-tight mb-4">{blog.title}</h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">{blog.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                  <span className="text-primary-400 text-sm font-bold">{blog.author?.name?.[0] || 'A'}</span>
                </div>
                <span className="text-slate-300">{blog.author?.name || 'Admin'}</span>
              </div>
              <span>📅 {date}</span>
              <span>📖 {blog.readTime} min read</span>
              <span>👁 {(blog.views || 0).toLocaleString()} views</span>
            </div>
          </div>

          {/* Ad banner */}
          <AdBanner slot="inline" className="mb-8" />

          {/* Article content */}
          <article
            className="prose-dark"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content || '') }}
          />

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/10">
              <p className="text-slate-500 text-sm mb-3 uppercase tracking-wider">Tags</p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Link key={tag} to={`/blog?search=${tag}`}
                    className="text-sm bg-white/5 text-slate-400 hover:text-white px-3 py-1 rounded-lg border border-white/10 hover:border-white/20 transition-all">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom ad */}
          <AdBanner slot="inline" className="mt-10" />

          <div className="text-center mt-8">
            <Link to="/blog" className="btn-outline">← More Articles</Link>
          </div>
        </div>
      </div>
    </>
  );
}
