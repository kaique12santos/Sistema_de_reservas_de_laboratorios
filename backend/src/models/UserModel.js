
/**
 * Modelo de usuário para representar os dados do usuário no sistema.
 * Este modelo é usado para mapear os dados do banco de dados para um formato mais amigável na aplicação.
 */
class UserModel {
  constructor(dbRow) {
    this.id = dbRow.id;
    this.name = dbRow.name;
    this.email = dbRow.email;
    this.departmentId = dbRow.department_id; 
    this.role = dbRow.role;
    this.status = dbRow.status;
    this.createdAt = dbRow.created_at;
    this.passwordHash = dbRow.password_hash;
    this.verificationToken = dbRow.verification_token;
  }


  isAdmin() {
    return this.role === 'ADMIN';
  }
  // Método para retornar apenas os dados seguros do usuário, sem informações sensíveis
  toSafeObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      departmentId: this.departmentId,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}

export default UserModel;