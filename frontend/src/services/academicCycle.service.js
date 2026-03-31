import api from './api'; 

class AcademicCycleService {
  /**
   * Lista todos os ciclos acadêmicos do backend
   * @returns {Promise<Array>}
   */
  async getAll() {
    const response = await api.get('/academic-cycles');
    return response.data;
  }

  /**
   * 🚀 Dispara o Motor de Automação que cria o próximo semestre e puxa os feriados
   * @returns {Promise<Object>}
   */
  async generate() {
    const response = await api.post('/academic-cycles/generate');
    return response.data;
  }

  /**
   * Ativa um ciclo específico e desativa os demais
   * @param {number|string} id 
   * @returns {Promise<Object>}
   */
  async activate(id) {
    const response = await api.put(`/academic-cycles/${id}/activate`);
    return response.data;
  }
}

export const academicCycleService = new AcademicCycleService();