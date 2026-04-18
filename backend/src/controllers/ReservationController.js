import ConflictService from '../services/ConflictService.js';

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
}

export default new ReservationController();