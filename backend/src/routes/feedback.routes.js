import { Router } from 'express';
import FeedbackController from '../controllers/FeedbackController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Rota POST protegida para recebimento do Widget/Toast de feedback
router.post('/', authMiddleware, FeedbackController.create);

export default router;