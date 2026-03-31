import HolidayService from '../services/HolidayService.js';

class HolidayController {
  async index(req, res) {
    try {
      const { cycle_id } = req.query;
      const holidays = await HolidayService.listHolidays(cycle_id);
      res.json(holidays);
    } catch (error) {
      const status = error.message.includes('Nenhum ciclo') ? 404 : 500;
      res.status(status).json({ error: error.message });
    }
  }

  async sync(req, res) {
    try {
      const { cycle_id } = req.body;
      
      if (!cycle_id) {
        return res.status(400).json({ error: 'O ID do ciclo acadêmico (cycle_id) é obrigatório.' });
      }

      const result = await HolidayService.syncHolidaysForCycle(cycle_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new HolidayController();