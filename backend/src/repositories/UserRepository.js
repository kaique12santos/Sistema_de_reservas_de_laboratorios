import db from '../config/Database.js';
import { withDepartmentScope } from '../utils/queryScope.js';

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

  /**
   * @param {number} userId - ID do usuário
   * @param {string} tokenHash - Hash do token gerado
   * @param {Date} expires - Data/hora de expiração
   */

  async savePasswordResetToken(userId, tokenHash, expires){
    await db.connection.query(
      `UPDATE users
      SET password_reset_token = ?, password_reset_expires = ?
      WHERE id = ?`,
      [ tokenHash, expires, userId]
    );
  }

  /**
   * @param {string} tokenHash - Hash do token a ser buscado
   * @returns {Object|null}
   */

  async findByResetToken(tokenHash){
    const [ rows ] = await db.connection.query(
      `SELECT * FROM users
      WHERE password_reset_token = ?
      AND password_reset_expires > NOW()`,
      [ tokenHash]
    );
    return rows[0]
  }

  /**
   * @param {number} userId - ID do usuário
   * @param {string} newPasswordHash - Nova senha já hasheada
   */

  async updatePasswordAndClearToken(userId, newPasswordHash){
    await db.connection.query(
      `UPDATE users
      SET password_hash = ?,
      password_reset_token = NULL,
      password_reset_expires = NULL
      WHERE id = ?`,
      [ newPasswordHash,userId ]
    );
  }
/**
   * Busca usuários pendentes, filtrando pelo departamento do Admin logado.
   * @param {number} adminDepartmentId 
   * @returns {Promise<Array>}
   */
  async findPending(adminDepartmentId) {
    const baseQuery = `
      SELECT u.id, u.name, u.email, u.role, u.department_id, u.created_at, d.name AS department_name, d.code AS department_code 
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.status = 'PENDING'
    `;
    
    const { query, params } = withDepartmentScope(baseQuery, [], adminDepartmentId, 'u');
    
    const [rows] = await db.connection.query(query, params);
    return rows;
  }

  /**
   * Atualiza o status de um usuário (Aprova ou Rejeita).
   * @param {number} id - ID do usuário.
   * @param {string} status - Novo status ('APPROVED' ou 'REJECTED').
   * @param {string|null} rejectionReason - Motivo da rejeição, se houver.
   * @returns {Promise<void>}
   */
  async updateStatus(id, status, rejectionReason = null) {
    await db.connection.query(
      'UPDATE users SET status = ?, rejection_reason = ? WHERE id = ?',
      [status, rejectionReason, id]
    );
  }

  /**
   * Conta usuários por status, respeitando o departamento do Admin.
   * @param {string} status 
   * @param {number} adminDepartmentId
   * @returns {Promise<number>}
   */
  async countByStatus(status, adminDepartmentId) {
    const baseQuery = 'SELECT COUNT(*) as total FROM users WHERE status = ?';
    
    // Injeta o escopo na contagem também
    const { query, params } = withDepartmentScope(baseQuery, [status], adminDepartmentId);
    
    const [rows] = await db.connection.query(query, params);
    return rows[0].total;
  }

  // /**
  //  * Busca um usuário pelo ID, garantindo que ele pertence ao departamento do Admin.
  //  * Isso previne a falha de segurança IDOR (Insecure Direct Object Reference).
  //  * @param {number} id 
  //  * @param {number} adminDepartmentId
  //  * @returns {Object|null}
  //  */
  // async findById(id, adminDepartmentId) {
  //   const baseQuery = 'SELECT * FROM users WHERE id = ?';
    
  //   // O Utils adiciona "AND department_id = ?"
  //   const { query, params } = withDepartmentScope(baseQuery, [id], adminDepartmentId);
    
  //   const [rows] = await db.connection.query(query, params);
  //   return rows[0];
  // }

  /**
   * Busca um usuário pelo ID.
   * Se o adminDepartmentId for passado, aplica o escopo de segurança (IDOR prevention).
   * Se não for passado (ex: Support Master), busca globalmente.
   * @param {number} id 
   * @param {number} [adminDepartmentId] - Opcional para acessos globais
   * @returns {Object|null}
   */
  async findById(id, adminDepartmentId) {
    let query = 'SELECT * FROM users WHERE id = ?';
    let params = [id];
    
    // Só aplica o escopo se um departamento for exigido (Admin). 
    // Suporte passa direto por aqui e busca na base inteira.
    if (adminDepartmentId) {
      const scope = withDepartmentScope(query, params, adminDepartmentId);
      query = scope.query;
      params = scope.params;
    }
    
    const [rows] = await db.connection.query(query, params);
    return rows[0];
  }

  /**
   * Busca TODOS os usuários.
   * Filtra por departamento se fornecido, senão traz a base toda (para o Suporte).
   * @param {number} [adminDepartmentId]
   * @returns {Promise<Array>}
   */
  async findAll(adminDepartmentId) {
    let baseQuery = `
      SELECT u.id, u.name, u.email, u.role, u.status, u.is_active, u.department_id, u.created_at, d.name AS department_name 
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE 1=1
    `;
    
    let query = baseQuery;
    let params = [];

    if (adminDepartmentId) {
      const scope = withDepartmentScope(baseQuery, [], adminDepartmentId, 'u');
      query = scope.query;
      params = scope.params;
    } else {
      query += ' ORDER BY u.created_at DESC'; // Organiza do mais novo para o mais antigo
    }
    
    const [rows] = await db.connection.query(query, params);
    
    // Mapeando "name" para "nome" para manter compatibilidade exata com o front-end
    return rows.map(row => ({ ...row, nome: row.name }));
  }

  /**
   * Atualiza STATUS e ROLE na mesma requisição.
   * @param {number} id 
   * @param {string} status 
   * @param {string} role 
   */
  async updateStatusAndRole(id, status, role) {
    await db.connection.query(
      'UPDATE users SET status = ?, role = ? WHERE id = ?',
      [status, role, id]
    );
  }

  /**
   * Atualiza apenas o ROLE do usuário.
   * @param {number} id 
   * @param {string} role 
   */
  async updateRole(id, role) {
    await db.connection.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );
  }
  /**
   * Executa o combo de aprovação de cadastro: Status, Role e Ativação.
   * @param {number} id 
   * @param {string} role 
   */
  async approveAndActivate(id, role) {
    await db.connection.query(
      `UPDATE users 
       SET status = 'APPROVED', is_active = 1, role = ? 
       WHERE id = ?`,
      [role, id]
    );
  }

  /**
   * Altera a permissão de login do usuário (Bloqueio/Desbloqueio)
   * @param {number} id 
   * @param {number} isActive - 1 (Ativo) ou 0 (Inativo)
   */
  async updateIsActive(id, isActive) {
    await db.connection.query(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [isActive, id]
    );
  }
}

export default new UserRepository();