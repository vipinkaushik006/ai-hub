import React, { useState, useEffect, useCallback, useMemo } from "react";
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

const TOOLS_PER_PAGE = 12;

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Always returns a plain array, never null / undefined. */
const safeArray = (val) => (Array.isArray(val) ? val : []);

/**
 * Apply search / category / pricing filters to a list of tools entirely
 * on the client side (used when the API is unavailable).
 */
const applyFilters = (tools, { search, category, pricing }) => {
  let result = safeArray(tools);

  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t?.name?.toLowerCase().includes(q) ||
        t?.description?.toLowerCase().includes(q)
    );
  }

  if (category && category !== "All") {
    result = result.filter((t) => t?.category === category);
  }

  if (pricing && pricing !== "All") {
    result = result.filter((t) => t?.pricing === pricing);
  }

  return result;
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // ── Read params (derived, never stale) ────────────────────────────────────
  const search   = searchParams.get("search")   || "";
  const category = searchParams.get("category") || "";
  const pricing  = searchParams.get("pricing")  || "";
  const page     = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  // ── State ─────────────────────────────────────────────────────────────────
  const [allTools,    setAllTools]    = useState(() => safeArray(mockTools));
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [bookmarks,   setBookmarks]   = useState([]);
  const [localSearch, setLocalSearch] = useState(search);

  // Keep the local search input in sync when the URL param changes externally
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // ── Fetch tools ───────────────────────────────────────────────────────────
  const fetchTools = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)   params.set("search",   search);
      if (category) params.set("category", category);
      if (pricing)  params.set("pricing",  pricing);
      params.set("page",  String(page));
      params.set("limit", String(TOOLS_PER_PAGE));

      const res = await api.get(`/tools?${params}`);

      // Defensive: the API might return various shapes
      const rawTools = res?.data?.tools ?? res?.data ?? [];
      const fetched  = safeArray(rawTools);

      if (fetched.length > 0) {
        setAllTools(fetched);
        setTotalPages(Math.max(1, res?.data?.pages ?? 1));
      } else {
        // API returned an empty list — fall back to (filtered) mock data
        const filtered = applyFilters(mockTools, { search, category, pricing });
        setAllTools(filtered);
        setTotalPages(1);
      }
    } catch {
      // Network / server error — use mock data with client-side filtering
      const filtered = applyFilters(mockTools, { search, category, pricing });
      setAllTools(filtered);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, category, pricing, page]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  // ── Bookmarks ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    api
      .get("/users/bookmarks")
      .then((res) => {
        const ids = safeArray(res?.data).map((b) => b?._id).filter(Boolean);
        setBookmarks(ids);
      })
      .catch(() => {
        // Silently ignore — bookmarks are non-critical
      });
  }, [user]);

  const handleBookmark = useCallback(
    async (toolId) => {
      if (!user) {
        toast.error("Please login to bookmark tools");
        return;
      }
      try {
        const res = await api.post(`/users/bookmarks/${toolId}`);
        if (res?.data?.bookmarked) {
          setBookmarks((prev) => [...prev, toolId]);
          toast.success("Bookmarked!");
        } else {
          setBookmarks((prev) => prev.filter((id) => id !== toolId));
          toast.success("Removed from bookmarks");
        }
      } catch {
        toast.error("Failed to update bookmark");
      }
    },
    [user]
  );

  // ── Param helpers ─────────────────────────────────────────────────────────
  const setParam = useCallback(
    (key, val) => {
      const p = new URLSearchParams(searchParams);
      if (val) p.set(key, val);
      else p.delete(key);
      p.delete("page"); // reset to page 1 on any filter change
      setSearchParams(p);
    },
    [searchParams, setSearchParams]
  );

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setParam("search", localSearch.trim());
    },
    [localSearch, setParam]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      const p = new URLSearchParams(searchParams);
      p.set("page", String(newPage));
      setSearchParams(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [searchParams, setSearchParams]
  );

  // ── Derived / memoised values ─────────────────────────────────────────────

  /** Safe, guaranteed-array snapshot of tools currently in state. */
  const tools = useMemo(() => safeArray(allTools), [allTools]);

  /** Bookmark set — O(1) lookups. */
  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <SEO
        title="AI Tools Directory"
        description="Browse and search 200+ AI tools across writing, coding, image generation, and video categories."
        keywords="AI tools directory, best AI tools, ChatGPT alternatives, AI writing tools, AI coding tools"
      />

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* ── Header ─────────────────────────────────────────────────────── */}
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

          {/* ── Search & Filters ───────────────────────────────────────────── */}
          <div className="card p-5 mb-8">
            <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-4">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search AI tools..."
                className="input-field"
              />
              <button type="submit" className="btn-primary px-6 whitespace-nowrap">
                Search
              </button>
            </form>

            <div className="flex flex-col gap-4">
              {/* Category filter */}
              <div>
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => {
                    const active = c === "All" ? !category : category === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setParam("category", c === "All" ? "" : c)}
                        className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${
                          active
                            ? "bg-primary-500 border-primary-500 text-white"
                            : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing filter */}
              <div>
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                  Pricing
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRICING_OPTIONS.map((opt) => {
                    const active = opt === "All" ? !pricing : pricing === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setParam("pricing", opt === "All" ? "" : opt)}
                        className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${
                          active
                            ? "bg-primary-500 border-primary-500 text-white"
                            : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <AdBanner slot="inline" className="mb-8" />

          {/* ── Results count ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-400 text-sm">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <span className="text-white font-medium">{tools.length}</span>{" "}
                  {tools.length === 1 ? "tool" : "tools"} found
                  {search && (
                    <>
                      {" "}for &ldquo;
                      <span className="text-white">{search}</span>
                      &rdquo;
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          {/* ── Tool grid ──────────────────────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: TOOLS_PER_PAGE }).map((_, i) => (
                <div key={i} className="card p-5 h-52 skeleton" />
              ))}
            </div>
          ) : tools.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-white text-2xl mb-2">
                No tools found
              </h3>
              <p className="text-slate-400">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="btn-primary mt-6 px-6 py-2"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.map((tool) => (
                <ToolCard
                  key={tool?._id ?? tool?.slug ?? Math.random()}
                  tool={tool}
                  onBookmark={handleBookmark}
                  isBookmarked={bookmarkSet.has(tool?._id)}
                />
              ))}
            </div>
          )}

          {/* ── Pagination ─────────────────────────────────────────────────── */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
              {/* Prev */}
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-4 h-10 rounded-lg border border-white/10 text-slate-400
                           hover:border-white/20 hover:text-white transition-all
                           disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold"
              >
                ← Prev
              </button>

              {/* Page numbers (show at most 7 pages around current) */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - page) <= 2
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) {
                    acc.push("ellipsis-" + p);
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item) =>
                  typeof item === "string" ? (
                    <span key={item} className="text-slate-500 px-1">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => handlePageChange(item)}
                      className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-all ${
                        page === item
                          ? "bg-primary-500 border-primary-500 text-white"
                          : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              {/* Next */}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-4 h-10 rounded-lg border border-white/10 text-slate-400
                           hover:border-white/20 hover:text-white transition-all
                           disabled:opacity-30 disabled:cursor-not-allowed text-sm font-semibold"
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}