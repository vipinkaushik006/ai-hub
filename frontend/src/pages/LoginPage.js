import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/common/SEO";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Login"
        description="Sign in to your AIHub account to bookmark tools, rate AI tools, and access personalized features."
      />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-accent-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/forgot-password" className="text-sm text-primary-400">
              Forgot Password?
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="text-white font-display font-bold">AI</span>
              </div>
              <span className="font-display font-bold text-2xl text-white">
                <span className="gradient-text">AI</span>Hub
              </span>
            </Link>
            <h1 className="font-display font-extrabold text-3xl text-white mb-2">
              Welcome back
            </h1>
            <p className="text-slate-400">Sign in to access your account</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Enter your password"
                  className="input-field"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5 text-base"
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                >
                  Create one free
                </Link>
              </p>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 card p-4 text-center">
            <p className="text-slate-500 text-xs mb-1">
              Demo admin credentials:
            </p>
            <p className="text-slate-400 text-xs font-mono">
              admin@aihub.com / Admin@123456
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
