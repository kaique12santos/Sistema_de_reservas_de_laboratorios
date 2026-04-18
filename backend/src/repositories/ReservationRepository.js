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

  async create(data) {
    const query = `
      INSERT INTO reservations (user_id, lab_id, cycle_id, type, status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.connection.query(query, [
      data.user_id,
      data.lab_id,
      data.cycle_id,
      data.type,
      data.status
    ]);
    return result.insertId;
  }

  async createItem(data) {
    const query = `
      INSERT INTO reservation_items (reservation_id, lab_id, date, time_slot_id, start_time, end_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.connection.query(query, [
      data.reservation_id,
      data.lab_id,
      data.date,
      data.time_slot_id,
      data.start_time,
      data.end_time
    ]);
    return result.insertId;
  }

  async findById(id) {
    const query = `
      SELECT r.*, ri.id as item_id, ri.date, ri.time_slot_id, ri.start_time, ri.end_time, ri.note, ri.status as item_status,
             l.name as lab_name, ts.name as time_slot_name
      FROM reservations r
      LEFT JOIN reservation_items ri ON ri.reservation_id = r.id
      LEFT JOIN laboratories l ON l.id = r.lab_id
      LEFT JOIN time_slots ts ON ts.id = ri.time_slot_id
      WHERE r.id = ?
      ORDER BY ri.date ASC, ri.start_time ASC
    `;
    const [rows] = await db.connection.query(query, [id]);
    return rows;
  }

  async findByProfessor(professorId) {
    const query = `
      SELECT r.*, ri.id as item_id, ri.date, ri.time_slot_id, ri.start_time, ri.end_time, ri.note, ri.status as item_status,
             l.name as lab_name, ts.name as time_slot_name
      FROM reservations r
      LEFT JOIN reservation_items ri ON ri.reservation_id = r.id
      LEFT JOIN laboratories l ON l.id = r.lab_id
      LEFT JOIN time_slots ts ON ts.id = ri.time_slot_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC, ri.date ASC
    `;
    const [rows] = await db.connection.query(query, [professorId]);
    return rows;
  }
}

export default new ReservationRepository();