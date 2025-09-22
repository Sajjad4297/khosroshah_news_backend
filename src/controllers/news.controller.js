const { createNews,readNewsOverView,readNewsById,readNewsByTopic,readNewsBySubTopic,readNewsByTag,readNewsOverViewByVisit,deleteNewsById,readNewsAll } = require('../models/news.model');
exports.postNews = async (req, res) => {
    try {
        const { title, content , top_title , lead , writer , source , tags , topics , subTopics, date } = req.body;
        const image = req.file?.filename;

        if (!image) return res.status(400).json({ error: 'No image uploaded' });
        const news = await createNews(title, content, image,top_title,lead , writer , source, date , JSON.parse(tags) , JSON.parse(topics) , JSON.parse(subTopics));
        res.json({
            success: true,
            data: news,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Image upload failed' });
    }
};
exports.getNewsOverView = async (req, res) => {
    try {
        const news = await readNewsOverView();
        res.json({
            success: true,
            data:
                news
            ,
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
exports.getNewsOverViewByVisit = async (req, res) => {
    try {
        const news = await readNewsOverViewByVisit();
        res.json({
            success: true,
            data:
                news
            ,
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}

exports.getNewsById = async (req, res) => {
    try {
        const newsId = req.params.id;
        const news = await readNewsById(newsId);
        res.json({
            success: true,
            data:
                news
            ,
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
exports.getNewsByTopic = async (req, res) => {
    try {
        const topicSlug = req.params.slug;
        const news = await readNewsByTopic(topicSlug);
        res.json({
            success: true,
            data:
                news
            ,
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
exports.getNewsBySubTopic = async (req , res) => {
    try {
        const subTopicSlug = req.params.slug;
        const news = await readNewsBySubTopic(subTopicSlug);
        res.json({
            success: true,
            data:
                news
            ,
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }

}
exports.getNewsByTag = async (req , res) => {
    try {
        const tagSlug = req.params.slug;
        const news = await readNewsByTag(tagSlug);
        res.json({
            success: true,
            data:
                news
            ,
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }

}
exports.deleteNews = async (req, res) => {
    try {
        const newsId = req.params.id;
        await deleteNewsById(newsId);
        res.json({
            success: true,
            message: 'News deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting news:', error);
        res.status(500).json({ error: 'Failed to delete news' });
    }
}
exports.getNewsAll = async (req, res) => {
    try {
        const news = await readNewsAll();
        res.json({
            success: true,
            data:
                news
            ,
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
