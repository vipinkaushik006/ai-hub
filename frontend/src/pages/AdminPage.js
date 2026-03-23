import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['AI Tools', 'Programming', 'Career', 'Tutorials', 'News', 'Analytics'];

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'AI Tools',
  tags: '',
  coverImage: '',
  metaTitle: '',
  metaDescription: '',
  published: true,
};

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list | create | edit
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'success'|'error', text }
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Auth check
  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  // Fetch blogs
  useEffect(() => {
    if (view === 'list') fetchBlogs();
  }, [view]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blogs?limit=100');
      setBlogs(res.data.blogs || []);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setView('create');
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || 'AI Tools',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      coverImage: blog.coverImage || '',
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      published: blog.published !== false,
    });
    setEditId(blog._id);
    setView('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editId) {
        await api.put(`/blogs/${editId}`, payload);
        showMsg('success', '✅ Blog updated successfully!');
      } else {
        await api.post('/blogs', payload);
        showMsg('success', '✅ Blog created successfully!');
      }
      setView('list');
    } catch (err) {
      showMsg('error', '❌ ' + (err.response?.data?.error || 'Something went wrong'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/blogs/${id}`);
      showMsg('success', '🗑️ Blog deleted!');
      setDeleteConfirm(null);
      fetchBlogs();
    } catch {
      showMsg('error', '❌ Delete failed');
    }
  };

  if (authLoading) return (
    <div className="pt-24 text-center text-slate-400 py-20">Checking access...</div>
  );

  if (!user || !user.isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-white">
              ⚙️ Admin Panel
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage your blog posts</p>
          </div>
          {view === 'list' && (
            <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
              ✏️ New Blog
            </button>
          )}
          {(view === 'create' || view === 'edit') && (
            <button
              onClick={() => setView('list')}
              className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
            >
              ← Back to List
            </button>
          )}
        </div>

        {/* Toast Message */}
        {msg && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium border ${
            msg.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {msg.text}
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <div className="card p-0 overflow-hidden">
            {loading ? (
              <div className="text-center py-16 text-slate-400">Loading blogs...</div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📝</div>
                <p className="text-slate-400">No blogs yet. Create your first one!</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">Title</th>
                    <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">Category</th>
                    <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">Status</th>
                    <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">Views</th>
                    <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">Date</th>
                    <th className="px-6 py-4 text-xs text-slate-500 uppercase tracking-wider font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog, i) => (
                    <tr key={blog._id} className={`border-b border-white/5 hover:bg-white/2 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm font-medium line-clamp-1">{blog.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{blog.excerpt}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-primary-500/10 text-primary-400 border border-primary-500/20 px-2 py-1 rounded-lg">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-lg border ${
                          blog.published
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        👁 {(blog.views || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(blog)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 border border-primary-500/20 transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(blog._id)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* CREATE / EDIT FORM */}
        {(view === 'create' || view === 'edit') && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-5">
                <div className="card p-6 space-y-5">
                  <h2 className="font-display font-bold text-white text-lg border-b border-white/10 pb-3">
                    📝 Blog Content
                  </h2>

                  {/* Title */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5 font-medium">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="Enter blog title..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 focus:bg-white/8 transition-all text-sm"
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5 font-medium">Excerpt *</label>
                    <textarea
                      name="excerpt"
                      value={form.excerpt}
                      onChange={handleChange}
                      required
                      rows={2}
                      placeholder="Short description shown on blog cards..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 transition-all text-sm resize-none"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5 font-medium">
                      Content * <span className="text-slate-600 font-normal">(Markdown supported)</span>
                    </label>
                    <div className="text-xs text-slate-600 mb-2">
                      ## Heading 2 &nbsp;|&nbsp; ### Heading 3 &nbsp;|&nbsp; **bold** &nbsp;|&nbsp; *italic* &nbsp;|&nbsp; - list item
                    </div>
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      required
                      rows={18}
                      placeholder="## Introduction&#10;&#10;Write your blog content here using Markdown...&#10;&#10;## Section 1&#10;&#10;Your content...&#10;&#10;## Conclusion&#10;&#10;Wrap up your article."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 transition-all text-sm font-mono resize-y"
                    />
                  </div>
                </div>

                {/* SEO */}
                <div className="card p-6 space-y-4">
                  <h2 className="font-display font-bold text-white text-lg border-b border-white/10 pb-3">
                    🔍 SEO Settings
                  </h2>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5 font-medium">Meta Title</label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={form.metaTitle}
                      onChange={handleChange}
                      placeholder="SEO title (defaults to blog title)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5 font-medium">Meta Description</label>
                    <textarea
                      name="metaDescription"
                      value={form.metaDescription}
                      onChange={handleChange}
                      rows={2}
                      placeholder="SEO description (defaults to excerpt)"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 transition-all text-sm resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Publish */}
                <div className="card p-6 space-y-4">
                  <h2 className="font-display font-bold text-white text-lg border-b border-white/10 pb-3">
                    🚀 Publish
                  </h2>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="published"
                        checked={form.published}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        onClick={() => setForm(f => ({ ...f, published: !f.published }))}
                        className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${form.published ? 'bg-primary-500' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.published ? 'left-6' : 'left-1'}`} />
                      </div>
                    </div>
                    <span className="text-sm text-slate-300">
                      {form.published ? '✅ Published' : '📝 Draft'}
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? '⏳ Saving...' : editId ? '💾 Update Blog' : '🚀 Publish Blog'}
                  </button>
                </div>

                {/* Settings */}
                <div className="card p-6 space-y-4">
                  <h2 className="font-display font-bold text-white text-lg border-b border-white/10 pb-3">
                    ⚙️ Settings
                  </h2>

                  {/* Category */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5 font-medium">Category *</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500/50 transition-all text-sm"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5 font-medium">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="AI, tools, students"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 transition-all text-sm"
                    />
                    <p className="text-slate-600 text-xs mt-1">Comma separated</p>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5 font-medium">Cover Image URL</label>
                    <input
                      type="text"
                      name="coverImage"
                      value={form.coverImage}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 transition-all text-sm"
                    />
                    {form.coverImage && (
                      <img src={form.coverImage} alt="preview" className="mt-2 w-full h-24 object-cover rounded-lg opacity-70" />
                    )}
                  </div>
                </div>

                {/* Word count */}
                <div className="card p-4">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Words</span>
                    <span className="text-slate-300 font-medium">
                      {form.content.split(/\s+/).filter(Boolean).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Est. Read Time</span>
                    <span className="text-slate-300 font-medium">
                      {Math.max(1, Math.ceil(form.content.split(/\s+/).filter(Boolean).length / 200))} min
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card p-6 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">🗑️</div>
            <h3 className="font-display font-bold text-white text-xl mb-2">Delete Blog?</h3>
            <p className="text-slate-400 text-sm mb-6">Ye action undo nahi ho sakta.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}