const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  category: { type: String, enum: ['Technology', 'AI/ML', 'Data', 'Cloud', 'DevOps', 'Design'], default: 'Technology' },
  demand: { type: Number, required: true }, // % demand score
  salary: { type: Number, required: true }, // Average salary in USD
  growth: { type: Number, default: 0 },    // YoY growth %
  jobPostings: { type: Number, default: 0 },
  year: { type: Number, default: new Date().getFullYear() },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
