// Simulando delay de rede
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SupportService {
  constructor() {
    this.mockUsers = [
      { id: '1', nome: 'João Professor', email: 'joao@fatec.sp.gov.br', role: 'PROFESSOR', status: 'ATIVO' },
      { id: '2', nome: 'Maria Silva', email: 'maria@fatec.sp.gov.br', role: 'USER', status: 'PENDENTE' },
      { id: '3', nome: 'Carlos Admin', email: 'carlos.admin@fatec.sp.gov.br', role: 'ADMIN', status: 'ATIVO' },
      { id: '4', nome: 'Ana Suporte', email: 'ana.suporte@fatec.sp.gov.br', role: 'SUPORT', status: 'ATIVO' },
      { id: '5', nome: 'Roberto Teste', email: 'roberto@fatec.sp.gov.br', role: 'USER', status: 'INATIVO' },
    ];
  }

  async getAllUsers() {
    await delay(600);
    return [...this.mockUsers];
  }

  async approveUser(id, newRole = 'PROFESSOR') {
    await delay(800);
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index].status = 'ATIVO';
      this.mockUsers[index].role = newRole;
    }
    return { success: true };
  }

  async changeUserRole(id, newRole) {
    await delay(600);
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index].role = newRole;
    }
    return { success: true };
  }

  async toggleUserStatus(id) {
    await delay(600);
    const index = this.mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      this.mockUsers[index].status = this.mockUsers[index].status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    }
    return { success: true };
  }
}

export const supportService = new SupportService();