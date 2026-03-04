import db from '../config/Database.js';

class DepartmentRepository {
  async findAll() {
    const [rows] = await db.connection.query('SELECT id, name, code FROM departments ORDER BY name ASC');
    return rows;
  }
}

export default new DepartmentRepository();