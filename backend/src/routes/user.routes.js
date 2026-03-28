import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import { verifyToken, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/pending', verifyToken, authorize(['ADMIN']), UserController.getPending);
router.put('/:id/approve', verifyToken, authorize(['ADMIN']), UserController.approve);
router.put('/:id/reject', verifyToken, authorize(['ADMIN']), UserController.reject);

export default router;