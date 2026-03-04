import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserRepository from '../repositories/UserRepository.js';
import EmailService from '../services/EmailService.js';
import UserModel from '../models/UserModel.js';

/**
 * Serviço de Autenticação.
 * Responsável por toda a lógica de negócio relacionada à autenticação de usuários,
 * como registro, login e geração de tokens JWT.
 * Segue o princípio de Separation of Concerns, isolando a lógica de autenticação.
 */
class AuthService {

    /**
     * 
     * @param {Object} data - Objeto contendo os dados de registro do usuário (name, email, password, department_id, role)
     * @returns {Object} - Retorna uma mensagem de sucesso, o ID do usuário e o email
     */
  async register(userDTO) {
    const { name, email, password, department_id, role } = userDTO;

    const existingUser = await UserRepository.findByEmail(email);
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const passwordHash = await bcrypt.hash(password, 10);

    let rawUserData;

    if (existingUser) {
      if (existingUser.status !== 'PENDING') {
        throw new Error(`Este e-mail já está cadastrado e a conta encontra-se: ${existingUser.status}`);
      }

      await UserRepository.updatePendingUser(existingUser.id, {
        name,
        password_hash: passwordHash,
        department_id: department_id || null,
        role: role || 'PROFESSOR',
        verification_token: verificationToken
      });
      rawUserData = { ...existingUser, name, department_id, role }
      
    } else {
      rawUserData = await UserRepository.create({
        name,
        email,
        password_hash: passwordHash,
        department_id: department_id || null,
        role: role || 'PROFESSOR',
        verification_token: verificationToken,
        status: 'PENDING'
      });
    }


    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const validationLink = `${frontendUrl}/verify?token=${verificationToken}`;
    
    await EmailService.sendVerificationCode(email, validationLink);

    const user = new UserModel(rawUserData);
    return {
      message: 'Cadastro registrado com sucesso. Verifique seu e-mail para confirmar a conta.',
      user: user.toSafeObject()
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

  async verifyEmail(token) {
    if (!token) throw new Error('Token não fornecido.');

    const user = await UserRepository.findByVerificationToken(token);
    
    if (!user) {
      throw new Error('Link de verificação inválido ou já utilizado.');
    }

    await UserRepository.clearVerificationToken(user.id);

    return { message: 'E-mail verificado com sucesso! Sua conta agora aguarda aprovação do administrador do seu curso.' };
  }
}

export default new AuthService();