import ReservationRepository from '../repositories/ReservationRepository.js';
import AcademicCycleService from './AcademicCycleService.js';
import HolidayService from './HolidayService.js';
import LaboratoryService from './LaboratoryService.js';
import TimeSlotRepository from '../repositories/TimeSlotRepository.js';
import ConflictService from './ConflictService.js';
import db from '../config/Database.js';

class ReservationService {
  /**
   * Cria uma nova reserva simples
   * @param {number} userId - ID do usuário que está criando a reserva
   * @param {string} userRole - Papel do usuário (PROFESSOR ou ADMIN)
   * @param {Object} reservationData - Dados da reserva a ser criada
   * @returns {Promise<number>} - Retorna o ID da reserva criada
   */
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

      const requestDateStr = reservationData.date; // Já vem "YYYY-MM-DD" do Zod
      
      // Converte as datas do banco para o formato YYYY-MM-DD
      const cycleStartStr = activeCycle.start_date.toISOString().split('T')[0];
      const cycleEndStr = activeCycle.end_date.toISOString().split('T')[0];

      if (requestDateStr < cycleStartStr || requestDateStr > cycleEndStr) {
        throw new Error('A data solicitada está fora do período do ciclo acadêmico ativo.');
      }

      // Verifica se é feriado
      const isHoliday = await HolidayService.isHoliday(requestDateStr, activeCycle.id);
      if (isHoliday) {
        throw new Error('A data solicitada é um feriado e não permite reservas.');
      }

      // Período exclusivo Admin (Comparação de strings é imune a fuso horário)
      const todayStr = new Date().toISOString().split('T')[0]; 
      const exclusiveEndStr = activeCycle.admin_exclusive_end_date 
        ? activeCycle.admin_exclusive_end_date.toISOString().split('T')[0] 
        : null;

