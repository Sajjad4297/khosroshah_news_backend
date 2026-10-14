// src/middlewares/rateLimiter.middleware.js
const rateLimit = require('express-rate-limit');

// Strict rate limiter for authentication endpoints (prevent brute-force)
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // 10 attempts per IP per window
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { status: 'failed', message: 'Too many authentication attempts. Please try again after 15 minutes.' },
});

// General rate limiter for public API endpoints (prevent flooding/DoS)
const apiRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 120, // 120 requests per minute per IP
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please slow down.' },
});

module.exports = {
    loginRateLimiter,
    apiRateLimiter,
};
