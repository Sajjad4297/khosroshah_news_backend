const db = require('../config/db');

const readTopics = async () => {
    try {
        const sql = `
        SELECT
        t.id AS topicId,
        t.title AS topicTitle,
        t.name AS topicName,
        s.id AS subTopicId,
        s.title AS subTopicTitle,
        s.name AS subTopicName
        FROM topics t
        LEFT JOIN sub_topics s ON t.id = s.topic_id
        `;
        const [rows] = await db.execute(sql);
        const topicsMap = {};

        rows.forEach(row => {
            const { topicId, topicName, subTopicId, subTopicName,subTopicTitle,topicTitle } = row;

            if (!topicsMap[topicId]) {
                topicsMap[topicId] = {
                    id: topicId,
                    name: topicName,
                    title: topicTitle,
                    subTopics: []
                };
            }

            if (subTopicId) {
                topicsMap[topicId].subTopics.push({
                    id: subTopicId,
                    title:subTopicTitle,
                    name: subTopicName
                });
            }
        });

        const topicsWithSubtopics = Object.values(topicsMap);

        return(topicsWithSubtopics);


    } catch (error) {
        throw error;

    }
}

module.exports = {
    readTopics
};
