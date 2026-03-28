import UserService from '../services/UserService.js';

class UserController {
  async getPending(req, res) {
    try {
      const users = await UserService.listPendingUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async approve(req, res) {
    try {
      const { id } = req.params;
      const adminId = req.user.id; 
      
      const user = await UserService.approveUser(id, adminId);
      res.json({ message: 'Usuário aprovado com sucesso', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async reject(req, res) {
    try {
      const { id } = req.params;
      const adminId = req.user.id;
      
      const user = await UserService.rejectUser(id, adminId);
      res.json({ message: 'Usuário rejeitado', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();