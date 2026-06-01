import api from './api';

class AuditService {
  /**
   * Busca o histórico de ações de um usuário específico
   * @param {string} userId - ID do usuário
   * @returns {Promise<Array>} - Lista de ações auditadas
   */
  async getAuditHistory(userId) {
    const response = await api.get(`/audit/user/${userId}`);
    return response.data;
  }

    /**
     * Busca o histórico de ações de um registro específico (ex: reserva, laboratório)
     * @param {string} table - Nome da tabela (ex: 'reservations', 'laboratories')
     * @param {string|number} id - ID do registro
     * @returns {Promise<Array>} - Lista de ações auditadas
     */
    async getRecordHistory(table, id) {
        const response = await api.get(`/audit/${table}/${id}`);
        return response.data;
    }

    /**
     * Busca os logs gerais do sistema para o painel de auditoria do Suporte
     * @returns {Promise<Array>} - Lista de ações auditadas
     */
    async getAllAudits() {
        const response = await api.get('/audit');
        return response.data;
    }
}

export const auditService = new AuditService();