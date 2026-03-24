const mongoose = require('mongoose');
const slugify = require('slugify');

const ToolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    category: {
      type: String,
      required: true,
      enum: [
        'AI Writing', 'AI Coding', 'AI Image Generation',
        'AI Video', 'AI Audio', 'AI Data', 'Productivity', 'Other'
      ],
      index: true
    },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, default: '', trim: true },

    websiteLink: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => /^https?:\/\/.+\..+/.test(v), // ✅ Basic URL validation
        message: 'websiteLink must be a valid URL'
      }
    },

    logoUrl: { type: String, default: '', trim: true },
    tags: [{ type: String, trim: true, lowercase: true }], // ✅ Normalized tags

    pricing: {
      type: String,
      enum: ['Free', 'Freemium', 'Paid', 'Open Source'],
      default: 'Freemium',
      index: true
    },

    // ✅ rating is now computed only — never set manually
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 },

    // ✅ Track who rated to prevent duplicate ratings
    ratedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    views: { type: Number, default: 0 },
    trending: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true }
  },
  {
    timestamps: true // ✅ Adds createdAt + updatedAt automatically
  }
);

// ✅ Slug generation with duplicate handling
ToolSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await mongoose.models.Tool.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }

  // ✅ Only recalculate rating if rating fields actually changed
  if (this.isModified('ratingSum') || this.isModified('totalRatings')) {
    this.rating =
      this.totalRatings > 0
        ? Math.round((this.ratingSum / this.totalRatings) * 10) / 10
        : 0;
  }

  next();
});

// ✅ Safe method to add a rating — prevents duplicate votes
ToolSchema.methods.addRating = async function (userId, value) {
  if (value < 1 || value > 5) throw new Error('Rating must be between 1 and 5');

  const alreadyRated = this.ratedBy.some((id) => id.equals(userId));
  if (alreadyRated) throw new Error('User has already rated this tool');

  this.ratedBy.push(userId);
  this.ratingSum += value;
  this.totalRatings += 1;

  await this.save(); // triggers pre('save') to recalculate rating
};

module.exports = mongoose.model('Tool', ToolSchema);