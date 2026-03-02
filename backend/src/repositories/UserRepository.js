import db from '../config/Database.js';

/**
 * Repositório de Usuários.
 * Responsável por todas as operações relacionadas à tabela de usuários no banco de dados.
 * Segue o princípio de Separation of Concerns, isolando a lógica de acesso a dados.
 */
class UserRepository {
  async findByEmail(email) {
    const [rows] = await db.connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  /**
   * 
   * @param {Object} user - Objeto contendo os dados do usuário a ser criado
   * @returns {Object} - Retorna o usuário criado com o ID gerado
   */
  async create(user) {
    const { name, email, password_hash, role, department_id } = user;
    
    const [result] = await db.connection.query(
      `INSERT INTO users (name, email, password_hash, role, department_id, status) 
       VALUES (?, ?, ?, ?, ?, 'PENDING')`, // PENDING conforme RF02
      [name, email, password_hash, role || 'PROFESSOR', department_id]
    );
    
    return { id: result.insertId, ...user };
  }
}

export default new UserRepository();