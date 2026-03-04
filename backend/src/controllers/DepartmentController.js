import DepartmentService from "../services/DepartmentService.js";

class DepartmentController {

  async getAllDepartments(req, res) {
    try {
      const departments = await DepartmentService.getAllDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new DepartmentController();