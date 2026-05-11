import AcademicCycleService from '../services/AcademicCycleService.js';

class AcademicCycleController {

  async index(req, res) {
    try {
      const cycles = await AcademicCycleService.listAll();
      res.json(cycles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async active(req, res) {
    try {
      const cycle = await AcademicCycleService.getActive();
      if (!cycle) return res.status(404).json({ message: 'Nenhum ciclo ativo no momento.' });
      res.json(cycle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Aciona o Motor de Geração Automática do próximo ciclo acadêmico
  async generate(req, res) {
    try {
      const result = await AcademicCycleService.generateNextCycle();
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async activate(req, res) {
    try {
      const { id } = req.params;
      const changedBy = req.user?.id || req.adminId; // ID do usuário autenticado (admin)
      const result = await AcademicCycleService.activateCycle(id, changedBy);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AcademicCycleController();