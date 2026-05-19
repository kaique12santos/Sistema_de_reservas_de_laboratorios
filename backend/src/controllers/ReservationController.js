import ConflictService from '../services/ConflictService.js';
import ReservationService from '../services/ReservationService.js';
import OverwriteService from '../services/OverwriteService.js';

class ReservationController {

  /**
   *  Verifica se há conflitos para um laboratório, data e horários específicos
   *  @route GET /reservations/check-conflict
   *  @query {number} lab_id - ID do laboratório a ser verificado
   *  @query {string} date - Data da reserva no formato 'YYYY-MM-DD'
   *  @query {Array<number>} time_slots - Lista de IDs dos horários a serem verificados
   *  @returns {Promise<{hasConflict: boolean, conflictingReservations: Array}>} - Retorna um objeto indicando se há conflito e uma lista de reservas conflitantes (se houver)
   */
  async checkConflict(req, res) {
    try {
      const payload = req.method === 'GET' ? req.query : req.body;
      const { lab_id } = payload;

      // 1. Desfaz a vírgula dos horários
      let time_slots = payload.time_slots || payload.time_slot_ids;
      if (typeof time_slots === 'string') time_slots = time_slots.split(',');
      if (!time_slots) return res.json({ hasConflict: false, conflictingSlots: [] });
      
      // Garante que é array de números
      time_slots = Array.isArray(time_slots) ? time_slots.map(Number) : [Number(time_slots)];

      // 2. Desfaz a vírgula das datas
      let datesToCheck = [];
      if (payload.dates) {
        datesToCheck = typeof payload.dates === 'string' ? payload.dates.split(',') : payload.dates;
      } else if (payload.date) {
        datesToCheck = [payload.date];
      }

      if (!lab_id || datesToCheck.length === 0 || time_slots.length === 0) {
        return res.json({ hasConflict: false, conflictingSlots: [] });
      }

      // 3. Manda pro nosso novo ConflictService
      const result = await ConflictService.checkConflict(lab_id, datesToCheck, time_slots);

      return res.json({
        hasConflict: result.hasConflict,
        conflictingSlots: result.conflictingSlots,
        conflictingDates: result.conflictingDates
      });

    } catch (error) {
      console.error('Erro na checagem de conflitos:', error.message);
      return res.status(500).json({ error: 'Erro interno ao verificar conflitos.' });
    }
  }
  
  /**
   * Cria uma nova reserva simples (sem itens de reserva detalhados)
   * @route POST /reservations/simple
   * @body {number} lab_id - ID do laboratório a ser reservado
   * @body {string} date - Data da reserva no formato 'YYYY-MM-DD'
   * @body {Array<number>} time_slots - Lista de IDs dos horários a serem reservados
   * @returns {Promise<{message: string, reservation: Object}>} - Retorna uma mensagem de sucesso e os detalhes da reserva criada
   */
  async create(req, res) {
    try {

      const validatedData = req.validatedData;
      const userId = req.user.id;
      const userRole = req.user.role;

      const reservation = validatedData.type === 'RECURRING'
        ? await ReservationService.createRecurringReservation(validatedData, req.user)
        : await ReservationService.createSimpleReservation(
            userId,
            userRole,
            validatedData
          );


      return res.status(201).json({
        message: 'Reserva criada com sucesso',
        reservation,
        promptFeedback: reservation.promptFeedback
      });
    } catch (error) {
      console.error('Erro ao criar reserva:', error.message);
      return res.status(400).json({
        error: error.message
      });
    }
  }

  async createSimpleReservation(req, res) {
    try {
      const validatedData = req.validatedData;
      const userId = req.user.id;
      const userRole = req.user.role;

      const reservation = await ReservationService.createSimpleReservation(
        userId,
        userRole,
        validatedData
      );

      return res.status(201).json({
        message: 'Reserva criada com sucesso',
        reservation
      });
    } catch (error) {
      console.error('Erro ao criar reserva:', error.message);
      return res.status(400).json({
        error: error.message
      });
    }
  }

  /**
   * Obtém todas as reservas de um professor específico
   * @route GET /reservations/my
   * @description Retorna uma lista de todas as reservas feitas pelo professor autenticado, 
   * incluindo detalhes do laboratório, data, horários e status de cada reserva.
   * @returns {Promise<{reservations: Array}>} - Retorna um objeto contendo uma lista de reservas do professor, ou uma mensagem de erro em caso de falha 
   */
  async getMyReservations(req, res) {
    try {
      const userId = req.userId;

      const reservations = await ReservationService.getMyReservations(userId);

      return res.status(200).json({
        reservations
      });
    } catch (error) {
      console.error('Erro ao buscar reservas:', error.message);
      return res.status(500).json({
        error: 'Erro interno ao buscar reservas'
      });
    }
  }

  /// Cancela uma reserva específica feita pelo professor autenticado
  async cancel(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id; // Pego pelo token do authMiddleware
      
      await ReservationService.cancelReservation(id, userId);
      
      return res.status(200).json({ message: 'Reserva cancelada com sucesso.' });
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  // Lista todas as reservas pendentes (status 'pending') para que o administrador possa aprovar ou rejeitar
  async pending (req, res) {
    try {
      const pendingReservations = await ReservationService.listPendingReservations();
      return res.status(200).json({ pendingReservations });
    } catch (error) {
      console.error('Erro ao listar reservas pendentes:', error);
      return res.status(500).json({ error: 'Erro interno ao listar reservas pendentes' });
    }
  }

  // Aprova uma reserva pendente
  async approve(req, res) {
    try {
      const { id } = req.params; // ID da reserva a ser aprovada
      const adminId = req.user.id; // ID do administrador que está aprovando

      const result = await ReservationService.approveReservation(id, adminId);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao aprovar reserva:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  // Rejeita uma reserva pendente, com motivo de rejeição
  async reject(req, res) {
    try {
      const { id } = req.params; // ID da reserva a ser rejeitada
      const adminId = req.user.id; // ID do administrador que está rejeitando
      const { reason } = req.body; // Motivo da rejeição

      const result = await ReservationService.rejectReservation(id, adminId, reason);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao rejeitar reserva:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  async redirect(req, res) {
    try {
      const { id } = req.params; // ID da reserva a ser redirecionada
      const adminId = req.user.id; // ID do administrador que está redirecionando
      const { new_lab_id, reason } = req.body; // Novos detalhes da reserva

      const result = await ReservationService.redirectReservation(id, adminId, new_lab_id, reason);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao redirecionar reserva:', error);
      return res.status(400).json({ error: error.message });
    }
  }

  async overwrite(req, res) {
    try {
      const adminId = req.user.id;
      // O body já vem sanitizado pelo middleware validateRequest
      const result = await OverwriteService.overwriteReservation(req.body, adminId);
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao sobrescrever reserva:', error);
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async bulkDelete(req, res) {
    try {
      const { ids } = req.body;
      const result = await ReservationService.bulkDeleteReservations(ids, req.user);
      res.json({ message: `${result.cancelled_count} reserva(s) cancelada(s)`, ...result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

}

export default new ReservationController();