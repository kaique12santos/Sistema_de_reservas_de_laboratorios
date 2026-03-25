import { z } from 'zod';

class LaboratoryDTO {
  static schema = z.object({
    name: z.string({ required_error: 'Nome é obrigatório' }).min(1, 'Nome não pode ser vazio').trim(),
    location: z.string().trim().optional(),
    capacity: z.number({ required_error: 'Capacidade é obrigatória', invalid_type_error: 'Capacidade deve ser um número' })
      .int()
      .positive('Capacidade deve ser maior que zero'),
    description_lab: z.string().trim().optional(),
    type: z.enum(['LABORATORIO', 'SALA DE AULA', 'AUDITORIO'], { 
      errorMap: () => ({ message: 'Tipo inválido. Valores aceitos: LABORATORIO, SALA DE AULA, AUDITORIO' })
    })
  })
  .superRefine((data, ctx) => {
    if (data.type === 'AUDITORIO' && data.capacity > 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A capacidade máxima para um Auditório é de 200 pessoas.',
        path: ['capacity'], // Aponta o erro direto para o campo de capacidade
      });
    } else if (data.type !== 'AUDITORIO' && data.capacity > 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `A capacidade máxima para um(a) ${data.type === 'LABORATORIO' ? 'Laboratório' : 'Sala de Aula'} é de 60 pessoas.`,
        path: ['capacity'],
      });
    }
  });
}

export default LaboratoryDTO;