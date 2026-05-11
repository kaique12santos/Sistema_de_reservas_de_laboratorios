import { z } from 'zod';

class OverwriteReservationDTO {
  static schema = z.object({
    lab_id: z.number({ required_error: 'O ID do laboratório é obrigatório' }).int().positive(),
    date: z.string({ required_error: 'A data é obrigatória' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido. Use YYYY-MM-DD.'),
    time_slot_ids: z.array(z.number().int().positive())
      .min(1, 'Pelo menos um horário deve ser selecionado.'),
    notes: z.string().trim().optional()
  });
}

export default OverwriteReservationDTO;