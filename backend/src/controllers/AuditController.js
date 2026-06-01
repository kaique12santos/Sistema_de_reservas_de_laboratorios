import AuditRepository from '../repositories/AuditRepository.js';

class AuditController {
  async getByRecord(req, res) {
    try {
      const { table, id } = req.params;
      const logs = await AuditRepository.findByRecord(table, id);
      return res.status(200).json(logs);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar logs de auditoria.' });
    }
  }

  async getByUser(req, res) {
    try {
      const { userId } = req.params;
      const logs = await AuditRepository.findByUser(userId);
      return res.status(200).json(logs);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar histórico do usuário.' });
    }
  }

  async getAll(req, res) {
    try {
      const logs = await AuditRepository.findAll();
      return res.status(200).json(logs);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar logs de auditoria.' });
    }
  }
}

export default new AuditController();