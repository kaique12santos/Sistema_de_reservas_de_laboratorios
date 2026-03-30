import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import UserApprovalDTO from '../dtos/UserApprovalDTO.js';

const router = Router();


router.get('/pending', authMiddleware, requireRole(['ADMIN']), UserController.getPending);
router.patch('/:id/approve', authMiddleware, requireRole(['ADMIN']), UserController.approve);
router.patch('/:id/reject', authMiddleware, requireRole(['ADMIN']), validateRequest(UserApprovalDTO.rejectSchema), UserController.reject);

export default router;