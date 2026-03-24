import api from './api';

class LaboratoryService {
  async getAll(includeInactive = false) {
    // const params = includeInactive ? '?include_inactive=true' : '';
    // const response = await api.get(`/laboratories${params}`);
    // return response.data;

    // --- MOCK ---
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: 1, name: 'Lab. Informática 01', location: 'Bloco A - Sala 101', capacity: 40, type: 'Laboratório', description: 'Computadores i5', status: 'Ativo' },
      { id: 2, name: 'Sala Maker', location: 'Bloco B - Sala 205', capacity: 20, type: 'Sala de Aula', description: 'Impressoras 3D', status: 'Ativo' },
      // Mock de inativo caso o filtro seja true
      ...(includeInactive ? [{ id: 3, name: 'Auditório Principal', location: 'Bloco C', capacity: 150, type: 'Auditório', description: 'Em reforma', status: 'Inativo' }] : [])
    ]), 800));
  }
  
  async create(data) {
    // const response = await api.post('/laboratories', data);
    // return response.data;

    return new Promise((resolve, reject) => setTimeout(() => {
      if (data.name === 'Lab. Informática 01') { // Simulando erro 400
        reject({ response: { status: 400, data: { error: 'Já existe um laboratório com este nome.' } } });
      } else {
        resolve({ id: Math.floor(Math.random() * 1000), status: 'Ativo', ...data });
      }
    }, 800));
  }
  
  async update(id, data) {
    // const response = await api.put(`/laboratories/${id}`, data);
    // return response.data;
    return new Promise((resolve) => setTimeout(() => resolve({ id, status: 'Ativo', ...data }), 800));
  }
  
  async delete(id) {
    // const response = await api.delete(`/laboratories/${id}`);
    // return response.data;

    return new Promise((resolve, reject) => setTimeout(() => {
      if (id === 1) { // Simulando erro de negócio do backend
        reject({ response: { data: { error: 'O laboratório possui reservas futuras. Cancele-as primeiro.' } } });
      } else {
        resolve({ success: true });
      }
    }, 800));
  }
}

export const laboratoryService = new LaboratoryService();