import { Router } from 'express';
import AuditController from '../controllers/AuditController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';
const router = Router();

// Somente Administradores acessam a trilha de auditoria
router.get('/user/:userId', authMiddleware, requireRole(['ADMIN']), AuditController.getByUser);
router.get('/:table/:id', authMiddleware, requireRole(['ADMIN']), AuditController.getByRecord);

export default router;