const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { postTag,getTags } = require('../controllers/tags.controller')

router.post('/',upload.single(), postTag);

router.get('/', getTags);

module.exports = router;
