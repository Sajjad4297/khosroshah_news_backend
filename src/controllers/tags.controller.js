// src/controllers/tags.controller.js
const { createTag, readTags } = require('../models/tags.model');

function slugify(name) {
    if (!name || typeof name !== 'string') return '';
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // replace spaces with dashes
        .replace(/[^\w\-]+/g, '')   // remove non-word characters
        .replace(/\-\-+/g, '-');    // replace multiple dashes
}

exports.postTag = async (req, res) => {
    try {
        const { title, name } = req.body || {};
        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
        }
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
        }

        const cleanTitle = title.trim();
        const slug = slugify(name);

        if (!slug) {
            return res.status(400).json({ error: 'Name produced an invalid slug' });
        }

        const tag = await createTag(cleanTitle, slug);
        return res.status(201).json({
            success: true,
            data: {
                tag
            },
        });
    } catch (error) {
        console.error('postTag error:', error);
        return res.status(500).json({ error: 'Failed to create tag' });
    }
};

exports.getTags = async (req, res) => {
    try {
        const tags = await readTags();
        return res.json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        return res.status(500).json({ error: 'Failed to fetch tags' });
    }
};
