import LaboratoryRepository from '../repositories/LaboratoryRepository.js';

class LaboratoryService {
  async listLaboratories(includeInactive = false) {
    return await LaboratoryRepository.findAll(includeInactive);
  }

  async getLaboratoryById(id) {
    const lab = await LaboratoryRepository.findById(id);
    if (!lab) {
      throw new Error('Laboratório não encontrado.');
    }
    return lab;
  }

  async createLaboratory(dto) {
    // 1. Verifica duplicidade de nome
    const existingLab = await LaboratoryRepository.findByName(dto.name);
    if (existingLab) {
      throw new Error('Já existe laboratório com este nome.');
    }
    // 2. Cria no banco
    return await LaboratoryRepository.create(dto);
  }

  async updateLaboratory(id, dto) {
    const lab = await LaboratoryRepository.findById(id);
    if (!lab) throw new Error('Laboratório não encontrado.');

    // Se o nome mudou, verifica se o novo nome já pertence a outro lab
    if (dto.name !== lab.name) {
      const existingLab = await LaboratoryRepository.findByName(dto.name);
      if (existingLab && existingLab.id !== Number(id)) {
        throw new Error('Já existe outro laboratório com este nome.');
      }
    }

    return await LaboratoryRepository.update(id, dto);
  }

  async toggleLaboratoryStatus(id) {
    const lab = await LaboratoryRepository.findById(id);
    if (!lab) throw new Error('Laboratório não encontrado.');

    // 🚨 Regra de Negócio Crítica: Só checa reservas se estivermos INATIVANDO a sala (is_active atual é true)
    if (lab.is_active) {
      const hasReservations = await LaboratoryRepository.hasActiveReservations(id);
      if (hasReservations) {
        throw new Error('Laboratório possui reservas futuras. Cancele-as antes de colocar em manutenção.');
      }
    }

    // Altera o status e retorna
    const result = await LaboratoryRepository.toggleStatus(id, lab.is_active);
    
    return { 
      message: `Laboratório ${result.is_active ? 'reativado' : 'inativado'} com sucesso.`, 
      is_active: result.is_active 
    };
  }
}


export default new LaboratoryService();