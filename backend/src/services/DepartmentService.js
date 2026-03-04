import DepartmentRepository from "../repositories/DepartmentRepository.js";

class DepartmentService {

  async getAllDepartments() {
    return await DepartmentRepository.findAll();
  }

}

export default new DepartmentService();