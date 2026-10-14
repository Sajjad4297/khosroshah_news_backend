// src/routes/auth.route.js
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/auth.middleware');
const { loginRateLimiter } = require('../middlewares/rateLimiter.middleware');
const { login, logout, me } = require('../controllers/auth.controller');

router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticateJWT, me);

module.exports = router;
