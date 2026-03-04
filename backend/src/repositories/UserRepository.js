import db from '../config/Database.js';

/**
 * Repositório de Usuários.
 * Responsável por todas as operações relacionadas à tabela de usuários no banco de dados.
 * Segue o princípio de Separation of Concerns, isolando a lógica de acesso a dados.
 */
class UserRepository {

  /**
   * 
   * @param {string} email - E-mail do usuário a ser encontrado
   * @returns {Object|null} - Retorna o usuário encontrado ou null se não existir
  */
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
    const { name, email, password_hash, department_id, role, verification_token, status } = user;
    
    const [result] = await db.connection.query(
      `INSERT INTO users (name, email, password_hash, department_id, role, verification_token, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password_hash, department_id, role, verification_token, status]
    );
    return { id: result.insertId, ...user };
  }

  /**
   * 
   * @param {number} id - ID do usuário a ser atualizado
   * @param {Object} userData - Objeto contendo os dados do usuário a serem atualizados (name, password_hash, department_id, role, verification_token) 
   * @returns {void} 
  */
  async updatePendingUser(id, userData) {
    const { name, password_hash, department_id, role, verification_token } = userData;
    
    await db.connection.query(
      `UPDATE users 
       SET name = ?, password_hash = ?, department_id = ?, role = ?, verification_token = ?
       WHERE id = ? AND status = 'PENDING'`,
      [name, password_hash, department_id, role, verification_token, id]
    );
  }

  /**
   * 
   * @param {string} token - Token de verificação a ser encontrado
   * @returns {Object|null} - Retorna o usuário encontrado ou null se não existir
  */
  async findByVerificationToken(token) {
    const [rows] = await db.connection.query(
      'SELECT * FROM users WHERE verification_token = ?',
      [token]
    );
    return rows[0];
  }

  /**
   * 
   * @param {number} userId - ID do usuário para limpar o token de verificação
   * @returns {void}
   */
  async clearVerificationToken(userId) {
    await db.connection.query(
      'UPDATE users SET verification_token = NULL WHERE id = ?',
      [userId]
    );
  }

}

export default new UserRepository();