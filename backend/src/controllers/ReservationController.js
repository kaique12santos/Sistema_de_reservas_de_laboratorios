import ConflictService from '../services/ConflictService.js';

class ReservationController {
    async checkConflict(req, res) {
    try {
        const { lab_id, date, time_slots } = req.query;
        const timeSlotIds = time_slots.split(',').map(Number);

        const result = await ConflictService.checkConflict(lab_id, date, timeSlotIds);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    }
}