import db from '../config/Database.js';

class ReservationRepository {
    async findConflicting(labId, date, timeSlotIds) {
        // Busca reservation_items onde:
        // - lab_id = labId
        // - date = date
        // - time_slot_id IN (timeSlotIds)
        // - status = 'ACTIVE'
        // JOIN reservations para garantir que a reserva pai também está ACTIVE
        const query = `
        SELECT ri.*, r.id as reservation_id, r.professor_id
        FROM reservation_items ri
        INNER JOIN reservations r ON r.id = ri.reservation_id
        WHERE ri.lab_id = ?
            AND ri.date = ?
            AND ri.time_slot_id IN (?)
            AND ri.status = 'ACTIVE'
            AND r.status IN ('APPROVED', 'PENDING')
        `;
        return await db.query(query, [labId, date, timeSlotIds]);
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
        return await db.query(query, [professorId, startDate, endDate]);
    }
}

export default new ReservationRepository();