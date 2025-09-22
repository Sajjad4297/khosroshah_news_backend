const express = require('express');
const router = express.Router();
const {getNewsOverView,getNewsOverViewByVisit} = require('../controllers/news.controller')

router.get('/' , getNewsOverView);

router.get('/byVisit' , getNewsOverViewByVisit);


//router.get('/', getNews);

module.exports = router;
