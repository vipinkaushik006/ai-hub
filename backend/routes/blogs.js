const router = require('express').Router();
const Blog = require('../models/Blog');
const { protect, admin } = require('../middleware/auth');

// ✅ Whitelist fields allowed on create
const extractCreateFields = (body) => {
  const { title, content, excerpt, coverImage, category, tags, metaTitle, metaDescription, published } = body;
  return { title, content, excerpt, coverImage, category, tags, metaTitle, metaDescription, published };
};

// ✅ Whitelist fields allowed on update (author/slug/views cannot be changed via API)
const extractUpdateFields = (body) => {
  const { title, content, excerpt, coverImage, category, tags, metaTitle, metaDescription, published } = body;
  return { title, content, excerpt, coverImage, category, tags, metaTitle, metaDescription, published };
};

// ✅ Shared error handler
const handleError = (res, err) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  const message = process.env.NODE_ENV === 'production' ? 'Server error' : err.message;
  return res.status(500).json({ error: message });
};


// ─────────────────────────────────────────────
// GET /api/blogs
// Public | Paginated | Search + filter
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // ✅ Sanitize category — block NoSQL injection objects
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : null;
    const search   = typeof req.query.search   === 'string' ? req.query.search.trim()   : null;

    // ✅ Safe pagination bounds
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
    const skip  = (page - 1) * limit;

    const query = { published: true };

    // ✅ $text search requires a text index on the Blog model:
    // BlogSchema.index({ title: 'text', content: 'text' })
    if (search) query.$text = { $search: search };
    if (category) query.category = category;

    const [total, blogs] = await Promise.all([
      Blog.countDocuments(query),
      Blog.find(query)
        .populate('author', 'name avatar')
        .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 }) // ✅ Sort by relevance when searching
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    res.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// GET /api/blogs/:slug
// Public | Increments view with bot protection
// ─────────────────────────────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      published: true
    })
      .populate('author', 'name avatar')
      .lean();

    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    // ✅ Only count views from real browsers — skip bots and curl
    const ua = req.headers['user-agent'] || '';
    const isBot = /bot|crawl|spider|curl|wget/i.test(ua);

    if (!isBot) {
      // ✅ Fire-and-forget — don't block the response for a view count
      Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();
    }

    res.json(blog);
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// POST /api/blogs
// Admin only | Whitelisted fields
// ─────────────────────────────────────────────
router.post('/', protect, admin, async (req, res) => {
  try {
    const fields = extractCreateFields(req.body);

    // ✅ Validate required fields before hitting DB
    if (!fields.title || !fields.content || !fields.excerpt) {
      return res.status(400).json({ error: 'title, content, and excerpt are required' });
    }

    // ✅ Author is always set from token — never from body
    const blog = await Blog.create({ ...fields, author: req.user._id });
    res.status(201).json(blog);
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// PUT /api/blogs/:id
// Admin only | Validates existence + runs schema validators
// ─────────────────────────────────────────────
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const fields = extractUpdateFields(req.body);

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      fields,
      {
        new: true,
        runValidators: true // ✅ Enforce schema validation on update
      }
    );

    // ✅ Explicit 404 instead of returning null
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    res.json(blog);
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// DELETE /api/blogs/:id
// Admin only | Confirms existence before delete
// ─────────────────────────────────────────────
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    // ✅ Explicit 404 instead of silent success on missing doc
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;