import { z } from 'zod';

class CheckConflictDTO {
    static schema = z.object({
        lab_id: z.coerce.number({
            required_error: 'ID do laboratório é obrigatório',
            invalid_type_error: 'ID do laboratório deve ser um número'
        }).int().positive('ID do laboratório deve ser maior que zero'),

        date: z.string({ required_error: 'Data é obrigatória' })
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),

        time_slots: z.string({ required_error: 'Horários são obrigatórios' })
            .regex(/^\d+(,\d+)*$/, 'time_slots deve ser uma lista de IDs separados por vírgula')
    });
}

export default CheckConflictDTO;