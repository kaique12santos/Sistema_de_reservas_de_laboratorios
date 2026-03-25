/**
 * Middleware genérico para validação de dados usando Zod Schemas.
 * @param {import('zod').ZodSchema} schema - O schema estático do DTO
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // 🚨 Mapeador de problemas: Se o schema chegar vazio, a gente avisa na hora!
      if (!schema) {
        throw new Error("O schema de validação não foi injetado corretamente na rota!");
      }

      console.log('\n[🔎 DEBUG ZOD] Body recebido do Front-end:');
      console.log(JSON.stringify(req.body, null, 2));
      console.log('-------------------------------------------\n');
      // O Zod valida e já devolve o objeto limpo
      req.body = schema.parse(req.body); 
      
      // Se passou, manda para o Controller
      next(); 
    } catch (error) {
      if (error.name === 'ZodError') {
        const errorMessages = error.errors.map((err) => err.message);
        
        // Manda o erro pro Toast do Front-end!
        return res.status(400).json({
          success: false,
          error: errorMessages[0], 
          details: errorMessages
        });
      }

      // 🔴 Se não for um erro do Zod, é um erro no nosso código (como o schema undefined)
      console.error('[-1] Erro CRÍTICO no middleware de validação:', error);
      return res.status(500).json({ error: 'Erro interno ao processar validação.' });
    }
  };
};

export default validateRequest;