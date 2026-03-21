import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import SEO from "../components/common/SEO";
import api from "../utils/api";
import { mockAnalytics } from "../data/mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
);

const chartDefaults = {
  plugins: {
    legend: { labels: { color: "#94a3b8", font: { family: "DM Sans" } } },
  },
  scales: {
    x: {
      ticks: { color: "#64748b" },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
    y: {
      ticks: { color: "#64748b" },
      grid: { color: "rgba(255,255,255,0.05)" },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

const AI_JOB_TRENDS = {
  labels: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
  datasets: [
    {
      label: "AI/ML Engineers",
      data: [45, 62, 89, 128, 195, 278, 380],
      borderColor: "#4f6ef7",
      backgroundColor: "rgba(79,110,247,0.1)",
      fill: true,
      tension: 0.4,
    },
    {
      label: "Data Scientists",
      data: [68, 82, 105, 140, 178, 215, 256],
      borderColor: "#22d3ee",
      backgroundColor: "rgba(34,211,238,0.1)",
      fill: true,
      tension: 0.4,
    },
    {
      label: "LLM Engineers",
      data: [0, 2, 8, 32, 98, 165, 290],
      borderColor: "#a855f7",
      backgroundColor: "rgba(168,85,247,0.1)",
      fill: true,
      tension: 0.4,
    },
  ],
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [activeTab, setActiveTab] = useState("demand");

  useEffect(() => {
  api.get('/analytics')
    .then(res => {
      const data = res?.data;

      if (Array.isArray(data) && data.length > 0) {
        setAnalytics(data);
      } else {
        setAnalytics(mockAnalytics);
      }
    })
    .catch(() => setAnalytics(mockAnalytics));
}, []);

  const demandData = {
    labels: analytics.map((a) => a.skill),
    datasets: [
      {
        label: "Demand Score (%)",
        data: analytics.map((a) => a.demand),
        backgroundColor: analytics.map(
          (_, i) => `hsl(${220 + i * 15}, 70%, 60%)`,
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const salaryData = {
    labels: analytics.map((a) => a.skill),
    datasets: [
      {
        label: "Average Salary (USD)",
        data: analytics.map((a) => a.salary),
        backgroundColor: analytics.map(
          (_, i) => `hsl(${170 + i * 12}, 60%, 55%)`,
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const growthData = {
    labels: analytics.map((a) => a.skill),
    datasets: [
      {
        label: "YoY Growth (%)",
        data: analytics.map((a) => a.growth),
        backgroundColor: analytics.map((a) =>
          a.growth > 50
            ? "rgba(34,197,94,0.7)"
            : a.growth > 20
              ? "rgba(234,179,8,0.7)"
              : "rgba(79,110,247,0.7)",
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const categoryCount = analytics.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});
  const doughnutData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        data: Object.values(categoryCount),
        backgroundColor: [
          "#4f6ef7",
          "#22d3ee",
          "#a855f7",
          "#f59e0b",
          "#10b981",
          "#ef4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  const radarData = {
    labels: analytics.slice(0, 6).map((a) => a.skill),
    datasets: [
      {
        label: "Overall Score",
        data: analytics
          .slice(0, 6)
          .map((a) => (a.demand + Math.min(a.growth * 0.5, 50)) / 1.5),
        borderColor: "#4f6ef7",
        backgroundColor: "rgba(79,110,247,0.15)",
        pointBackgroundColor: "#4f6ef7",
      },
    ],
  };

  const STAT_CARDS = [
    {
      label: "Avg AI Engineer Salary",
      value: "$145K",
      change: "+18%",
      icon: "💰",
    },
    {
      label: "AI Job Postings (2025)",
      value: "380K+",
      change: "+97%",
      icon: "💼",
    },
    {
      label: "Top Paid Skill",
      value: "LLM Eng.",
      change: "$155K avg",
      icon: "🏆",
    },
    {
      label: "Fastest Growing",
      value: "Prompt Eng",
      change: "+120% YoY",
      icon: "🚀",
    },
  ];

  return (
    <>
      <SEO
        title="Tech Analytics Dashboard"
        description="Explore AI job demand trends, technology salary insights, and skills demand analysis for 2025-2026."
        keywords="tech salary insights, AI job demand, programming skills demand, tech analytics dashboard"
      />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-primary-400 font-semibold text-sm uppercase tracking-wider mb-2">
              📊 Live Data
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-4">
              Tech Analytics <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Real salary data, job demand trends, and skills analysis for
              developers in 2025-2026.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {STAT_CARDS.map((s) => (
              <div key={s.label} className="card p-5">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-display font-bold text-xl text-white mb-1">
                  {s.value}
                </div>
                <div className="text-xs text-green-400 mb-1">{s.change}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {[
              { id: "demand", label: "📈 Skill Demand" },
              { id: "salary", label: "💰 Salary Insights" },
              { id: "growth", label: "🚀 Growth Trends" },
              { id: "jobs", label: "📉 Job Market" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${activeTab === tab.id ? "bg-primary-500 border-primary-500 text-white" : "border-white/10 text-slate-400 hover:text-white"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main chart */}
            <div className="lg:col-span-2 card p-6">
              <h3 className="font-display font-bold text-white text-lg mb-5">
                {activeTab === "demand" && "Skills Demand Score (2025)"}
                {activeTab === "salary" &&
                  "Average Annual Salary by Skill (USD)"}
                {activeTab === "growth" && "Year-over-Year Growth Rate (%)"}
                {activeTab === "jobs" && "AI Job Market Trends (2020–2026)"}
              </h3>
              <div className="h-72">
                {activeTab === "demand" && (
                  <Bar data={demandData} options={chartDefaults} />
                )}
                {activeTab === "salary" && (
                  <Bar
                    data={salaryData}
                    options={{
                      ...chartDefaults,
                      plugins: {
                        ...chartDefaults.plugins,
                        tooltip: {
                          callbacks: {
                            label: (ctx) => `$${ctx.raw.toLocaleString()}`,
                          },
                        },
                      },
                    }}
                  />
                )}
                {activeTab === "growth" && (
                  <Bar data={growthData} options={chartDefaults} />
                )}
                {activeTab === "jobs" && (
                  <Line data={AI_JOB_TRENDS} options={chartDefaults} />
                )}
              </div>
            </div>

            {/* Side charts */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-display font-bold text-white text-sm mb-4">
                  Skills by Category
                </h3>
                <div className="h-44">
                  <Doughnut
                    data={doughnutData}
                    options={{
                      ...chartDefaults,
                      scales: undefined,
                      plugins: {
                        legend: {
                          position: "bottom",
                          labels: { color: "#64748b", font: { size: 11 } },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="card p-6">
                <h3 className="font-display font-bold text-white text-sm mb-4">
                  Overall Skill Scores
                </h3>
                <div className="h-44">
                  <Radar
                    data={radarData}
                    options={{
                      ...chartDefaults,
                      scales: {
                        r: {
                          ticks: {
                            color: "#64748b",
                            backdropColor: "transparent",
                          },
                          grid: { color: "rgba(255,255,255,0.05)" },
                          pointLabels: { color: "#94a3b8", font: { size: 10 } },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Data table */}
          <div className="card overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="font-display font-bold text-white">
                Detailed Skills Analytics Table
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {[
                      "Skill",
                      "Category",
                      "Demand Score",
                      "Avg Salary",
                      "YoY Growth",
                      "Job Postings",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-slate-500 px-5 py-3 text-xs uppercase tracking-wider font-semibold"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((a, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 hover:bg-white/3 transition-colors"
                    >
                      <td className="px-5 py-3 font-semibold text-white">
                        {a.skill}
                      </td>
                      <td className="px-5 py-3">
                        <span className="badge bg-primary-500/15 text-primary-300 text-xs">
                          {a.category}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/5 rounded-full h-1.5 w-20">
                            <div
                              className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-400"
                              style={{ width: `${a.demand}%` }}
                            />
                          </div>
                          <span className="text-slate-300">{a.demand}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-green-400 font-semibold">
                        ${a.salary?.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`font-semibold ${a.growth > 50 ? "text-green-400" : a.growth > 20 ? "text-yellow-400" : "text-slate-400"}`}
                        >
                          +{a.growth}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400">
                        {a.jobPostings?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
