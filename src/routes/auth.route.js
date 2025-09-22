const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/auth.middleware');
const { login,logout,me } = require('../controllers/auth.controller')

router.post('/login', login);

router.post('/logout', logout);

router.get('/me',authenticateJWT, me);
module.exports = router;
