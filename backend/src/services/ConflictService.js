import ReservationRepository from '../repositories/ReservationRepository.js';

class ConflictService {
    async checkConflict(labId, date, timeSlotIds) {
        const conflicts = await ReservationRepository.findConflicting(
            labId, date, timeSlotIds
        );

        if (conflicts.length === 0) {
            return { hasConflict: false, conflicts: [] };
        }

        const conflictingSlots = conflicts.map(c => c.time_slot_id);
        return {
            hasConflict: true,
            conflicts: conflicts,
            conflictingSlots,
            message: `Conflito detectado para ${conflicts.length} horário(s) solicitado(s)`
        };
    }
}

export default new ConflictService();