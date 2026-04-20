import ConflictService from '../services/ConflictService.js';
import ReservationService from '../services/ReservationService.js';
import ReservationDTO from '../dtos/ReservationDTO.js';

class ReservationController {
  async checkConflict(req, res) {
    try {
      const { lab_id, date, time_slots } = req.validatedData;

      const result = await ConflictService.checkConflict(
        lab_id,
        date,
        time_slots
      ); 

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao verificar conflito:', error.message);
      return res.status(500).json({
        error: 'Erro interno ao verificar conflito'
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

}

export default new ReservationController();