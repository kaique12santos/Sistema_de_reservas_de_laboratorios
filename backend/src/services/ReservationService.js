import db from '../config/Database.js';
import ReservationRepository from '../repositories/ReservationRepository.js';
import AcademicCycleRepository from '../repositories/AcademicCycleRepository.js';
import HolidayRepository from '../repositories/HolidayRepository.js';
import LaboratoryRepository from '../repositories/LaboratoryRepository.js';
import TimeSlotRepository from '../repositories/TimeSlotRepository.js';
import ConflictService from './ConflictService.js';

class ReservationService {
  async createSimpleReservation(userId, userRole, data) {
    const connection = await db.connection.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Check for Active Academic Cycle
      const activeCycle = await AcademicCycleRepository.findActive();
      if (!activeCycle) {
        throw new Error('Nenhum ciclo acadêmico ativo encontrado');
      }

      // 2. Validate 'date' is within cycle
      const reservationDate = new Date(data.date);
      const cycleStart = new Date(activeCycle.start_date);
      const cycleEnd = new Date(activeCycle.end_date);
      if (reservationDate < cycleStart || reservationDate > cycleEnd) {
        throw new Error('Data fora do período do ciclo acadêmico ativo');
      }

      // 3. Check for Holiday
      const holiday = await HolidayRepository.findByDateAndCycle(data.date, activeCycle.id);
      if (holiday) {
        throw new Error(`Data ${data.date} é feriado: ${holiday.description}`);
      }

      // 4. Validate Admin Exclusive Period
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exclusiveEnd = activeCycle.admin_exclusive_end_date ? new Date(activeCycle.admin_exclusive_end_date) : null;
      if (exclusiveEnd && today <= exclusiveEnd && userRole !== 'ADMIN') {
        throw new Error('Período exclusivo para administradores');
      }

      // 5. Validate lab existence and active status
      const lab = await LaboratoryRepository.findById(data.lab_id);
      if (!lab || !lab.is_active) {
        throw new Error('Laboratório não encontrado ou inativo');
      }

      // 6. Validate time_slots existence and active status
      const timeSlots = [];
      for (const slotId of data.time_slots) {
        const slot = await TimeSlotRepository.findById(slotId);
        if (!slot || !slot.is_active) {
          throw new Error(`Horário ${slotId} não encontrado ou inativo`);
        }
        timeSlots.push(slot);
      }

      // 7. Conflict Check
      const conflictResult = await ConflictService.checkConflict(data.lab_id, data.date, data.time_slots);
      if (conflictResult.hasConflict) {
        if (userRole === 'PROFESSOR') {
          throw new Error('Conflito de horário detectado');
        } else if (userRole === 'ADMIN') {
          console.warn('Conflito detectado para administrador, prosseguindo:', conflictResult.message);
        }
      }

      // 8. Set Status: 'APPROVED'
      const status = 'APPROVED';

      // 9. Persistence
      const reservationId = await ReservationRepository.create({
        user_id: userId,
        lab_id: data.lab_id,
        cycle_id: activeCycle.id,
        type: 'SINGLE',
        status
      });

      const items = [];
      for (const slot of timeSlots) {
        const itemId = await ReservationRepository.createItem({
          reservation_id: reservationId,
          lab_id: data.lab_id,
          date: data.date,
          time_slot_id: slot.id,
          start_time: slot.start_time,
          end_time: slot.end_time
        });
        items.push({
          id: itemId,
          date: data.date,
          time_slot_id: slot.id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          status: 'ACTIVE'
        });
      }

      await connection.commit();

      // 10. Return full reservation object with items
      return {
        id: reservationId,
        user_id: userId,
        lab_id: data.lab_id,
        cycle_id: activeCycle.id,
        type: 'SINGLE',
        status,
        created_at: new Date(),
        items
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getMyReservations(userId) {
    const rows = await ReservationRepository.findByProfessor(userId);

    // Group by reservation
    const reservations = {};
    for (const row of rows) {
      if (!reservations[row.id]) {
        reservations[row.id] = {
          id: row.id,
          user_id: row.user_id,
          lab_id: row.lab_id,
          lab_name: row.lab_name,
          cycle_id: row.cycle_id,
          type: row.type,
          status: row.status,
          reason: row.reason,
          approved_by: row.approved_by,
          approval_date: row.approval_date,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: []
        };
      }
      if (row.item_id) {
        reservations[row.id].items.push({
          id: row.item_id,
          date: row.date,
          time_slot_id: row.time_slot_id,
          time_slot_name: row.time_slot_name,
          start_time: row.start_time,
          end_time: row.end_time,
          note: row.note,
          status: row.item_status
        });
      }
    }

    return Object.values(reservations);
  }
}

export default new ReservationService();