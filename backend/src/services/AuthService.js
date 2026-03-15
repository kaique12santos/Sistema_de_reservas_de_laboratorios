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
  async login({ email, password }) {
   

    const user = await UserRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // A nossa validação segura da senha ANTES do status
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    if (user.status === 'PENDING') {
      throw new Error('Sua conta ainda não foi Aprovada pelo coordenador do seu departamento.'
        + ' Aguarde a aprovação para poder acessar o sistema.'
      );
    }
    if (user.status === 'REJECTED') {
      throw new Error('Sua conta foi rejeitada. Entre em contato com o coordenador do seu departamento.');
    }
    if (user.status !== 'APPROVED') {
      throw new Error('Sua conta não está ativa. Entre em contato com o administrador.');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret_dev',
      { expiresIn: '1d' }
    );

    const safeUser = new UserModel(user).toSafeObject();

    return {
      user: safeUser,
      token
    };
  }

  /**
   * 
   * @param {string} token - Token de verificação recebido no e-mail do usuário 
   * @returns  {Object} - Retorna uma mensagem de sucesso ou lança um erro caso o token seja inválido ou já utilizado
   * 
   */
  async verifyEmail(token) {
    if (!token) {
      throw new Error('O link de verificação está incompleto. Verifique se copiou a URL inteira recebida no e-mail.');
    }

    const user = await UserRepository.findByVerificationToken(token);
    
    if (!user) {
      throw new Error(
        'Este link de verificação é inválido ou já foi utilizado. ' +
        'Se você já confirmou seu e-mail antes, tente fazer o login. ' +
        'Caso contrário, solicite um novo link de verificação na tela inicial.'
      );
    }

    await UserRepository.clearVerificationToken(user.id);

    return { message: 'E-mail verificado com sucesso! Sua conta agora aguarda aprovação do administrador do seu curso.' };
  }
}

export default new AuthService();