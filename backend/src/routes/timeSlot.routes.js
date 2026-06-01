import { Router } from 'express';
import TimeSlotController from '../controllers/TimeSlotController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'; 
import validateRequest from '../middlewares/validateRequest.js'; 
import TimeSlotDTO from '../dtos/TimeSlotDTO.js'; 

const router = Router();

router.get('/', authMiddleware, TimeSlotController.index);

router.post('/', authMiddleware, requireRole(['SUPPORT']), validateRequest(TimeSlotDTO.schema), TimeSlotController.create);
router.put('/:id', authMiddleware, requireRole(['SUPPORT']), validateRequest(TimeSlotDTO.schema), TimeSlotController.update);
router.delete('/:id', authMiddleware, requireRole(['SUPPORT']), TimeSlotController.destroy);

export default router;