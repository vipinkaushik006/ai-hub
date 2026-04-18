require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");


const app = express();

// ✅ Trust exactly one proxy hop (Vercel / Render / Railway all use 1)
app.set("trust proxy", 1);

// ─────────────────────────────────────────────
// Security middleware
// ─────────────────────────────────────────────
app.use(helmet());

// ✅ CORS origin from env — never hardcode production URLs in source
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  }),
);

// ✅ Fail fast — never silently fall back to wrong DB or weak secrets
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be set in environment variables");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in environment variables");
}

// ✅ Tight body limit — 100kb is plenty for blog content and API payloads
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// ─────────────────────────────────────────────
// Rate limiting
// ─────────────────────────────────────────────

// ✅ Global safety net — generous, just prevents extreme abuse
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Tighter limiter for read-heavy public routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", globalLimiter);

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tools", apiLimiter, require("./routes/tools"));
app.use("/api/blogs", apiLimiter, require("./routes/blogs"));
app.use("/api/analytics", apiLimiter, require("./routes/analytics"));
app.use("/api/users", require("./routes/users"));

// ✅ Health check — useful info, protected by global limiter
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/tools/trending", (req, res) => {
  res.json([
    {
      name: "ChatGPT",
      category: "AI",
      rating: 4.8,
    },
    {
      name: "Midjourney",
      category: "Image AI",
      rating: 4.7,
    },
  ]);
});

// ─────────────────────────────────────────────
// 404 handler — must be after all routes
// ─────────────────────────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─────────────────────────────────────────────
// Global error handler
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    err,
  );

  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({ error: err.message });
  }

  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body too large" });
  }

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;
  res.status(err.status || 500).json({ error: message });
});

// ─────────────────────────────────────────────
// DB connection + server startup
// ─────────────────────────────────────────────
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log("✅ MongoDB connected");
};

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(
        `🚀 Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`,
      );
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n${signal} received — shutting down gracefully`);

      server.close(async () => {
        console.log("🔌 HTTP server closed");
        await mongoose.connection.close();
        console.log("🔌 MongoDB connection closed");
        process.exit(0);
      });

      setTimeout(() => {
        console.error("⚠️  Forced shutdown after timeout");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });