// src/routes/tags.route.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const authenticateJWT = require('../middlewares/auth.middleware');
const { postTag, getTags } = require('../controllers/tags.controller');

// Public read routes
router.get('/', getTags);

// Protected mutation routes (authenticated admins only)
router.post('/', authenticateJWT, upload.none(), postTag);

module.exports = router;
