import TimeSlotService from '../services/TimeSlotService.js';

class TimeSlotController {
    async index (req, res) {
        try {
            const isAdmin = req.userRole?.toUpperCase() === 'ADMIN';
            const includeInactive = isAdmin && req.query.include_inactive === 'true';

            const timeSlot = await TimeSlotService.listTimeSlots(includeInactive);
            return res.status(200).json(timeSlot);
        } catch (error) {
            console.error('[-1] ERRO ESTOUROU NO INDEX:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const newTimeSlot = await TimeSlotService.createTimeSlot(req.body);
            return res.status(201).json(newTimeSlot);
        } catch (error) {
            const status = error.message.includes('Já existe') ? 400 : 500;
            return res.status(status).json({ error: error.message });
        }
    }

    async update(req, res) {
        try{
            const updatedTimeSlot = await TimeSlotService.updateTimeSlot(req.params.id, req.body);
            return res.status(200).json(updatedTimeSlot);
        } catch (error){
            const status = error.message.includes('não encontrado') ? 404 : 400;
            return res.status(status).json({ error: error.message });
        }
    }

    async destroy(req, res) {
        try{
            const destroyedTimeSlot = await TimeSlotService.deleteTimeSlot(req.params.id);
            return res.status(200).json(destroyedTimeSlot);
        } catch (error){
            const status = error.message.includes('não encontrado') ? 404 : 400;
            return res.status(status).json({ error: error.message });
        }
    }
}

export default new TimeSlotController();