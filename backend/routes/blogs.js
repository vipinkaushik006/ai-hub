// routes/blogs.js
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// ─────────────────────────────────────────────
// GET /api/blogs  → All blogs
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// GET /api/blogs/:slug → Single blog
// ─────────────────────────────────────────────
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      published: true
    }).populate('author', 'name');

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────
// POST /api/blogs → Create blog
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();

    res.status(201).json({
      success: true,
      blog
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;