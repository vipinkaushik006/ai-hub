const router = require('express').Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ✅ GET all users (for testing / admin)
router.get('/', async (req, res) => {
try {
const users = await User.find().select('-password');
res.json(users);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// GET bookmarks
router.get('/bookmarks', protect, async (req, res) => {
try {
const user = await User.findById(req.user._id).populate('bookmarks');
res.json(user.bookmarks);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// Toggle bookmark
router.post('/bookmarks/:toolId', protect, async (req, res) => {
try {
const user = await User.findById(req.user._id);
const toolId = req.params.toolId;
const idx = user.bookmarks.indexOf(toolId);

```
if (idx > -1) {
  user.bookmarks.splice(idx, 1);
} else {
  user.bookmarks.push(toolId);
}

await user.save();

res.json({
  bookmarks: user.bookmarks,
  bookmarked: idx === -1
});
```

} catch (err) {
res.status(500).json({ error: err.message });
}
});

module.exports = router;
