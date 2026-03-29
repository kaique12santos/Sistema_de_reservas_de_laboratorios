import { z } from 'zod';

class UserApprovalDTO {
  static rejectSchema = z.object({
    reason: z.string({ required_error: 'Motivo da rejeição é obrigatório' })
      .min(5, 'O motivo deve ter pelo menos 5 caracteres')
      .trim()
  });
}

export default UserApprovalDTO;