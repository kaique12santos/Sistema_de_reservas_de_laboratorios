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
// Cancelar reserva
router.patch('/:id/cancel', authMiddleware, ReservationController.cancel);

// --- ROTAS DE APROVAÇÃO (Acesso Restrito a Admins) ---
// Listar reservas pendentes para aprovação
router.get(
  '/pending',
  authMiddleware,
  requireRole(['ADMIN']),
  ReservationController.pending
);

// Aprovar reserva específica
router.patch(
  '/:id/approve',
  authMiddleware,
  requireRole(['ADMIN']),
  ReservationController.approve
);

// Rejeitar reserva específica
router.patch(
  '/:id/reject',
  authMiddleware,
  requireRole(['ADMIN']),
  ReservationController.reject
);

// Redirecionar reserva aprovada para outro laboratório, data ou horário
router.patch(
  '/:id/redirect',
  authMiddleware,
  requireRole(['ADMIN']),
  ReservationController.redirect
);

export default router;