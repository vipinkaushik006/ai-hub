import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/common/SEO";
import ToolCard from "../components/tools/ToolCard";
import AdBanner from "../components/common/AdBanner";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { mockTools } from "../data/mockData";
import toast from "react-hot-toast";

const CATEGORIES = [
  "All",
  "AI Writing",
  "AI Coding",
  "AI Image Generation",
  "AI Video",
  "AI Audio",
  "AI Data",
  "Productivity",
];
const PRICING_OPTIONS = ["All", "Free", "Freemium", "Paid", "Open Source"];

export default function ToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);
  const { user } = useAuth();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const pricing = searchParams.get("pricing") || "";
  const page = parseInt(searchParams.get("page") || "1");

  const fetchTools = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (pricing) params.set("pricing", pricing);
      params.set("page", page);
      params.set("limit", 12);

      const res = await api.get(`/tools?${params}`);
      setTools(res.data.tools);
      setTotalPages(res.data.pages);
    } catch {
      let filtered = mockTools;
      if (search)
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase()),
        );
      if (category) filtered = filtered.filter((t) => t.category === category);
      if (pricing) filtered = filtered.filter((t) => t.pricing === pricing);
      setTools(filtered);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, category, pricing, page]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  useEffect(() => {
    if (user) {
      api
        .get("/users/bookmarks")
        .then((res) => setBookmarks(res.data.map((b) => b._id)))
        .catch(() => {});
    }
  }, [user]);

  const handleBookmark = async (toolId) => {
    if (!user) {
      toast.error("Please login to bookmark tools");
      return;
    }
    try {
      const res = await api.post(`/users/bookmarks/${toolId}`);
      if (res.data.bookmarked) {
        setBookmarks((prev) => [...prev, toolId]);
        toast.success("Bookmarked!");
      } else {
        setBookmarks((prev) => prev.filter((id) => id !== toolId));
        toast.success("Removed from bookmarks");
      }
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    p.delete("page");
    setSearchParams(p);
  };

  const [localSearch, setLocalSearch] = useState(search);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setParam("search", localSearch);
  };

  return (
    <>
      <SEO
        title="AI Tools Directory"
        description="Browse and search 200+ AI tools across writing, coding, image generation, and video categories."
        keywords="AI tools directory, best AI tools, ChatGPT alternatives, AI writing tools, AI coding tools"
      />

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-2">
              🤖 AI Tools Directory
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-4">
              Discover <span className="gradient-text">200+ AI Tools</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Find the perfect AI tool for writing, coding, image generation,
              video, and more.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="card p-5 mb-8">
            <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-4">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search AI tools..."
                className="input-field"
              />
              <button
                type="submit"
                className="btn-primary px-6 whitespace-nowrap"
              >
                Search
              </button>
            </form>
            <div className="flex flex-wrap gap-3">
              <div>
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setParam("category", c === "All" ? "" : c)}
                      className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${(c === "All" && !category) || category === c ? "bg-primary-500 border-primary-500 text-white" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider mt-3">
                  Pricing
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRICING_OPTIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setParam("pricing", p === "All" ? "" : p)}
                      className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${(p === "All" && !pricing) || pricing === p ? "bg-primary-500 border-primary-500 text-white" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <AdBanner slot="inline" className="mb-8" />

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-400 text-sm">
              {loading ? "Loading..." : `${(Array.isArray(tools) ? tools : []).length} tools found`}
              {search && (
                <span>
                  {" "}
                  for "<span className="text-white">{search}</span>"
                </span>
              )}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="card p-5 h-52 skeleton" />
              ))}
            </div>
          ) : (Array.isArray(tools) ? tools : []).length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-white text-2xl mb-2">
                No tools found
              </h3>
              <p className="text-slate-400">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(Array.isArray(tools) ? tools : []).map((tool) => (
                <ToolCard
                  key={tool._id || tool.slug}
                  tool={tool}
                  onBookmark={handleBookmark}
                  isBookmarked={bookmarks?.includes(tool._id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    p.set("page", i + 1);
                    setSearchParams(p);
                  }}
                  className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-all ${page === i + 1 ? "bg-primary-500 border-primary-500 text-white" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
