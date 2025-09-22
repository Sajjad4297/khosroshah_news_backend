// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function authenticateJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Invalid Authenticate' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // You can access user info in your route
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid Authenticate' });
    }
}

module.exports = authenticateJWT;
