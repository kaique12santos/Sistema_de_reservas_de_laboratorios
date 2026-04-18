import ConflictService from '../services/ConflictService.js';
import ReservationService from '../services/ReservationService.js';

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
      return res.status(500).json({
        error: 'Erro interno ao verificar conflito'
      });
    }
  }

  async create(req, res) {
    try {
      const { lab_id, date, time_slots } = req.body;

      const result = await ReservationService.createSimpleReservation(
        req.userId,
        req.userRole,
        { lab_id, date, time_slots }
      );

      return res.status(201).json(result);
    } catch (error) {
      const statusCode = error.statusCode || 400;
      return res.status(statusCode).json({
        error: error.message
      });
    }
  }

  async myReservations(req, res) {
    try {
      const result = await ReservationService.getMyReservations(req.userId);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        error: 'Erro interno ao buscar reservas'
      });
    }
  }
}

export default new ReservationController();