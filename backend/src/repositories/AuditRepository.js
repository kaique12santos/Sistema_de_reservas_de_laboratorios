import db from '../config/Database.js';

class AuditRepository {
  /**
   * Insere um novo registro de auditoria
   */
  async create(data, connection = null) {
    const conn = connection || db.connection;
    const query = `
      INSERT INTO audit_logs (action, table_name, record_id, changed_by, old_values, new_values, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await conn.query(query, [
      data.action,
      data.table_name,
      data.record_id,
      data.changed_by,
      data.old_values ? JSON.stringify(data.old_values) : null,
      data.new_values ? JSON.stringify(data.new_values) : null
    ]);
  }

  /**
   * Busca o histórico de um registro específico
   */
  async findByRecord(tableName, recordId) {
    const query = `
      SELECT a.*, u.name as user_name 
      FROM audit_logs a
      LEFT JOIN users u ON u.id = a.changed_by
      WHERE a.table_name = ? AND a.record_id = ?
      ORDER BY a.timestamp DESC
    `;
    const [rows] = await db.connection.query(query, [tableName, recordId]);
    return rows;
  }

  /**
   * Busca as últimas ações de um usuário
   */
  async findByUser(userId, limit = 50) {
    const query = `
      SELECT * FROM audit_logs 
      WHERE changed_by = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    const [rows] = await db.connection.query(query, [userId, limit]);
    return rows;
  }

  /**
   * Busca os logs gerais do sistema para o painel de auditoria do Suporte
   */
  async findAll(limit = 200) {
    const query = `
      SELECT a.*, u.name as user_name 
      FROM audit_logs a
      LEFT JOIN users u ON u.id = a.changed_by
      ORDER BY a.timestamp DESC
      LIMIT ?
    `;
    const [rows] = await db.connection.query(query, [limit]);
    return rows;
  }

}

export default new AuditRepository();