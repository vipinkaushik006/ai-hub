const router = require('express').Router();
const Analytics = require('../models/Analytics');
const { protect, admin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const data = await Analytics.find(query).sort('-demand');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const item = await Analytics.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
