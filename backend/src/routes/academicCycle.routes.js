import express from 'express';
import AcademicCycleController from '../controllers/AcademicCycleController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Públicas para usuários logados
router.get('/', authMiddleware, AcademicCycleController.index);
router.get('/active', authMiddleware, AcademicCycleController.active);

// APENAS SUPPORTER PODE GERAR NOVOS CICLOS E ATIVAR UM CICLO
router.post('/generate', authMiddleware, requireRole(['SUPPORT']), AcademicCycleController.generate);
router.put('/:id/activate', authMiddleware, requireRole(['SUPPORT']), AcademicCycleController.activate);

export default router;