import api from './api'; // Ajuste para o caminho do seu axios configurado

/**
 * Serviço responsável pelas operações relacionadas a Usuários.
 * Segue o padrão Orientado a Objetos (Singleton).
 */
class UserService {
  
  /**
   * Busca todos os usuários com status 'pendente' de aprovação.
   * @returns {Promise<Array>} Lista de usuários pendentes
   */
  async getPending() {
    // Quando a API estiver pronta, descomente as linhas abaixo:
    // const response = await api.get('/users/pending');
    // return response.data;

    // --- MOCK PARA TESTAR A TELA ---
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: 1, name: 'João Silva', email: 'joao.silva@fatec.sp.gov.br', department: 'Desenvolvimento de Software Multiplataforma', createdAt: '2026-03-24T10:00:00Z' },
      { id: 2, name: 'Maria Souza', email: 'maria.souza@fatec.sp.gov.br', department: 'Gestão de Recursos Humanos', createdAt: '2026-03-23T15:30:00Z' },
    ]), 1000));
  }

  /**
   * Aprova o cadastro de um usuário específico.
   * @param {string|number} userId - O ID do usuário a ser aprovado.
   * @returns {Promise<Object>} Confirmação de sucesso da API.
   */
  async approve(userId) {
    // const response = await api.put(`/users/${userId}/approve`);
    // return response.data;
    
    // --- MOCK ---
    return new Promise((resolve) => setTimeout(resolve, 800)); 
  }

  /**
   * Rejeita o cadastro de um usuário, exigindo um motivo justificado.
   * @param {string|number} userId - O ID do usuário a ser rejeitado.
   * @param {string} reason - O motivo detalhado da rejeição.
   * @returns {Promise<Object>} Confirmação de sucesso da API.
   */
  async reject(userId, reason) {
    // const response = await api.put(`/users/${userId}/reject`, { reason });
    // return response.data;
    
    // --- MOCK ---
    return new Promise((resolve) => setTimeout(resolve, 800)); 
  }
}

// Exporta uma instância única (Singleton) da classe
export const userService = new UserService();