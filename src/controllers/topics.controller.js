const { readTopics } = require('../models/topics.model')

exports.getTopics = async (req, res) => {
    try {
        const topics = await readTopics();
        res.json({
            success: true,
            data:
                topics
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
}
