import db from '../config/Database.js';
import ReservationRepository from '../repositories/ReservationRepository.js';
import AcademicCycleService from './AcademicCycleService.js';
import HolidayService from './HolidayService.js';
import TimeSlotRepository from '../repositories/TimeSlotRepository.js';
import EventBus from '../events/EventBus.js';
import UserRepository from '../repositories/UserRepository.js';

class OverwriteService {
  async overwriteReservation(dto, adminId) {
    const { lab_id, date, time_slot_ids, notes } = dto;

    const connection = await db.connection.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Validações de Ciclo e Feriado
      const activeCycle = await AcademicCycleService.getActive();
      if (!activeCycle) throw Object.assign(new Error('Nenhum ciclo acadêmico ativo.'), { statusCode: 400 });

      const cycleStart = activeCycle.start_date.toISOString().split('T')[0];
      const cycleEnd = activeCycle.end_date.toISOString().split('T')[0];
      if (date < cycleStart || date > cycleEnd) {
        throw Object.assign(new Error('A data solicitada está fora do ciclo acadêmico ativo.'), { statusCode: 400 });
      }

      const holidays = await HolidayService.listHolidays(activeCycle.id);
      const isHoliday = holidays.some(h => (h.date instanceof Date ? h.date.toISOString().split('T')[0] : String(h.date).slice(0, 10)) === date);
      if (isHoliday) throw Object.assign(new Error('Não é possível realizar reservas em feriados.'), { statusCode: 400 });

      // 2. Busca os conflitos reais
      // Passamos os slots limpos para o repository
      const normalizedSlotIds = [...new Set(time_slot_ids)];
      const conflicts = await ReservationRepository.findConflicting(lab_id, date, normalizedSlotIds);

      if (conflicts.length === 0) {
        throw Object.assign(new Error('Não há conflito a sobrescrever nesta data e horário. Use a criação normal de reserva.'), { statusCode: 400 });
      }

      // 3. Cancela itens em conflito e verifica as reservas "pai"
      for (const conflictItem of conflicts) {
        await ReservationRepository.cancelItem(conflictItem.id, connection);
        await ReservationRepository.cancelReservationIfAllItemsCancelled(conflictItem.reservation_id, connection);
      }

      // 4. Cria a nova reserva para o ADMIN
      const newReservationId = await ReservationRepository.create({
        user_id: adminId, // Usando user_id conforme seu schema
        lab_id,
        cycle_id: activeCycle.id,
        type: 'SINGLE',
        status: 'APPROVED'
      }, connection);

      const timeSlots = await TimeSlotRepository.findByIds(normalizedSlotIds);
      const newItems = normalizedSlotIds.map(slotId => {
        const ts = timeSlots.find(t => t.id === slotId);
        return {
          lab_id,
          date,
          time_slot_id: slotId,
          start_time: ts.start_time,
          end_time: ts.end_time,
          note: notes || null
        };
      });

      await ReservationRepository.createMany(newReservationId, newItems, connection);

      // 5. Log de Auditoria
      const overwrittenReservationIds = [...new Set(conflicts.map(c => c.reservation_id))];
      await ReservationRepository.createAuditLog(
        'OVERWRITE', 
        'reservation_items', 
        newReservationId, 
        adminId, 
        { overwritten_item_ids: conflicts.map(c => c.id), overwritten_reservation_ids: overwrittenReservationIds }, 
        { new_reservation_id: newReservationId, notes }, 
        connection
      );

      await connection.commit();

      // ==========================================
      // 6. INTEGRAÇÃO FASE 7 (Disparo de E-mails)
      // ==========================================
      const newReservation = await ReservationRepository.findById(newReservationId);
      
      // Agrupa itens cancelados por professor para não mandar e-mail duplicado
      for (const affectedResId of overwrittenReservationIds) {
        try {
          const affectedReservation = conflicts.find(c => c.reservation_id === affectedResId);
          const affectedProfessor = await UserRepository.findById(affectedReservation.user_id);
          const cancelledItems = conflicts.filter(c => c.reservation_id === affectedResId);
          
          EventBus.emit('reservation:overwritten', {
            affectedProfessor,
            newReservation,
            cancelledItems
          });
        } catch (eventErr) {
          console.error('[OverwriteService] Falha silenciosa ao emitir evento:', eventErr.message);
        }
      }

      return {
        new_reservation: newReservation,
        overwritten_count: conflicts.length,
        overwritten_reservation_ids: overwrittenReservationIds
      };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new OverwriteService();