import { Router } from 'express';
import LaboratoryController from '../controllers/LaboratoryController.js';
import validateRequest from '../middlewares/validateRequest.js'; // Nosso guardião do Zod
import LaboratoryDTO from '../dtos/LaboratoryDTO.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js'; // O seu arquivo real

const router = Router();

// --- ROTAS DE LEITURA (Acesso Geral Logado) ---
// Qualquer usuário com token válido pode ver os laboratórios
router.get('/', authMiddleware, LaboratoryController.index);
router.get('/:id', authMiddleware, LaboratoryController.show);

// --- ROTAS DE ESCRITA (Somente ADMIN) ---

// Criar Laboratório
router.post(
  '/', 
  authMiddleware,               // 1. Está logado?
  requireRole(['ADMIN']),       // 2. É Admin?
  validateRequest(LaboratoryDTO.schema), // 3. Dados são válidos?
  LaboratoryController.create   // 4. Salva!
);

// Atualizar Laboratório
router.put(
  '/:id', 
  authMiddleware, 
  requireRole(['ADMIN']), 
  validateRequest(LaboratoryDTO.schema), 
  LaboratoryController.update
);

// desativar Laboratório
router.patch(
  '/:id/toggle-status', 
  authMiddleware, 
  requireRole(['ADMIN']), 
  LaboratoryController.toggleStatus
);

export default router;