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
      const { role } = req.body; // Pegamos o cargo definido no modal do Front
      const adminId = req.user.id; 
      
      const adminDepartmentId = req.user.role === 'SUPPORT' ? null : (req.user.userDepartmentId || req.user.department_id);
      
      const user = await UserService.approveUser(id, adminDepartmentId, adminId, role);
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

  async getAll(req, res) {
    try {
      // Se o Support Master não tiver departamento, talvez seja bom prever um bypass aqui futuramente
     const departmentId = req.user.role === 'SUPPORT' ? null : req.user.department_id;
      
      const users = await UserService.listAllUsers(departmentId);
      return res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async changeRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      // Validação de segurança
      if (!['PROFESSOR', 'ADMIN', 'SUPPORT'].includes(role)) {
        return res.status(400).json({ error: 'Cargo inválido fornecido.' });
      }

      const user = await UserService.changeRole(id, role);
      return res.status(200).json({ message: 'Cargo alterado com sucesso', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async toggleStatus(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.toggleStatus(id);
      return res.status(200).json({ message: 'Status alterado com sucesso', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();