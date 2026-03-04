/**
 * DTO para criação de usuário.
 * Valida os dados de entrada e prepara o objeto para uso no serviço de autenticação.
 */
class CreateUserDTO {
  constructor(data) {
    this.name = data.name?.trim();
    this.email = data.email?.trim().toLowerCase();
    this.password = data.password;
    this.department_id = data.department_id;
    this.role = data.role || 'PROFESSOR';
  }
  /**
   * Valida os dados de entrada e retorna uma lista de erros, se houver.
   * @returns {Array} - Lista de mensagens de erro, ou vazia se os dados forem válidos.
   */
  validate() {
    const errors = [];
    if (!this.name || this.name.length < 3) {
      errors.push('O nome deve ter pelo menos 3 caracteres.');
    }
    
    if (!this.email ) {
      errors.push('É obrigatório usar um e-mail institucional válido.');
    }

    if (!this.password || this.password.length < 6) {
      errors.push('A senha deve ter no mínimo 6 caracteres.');
    }

    if (!this.department_id) {
      errors.push('O departamento/curso é obrigatório.');
    }

    return errors;
  }

}

export default CreateUserDTO;