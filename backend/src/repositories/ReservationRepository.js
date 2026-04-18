import db from '../config/Database.js';

class ReservationRepository {
  async findConflicting(labId, date, timeSlotIds) {
    const placeholders = timeSlotIds.map(() => '?').join(',');

    const query = `
      SELECT ri.*, r.id as reservation_id, r.user_id, r.status as reservation_status
      FROM reservation_items ri
      INNER JOIN reservations r ON r.id = ri.reservation_id
      WHERE ri.lab_id = ?
        AND ri.date = ?
        AND ri.time_slot_id IN (${placeholders})
        AND ri.status = 'ACTIVE'
        AND r.status IN ('APPROVED', 'PENDING')
    `;

    const [rows] = await db.connection.query(query, [
      labId,
      date,
      ...timeSlotIds
    ]);

    return rows;
  }

  async findByProfessorAndDateRange(professorId, startDate, endDate) {
    const query = `
      SELECT r.*, ri.date, ri.time_slot_id, ri.lab_id, ri.status as item_status
      FROM reservations r
      INNER JOIN reservation_items ri ON ri.reservation_id = r.id
      WHERE r.user_id = ?
        AND ri.date BETWEEN ? AND ?
      ORDER BY ri.date ASC, ri.time_slot_id ASC
    `;

    const [rows] = await db.connection.query(query, [
      professorId,
      startDate,
      endDate
    ]);

    return rows;
  }

  async create(reservationData, connection = null) {
    const conn = connection || db.connection;
    const query = `
      INSERT INTO reservations (user_id, lab_id, cycle_id, type, status, created_at, updated_at)
      VALUES (?, ?, ?, 'SINGLE', 'APPROVED', NOW(), NOW())
    `;
    const [result] = await conn.query(query, [
      reservationData.user_id,
      reservationData.lab_id,
      reservationData.cycle_id
    ]);
    return result.insertId;
  }

  async createItem(itemData, connection = null) {
    const conn = connection || db.connection;
    const query = `
      INSERT INTO reservation_items (reservation_id, lab_id, date, time_slot_id, start_time, end_time, note, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', NOW())
    `;
    const [result] = await conn.query(query, [
      itemData.reservation_id,
      itemData.lab_id,
      itemData.date,
      itemData.time_slot_id,
      itemData.start_time,
      itemData.end_time,
      itemData.note || null
    ]);
    return result.insertId;
  }

  async findById(id) {
    const query = `
      SELECT r.*, u.name as professor_name, l.name as lab_name, ac.name as cycle_name
      FROM reservations r
      INNER JOIN users u ON u.id = r.user_id
      INNER JOIN laboratories l ON l.id = r.lab_id
      INNER JOIN academic_cycles ac ON ac.id = r.cycle_id
      WHERE r.id = ?
    `;
    const [rows] = await db.connection.query(query, [id]);
    return rows[0];
  }

  async findByProfessor(professorId) {
    const query = `
      SELECT r.*, ri.date, ri.time_slot_id, ri.lab_id, ri.status as item_status, ri.note,
             ts.name as time_slot_name, ts.start_time, ts.end_time,
             l.name as lab_name, ac.name as cycle_name
      FROM reservations r
      INNER JOIN reservation_items ri ON ri.reservation_id = r.id
      INNER JOIN time_slots ts ON ts.id = ri.time_slot_id
      INNER JOIN laboratories l ON l.id = r.lab_id
      INNER JOIN academic_cycles ac ON ac.id = r.cycle_id
      WHERE r.user_id = ?
        AND ri.status = 'ACTIVE'
      ORDER BY ri.date DESC, ts.start_time ASC
    `;
    const [rows] = await db.connection.query(query, [professorId]);
    return rows;
  }

  async createAuditLog(action, tableName, recordId, changedBy, oldValues = null, newValues = null, connection = null) {
    const conn = connection || db.connection;
    const query = `
      INSERT INTO audit_logs (action, table_name, record_id, changed_by, old_values, new_values, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    await conn.query(query, [
      action,
      tableName,
      recordId,
      changedBy,
      oldValues ? JSON.stringify(oldValues) : null,
      newValues ? JSON.stringify(newValues) : null
    ]);
  }
}

export default new ReservationRepository();