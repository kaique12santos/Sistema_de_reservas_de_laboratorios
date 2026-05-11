import UserRepository from '../repositories/UserRepository.js';
import AuditService from './AuditService.js';
import EmailService from './EmailService.js';

class UserService {
  async listPendingUsers(adminDepartmentId) {
    return await UserRepository.findPending(adminDepartmentId);
  }

  /**
   * 
   * @param {string|number} userId - O ID do usuário a ser aprovado.
   * @param {string|number} adminId - O ID do administrador que está aprovando o usuário.
   * @returns {Object} - Retorna o usuário aprovado.
   */
  async approveUser(userId, adminDepartmentId, adminId, role) {
    const user = await UserRepository.findById(userId, adminDepartmentId);

    if (!user) {
      throw Object.assign(new Error('Usuário não encontrado ou não pertence ao seu escopo.'), { statusCode: 404 });
    }
    if (user.status !== 'PENDING') {
      throw Object.assign(new Error('Usuário já foi processado ou está ativo.'), { statusCode: 409 });
    }
    
    const finalRole = role || user.role;

    // Passamos para o Repository aprovar (status), ativar (is_active) e definir o cargo (role)
    await UserRepository.approveAndActivate(userId, finalRole);

    // Log de auditoria
    await AuditService.log('APPROVE', 'users', userId, adminId, { status: 'PENDING' }, { status: 'APPROVED', role: finalRole });

    EmailService.sendApprovalNotification(user.email, user.name)
        .catch(err => console.error("Falha silenciosa ao enviar email de aprovação", err));

    // Retornamos os dados novos para o front-end
    return { ...user, status: 'APPROVED', is_active: 1, role };
  }

  /**
   * 
   * @param {string|number} userId - O ID do usuário a ser rejeitado.
   * @param {string|number} adminId - O ID do administrador que está rejeitando o usuário.
   * @param {string} reason - O motivo detalhado da rejeição, fornecido pelo administrador.
   * @returns {Object} - Retorna o usuário rejeitado com o motivo da rejeição.
   */
  async rejectUser(userId, adminDepartmentId, adminId, reason) {
    const user = await UserRepository.findById(userId, adminDepartmentId);

    // Validações de ESTADO
    if (!user) {
      throw Object.assign(new Error('Usuário não encontrado ou não pertence ao seu departamento.'), { statusCode: 404 });
    }
    if (user.status !== 'PENDING') {
      throw Object.assign(new Error('Usuário já foi processado ou está ativo.'), { statusCode: 409 });
    }

    await UserRepository.updateStatus(userId, 'REJECTED', reason);

    // Log de auditoria
    await AuditService.log('REJECT', 'users', userId, adminId, { status: 'PENDING' }, { status: 'REJECTED', rejection_reason: reason });

     EmailService.sendRejectionNotification(user.email, user.name, reason)
        .catch(err => console.error("Falha silenciosa ao enviar email de rejeição", err));

    return { ...user, status: 'REJECTED', rejection_reason: reason };
  }

  // ==========================================
  // NOVOS MÉTODOS DE GESTÃO (SUPPORT)
  // ==========================================

  async changeRole(userId, newRole) {
    // Como Support tem acesso global, buscamos o usuário ignorando o filtro de departamento
    const user = await UserRepository.findById(userId); 

    if (!user) {
      throw Object.assign(new Error('Usuário não encontrado.'), { statusCode: 404 });
    }

    await UserRepository.updateRole(userId, newRole);

    return { ...user, role: newRole };
  }

  async toggleStatus(userId) {
    const user = await UserRepository.findById(userId); // Suporte não passa departmentId, pega global

    if (!user) {
      throw Object.assign(new Error('Usuário não encontrado.'), { statusCode: 404 });
    }

    // Regra: Inverte o boolean (Se for 1 vira 0, se for 0 vira 1)
    const newIsActive = user.is_active ? 0 : 1; 
    
    await UserRepository.updateIsActive(userId, newIsActive);

    return { ...user, is_active: newIsActive };
  }

  async listAllUsers(departmentId) {
    return await UserRepository.findAll(departmentId);
  }
}

export default new UserService();