import db from '../config/database.js';

class AcademicCycleRepository {

   /**
    * @returns {Promise<Array>} - Retorna uma lista de todos os ciclos acadêmicos ordenados por nome (do mais recente para o mais antigo) 
    */ 
  async findAll() {
    const [rows] = await db.connection.query('SELECT * FROM academic_cycles ORDER BY name DESC');
    return rows;
  }

  async findById(id) {
    const [rows] = await db.connection.query('SELECT * FROM academic_cycles WHERE id = ?', [id]);
    return rows[0] || null;
  }

  /**
   * @returns {Promise<Object|null>} - Retorna o ciclo ativo ou null se não houver ciclo ativo 
   */
  async findActive() {
    const [rows] = await db.connection.query('SELECT * FROM academic_cycles WHERE is_active = true LIMIT 1');
    return rows[0] || null;
  }

  /**
   * @returns {Promise<Object|null>} - Retorna o último ciclo criado ou null se não houver ciclos 
   */
  async findLatest() {
    // Busca o último ciclo gerado ordenando pelo nome (ex: 2026-2 vem antes de 2026-1 no DESC)
    const [rows] = await db.connection.query('SELECT * FROM academic_cycles ORDER BY name DESC LIMIT 1');
    return rows[0] || null;
  }

  /**
   * @param {Object} data - Dados do ciclo acadêmico a ser criado 
   * @returns {Promise<Object>} - Retorna o ciclo criado com seu ID e status de ativo (sempre false ao criar)
   */
  async create(data) {
    const [result] = await db.connection.query(
      'INSERT INTO academic_cycles (name, start_date, end_date, admin_exclusive_end_date, is_active) VALUES (?, ?, ?, ?, false)',
      [data.name, data.start_date, data.end_date, data.admin_exclusive_end_date]
    );
    return { id: result.insertId, ...data, is_active: false };
  }

  /**
   * @param {number} id - ID do ciclo a ser ativado
   * @returns {Promise<void>} 
   */
  async activate(id) {
    const connection = await db.connection.getConnection();
    try {
      await connection.beginTransaction();
      // Desativa todos
      await connection.query('UPDATE academic_cycles SET is_active = false');
      // Ativa apenas o solicitado
      await connection.query('UPDATE academic_cycles SET is_active = true WHERE id = ?', [id]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new AcademicCycleRepository();