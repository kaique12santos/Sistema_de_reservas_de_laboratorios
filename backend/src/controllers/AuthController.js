import AuthService from '../services/AuthService.js';


/**
 * Controlador de Autenticação.
 * Responsável por receber as requisições HTTP relacionadas à autenticação,
 * como registro e login, e delegar a lógica de negócio para o AuthService.
 * Segue o princípio de Separation of Concerns, isolando a lógica de controle.
 */
class AuthController {

    /**
    * @param {Object} req - Objeto de requisição do Express contendo os dados do usuário a ser registrado
    * @param {Object} res - Objeto de resposta do Express para enviar a resposta ao cliente
    * @returns {Object} - Retorna o usuário criado (sem senha) e status PENDING ou um erro 
    */
  async register(req, res) {
    try {
      const { name, email, password, department_id, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
      }
      if (!department_id) {
        return res.status(400).json({ error: 'O departamento é obrigatório.' });
      }

      const result = await AuthService.register({ name, email, password, department_id, role });

      return res.status(201).json(result);
    } catch (error) {
      const statusCode = error.message.includes('já está cadastrado') ? 400 : 500;
      return res.status(statusCode).json({ error: error.message });
    }
  }

  /**
   * 
   * @param {Object} req - Objeto de requisição do Express contendo os dados do usuário que deseja logar
   * @param {Object} res - Objeto de resposta do Express para enviar a resposta ao cliente
   * @returns {Object} - Retorna os dados do usuário e o token JWT ou um erro 
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const session = await AuthService.login(email, password);
      
      return res.json(session);
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.body;
      const result = await AuthService.verifyEmail(token);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();