import api from './api'; 

class TimeSlotService {
  /**
   * Lista todos os horários (time slots).
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await api.get('/time-slots');
    return response.data;
  }

  /**
   * Cria um novo horário.
   * @param {Object} data - Dados do horário.
   * @returns {Promise<Object>}
   */
  async create(data) {
    // Garantindo que o payload vá no formato exato que o backend exige
    const payload = {
      name: data.name,
      // Se o formulário do React enviar camelCase, nós traduzimos aqui:
      start_time: data.start_time || data.startTime, 
      end_time: data.end_time || data.endTime
    };

    const response = await api.post('/time-slots', payload);
    return response.data;
  }

  /**
   * Atualiza um horário existente.
   * @param {number|string} id - ID do horário.
   * @param {Object} data - Dados a serem atualizados.
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    const payload = {
      name: data.name,
      start_time: data.start_time || data.startTime,
      end_time: data.end_time || data.endTime,
      is_active: data.is_active !== undefined ? data.is_active : data.active
    };

    const response = await api.put(`/time-slots/${id}`, payload);
    return response.data;
  }

  /**
   * Inativa um horário (Soft Delete).
   * @param {number|string} id - ID do horário.
   * @returns {Promise<Object>}
   */
  async delete(id) {
    const response = await api.delete(`/time-slots/${id}`);
    return response.data;
  }
}

export const timeSlotService = new TimeSlotService();