import { Request, Response } from 'express';
import { AppDataSource } from '../db/data-source';
import { User } from '../auth/authEntity';

export class UserController {
  static async getUser(req: Request, res: Response) {
    try {
      const username = (req as any).user.username;
      const user = await AppDataSource.getRepository(User).findOneBy({ username });

      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar dados do usuário.' });
    }
  }
}
