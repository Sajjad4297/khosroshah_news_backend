const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';



exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username === "sajy" && password === "sajy") {
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only HTTPS in prod
                sameSite: 'none',
                maxAge: 3600000, // 1 hour
            });

            return res.status(200).json({ status: "success", message: 'Login successful' });
        } else {
            return res.status(401).json({ status: "failed", message: 'Invalid username or password' })
        }
    } catch (error) {
        console.error(error)
    }
}
exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.json({ message: 'Logged out' });
    } catch (error) {
        console.error(error)
    }
}
exports.me = async (req, res) => {
    try {
        res.json({ message:'logged in',user:"admin" });
    } catch (error) {
        console.error(error)
    }
}
