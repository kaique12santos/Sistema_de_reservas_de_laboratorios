import { Router } from 'express';
import ReservationController from '../controllers/ReservationController.js';
import validateRequest from '../middlewares/validateRequest.js';
import CheckConflictDTO from '../dtos/CheckConflictDTO.js';
import ReservationDTO from '../dtos/ReservationDTO.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

// --- ROTAS DE LEITURA (Acesso Geral Logado) ---
router.get(
  '/check-conflict',
  authMiddleware,
  validateRequest(CheckConflictDTO.schema, 'query'),
  ReservationController.checkConflict
);

// Criar reserva simples
router.post(
  '/simple',
  authMiddleware,
  validateRequest(ReservationDTO.createSchema),
  ReservationController.createSimpleReservation
);

// Listar minhas reservas
router.get(
  '/my',
  authMiddleware,
  ReservationController.getMyReservations
);
router.patch('/:id/cancel', authMiddleware, ReservationController.cancel);

export default router;