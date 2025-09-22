const db = require('../config/db');

const createNews = async (title, content, image, top_title, lead, writer, source, news_date, tags = [], topics = [], subTopics = []) => {
    try {
        // Insert main news record
        const sql = `
            INSERT INTO news (title, content, image, top_title, news_lead, writer, news_source, news_date , visits)
            VALUES (?, ?, ?, ?, ?, ?, ?, ? , ?)
        `;
        const [result] = await db.execute(sql, [title, content, image, top_title, lead, writer, source, news_date, 0]);
        const newsId = result.insertId;

        const queries = [];

        // Insert multiple tags in one query
        if (tags.length) {
            const tagValues = tags.map(() => '(?, ?)').join(', ');
            const tagParams = tags.flatMap(tagId => [newsId, tagId]);
            queries.push(db.execute(`INSERT INTO news_to_tags (news_id, tag_id) VALUES ${tagValues}`, tagParams));
        }

        // Insert multiple topics in one query
        if (topics.length) {
            const topicValues = topics.map(() => '(?, ?)').join(', ');
            const topicParams = topics.flatMap(topicId => [newsId, topicId]);
            queries.push(db.execute(`INSERT INTO news_to_topics (news_id, topic_id) VALUES ${topicValues}`, topicParams));
        }

        // Insert multiple subTopics in one query
        if (subTopics.length) {
            const subTopicValues = subTopics.map(() => '(?, ?)').join(', ');
            const subTopicParams = subTopics.flatMap(subTopicId => [newsId, subTopicId]);
            queries.push(db.execute(`INSERT INTO news_to_sub_topics (news_id, sub_topic_id) VALUES ${subTopicValues}`, subTopicParams));
        }

        await Promise.all(queries);
        return newsId;

    } catch (error) {
        console.error('Error creating news:', error);
        throw error;
    }
};



const readNewsAll = async () => {
    try {
        const sql = `
        SELECT
          n.id, n.title, n.image, n.top_title, n.news_date, n.news_lead, n.visits,n.createdAt,
          top.id AS topic_id, top.name AS topic_name, top.title AS topic_title
        FROM news AS n
        LEFT JOIN news_to_topics AS nt ON n.id = nt.news_id
        LEFT JOIN topics AS top ON nt.topic_id = top.id
        ORDER BY n.news_date DESC
        LIMIT 50
      `;

        const [rows] = await db.execute(sql);

        const newsMap = {};

        rows.forEach(row => {
            const { id, title, image, top_title, news_date, news_lead, visits, topic_id, topic_name, topic_title,createdAt } = row;

            if (!newsMap[id]) {
                newsMap[id] = {
                    id,
                    title,
                    image,
                    top_title,
                    news_date,
                    news_lead,
                    visits,
                    createdAt,
                    topics: []
                };
            }

            if (topic_id) {
                newsMap[id].topics.push({
                    id: topic_id,
                    name: topic_name?.trim(),
                    title: topic_title?.trim()
                });
            }
        });

        return Object.values(newsMap);
    } catch (error) {
        throw error;
    }
}
const readNewsOverView = async () => {
    try {
        const sql = `
            SELECT
                n.id, n.title, n.image, n.top_title, n.news_date, n.news_lead, n.visits,
                top.id AS topic_id, top.name AS topic_name, top.title AS topic_title
            FROM news AS n
            LEFT JOIN news_to_topics AS nt ON n.id = nt.news_id
            LEFT JOIN topics AS top ON nt.topic_id = top.id
            ORDER BY n.news_date DESC
            LIMIT 20; 
        `;

        const [rows] = await db.execute(sql);
        const newsMap = {};

        rows.forEach(row => {
            const { id, title, image, top_title, news_date, news_lead, visits, topic_id, topic_name, topic_title } = row;

            if (!newsMap[id]) {
                newsMap[id] = {
                    id,
                    title,
                    image,
                    top_title,
                    news_date,
                    news_lead,
                    visits,
                    topics: []
                };
            }

            if (topic_id && topic_name) {
                newsMap[id].topics.push({
                    id: topic_id,
                    name: topic_name.trim(),
                    title: topic_title ? topic_title.trim() : null
                });
            }
        });

        return Object.values(newsMap);

    } catch (error) {
        console.error('Error in readNewsOverView with topics:', error);
        throw error;
    }
};
const readNewsOverViewByVisit = async () => {
    try {
        const sql = 'SELECT n.id, n.title, n.image, n.top_title, n.news_date , n.news_lead , n.visits FROM news AS n ORDER BY n.visits DESC LIMIT 12';
        const [result] = await db.execute(sql);
        return result;

    } catch (error) {
        throw error;

    }
}

