const mongoose = require('mongoose');
const slugify = require('slugify');

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    coverImage: { type: String, default: '' },
    category: {
      type: String,
      enum: ['AI Tools', 'Programming', 'Career', 'Tutorials', 'News', 'Analytics'],
      default: 'AI Tools',
      index: true
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    readTime: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
    published: { type: Boolean, default: true }
  },
  {
    timestamps: true // ✅ Automatically handles createdAt & updatedAt (even on updates)
  }
);

// ✅ Auto-generate slug + handle duplicates
BlogSchema.pre('save', async function (next) {
  if (this.isModified('title')) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // Keep incrementing suffix until slug is unique
    while (await mongoose.models.Blog.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }

  if (this.isModified('content')) {
    const words = this.content.trim().split(/\s+/).length; // ✅ Handles multiple spaces/newlines
    this.readTime = Math.ceil(words / 200);
  }

  next();
});

// ✅ Also update readTime on findOneAndUpdate
BlogSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();

  if (update.content) {
    const words = update.content.trim().split(/\s+/).length;
    update.readTime = Math.ceil(words / 200);
  }

  next();
});

module.exports = mongoose.model('Blog', BlogSchema);