import { z } from 'zod';

class ReservationDTO {
  static createSchema = z.object({
    lab_id: z.coerce
      .number()
      .int()
      .positive('lab_id deve ser maior que zero'),

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
      }, 'Data inválida'),

    time_slot_ids: z
      .array(z.coerce.number().int().positive())
      .min(1, 'Pelo menos um horário deve ser selecionado')
      .max(10, 'Máximo de 10 horários permitidos'),

    note: z.string().max(255, 'Nota deve ter no máximo 255 caracteres').optional()
  });
}

export default ReservationDTO;