// src/controllers/news.controller.js
const fs = require('fs');
const {
    createNews,
    readNewsOverView,
    readNewsById,
    readNewsByTopic,
    readNewsBySubTopic,
    readNewsByTag,
    readNewsOverViewByVisit,
    deleteNewsById,
    readNewsAll
} = require('../models/news.model');

function safeJsonParse(val, fallback = []) {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    if (typeof val !== 'string') return fallback;
    try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

exports.postNews = async (req, res) => {
    const uploadedFilePath = req.file?.path;
    try {
        const { title, content, top_title, lead, writer, source, tags, topics, subTopics, date } = req.body;
        const image = req.file?.filename;

        if (!image) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        if (!title || typeof title !== 'string' || !title.trim()) {
            if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
                try { fs.unlinkSync(uploadedFilePath); } catch (e) { /* ignore */ }
            }
            return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
        }

        const parsedTags = safeJsonParse(tags);
        const parsedTopics = safeJsonParse(topics);
        const parsedSubTopics = safeJsonParse(subTopics);

        const newsId = await createNews(
            title.trim(),
            typeof content === 'string' ? content : '',
            image,
            typeof top_title === 'string' ? top_title : '',
            typeof lead === 'string' ? lead : '',
            typeof writer === 'string' ? writer : '',
            typeof source === 'string' ? source : '',
            date || new Date(),
            parsedTags,
            parsedTopics,
            parsedSubTopics
        );

        return res.status(201).json({
            success: true,
            data: { id: newsId },
        });
    } catch (error) {
        if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
            try { fs.unlinkSync(uploadedFilePath); } catch (e) { /* ignore */ }
        }
        console.error('postNews error:', error);
        return res.status(500).json({ error: 'Failed to create news article' });
    }
};

exports.getNewsOverView = async (req, res) => {
    try {
        const news = await readNewsOverView();
        return res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        console.error('Error fetching news overview:', error);
        return res.status(500).json({ error: 'Failed to fetch news overview' });
    }
};

exports.getNewsOverViewByVisit = async (req, res) => {
    try {
        const news = await readNewsOverViewByVisit();
        return res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        console.error('Error fetching news overview by visits:', error);
        return res.status(500).json({ error: 'Failed to fetch news overview' });
    }
};

exports.getNewsById = async (req, res) => {
    try {
        const newsId = req.params.id;
        if (!newsId || isNaN(newsId)) {
            return res.status(400).json({ error: 'Invalid news ID' });
        }
        const news = await readNewsById(parseInt(newsId, 10));
        if (!news) {
            return res.status(404).json({ error: 'News article not found' });
        }
        return res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        console.error('Error fetching news by ID:', error);
        return res.status(500).json({ error: 'Failed to fetch news' });
    }
};

exports.getNewsByTopic = async (req, res) => {
    try {
        const topicSlug = req.params.slug;
        if (!topicSlug || typeof topicSlug !== 'string') {
            return res.status(400).json({ error: 'Invalid topic slug' });
        }
        const news = await readNewsByTopic(topicSlug);
        return res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        console.error('Error fetching news by topic:', error);
        return res.status(500).json({ error: 'Failed to fetch news' });
    }
};

exports.getNewsBySubTopic = async (req, res) => {
    try {
        const subTopicSlug = req.params.slug;
        if (!subTopicSlug || typeof subTopicSlug !== 'string') {
            return res.status(400).json({ error: 'Invalid subtopic slug' });
        }
        const news = await readNewsBySubTopic(subTopicSlug);
        return res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        console.error('Error fetching news by subtopic:', error);
        return res.status(500).json({ error: 'Failed to fetch news' });
    }
};

exports.getNewsByTag = async (req, res) => {
    try {
        const tagSlug = req.params.slug;
        if (!tagSlug || typeof tagSlug !== 'string') {
            return res.status(400).json({ error: 'Invalid tag slug' });
        }
        const news = await readNewsByTag(tagSlug);
        return res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        console.error('Error fetching news by tag:', error);
        return res.status(500).json({ error: 'Failed to fetch news' });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const newsId = req.params.id;
        if (!newsId || isNaN(newsId)) {
            return res.status(400).json({ error: 'Invalid news ID' });
        }
        const deleted = await deleteNewsById(parseInt(newsId, 10));
        if (!deleted) {
            return res.status(404).json({ error: 'News article not found' });
        }
        return res.json({
            success: true,
            message: 'News deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting news:', error);
        return res.status(500).json({ error: 'Failed to delete news' });
    }
};

exports.getNewsAll = async (req, res) => {
    try {
        const news = await readNewsAll();
        return res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        console.error('Error fetching all news:', error);
        return res.status(500).json({ error: 'Failed to fetch news' });
    }
};
