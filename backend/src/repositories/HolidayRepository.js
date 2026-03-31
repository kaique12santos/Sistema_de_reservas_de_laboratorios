import db from '../config/database.js';

class HolidayRepository {
  async findByCycle(cycleId) {
    const [rows] = await db.connection.query(
      'SELECT * FROM holidays WHERE cycle_id = ? ORDER BY date ASC',
      [cycleId]
    );
    return rows;
  }

  /**
   * @param {string} date - A data a ser pesquisada.
   * @param {number} cycleId - O ID do ciclo acadêmico.
   * @returns {Promise<Object|null>} O feriado encontrado ou null.
   */
  async findByDateAndCycle(date, cycleId) {
    const [rows] = await db.connection.query(
      'SELECT * FROM holidays WHERE date = ? AND cycle_id = ?',
      [date, cycleId]
    );
    return rows[0] || null;
  }

  async deleteByCycle(cycleId) {
    const [result] = await db.connection.query(
      'DELETE FROM holidays WHERE cycle_id = ?',
      [cycleId]
    );
    return result;
  }

  /**
   * Cria múltiplos feriados de uma vez.
   * @param {Array<Object>} holidays - Lista de feriados a serem criados.
   * @returns {Promise<Array>} Lista dos feriados criados.
   */
  async bulkCreate(holidays) {
    if (!holidays || holidays.length === 0) return [];

    // Monta a query para inserção múltipla: INSERT INTO ... VALUES (?, ?, ?), (?, ?, ?)
    const values = holidays.map(h => [h.cycle_id, h.date, h.description]);
    const [result] = await db.connection.query(
      'INSERT INTO holidays (cycle_id, date, description) VALUES ?',
      [values]
    );
    return result;
  }
}

export default new HolidayRepository();