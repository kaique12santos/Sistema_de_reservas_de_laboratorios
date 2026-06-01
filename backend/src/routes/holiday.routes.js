import express from 'express';
const router = express.Router();
import HolidayController from '../controllers/HolidayController.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

// Público (autenticado) — professor/coordenador precisa saber os feriados
router.get('/', authMiddleware, HolidayController.index);

// SUPPORT only — Rota para forçar/iniciar a sincronização de um ciclo
router.post('/sync', authMiddleware, requireRole(['SUPPORT']), HolidayController.sync);

export default router;