const readNewsById = async (newsId) => {
    try {
        const sql = `
            SELECT
                n.id, n.title, n.content, n.image, n.top_title, n.news_lead, n.writer, n.news_source, n.news_date,
                GROUP_CONCAT(DISTINCT CONCAT(nt.tag_id, ':', t.name , ':' , t.title)) AS tags,
                GROUP_CONCAT(DISTINCT CONCAT(tp.topic_id, ':', top.name, ':' , top.title)) AS topics,
                GROUP_CONCAT(DISTINCT CONCAT(st.sub_topic_id, ':', stp.name , ':' , stp.title)) AS subTopics
            FROM news AS n
            LEFT JOIN news_to_tags AS nt ON n.id = nt.news_id
            LEFT JOIN tags AS t ON nt.tag_id = t.id
            LEFT JOIN news_to_topics AS tp ON n.id = tp.news_id
            LEFT JOIN topics AS top ON tp.topic_id = top.id
            LEFT JOIN news_to_sub_topics AS st ON n.id = st.news_id
            LEFT JOIN sub_topics AS stp ON st.sub_topic_id = stp.id
            WHERE n.id = ?
            GROUP BY n.id
        `;
        await db.execute('UPDATE news SET visits = visits + 1 WHERE id = ?', [newsId]);
        const [result] = await db.execute(sql, [newsId]);
        const news = {
            ...result[0],
            tags: result[0].tags ? result[0].tags.split(',').map(tag => {
                const [id, name, title] = tag.split(':');
                return { id: parseInt(id, 10), name, title };
            }) : [],
            topics: result[0].topics ? result[0].topics.split(',').map(topic => {
                const [id, name, title] = topic.split(':');
                return { id: parseInt(id, 10), name, title };
            }) : [],
            subTopics: result[0].subTopics ? result[0].subTopics.split(',').map(subTopic => {
                const [id, name, title] = subTopic.split(':');
                return { id: parseInt(id, 10), name, title };
            }) : [],
        };
        return news;

    } catch (error) {
        throw error;
    }
};
const readNewsByTopic = async (slug) => {
    try {
        // Step 1: Get tag ID from slug
        const [Result] = await db.execute(
            'SELECT id , title FROM topics WHERE name = ?',
            [slug]
        );

        if (Result.length === 0) {
            // Tag not found
            return [];
        }

        const id = Result[0].id;
        const title = Result[0].title;
        // Step 2: Get news by tag ID
        const [newsResult] = await db.execute(
            `
            SELECT n.id, n.title, n.image, n.top_title, n.news_date,news_lead
            FROM news AS n
            JOIN news_to_topics AS nt ON n.id = nt.news_id
            WHERE nt.topic_id = ?
            `,
            [id]
        );

        // Step 3: Sort by news_date descending
        newsResult.sort((b, a) => a.news_date - b.news_date)

        return { news: newsResult, title: title };

    } catch (error) {
        throw error;
    }
}
const readNewsBySubTopic = async (slug) => {
    try {
        // Step 1: Get tag ID from slug
        const [Result] = await db.execute(
            'SELECT id , title FROM sub_topics WHERE name = ?',
            [slug]
        );

        if (Result.length === 0) {
            // Tag not found
            return [];
        }

        const id = Result[0].id;
        const title = Result[0].title;

        // Step 2: Get news by tag ID
        const [newsResult] = await db.execute(
            `
            SELECT n.id, n.title, n.image, n.top_title, n.news_date,news_lead
            FROM news AS n
            JOIN news_to_sub_topics AS ns ON n.id = ns.news_id
            WHERE ns.sub_topic_id = ?
            `,
            [id]
        );

        // Step 3: Sort by news_date descending
        newsResult.sort((b, a) => a.news_date - b.news_date)

        return { news: newsResult, title: title };

    } catch (error) {
        throw error;
    }
};
const readNewsByTag = async (slug) => {
    try {
        // Step 1: Get tag ID from slug
        const [Result] = await db.execute(
            'SELECT id,title FROM tags WHERE name = ? ',
            [slug]
        );

        if (Result.length === 0) {
            // Tag not found
            return [];
        }

        const tagId = Result[0].id;
        const title = Result[0].title;

        // Step 2: Get news by tag ID
        const [newsResult] = await db.execute(
            `
            SELECT n.id, n.title, n.image, n.top_title, n.news_date,news_lead
            FROM news AS n
            JOIN news_to_tags AS nt ON n.id = nt.news_id
            WHERE nt.tag_id = ?
            `,
            [tagId]
        );

        // Step 3: Sort by news_date descending
        newsResult.sort((b, a) => a.news_date - b.news_date)

        return { news: newsResult, title: title };

    } catch (error) {
        throw error;
    }
};
const deleteNewsById = async (id) => {
    try {
        await db.execute(
            'DELETE FROM news WHERE id = ?',
            [id]
        );



    } catch (error) {
        throw error;
    }

}
module.exports = {
    createNews,
    readNewsOverView,
    readNewsById,
    readNewsByTopic,
    readNewsBySubTopic,
    readNewsByTag,
    readNewsOverViewByVisit,
    deleteNewsById,
    readNewsAll
};
