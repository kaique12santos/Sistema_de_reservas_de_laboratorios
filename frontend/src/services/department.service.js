import api from './api';

class DepartmentService {
  async getDepartments() {
    const response = await api.get('/departments');
    return response.data;
  }
}

export default new DepartmentService();