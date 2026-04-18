import ReservationRepository from '../repositories/ReservationRepository.js';
import AcademicCycleService from './AcademicCycleService.js';
import HolidayService from './HolidayService.js';
import LaboratoryService from './LaboratoryService.js';
import TimeSlotRepository from '../repositories/TimeSlotRepository.js';
import ConflictService from './ConflictService.js';
import db from '../config/Database.js';

class ReservationService {
  async createSimpleReservation(userId, userRole, reservationData) {
    const connection = await db.connection.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Validation
      // Check if an active academic cycle exists
      const activeCycle = await AcademicCycleService.getActive();
      if (!activeCycle) {
        throw new Error('Nenhum ciclo acadêmico ativo encontrado.');
      }

      // Validate that the requested date is within the active cycle
      const requestDate = new Date(reservationData.date);
      const cycleStart = new Date(activeCycle.start_date);
      const cycleEnd = new Date(activeCycle.end_date);
      if (requestDate < cycleStart || requestDate > cycleEnd) {
        throw new Error('A data solicitada está fora do período do ciclo acadêmico ativo.');
      }

      // Check if the date is a holiday
      const isHoliday = await HolidayService.isHoliday(reservationData.date, activeCycle.id);
      if (isHoliday) {
        throw new Error('A data solicitada é um feriado e não permite reservas.');
      }

      // Exclusive Admin Period
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exclusiveEnd = activeCycle.admin_exclusive_end_date ? new Date(activeCycle.admin_exclusive_end_date) : null;
      if (exclusiveEnd && today <= exclusiveEnd && userRole !== 'ADMIN') {
        throw new Error('Período exclusivo para coordenadores. Professores não podem fazer reservas neste momento.');
      }

      // Validate lab existence and active status
      const lab = await LaboratoryService.getLaboratoryById(reservationData.lab_id);
      if (!lab.is_active) {
        throw new Error('O laboratório selecionado não está ativo.');
      }

      // Validate time_slots existence and active status
      const timeSlots = await TimeSlotRepository.findByIds(reservationData.time_slot_ids);
      if (timeSlots.length !== reservationData.time_slot_ids.length) {
        throw new Error('Um ou mais horários selecionados não existem ou não estão ativos.');
      }

      // 2. Conflict Handling
      const conflictResult = await ConflictService.checkConflict(
        reservationData.lab_id,
        reservationData.date,
        reservationData.time_slot_ids
      );

      if (conflictResult.hasConflict) {
        if (userRole === 'PROFESSOR') {
          throw new Error('Conflito detectado: O laboratório já está reservado para um ou mais horários selecionados.');
        } else if (userRole === 'ADMIN') {
          // Log as warning but allow creation
          console.warn(`Admin override: Conflict detected for reservation on ${reservationData.date}, lab ${reservationData.lab_id}`);
        }
      }

      // 3. Status Definition
      const status = 'APPROVED'; // Both professor and admin get APPROVED

      // 4. Data Persistence (ATOMIC TRANSACTION)
      // Insert into 'reservations'
      const reservationId = await ReservationRepository.create({
        user_id: userId,
        lab_id: reservationData.lab_id,
        cycle_id: activeCycle.id
      }, connection);

      // Map 'time_slot_ids' to insert multiple rows into 'reservation_items'
      const reservationItems = [];
      for (const timeSlotId of reservationData.time_slot_ids) {
        const timeSlot = timeSlots.find(ts => ts.id === timeSlotId);
        const itemId = await ReservationRepository.createItem({
          reservation_id: reservationId,
          lab_id: reservationData.lab_id,
          date: reservationData.date,
          time_slot_id: timeSlotId,
          start_time: timeSlot.start_time,
          end_time: timeSlot.end_time,
          note: reservationData.note
        }, connection);
        reservationItems.push({
          id: itemId,
          time_slot_id: timeSlotId,
          time_slot_name: timeSlot.name,
          start_time: timeSlot.start_time,
          end_time: timeSlot.end_time,
          note: reservationData.note
        });
      }

      // Audit log entries
      await ReservationRepository.createAuditLog(
        'CREATE',
        'reservations',
        reservationId,
        userId,
        null,
        { lab_id: reservationData.lab_id, date: reservationData.date, time_slot_ids: reservationData.time_slot_ids },
        connection
      );

      for (const item of reservationItems) {
        await ReservationRepository.createAuditLog(
          'CREATE',
          'reservation_items',
          item.id,
          userId,
          null,
          { reservation_id: reservationId, lab_id: reservationData.lab_id, date: reservationData.date, time_slot_id: item.time_slot_id },
          connection
        );
      }

      await connection.commit();

      // 5. Return: Full reservation object including its items
      const reservation = await ReservationRepository.findById(reservationId);
      reservation.items = reservationItems;

      return reservation;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getMyReservations(userId) {
    return await ReservationRepository.findByProfessor(userId);
  }
}

export default new ReservationService();