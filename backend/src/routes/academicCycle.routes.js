import express from 'express';
import AcademicCycleController from '../controllers/AcademicCycleController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Públicas para usuários logados
router.get('/', authMiddleware, AcademicCycleController.index);
router.get('/active', authMiddleware, AcademicCycleController.active);

// APENAS ADMIN
// Rota mágica que faz o trabalho de 2 CRUDs inteiros:
router.post('/generate', authMiddleware, requireRole(['ADMIN']), AcademicCycleController.generate);
// Rota para mudar de semestre
router.put('/:id/activate', authMiddleware, requireRole(['ADMIN']), AcademicCycleController.activate);

export default router;