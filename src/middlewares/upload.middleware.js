// src/middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const ALLOWED_MIME_TYPES = {
    'image/jpeg': '.jpeg',
    'image/png': '.png',
    'image/webp': '.webp'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        // Enforce safe extension derived strictly from verified MIME mapping
        const safeExt = ALLOWED_MIME_TYPES[file.mimetype] || '.jpeg';
        const uniqueSuffix = 'image-' + Date.now() + '-' + crypto.randomBytes(6).toString('hex');
        cb(null, uniqueSuffix + safeExt);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB max per file
        files: 1
    },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES[file.mimetype]) {
            return cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
        }
        // Defense-in-depth: Reject mismatched client extensions
        const clientExt = path.extname(file.originalname).toLowerCase();
        const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
        if (!allowedExts.includes(clientExt)) {
            return cb(new Error('Invalid file extension for uploaded image.'));
        }
        cb(null, true);
    }
});

module.exports = upload;
