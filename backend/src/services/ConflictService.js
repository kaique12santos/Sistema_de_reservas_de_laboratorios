import ReservationRepository from '../repositories/ReservationRepository.js';

class ConflictService {
  async checkConflict(labId, datesOrDate, timeSlotIds, excludeReservationId = null) {
    // 1. Early return (antes de bater no banco)
    if (!timeSlotIds || timeSlotIds.length === 0 || !datesOrDate || datesOrDate.length === 0) {
      return {
        hasConflict: false,
        conflicts: [],
        conflictingSlots: [],
        message: null
      };
    }

    // 2. A MÁGICA: Normaliza a data (Se o Front mandar String da Simples, vira Array. Se mandar Array da Recorrente, segue o jogo)
    const datesToCheck = Array.isArray(datesOrDate) ? datesOrDate : [datesOrDate];

    // 3. Chama sempre a query otimizada (Bulk), já que ela suporta de 1 a N datas tranquilamente
    const conflicts = await ReservationRepository.findConflictingBulk(
      labId,
      datesToCheck,
      timeSlotIds,
      excludeReservationId
    );

    if (conflicts.length === 0) {
      return {
        hasConflict: false,
        conflicts: [],
        conflictingSlots: [],
        message: null
      };
    }

    // 4. Extrai os IDs dos horários exatos que deram problema
    const conflictingSlots = [
      ...new Set(conflicts.map(c => c.time_slot_id))
    ];

    const conflictingDates = [
      ...new Set(conflicts.map(c => c.date)) // Confirme se a coluna de data no seu banco se chama 'date' mesmo
    ];

    return {
      hasConflict: true,
      conflicts,
      conflictingSlots,
      conflictingDates,
      message: `Conflito detectado em ${datesToCheck.length > 1 ? 'múltiplas datas' : '1 data'} para ${conflictingSlots.length} horário(s).`
    };
  }
}

export default new ConflictService();