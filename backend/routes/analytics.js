const router = require('express').Router();
const Analytics = require('../models/Analytics');
const { protect, admin } = require('../middleware/auth');

// ✅ Sanitize query params — blocks NoSQL injection like { $gt: '' }
const sanitizeCategory = (value) => {
  if (typeof value !== 'string') return null;
  return value.trim();
};

// ✅ Whitelist only the fields you expect from req.body
const extractAnalyticsFields = (body) => {
  const { category, demand, label, region, source } = body;
  return { category, demand, label, region, source };
};

// ✅ Distinguish validation errors (400) from server errors (500)
const handleError = (res, err) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }
  // ✅ Never leak internals in production
  const message = process.env.NODE_ENV === 'production' ? 'Server error' : err.message;
  return res.status(500).json({ error: message });
};

// ─────────────────────────────────────────────
// GET /api/analytics
// Public | Paginated | Filtered by category
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const category = sanitizeCategory(req.query.category);

    // ✅ Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const query = category ? { category } : {};

    // ✅ Run count + fetch in parallel for performance
    const [total, data] = await Promise.all([
      Analytics.countDocuments(query),
      Analytics.find(query)
        .sort({ demand: -1 })
        .skip(skip)
        .limit(limit)
        .lean() // ✅ Returns plain JS objects, faster than full Mongoose docs
    ]);

    res.json({
      data,
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
// POST /api/analytics
// Admin only | Whitelisted fields only
// ─────────────────────────────────────────────
router.post('/', protect, admin, async (req, res) => {
  try {
    // ✅ Never pass req.body directly — whitelist fields explicitly
    const fields = extractAnalyticsFields(req.body);

    // ✅ Check required fields before hitting the DB
    if (!fields.category || !fields.demand) {
      return res.status(400).json({ error: 'category and demand are required' });
    }

    const item = await Analytics.create(fields);
    res.status(201).json(item);
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;