      if (exclusiveEndStr && todayStr <= exclusiveEndStr && userRole !== 'ADMIN') {
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
          console.warn(`Admin override: Cancelando reservas conflitantes em ${reservationData.date}, lab ${reservationData.lab_id}`);
          
          await ReservationRepository.overrideConflictingItems(
            reservationData.lab_id,
            reservationData.date,
            reservationData.time_slot_ids,
            connection
          );
        }
      }

      const status = userRole === 'ADMIN' ? 'APPROVED' : 'PENDING'; 

      const reservationId = await ReservationRepository.create({
        user_id: userId,
        lab_id: reservationData.lab_id,
        cycle_id: activeCycle.id,
        status: status
      }, connection);

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

  /**
   * Obtém todas as reservas de um professor específico
   * @param {number} userId - ID do professor
   * @returns {Promise<Array>} - Retorna uma lista de reservas encontradas
   */
  async getMyReservations(userId) {
    return await ReservationRepository.findByProfessor(userId);
  }

  /**
   * Cancela uma reserva específica
   * @param {number} reservationId - ID da reserva a ser cancelada
   * @param {number} userId - ID do usuário que está cancelando a reserva
   * @returns {Promise<boolean>} - Retorna true se a reserva for cancelada com sucesso
   */
  async cancelReservation(reservationId, userId) {
    const connection = await db.connection.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Busca a reserva para validar
      const reservation = await ReservationRepository.findById(reservationId);
      
      if (!reservation) {
        throw new Error('Reserva não encontrada.');
      }

      // 2. Trava de Segurança: Só o dono da reserva (ou um ADMIN) pode cancelar
      if (reservation.user_id !== userId) {
        throw new Error('Acesso negado. Você não tem permissão para cancelar esta reserva.');
      }

      // 3. Impede cancelamento de algo que já está cancelado
      if (reservation.status === 'CANCELED') {
        throw new Error('Esta reserva já encontra-se cancelada.');
      }

      // 4. Atualiza o banco (você precisará ter esse método no Repository)
      await ReservationRepository.updateStatus(reservationId, 'CANCELED', connection);

      // (Opcional) Log de auditoria
      await ReservationRepository.createAuditLog(
        'UPDATE', 'reservations', reservationId, userId, 
        { status: reservation.status }, { status: 'CANCELED' }, 
        connection
      );

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Apenas para Admin: Lista todas as reservas pendentes para aprovação
  async listPendingReservations() {
    return ReservationRepository.findPending();
  }

  /**
   * Aprova uma reserva específica
   * @param {number} reservationId 
   * @param {number} adminId 
   * @returns {Promise<{success: boolean, message: string}>} - Retorna um objeto indicando o sucesso da operação e uma mensagem descritiva 
   */
  async approveReservation(reservationId, adminId) {
    const connection = await db.connection.getConnection();
    await connection.beginTransaction();

    try {
      const reservation = await ReservationRepository.findById(reservationId);
      if (!reservation) {
        throw new Error('Reserva não encontrada.');
      }
      if (reservation.status !== 'PENDING') {
        throw new Error('Apenas reservas pendentes podem ser aprovadas.');
      }

      const items = await ReservationRepository.findItemsByReservationId(reservationId);
      for (const item of items) {
        const conflit = await ConflictService.checkConflict(
          item.lab_id,
          item.date,
          [item.time_slot_id],
          reservationId
        );
        if (conflit.hasConflict) {
          throw new Error(`Conflito detectado para o item de reserva ID ${item.id}. O laboratório já está reservado para o horário selecionado.`);
        }
      }
     
      await ReservationRepository.updateStatus(reservationId, 'APPROVED',{approved_by: adminId}, connection);

      await ReservationRepository.createAuditLog(
        'UPDATE', 'reservations', reservationId, adminId, 
        { status: reservation.status }, { status: 'APPROVED' }, 
        connection
      );

      await connection.commit();
      return { success: true, message: 'Reserva aprovada com sucesso.' };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async rejectReservation(reservationId, adminId, reason) {
    if (!reason || reason.trim() === '') {
      throw new Error('Motivo de rejeição é obrigatório.');
    }
    
    const connection = await db.connection.getConnection();
    await connection.beginTransaction();

    try {
      const reservation = await ReservationRepository.findById(reservationId,connection);
      if (!reservation) {
        throw new Error('Reserva não encontrada.');
      }
      if (reservation.status !== 'PENDING') {
        throw new Error('Apenas reservas pendentes podem ser rejeitadas.');
      }
      await ReservationRepository.updateStatus(reservationId, 'REJECTED', {approved_by: adminId, reason: reason}, connection);

      await ReservationRepository.createAuditLog(
        'UPDATE', 'reservations', reservationId, adminId, 
        { status: reservation.status }, { status: 'REJECTED', rejection_reason: reason }, 
        connection
      );

      await ReservationRepository.cancelItemsByReservationId(reservationId, connection);

      await connection.commit();
      return { success: true, message: 'Reserva rejeitada com sucesso.' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async redirectReservation(reservationId, adminId, newLabId, reason) {
    if (!reason || reason.trim() === '') throw new Error('Motivo de redirecionamento é obrigatório.');
    if (!newLabId) throw new Error('O novo laboratório é obrigatório.');
    const connection = await db.connection.getConnection();
    await connection.beginTransaction();

    try {
      const reservation = await ReservationRepository.findById(reservationId, connection);
      if (!reservation) throw new Error('Reserva não encontrada.');
      if (reservation.status !== 'PENDING') throw new Error('Apenas reservas pendentes podem ser redirecionadas.');

      const items = await ReservationRepository.findItemsByReservationId(reservationId, connection);
      for (const item of items) {
        const conflit = await ConflictService.checkConflict(
          newLabId,
          item.date,
          [item.time_slot_id],        
          reservationId
        );
        if (conflit.hasConflict) {
          throw new Error(`Conflito detectado para o item de reserva ID ${item.id}. O novo laboratório já está reservado para o horário selecionado.`);
        }
      }
      
      // APAGUEI AQUELA LINHA PERDIDA DO CONFLITO AQUI!

      await ReservationRepository.redirectItems(reservationId, newLabId, connection);

      // CORRIGIDO O STATUS PARA 'APPROVED'
      await ReservationRepository.createAuditLog(
        'UPDATE', 'reservations', reservationId, adminId, 
        { status: reservation.status }, { status: 'APPROVED', reason: reason, lab_id: newLabId }, 
        connection
      );

      // CORRIGIDO O STATUS PARA 'APPROVED'
      await ReservationRepository.updateStatus(reservationId, 'APPROVED', {approved_by: adminId, reason: reason}, connection);

      await connection.commit();
      return { success: true, message: 'Reserva redirecionada com sucesso.' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

}
export default new ReservationService();