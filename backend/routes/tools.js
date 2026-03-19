const router = require('express').Router();
const Tool = require('../models/Tool');
const { protect, admin } = require('../middleware/auth');

// GET all tools with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, pricing, page = 1, limit = 12, sort = '-createdAt' } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (pricing) query.pricing = pricing;

    const total = await Tool.countDocuments(query);
    const tools = await Tool.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ tools, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET trending tools
router.get('/trending', async (req, res) => {
  try {
    const tools = await Tool.find({ trending: true }).sort('-views').limit(8);
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single tool
router.get('/:slug', async (req, res) => {
  try {
    const tool = await Tool.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!tool) return res.status(404).json({ error: 'Tool not found' });
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST rate a tool
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { $inc: { totalRatings: 1, ratingSum: rating } },
      { new: true }
    );
    tool.rating = Math.round((tool.ratingSum / tool.totalRatings) * 10) / 10;
    await tool.save();
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create tool (admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const tool = await Tool.create(req.body);
    res.status(201).json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update tool (admin)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE tool (admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await Tool.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tool deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
