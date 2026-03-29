import { Router } from 'express';
import TimeSlotController from '../controllers/TimeSlotController';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, TimeSlotController.index);

router.post('/', authMiddleware, requireRole(['ADMIN']), TimeSlotController.create);
router.put('/:id', authMiddleware, requireRole(['ADMIN']), TimeSlotController.update);
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), TimeSlotController.destroy);