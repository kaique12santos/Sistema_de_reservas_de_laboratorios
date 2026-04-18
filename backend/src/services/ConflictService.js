import ReservationRepository from '../repositories/ReservationRepository.js';

class ConflictService {
  async checkConflict(labId, date, timeSlotIds) {
    // Early return (antes de bater no banco)
    if (!timeSlotIds || timeSlotIds.length === 0) {
      return {
        hasConflict: false,
        conflicts: [],
        conflictingSlots: [],
        message: null
      };
    }

    const conflicts = await ReservationRepository.findConflicting(
      labId,
      date,
      timeSlotIds
    );

    if (conflicts.length === 0) {
      return {
        hasConflict: false,
        conflicts: [],
        conflictingSlots: [],
        message: null
      };
    }

    const conflictingSlots = [
      ...new Set(conflicts.map(c => c.time_slot_id))
    ];

    return {
      hasConflict: true,
      conflicts,
      conflictingSlots,
      message: `Conflito detectado para ${conflictingSlots.length} horário(s)`
    };
  }
}

export default new ConflictService();