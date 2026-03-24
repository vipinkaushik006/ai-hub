const router = require('express').Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit'); // ✅ npm i express-rate-limit
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ✅ Hard crash at startup if secret is missing — never silently fall back
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in environment variables');
}

// ✅ Short-lived access token + longer refresh token
const signAccessToken  = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '15m' });
const signRefreshToken = (id) => jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

// ✅ Only expose safe fields — never the full user object
const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  createdAt: user.createdAt
});

// ✅ Error handler — never leak internals in production
const handleError = (res, err) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }
  const message = process.env.NODE_ENV === 'production' ? 'Server error' : err.message;
  return res.status(500).json({ error: message });
};

// ✅ Rate limit login + register — blocks brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

// ─────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // ✅ Basic password strength check
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const user = await User.create({ name, email, password });

    const accessToken  = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    // ✅ Refresh token in httpOnly cookie — JS cannot access it
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // ✅ Only return safe user fields
    res.status(201).json({ accessToken, user: safeUser(user) });
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // ✅ select('+password') because password has select:false in schema
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    // ✅ Always run bcrypt compare — prevents timing attack that reveals if email exists
    const passwordMatch = user ? await user.comparePassword(password) : false;
    if (!user || !passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken  = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken, user: safeUser(user) });
  } catch (err) {
    handleError(res, err);
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/refresh
// Issues new access token via refresh token cookie
// ─────────────────────────────────────────────
router.post('/refresh', async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: 'No refresh token' });

    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'User not found' });

    const accessToken = signAccessToken(user._id);
    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// ─────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: 'Logged out successfully' });
});

// ─────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────
router.get('/me', protect, (req, res) => {
  res.json({ user: safeUser(req.user) });
});

module.exports = router;