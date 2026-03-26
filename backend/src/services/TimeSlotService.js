import TimeSlotRepository from '../repositories/TimeSlotRepository.js';

class TimeSlotService {
    async listTimeSlots(includeInactive = false)
    {
        return await TimeSlotRepository.findAll(includeInactive);
    }

    async createTimeSlot(dto) {
        if (!dto.name) throw new Error('Nome é obrigatório');
        if (!dto.start_time || !dto.end_time) throw new Error('Horários são obrigatórios');
        if (dto.start_time >= dto.end_time) throw new Error('Horário inicial deve ser anterior ao final');

        const existing = await TimeSlotRepository.findByName(dto.name);
        if (existing) throw new Error('Já existe um horário com este nome');

        return await TimeSlotRepository.create(dto);
    }

    async updateTimeSlot(id, dto){
        const timeSlot = await TimeSlotRepository.findById(id);
        if (!timeSlot) throw new Error ('Horário não encontrado.');

        if (dto.name !== timeSlot.name) {
            const existingTimeSlot = await TimeSlotRepository.findByName(dto.name);
            if (existingTimeSlot && existingTimeSlot.id !==Number(id)) {
                throw new Error ('Já existe um horário com este nome.');
            }
        }
        return await TimeSlotRepository.update(id,dto);
    }

    async deleteTimeSlot(id) {
        const timeSlot = await TimeSlotRepository.findById(id);
        if (!timeSlot) throw new Error ('Horário não encontrado.');

        const hasReservations = await TimeSlotRepository.hasActiveReservations(id);
        if (hasReservations) {
            throw new Error('Horário possui reservas futuras. Não pode ser inativado.');
        }
        return await TimeSlotRepository.softDelete(id);
    }
}

export default new TimeSlotService();