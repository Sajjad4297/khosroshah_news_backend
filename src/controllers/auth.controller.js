// src/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const { getJwtSecret, verifyAdminCredentials } = require('../config/auth.config');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body || {};
        if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ status: "failed", message: 'Username and password are required' });
        }

        if (verifyAdminCredentials(username, password)) {
            const token = jwt.sign({ username }, getJwtSecret(), { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
                maxAge: 3600000, // 1 hour
            });

            return res.status(200).json({ status: "success", message: 'Login successful' });
        } else {
            return res.status(401).json({ status: "failed", message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ status: "failed", message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        });
        return res.json({ message: 'Logged out' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ status: "failed", message: 'Internal server error' });
    }
};

exports.me = async (req, res) => {
    try {
        return res.json({
            message: 'logged in',
            user: req.user?.username || 'admin'
        });
    } catch (error) {
        console.error('Me error:', error);
        return res.status(500).json({ status: "failed", message: 'Internal server error' });
    }
};
