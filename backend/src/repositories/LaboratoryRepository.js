import db from '../config/Database.js';

class LaboratoryRepository {
  async findAll(includeInactive = false) {
    const query = includeInactive 
      ? 'SELECT * FROM laboratories ORDER BY name ASC' 
      : 'SELECT * FROM laboratories WHERE is_active = true ORDER BY name ASC';
    const [rows] = await db.connection.query(query);
    return rows;
  }

  async findById(id) {
    const [rows] = await db.connection.query('SELECT * FROM laboratories WHERE id = ?', [id]);
    return rows[0]; // Retorna undefined se não achar
  }

  async findByName(name) {
    const [rows] = await db.connection.query('SELECT * FROM laboratories WHERE name = ?', [name]);
    return rows[0];
  }

  async create(data) {
    const query = `
      INSERT INTO laboratories (name, location, capacity, description_lab, type, is_active) 
      VALUES (?, ?, ?, ?, ?, true)
    `;
    const [result] = await db.connection.query(query, [data.name, data.location, data.capacity, data.description_lab, data.type]);
    return { id: result.insertId, ...data, is_active: true };
  }

  async update(id, data) {
    const query = `
      UPDATE laboratories 
      SET name = ?, location = ?, capacity = ?, description_lab = ?, type = ? 
      WHERE id = ?
    `;
    await db.connection.query(query, [data.name, data.location, data.capacity, data.description_lab, data.type, id]);
    return { id, ...data };
  }

  async toggleStatus(id, currentStatus) {
    const newStatus = !currentStatus; // Inverte o booleano (true vira false, false vira true)
    await db.connection.query('UPDATE laboratories SET is_active = ? WHERE id = ?', [newStatus, id]);
    return { is_active: newStatus };
  }

  async hasActiveReservations(labId) {
    // Regra de negócio crítica do SQL da task
    const query = `
      SELECT COUNT(*) as count 
      FROM reservation_items 
      WHERE lab_id = ? AND date >= CURDATE() AND status = 'ACTIVE'
    `;
    const [rows] = await db.connection.query(query, [labId]);
    return rows[0].count > 0;
  }
}

export default new LaboratoryRepository();