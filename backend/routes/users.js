const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Tool = require('../models/Tool');
const { protect, admin } = require('../middleware/auth');

// ✅ Shared error handler
const handleError = (res, err) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  const message = process.env.NODE_ENV === 'production' ? 'Server error' : err.message;
  return res.status(500).json({ error: message });
};

// ✅ Validate MongoDB ObjectId before any DB call
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ─────────────────────────────────────────────
// GET /api/users
// ✅ Admin only — was completely public before
// ─────────────────────────────────────────────
router.get('/', protect, admin, async (req, res) => {
  try {
    // ✅ Whitelist only the fields admin actually needs
    const users = await User.find({ isActive: true })
      .select('name email role avatar createdAt')
      .lean();

    res.json(users);
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// GET /api/users/bookmarks
// Protected | Returns populated tool bookmarks
// ─────────────────────────────────────────────
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookmarks',
        select: 'name slug category description logoUrl pricing rating', // ✅ Only needed fields
        options: { lean: true }
      })
      .lean();

    // ✅ Guard against missing user
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.bookmarks ?? []);
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// POST /api/users/bookmarks/:toolId
// Protected | Toggle bookmark on/off
// ─────────────────────────────────────────────
router.post('/bookmarks/:toolId', protect, async (req, res) => {
  try {
    const { toolId } = req.params;

    // ✅ Validate ObjectId before hitting DB
    if (!isValidObjectId(toolId)) {
      return res.status(400).json({ error: 'Invalid tool ID' });
    }

    // ✅ Confirm tool actually exists
    const toolExists = await Tool.exists({ _id: toolId });
    if (!toolExists) return res.status(404).json({ error: 'Tool not found' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // ✅ Use .equals() for ObjectId comparison — indexOf() always fails on ObjectIds
    const alreadyBookmarked = user.bookmarks.some((id) => id.equals(toolId));

    if (alreadyBookmarked) {
      // ✅ Remove with filter instead of splice — safer and cleaner
      user.bookmarks = user.bookmarks.filter((id) => !id.equals(toolId));
    } else {
      // ✅ Cap bookmark count to prevent abuse
      if (user.bookmarks.length >= 200) {
        return res.status(400).json({ error: 'Bookmark limit of 200 reached' });
      }
      user.bookmarks.push(toolId);
    }

    await user.save();

    res.json({
      bookmarked: !alreadyBookmarked,
      totalBookmarks: user.bookmarks.length
    });
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// DELETE /api/users/:id
// Admin only | Soft delete
// ─────────────────────────────────────────────
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // ✅ Prevent admin from deleting their own account
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deactivated successfully' });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;