import jwt from 'jsonwebtoken';

/**
 * Middleware de AUTENTICAÇÃO
 * Verifica se o usuário tem um token válido e quem ele é.
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.userRole = decoded.role;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

/**
 * Middleware de AUTORIZAÇÃO (Role-Based Access Control - RBAC)
 * Garante que apenas níveis de acesso específicos usem a rota (ex: ADMIN)
 */
export const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    
    if (!req.userRole) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (!requiredRoles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Acesso negado: privilégios insuficientes para esta ação.' });
    }

    return next();
  };
};