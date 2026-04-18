import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SEO from "../components/common/SEO";
import BlogCard from "../components/blog/BlogCard";
import AdBanner from "../components/common/AdBanner";
import api from "../utils/api";
//import { mockBlogs } from "../data/mockData";

const CATEGORIES = [
  "All",
  "AI Tools",
  "Programming",
  "Career",
  "Tutorials",
  "News",
  "Analytics",
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";

  useEffect(() => {
    api
      .get("/blogs")
      .then((res) => {
        const data = res?.data?.blogs;
        setBlogs(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setBlogs([]);
      })
      .catch(() => {
        setBlogs(null);
      })
      .finally(() => {
        setLoading(false); // ✅ Fix #1
      });
  }, []);

  const filteredBlogs = category
    ? blogs.filter((b) => b.category === category)
    : blogs; // ✅ Fix #2

  return (
    <>
      <SEO
        title="Tech & AI Blog"
        description="Read in-depth articles about AI tools, programming languages, career advice, and tech industry insights."
        keywords="AI tools blog, programming tutorials, tech career, best AI tools articles"
      />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-accent-400 font-semibold text-sm uppercase tracking-wider mb-2">
              ✍️ Expert Blog
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-4">
              Tech & AI <span className="gradient-text">Insights</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Expert articles on AI tools, programming, career paths, and the
              future of technology.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  const p = new URLSearchParams();
                  if (c !== "All") p.set("category", c);
                  setSearchParams(p);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  (c === "All" && !category) || category === c
                    ? "bg-primary-500 border-primary-500 text-white"
                    : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <AdBanner slot="inline" className="mb-10" />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-80 skeleton" />
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="font-display font-bold text-white text-2xl">
                No posts yet
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, i) => (
                <BlogCard key={blog._id || blog.slug} blog={blog} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
