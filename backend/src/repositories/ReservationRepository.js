import db from '../config/Database.js';

class ReservationRepository {
  async findConflicting(labId, date, timeSlotIds) {
    const placeholders = timeSlotIds.map(() => '?').join(',');

    const query = `
      SELECT ri.*, r.id as reservation_id, r.professor_id, r.status as reservation_status
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
      WHERE r.professor_id = ?
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
}

export default new ReservationRepository();