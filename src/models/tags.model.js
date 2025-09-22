const db = require('../config/db');

const createTag = async (title, name) => {
    try {
        const sql = 'INSERT INTO tags (title, name) VALUES (?, ?)';
        const [result] = await db.execute(sql, [title,name]);
    } catch (error) {
        throw error;
    }
}
const readTags = async () => {
    try {
        const sql = 'SELECT * FROM tags';
        const [result] = await db.execute(sql);
        return result;

    } catch (error) {
        throw error;

    }
}
module.exports = {
    createTag,
    readTags
};
