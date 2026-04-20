const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
   try {
      if (!schema) throw new Error("Schema não injetado");
      
      const data = req[source] || {};
      const parsed = schema.parse(data);

      // 👇 A CORREÇÃO: Trata o 'body' e o 'query' de formas diferentes
      if (source === 'body') {
        req.body = parsed; // Salva a pátria do painel antigo
      } else {
        Object.assign(req[source], parsed); // Atualiza os dados da URL com segurança
      }
      
      req.validatedData = parsed; // Mantém o controller novo funcionando

      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        const errorMessages = error.issues.map((err) => err.message);
        return res.status(400).json({
          success: false,
          error: errorMessages[0]
        });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao processar validação.' });
    }
  };
};

export default validateRequest;