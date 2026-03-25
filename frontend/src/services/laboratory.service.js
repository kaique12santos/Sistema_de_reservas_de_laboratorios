import api from './api';

class LaboratoryService {
  async getAll(includeInactive = false) {
    const params = includeInactive ? '?include_inactive=true' : '';
    const response = await api.get(`/laboratories${params}`);
    return response.data.map(lab => ({
      ...lab,
      description: lab.description_lab || '', 
    }));
  }
  
  async create(data) {
    // Adaptador: Renomeia 'description' para 'description_lab' para o backend (Zod) aceitar
    const payload = { ...data, description_lab: data.description };
    delete payload.description;

    const response = await api.post('/laboratories', payload);
    return response.data;
  }
  
  async update(id, data) {
    // Adaptador para o update também
    const payload = { ...data, description_lab: data.description };
    delete payload.description;

    const response = await api.put(`/laboratories/${id}`, payload);
    return response.data;
  }
  
  async toggleStatus(id) {
    const response = await api.patch(`/laboratories/${id}/toggle-status`);
    return response.data;
  }
}

export const laboratoryService = new LaboratoryService();