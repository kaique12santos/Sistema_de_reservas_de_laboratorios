import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';


/**
 * Serviço de Autenticação.
 * Responsável por toda a lógica de negócio relacionada à autenticação de usuários,
 * como registro, login e geração de tokens JWT.
 * Segue o princípio de Separation of Concerns, isolando a lógica de autenticação.
 */
class AuthService {

    /**
     * 
     * @param {Object} data - Objeto contendo os dados do usuário a ser registrado
     * @returns {Object} - Retorna o usuário criado (sem senha) e status PENDING 
     */
  async register(data) {
    const userExists = await UserRepository.findByEmail(data.email);

    if (userExists) {
      throw new Error('usuario já existe');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password, salt);

    const newUser = await UserRepository.create({
      ...data,
      password_hash,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      status: 'PENDING' // RF02 - Cadastro pendente
    };
  }

  /**
   * 
    * @param {string} email - Email do usuário que deseja logar
    * @param {string} password - Senha do usuário
    * @returns {Object} - Retorna os dados do usuário e o token JWT 
   */
  async login(email, password) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Comparar senha enviada com o hash do banco
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error('Senha inválida');
    }

    // Gerar Token JWT (RNF03)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_dev',
      { expiresIn: '1d' }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }
}

export default new AuthService();