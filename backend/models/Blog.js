const mongoose = require('mongoose');
const slugify = require('slugify');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String, default: '' },
  category: {
    type: String,
    enum: ['AI Tools', 'Programming', 'Career', 'Tutorials', 'News', 'Analytics'],
    default: 'AI Tools'
  },
  tags: [{ type: String }],
  metaTitle: { type: String },
  metaDescription: { type: String },
  readTime: { type: Number, default: 5 },
  views: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

BlogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified('content')) {
    const words = this.content.split(' ').length;
    this.readTime = Math.ceil(words / 200);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);
