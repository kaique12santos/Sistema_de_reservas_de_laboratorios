import UserService from '../services/User.service.js';


class UserController {
  async getPending(req, res) {
    try {
    const adminDepartmentId = req.user.department_id; 
    
    const users = await UserService.listPendingUsers(adminDepartmentId);
    return res.json(users);
  } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async approve(req, res) {
    try {
      const { id } = req.params;
      const adminId = req.user.id; 
      const adminDepartmentId = req.user.userDepartmentId || req.user.department_id;
      
      const user = await UserService.approveUser(id, adminDepartmentId, adminId);
      res.json({ message: 'Usuário aprovado com sucesso', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async reject(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.user.id;
      const adminDepartmentId = req.user.userDepartmentId || req.user.department_id;
      
      const user = await UserService.rejectUser(id, adminDepartmentId, adminId, reason);
      res.json({ message: 'Usuário rejeitado', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();