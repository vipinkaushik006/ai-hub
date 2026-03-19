import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to AIHub 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const BENEFITS = ['Bookmark your favourite AI tools', 'Rate & review tools', 'Save dev tool presets', 'Access exclusive content'];

  return (
    <>
      <SEO title="Create Account" description="Join AIHub for free. Bookmark AI tools, rate and review, and get personalized recommendations." />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16 py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-accent-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-4xl grid md:grid-cols-2 gap-10 items-center">
          {/* Left side - benefits */}
          <div className="hidden md:block">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold">AI</span>
              </div>
              <span className="font-display font-bold text-2xl text-white"><span className="gradient-text">AI</span>Hub</span>
            </Link>
            <h2 className="font-display font-extrabold text-3xl text-white mb-4 leading-tight">
              Join 50,000+ developers & creators
            </h2>
            <p className="text-slate-400 mb-8">Get free access to AI tools discovery, developer utilities, and expert tech content.</p>
            <ul className="space-y-3">
              {BENEFITS.map(b => (
                <li key={b} className="flex items-center gap-3 text-slate-300">
                  <span className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-400 text-xs">✓</span>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - form */}
          <div>
            <div className="text-center mb-6 md:hidden">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                  <span className="text-white font-display font-bold text-sm">AI</span>
                </div>
                <span className="font-display font-bold text-xl text-white"><span className="gradient-text">AI</span>Hub</span>
              </Link>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-white mb-6">Create your free account</h1>
            <div className="card p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 font-medium">Full Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 font-medium">Email Address</label>
                  <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 font-medium">Password</label>
                  <input type="password" required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Min. 6 characters" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 font-medium">Confirm Password</label>
                  <input type="password" required value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Repeat password" className="input-field" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
                  {loading ? 'Creating Account...' : 'Create Free Account →'}
                </button>
              </form>
              <div className="mt-5 pt-5 border-t border-white/10 text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">Sign in</Link>
                </p>
              </div>
            </div>
            <p className="text-slate-600 text-xs text-center mt-4">By signing up, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </>
  );
}
