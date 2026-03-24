/**
 * Middleware genérico para validação de dados usando Zod Schemas.
 * @param {import('zod').ZodSchema} schema - O schema estático do DTO
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // O Zod valida e já devolve o objeto limpo (sem espaços extras, em minúsculo, etc)
      req.body = schema.parse(req.body); 
      
      // Se passou, manda para o Controller
      next(); 
    } catch (error) {
      // Mapeia os erros do Zod para um array simples de mensagens
      const errorMessages = error.errors.map((err) => err.message);
      
      return res.status(400).json({
        success: false,
        error: "Erro de validação de dados.",
        details: errorMessages
      });
    }
  };
};

export default validateRequest;