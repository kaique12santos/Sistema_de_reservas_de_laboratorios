import { Router } from 'express';
import ReservationController from '../controllers/ReservationController.js';
import validateRequest from '../middlewares/validateRequest.js';
import CheckConflictDTO from '../dtos/CheckConflictDTO.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// --- ROTAS DE LEITURA (Acesso Geral Logado) ---
router.get(
  '/check-conflict',
  authMiddleware,
  validateRequest(CheckConflictDTO.schema),
  ReservationController.checkConflict
);

export default router;