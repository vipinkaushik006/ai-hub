require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const app = express();

// ✅ FIX: trust proxy enable (IMPORTANT)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(cors({
origin: process.env.FRONTEND_URL || 'http://localhost:3000',
credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: 100,
message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tools', require('./routes/tools'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// MongoDB connection
const connectDB = async () => {
try {
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aihub');
console.log('✅ MongoDB connected');
} catch (err) {
console.error('❌ MongoDB connection error:', err.message);
process.exit(1);
}
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
});
});
