const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const {postNews,getNewsById,getNewsByTopic,getNewsBySubTopic,getNewsByTag,deleteNews,getNewsAll} = require('../controllers/news.controller')

router.post('/' , upload.single('image'), postNews);

router.get('/all', getNewsAll);

router.get('/:id', getNewsById);

router.get('/byTopic/:slug', getNewsByTopic);

router.get('/bySubTopic/:slug', getNewsBySubTopic);

router.delete('/:id', deleteNews);

router.get('/byTag/:slug', getNewsByTag)

module.exports = router;
