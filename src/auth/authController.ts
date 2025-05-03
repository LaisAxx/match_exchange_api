import { Request, Response, NextFunction } from 'express';
import { AuthService } from './authService';


export class AuthController {

  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username } = req.body;

      if (!username) {
        res.status(400).json({ message: 'Username é obrigatório.' });
        return;
      }

      const { token, user } = await AuthService.register(username);

      res.status(201).json({ token, user });
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'Usuário já existe') {
        res.status(400).json({ message: errorMessage });
      } else {
        res.status(500).json({ message: 'Erro interno.' });
      }
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username } = req.body;

      if (!username) {
        res.status(400).json({ message: 'Username é obrigatório.' });
        return;
      }

      const { token, user } = await AuthService.login(username);

      res.json({ token, user });
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === 'Usuário não encontrado') {
        res.status(404).json({ message: errorMessage });
      } else {
        res.status(500).json({ message: 'Erro interno.' });
      }
    }
  }
}
