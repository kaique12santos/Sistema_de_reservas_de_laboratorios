import db from '../config/Database.js';

class FeedbackRepository {
  /**
   * Insere um novo registro de feedback no banco de dados
   */
  async create(data) {
    const query = `
      INSERT INTO logs_feedback (user_id, feature, rating, comment)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.connection.query(query, [
      data.user_id,
      data.feature,
      data.rating,
      data.comment || null
    ]);
    return result.insertId;
  }
}

export default new FeedbackRepository();