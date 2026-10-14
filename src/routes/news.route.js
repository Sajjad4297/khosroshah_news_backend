// src/routes/news.route.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const authenticateJWT = require('../middlewares/auth.middleware');
const {
    postNews,
    getNewsById,
    getNewsByTopic,
    getNewsBySubTopic,
    getNewsByTag,
    deleteNews,
    getNewsAll
} = require('../controllers/news.controller');

// Public read routes
router.get('/all', getNewsAll);
router.get('/:id', getNewsById);
router.get('/byTopic/:slug', getNewsByTopic);
router.get('/bySubTopic/:slug', getNewsBySubTopic);
router.get('/byTag/:slug', getNewsByTag);

// Protected mutation routes (authenticated admins only)
router.post('/', authenticateJWT, upload.single('image'), postNews);
router.delete('/:id', authenticateJWT, deleteNews);

module.exports = router;
