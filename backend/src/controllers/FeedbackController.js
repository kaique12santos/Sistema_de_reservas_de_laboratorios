import FeedbackRepository from '../repositories/FeedbackRepository.js';

class FeedbackController {
  async create(req, res) {
    try {
      const { feature, rating, comment } = req.body;
      const userId = req.user.id; // Extraído automaticamente pelo seu authMiddleware

      // Validação básica de consistência dos dados
      if (!feature || rating === undefined) {
        return res.status(400).json({ error: 'Os campos "feature" e "rating" são obrigatórios.' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'A avaliação deve ser um valor numérico entre 1 e 5.' });
      }

      const feedbackId = await FeedbackRepository.create({
        user_id: userId,
        feature,
        rating,
        comment
      });

      return res.status(201).json({
        message: 'Feedback registrado com sucesso!',
        feedbackId
      });
    } catch (error) {
      console.error('[FeedbackController] Erro ao salvar feedback:', error.message);
      return res.status(500).json({ error: 'Erro interno ao processar a avaliação de satisfação.' });
    }
  }
}

export default new FeedbackController();