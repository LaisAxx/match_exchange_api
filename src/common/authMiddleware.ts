import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/authService';

interface JwtPayload {
  id: number;
  username: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token não fornecido.' });
    return;
  }

  try {
    const decoded = AuthService.verifyToken(token) as JwtPayload;
    req.user = decoded; // agora tipado corretamente
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
}
