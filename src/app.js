// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { apiRateLimiter } = require('./middlewares/rateLimiter.middleware');

const newsRoutes = require('./routes/news.route');
const tagsRouter = require('./routes/tags.route');
const topicRouter = require('./routes/topics.route');
const newsOverViewRouter = require('./routes/newsOverView.route');
const authRouter = require('./routes/auth.route');

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS Configuration
const defaultOrigins = ['http://localhost:4000', 'https://backend.navayetabriz.ir'];
const envOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
  : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));

// General rate limiter for public API endpoints
app.use('/api', apiRateLimiter);

// Parsers with bounded payload limits
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Static uploads with nosniff and restrictive CSP
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  setHeaders: (res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
  }
}));

// Application routes
app.use('/auth', authRouter);
app.use('/api/news', newsRoutes);
app.use('/api/tags', tagsRouter);
app.use('/api/topics', topicRouter);
app.use('/api/news-over-view', newsOverViewRouter);

// 404 Handler for unmatched endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : (err.message || 'Server error')
  });
});

module.exports = app;
