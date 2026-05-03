import { z } from 'zod';

class ReservationDTO {
  static createSchema = z.object({
    lab_id: z.coerce
      .number()
      .int()
      .positive('lab_id deve ser maior que zero'),

    type: z.enum(['SIMPLE', 'RECURRING']).optional(),

    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
      .refine((val) => {
        const [year, month, day] = val.split('-').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        return (
          date.getUTCFullYear() === year &&
          date.getUTCMonth() + 1 === month &&
          date.getUTCDate() === day
        );
      }, 'Data inválida')
      .optional(),

    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
      .refine((val) => {
        const [year, month, day] = val.split('-').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        return (
          date.getUTCFullYear() === year &&
          date.getUTCMonth() + 1 === month &&
          date.getUTCDate() === day
        );
      }, 'Data inválida')
      .optional(),

    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
      .refine((val) => {
        const [year, month, day] = val.split('-').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day));
        return (
          date.getUTCFullYear() === year &&
          date.getUTCMonth() + 1 === month &&
          date.getUTCDate() === day
        );
      }, 'Data inválida')
      .optional(),

    weekdays: z.array(z.coerce.number().int().min(0).max(6)).optional(),

    time_slot_ids: z
      .array(z.coerce.number().int().positive())
      .min(1, 'Pelo menos um horário deve ser selecionado')
      .max(10, 'Máximo de 10 horários permitidos'),

    note: z.string().max(255, 'Nota deve ter no máximo 255 caracteres').optional()
  }).superRefine((data, ctx) => {
    if (data.type === 'RECURRING') {
      if (!data.start_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['start_date'],
          message: 'start_date é obrigatório para reservas recorrentes.'
        });
      }
      if (!data.end_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['end_date'],
          message: 'end_date é obrigatório para reservas recorrentes.'
        });
      }
      if (!data.weekdays || data.weekdays.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['weekdays'],
          message: 'Pelo menos um weekday deve ser informado para reservas recorrentes.'
        });
      }
    } else {
      if (!data.date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['date'],
          message: 'date é obrigatório para reservas simples.'
        });
      }
    }
  });
}

export default ReservationDTO;