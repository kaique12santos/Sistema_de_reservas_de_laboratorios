import api from './api'; 

class HolidayService {
  /**
   * Busca os feriados (Se não passar o ID, o backend já traz do ciclo ativo padrão)
   * @param {number|string} [cycleId] - Opcional
   * @returns {Promise<Array>}
   */
  async getByCycle(cycleId) {
    const url = cycleId ? `/holidays?cycle_id=${cycleId}` : '/holidays';
    const response = await api.get(url);
    return response.data;
  }

  /**
   * ♻️ Força a sincronização dos feriados de um ciclo com a BrasilAPI
   * @param {number|string} cycleId 
   * @returns {Promise<Object>}
   */
  async sync(cycleId) {
    const response = await api.post('/holidays/sync', { cycle_id: cycleId });
    return response.data;
  }
}

export const holidayService = new HolidayService();