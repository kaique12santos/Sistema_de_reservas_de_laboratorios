import { z } from 'zod';

class CheckConflictDTO {
  static schema = z.object({
    lab_id: z.coerce
      .number()
      .int()
      .positive('lab_id deve ser maior que zero'),

    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
      .refine((val) => {
        const [year, month, day] = val.split('-').map(Number);

        // Cria data em UTC para evitar problemas de timezone
        const date = new Date(Date.UTC(year, month - 1, day));

        return (
          date.getUTCFullYear() === year &&
          date.getUTCMonth() + 1 === month &&
          date.getUTCDate() === day
        );
      }, 'Data inválida'),

    time_slots: z
      .string()
      .transform((val) => val.split(',').map(Number))
      .refine(
        (arr) =>
          arr.length > 0 &&
          arr.every((n) => Number.isInteger(n) && n > 0),
        'time_slots deve conter IDs válidos'
      )
  });
}

export default CheckConflictDTO;