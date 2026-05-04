import { z } from 'zod';

const validateDateLogic = (val) => {
  const [year, month, day] = val.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
};

class CheckConflictDTO {
  static schema = z.object({
    lab_id: z.coerce
      .number()
      .int()
      .positive('lab_id deve ser maior que zero'),

    // 1. Reserva Simples (Passou a ser .optional())
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
      .refine(validateDateLogic, 'Data inválida')
      .optional(),

    // 2. Reserva Recorrente (Nova chave que o Front está enviando)
    dates: z
      .string()
      .refine((val) => {
        // Como recebemos "2026-05-04,2026-05-05", precisamos quebrar e validar cada uma
        const datesArray = val.split(',');
        return datesArray.every(d => /^\d{4}-\d{2}-\d{2}$/.test(d) && validateDateLogic(d));
      }, 'A lista de datas (dates) contém formatos inválidos')
      .optional(),

    time_slots: z
      .string()
      .transform((val) => val.split(',').map(Number))
      .refine(
        (arr) =>
          arr.length > 0 &&
          arr.every((n) => Number.isInteger(n) && n > 0),
        'time_slots deve conter IDs válidos'
      )
  })
  // 3. A cereja do bolo: Obriga o front a mandar pelo menos UMA das duas!
  .refine((data) => data.date || data.dates, {
    message: "É obrigatório enviar 'date' (Reserva Simples) ou 'dates' (Reserva Recorrente)",
    path: ["date"]
  });
}

export default CheckConflictDTO;