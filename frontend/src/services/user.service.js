import api from './api'; 

class UserService {
  
  /**
   * Busca todos os usuários com status 'pendente' de aprovação.
   * @returns {Promise<Array>} Lista de usuários pendentes
   */
  async getPending() {
    const response = await api.get('/users/pending');
    return response.data;
  }

  /**
   * Aprova o cadastro de um usuário específico.
   * @param {string|number} userId - O ID do usuário a ser aprovado.
   * @returns {Promise<Object>} Confirmação de sucesso da API.
   */
  async approve(userId) {
    const response = await api.patch(`/users/${userId}/approve`);
    return response.data;
  }

  /**
   * Rejeita o cadastro de um usuário, exigindo um motivo justificado.
   * @param {string|number} userId - O ID do usuário a ser rejeitado.
   * @param {string} reason - O motivo detalhado da rejeição.
   * @returns {Promise<Object>} Confirmação de sucesso da API.
   */
  async reject(userId, reason) {
    const response = await api.patch(`/users/${userId}/reject`, { reason });
    return response.data;
  }


  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  }


  async changeUserRole(id, newRole) {
    const response = await api.patch(`/users/${id}/role`, { role: newRole });
    return response.data;
  }

  async toggleUserStatus(id) {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data;
  }
}

export const userService = new UserService();