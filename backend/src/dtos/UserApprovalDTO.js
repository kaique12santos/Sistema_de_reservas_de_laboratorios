import { z } from 'zod';

class UserApprovalDTO {
  static rejectSchema = z.object({
    reason: z.string({ required_error: 'Motivo da rejeição é obrigatório' })
      .min(5, 'O motivo deve ter pelo menos 5 caracteres')
      .trim()
  });

  static approveSchema = z.object({
    role: z.enum(['PROFESSOR', 'ADMIN', 'SUPPORT'], {
      required_error: 'O cargo é obrigatório para aprovação.',
      invalid_type_error: 'Cargo inválido. Escolha entre PROFESSOR, ADMIN ou SUPPORT.'
    }).optional()
    .catch(undefined)
  });

  static changeRoleSchema = z.object({
    role: z.enum(['PROFESSOR', 'ADMIN', 'SUPPORT'], {
      required_error: 'O novo cargo é obrigatório.',
      invalid_type_error: 'Cargo inválido. Escolha entre PROFESSOR, ADMIN ou SUPPORT.'
    })
  });
}

export default UserApprovalDTO;