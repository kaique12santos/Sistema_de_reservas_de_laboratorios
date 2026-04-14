import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import UserApprovalDTO from '../dtos/UserApprovalDTO.js';

const router = Router();


router.get('/pending', authMiddleware, requireRole(['ADMIN']), UserController.getPending);
router.patch('/:id/approve', authMiddleware, requireRole(['ADMIN']), validateRequest(UserApprovalDTO.approveSchema), UserController.approve);
router.patch('/:id/reject', authMiddleware, requireRole(['ADMIN']), validateRequest(UserApprovalDTO.rejectSchema), UserController.reject);

router.get('/', authMiddleware, requireRole(['SUPPORT']), UserController.getAll);
router.patch('/:id/role', authMiddleware, requireRole(['SUPPORT']),validateRequest(UserApprovalDTO.changeRoleSchema), UserController.changeRole);
router.patch('/:id/toggle-status', authMiddleware, requireRole(['SUPPORT']), UserController.toggleStatus);
export default router;