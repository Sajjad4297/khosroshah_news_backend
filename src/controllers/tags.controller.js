const { createTag, readTags } = require('../models/tags.model')

exports.postTag = async (req, res) => {
    try {
        console.log(req.body)
        const { title, name } = req.body;
        const tags = await createTag(title, slugify(name));
        res.json({
            success: true,
            data: {
                tags
            },
        });

    } catch (error) {
        console.error('post error:', error);
        res.status(500).json({ error: 'post failed' });
    }
}
exports.getTags = async (req, res) => {
    try {
        const news = await readTags();
        res.json({
            success: true,
            data:
                news
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
}
function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // replace spaces with dashes
    .replace(/[^\w\-]+/g, '')   // remove non-word characters
    .replace(/\-\-+/g, '-');    // replace multiple dashes
}
