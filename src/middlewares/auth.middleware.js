// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/auth.config');

function authenticateJWT(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

module.exports = authenticateJWT;
