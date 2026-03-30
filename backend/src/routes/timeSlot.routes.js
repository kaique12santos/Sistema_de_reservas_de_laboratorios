import { Router } from 'express';
import TimeSlotController from '../controllers/TimeSlotController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'; 
import validateRequest from '../middlewares/validateRequest.js'; 
import TimeSlotDTO from '../dtos/TimeSlotDTO.js'; 

const router = Router();

router.get('/', authMiddleware, TimeSlotController.index);

router.post('/', authMiddleware, requireRole(['ADMIN']), validateRequest(TimeSlotDTO.schema), TimeSlotController.create);
router.put('/:id', authMiddleware, requireRole(['ADMIN']), validateRequest(TimeSlotDTO.schema), TimeSlotController.update);
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), TimeSlotController.destroy);

export default router;