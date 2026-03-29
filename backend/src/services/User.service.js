import UserRepository from '../repositories/UserRepository.js';
// import AuditService from './AuditService.js'; // Descomentar quando o AuditService estiver pronto
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
  async approveUser(userId, adminDepartmentId, adminId) {
    const user = await UserRepository.findById(userId, adminDepartmentId);

    // Validações de ESTADO (Regras de Negócio Invioláveis)
    if (!user) {
      throw Object.assign(new Error('Usuário não encontrado ou não pertence ao seu departamento.'), { statusCode: 404 });
    }
    if (user.status !== 'PENDING') {
      throw Object.assign(new Error('Usuário já foi processado ou está ativo.'), { statusCode: 409 }); // 409 Conflict
    }

    await UserRepository.updateStatus(userId, 'APPROVED');

   EmailService.sendApprovalNotification(user.email, user.name)
        .catch(err => console.error("Falha silenciosa ao enviar email de aprovação", err));

    // await AuditService.log('APPROVE', 'users', userId, adminId, { status: 'PENDING' }, { status: 'APPROVED' });

    return { ...user, status: 'APPROVED' };
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

     EmailService.sendRejectionNotification(user.email, user.name, reason)
        .catch(err => console.error("Falha silenciosa ao enviar email de rejeição", err));
    // await AuditService.log('REJECT', 'users', userId, adminId, { status: 'PENDING' }, { status: 'REJECTED', rejection_reason: reason });

    return { ...user, status: 'REJECTED', rejection_reason: reason };
  }
}

export default new UserService();