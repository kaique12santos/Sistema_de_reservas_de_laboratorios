import UserRepository from '../repositories/UserRepository.js';

class UserService {
  async listPendingUsers() {
    return await UserRepository.findPending();
  }

  async approveUser(userId, adminId) {
    const user = await UserRepository.findById(userId);

    if (!user) throw new Error('Usuário não encontrado');
    if (user.status !== 'PENDING') throw new Error('Usuário já foi processado');

    await UserRepository.updateStatus(userId, 'APPROVED');

    // Se tiver AuditService, descomente abaixo:
    // await AuditService.log('APPROVE', 'users', userId, adminId, { status: 'PENDING' }, { status: 'APPROVED' });

    return { ...user, status: 'APPROVED' };
  }

  async rejectUser(userId, adminId) {
    const user = await UserRepository.findById(userId);

    if (!user) throw new Error('Usuário não encontrado');
    if (user.status !== 'PENDING') throw new Error('Usuário já foi processado');

    await UserRepository.updateStatus(userId, 'REJECTED');

    // Se tiver AuditService, descomente abaixo:
    // await AuditService.log('REJECT', 'users', userId, adminId, { status: 'PENDING' }, { status: 'REJECTED' });

    return { ...user, status: 'REJECTED' };
  }
}

export default new UserService();