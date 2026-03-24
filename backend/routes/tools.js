const router = require('express').Router();
const Tool = require('../models/Tool');
const { protect, admin } = require('../middleware/auth');

// ✅ Whitelist sortable fields — never pass raw query string to .sort()
const ALLOWED_SORT_FIELDS = {
  '-createdAt' : { createdAt: -1 },
  'createdAt'  : { createdAt:  1 },
  '-views'     : { views:     -1 },
  '-rating'    : { rating:    -1 },
  '-demand'    : { demand:    -1 },
  'name'       : { name:       1 }
};

const getSortOption = (sort) => ALLOWED_SORT_FIELDS[sort] ?? { createdAt: -1 };

// ✅ Whitelist fields for create
const extractCreateFields = (body) => {
  const { name, category, description, longDescription, websiteLink, logoUrl, tags, pricing, featured, trending } = body;
  return { name, category, description, longDescription, websiteLink, logoUrl, tags, pricing, featured, trending };
};

// ✅ Whitelist fields for update (rating fields can never be set manually)
const extractUpdateFields = (body) => {
  const { name, category, description, longDescription, websiteLink, logoUrl, tags, pricing, featured, trending } = body;
  return { name, category, description, longDescription, websiteLink, logoUrl, tags, pricing, featured, trending };
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
// GET /api/tools
// Public | Search, filter, paginate
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    // ✅ Sanitize all query strings — block NoSQL injection objects
    const search  = typeof req.query.search   === 'string' ? req.query.search.trim()   : null;
    const category= typeof req.query.category === 'string' ? req.query.category.trim() : null;
    const pricing = typeof req.query.pricing  === 'string' ? req.query.pricing.trim()  : null;

    // ✅ Safe pagination
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip  = (page - 1) * limit;
    const sort  = getSortOption(req.query.sort);

    const query = {};
    if (search)   query.$text    = { $search: search };
    if (category) query.category = category;
    if (pricing)  query.pricing  = pricing;

    const [total, tools] = await Promise.all([
      Tool.countDocuments(query),
      Tool.find(query)
        .sort(search ? { score: { $meta: 'textScore' } } : sort) // ✅ Relevance sort when searching
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    res.json({
      tools,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// GET /api/tools/trending
// ✅ Must be defined BEFORE /:slug to avoid route shadowing
// ─────────────────────────────────────────────
router.get('/trending', async (req, res) => {
  try {
    const tools = await Tool.find({ trending: true })
      .sort({ views: -1 })
      .limit(8)
      .lean();

    res.json(tools);
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// GET /api/tools/:slug
// Public | Bot-protected view count
// ─────────────────────────────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const tool = await Tool.findOne({ slug: req.params.slug }).lean();
    if (!tool) return res.status(404).json({ error: 'Tool not found' });

    // ✅ Skip bots and automated requests
    const ua = req.headers['user-agent'] || '';
    const isBot = /bot|crawl|spider|curl|wget/i.test(ua);
    if (!isBot) {
      Tool.findByIdAndUpdate(tool._id, { $inc: { views: 1 } }).exec();
    }

    res.json(tool);
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// POST /api/tools/:id/rate
// Protected | Uses model method to prevent duplicate ratings
// ─────────────────────────────────────────────
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;
    const value = parseInt(rating);

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ error: 'Tool not found' });

    // ✅ addRating() handles duplicate check + atomic update (defined in model)
    await tool.addRating(req.user._id, value);

    res.json({
      rating: tool.rating,
      totalRatings: tool.totalRatings
    });
  } catch (err) {
    // ✅ addRating throws a readable error on duplicate — surface it as 400
    if (err.message.includes('already rated')) {
      return res.status(400).json({ error: err.message });
    }
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// POST /api/tools
// Admin only | Whitelisted fields
// ─────────────────────────────────────────────
router.post('/', protect, admin, async (req, res) => {
  try {
    const fields = extractCreateFields(req.body);

    if (!fields.name || !fields.category || !fields.description || !fields.websiteLink) {
      return res.status(400).json({ error: 'name, category, description and websiteLink are required' });
    }

    const tool = await Tool.create(fields);
    res.status(201).json(tool);
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// PUT /api/tools/:id
// Admin only | Validates existence + runs validators
// ─────────────────────────────────────────────
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const fields = extractUpdateFields(req.body);

    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      fields,
      { new: true, runValidators: true }
    );

    if (!tool) return res.status(404).json({ error: 'Tool not found' });
    res.json(tool);
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// DELETE /api/tools/:id
// Admin only | Confirms existence
// ─────────────────────────────────────────────
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const tool = await Tool.findByIdAndDelete(req.params.id);
    if (!tool) return res.status(404).json({ error: 'Tool not found' });
    res.json({ message: 'Tool deleted successfully' });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;