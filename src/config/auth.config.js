// src/config/auth.config.js
const crypto = require('crypto');

let ephemeralDevSecret = null;

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (secret && secret !== 'your-secret-key') {
        return secret;
    }

    if (process.env.NODE_ENV === 'production') {
        throw new Error('FATAL: JWT_SECRET environment variable must be set to a secure secret in production!');
    }

    if (!ephemeralDevSecret) {
        console.warn('⚠️  [SECURITY WARNING] JWT_SECRET is unset or using default placeholder. Using an ephemeral random secret for this session.');
        ephemeralDevSecret = crypto.randomBytes(32).toString('hex');
    }
    return ephemeralDevSecret;
}

function timingSafeMatch(candidate, expected) {
    if (typeof candidate !== 'string' || typeof expected !== 'string') {
        return false;
    }
    const bufCandidate = crypto.createHash('sha256').update(candidate).digest();
    const bufExpected = crypto.createHash('sha256').update(expected).digest();
    return crypto.timingSafeEqual(bufCandidate, bufExpected);
}

function verifyAdminCredentials(username, password) {
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
        return false;
    }

    const expectedUser = process.env.ADMIN_USERNAME || 'admin';
    const expectedPass = process.env.ADMIN_PASSWORD;

    if (!expectedPass) {
        if (process.env.NODE_ENV === 'production') {
            console.error('FATAL: ADMIN_PASSWORD environment variable is not configured in production!');
            return false;
        }
        // In local development fallback, allow configured default with visible warning
        const devDefaultUser = 'admin';
        const devDefaultPass = 'admin';
        const userMatch = timingSafeMatch(username, devDefaultUser);
        const passMatch = timingSafeMatch(password, devDefaultPass);
        return userMatch && passMatch;
    }

    const userMatch = timingSafeMatch(username, expectedUser);
    const passMatch = timingSafeMatch(password, expectedPass);

    return userMatch && passMatch;
}

module.exports = {
    getJwtSecret,
    verifyAdminCredentials,
    timingSafeMatch,
};
