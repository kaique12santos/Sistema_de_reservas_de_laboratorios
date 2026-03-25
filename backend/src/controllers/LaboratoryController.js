import LaboratoryService from '../services/LaboratoryService.js';

class LaboratoryController {
  async index(req, res) {
    try {
      // Se for ADMIN, permite ler a query. Se for professor, força false.
      const isAdmin = req.userRole?.toUpperCase() === 'ADMIN';
      const includeInactive = isAdmin && req.query.include_inactive === 'true';
      
      const labs = await LaboratoryService.listLaboratories(includeInactive);
      return res.status(200).json(labs);
    } catch (error) {
        console.error('[-1] ERRO ESTOUROU NO INDEX:', error);
      return res.status(500).json({ error: error.message });
    }
  }
 
  async show(req, res) {
    try {
      const lab = await LaboratoryService.getLaboratoryById(req.params.id);
      return res.status(200).json(lab);
    } catch (error) {
      const status = error.message.includes('não encontrado') ? 404 : 500;
      return res.status(status).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      // req.body JÁ VEM VALIDADO PELO ZOD MIDDLEWARE
      const newLab = await LaboratoryService.createLaboratory(req.body);
      return res.status(201).json(newLab);
    } catch (error) {
      // Erro de regra de negócio (ex: duplicado) devolve 400
      const status = error.message.includes('Já existe') ? 400 : 500;
      return res.status(status).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const updatedLab = await LaboratoryService.updateLaboratory(req.params.id, req.body);
      return res.status(200).json(updatedLab);
    } catch (error) {
      const status = error.message.includes('não encontrado') ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  }

  async toggleStatus(req, res) {
    try {
      const result = await LaboratoryService.toggleLaboratoryStatus(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message.includes('não encontrado') ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  }
}

export default new LaboratoryController();