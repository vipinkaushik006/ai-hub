const mongoose = require('mongoose');
const slugify = require('slugify');

const ToolSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  category: {
    type: String,
    required: true,
    enum: ['AI Writing', 'AI Coding', 'AI Image Generation', 'AI Video', 'AI Audio', 'AI Data', 'Productivity', 'Other']
  },
  description: { type: String, required: true },
  longDescription: { type: String, default: '' },
  websiteLink: { type: String, required: true },
  logoUrl: { type: String, default: '' },
  tags: [{ type: String }],
  pricing: { type: String, enum: ['Free', 'Freemium', 'Paid', 'Open Source'], default: 'Freemium' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  ratingSum: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  trending: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

ToolSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  if (this.ratingSum > 0 && this.totalRatings > 0) {
    this.rating = Math.round((this.ratingSum / this.totalRatings) * 10) / 10;
  }
  next();
});

module.exports = mongoose.model('Tool', ToolSchema);
