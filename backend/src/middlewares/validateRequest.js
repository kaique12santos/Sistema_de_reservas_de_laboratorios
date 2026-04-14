const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      if (!schema) throw new Error("Schema não injetado");
      
      // 👈 Se o front mandar undefined, o Zod valida um objeto vazio {} sem quebrar o Node
      req.body = schema.parse(req.body || {}); 
      next();
    } catch (error) {
      if (error.name === 'ZodError') {
        // 👈 Usando .issues (que é o padrão oficial e blindado do Zod)
        const errorMessages = error.issues.map((err) => err.message);
        return res.status(400).json({ success: false, error: errorMessages[0] });
      }
      return res.status(500).json({ error: 'Erro interno ao processar validação.' });
    }
  };
};
export default validateRequest;