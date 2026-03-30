import { z } from 'zod';

// Regex para aceitar formato HH:MM ou HH:MM:SS
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

class TimeSlotDTO {
  static schema = z.object({
    name: z.string({ required_error: 'Nome é obrigatório' })
      .min(1, 'Nome não pode ser vazio')
      .trim(),
    start_time: z.string({ required_error: 'Horário inicial é obrigatório' })
      .regex(timeRegex, 'Formato de hora inválido. Use HH:MM ou HH:MM:SS'),
    end_time: z.string({ required_error: 'Horário final é obrigatório' })
      .regex(timeRegex, 'Formato de hora inválido. Use HH:MM ou HH:MM:SS'),
    is_active: z.boolean().optional()
  });
}


export default TimeSlotDTO;