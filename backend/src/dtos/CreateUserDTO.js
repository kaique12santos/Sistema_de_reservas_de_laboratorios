import { z } from 'zod';

/**
 * DTO para criação de usuário no Sistema de Reservas.
 * Encapsula as regras de validação usando Zod.
 */
class CreateUserDTO {
  // Propriedade estática contendo o contrato de dados
  static schema = z.object({
    name: z.string({ required_error: 'O nome é obrigatório.' })
      .trim()
      .min(3, 'O nome deve ter pelo menos 3 caracteres.'),
      
    email: z.string({ required_error: 'O e-mail é obrigatório.' })
      .trim()
      .toLowerCase()
      .email('É obrigatório usar um e-mail válido.'),
      // Se quiser forçar o e-mail da Fatec no futuro, basta descomentar a linha abaixo:
      // .endsWith('@fatec.sp.gov.br', 'Utilize o e-mail institucional.'),
      
    password: z.string({ required_error: 'A senha é obrigatória.' })
      .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
      
    department_id: z.any({ required_error: 'O departamento/curso é obrigatório.' }),
    
    role: z.enum(['PROFESSOR', 'COORDENADOR', 'SUPORTE'])
      .default('PROFESSOR'),
  });
}

export default CreateUserDTO;