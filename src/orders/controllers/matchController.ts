import { Request, Response } from 'express';
import { AppDataSource } from '../../db/data-source';
import { Match } from '../entities/matchEntity';

export class MatchController {
  static async listMatches(req: Request, res: Response) {
    try {
      const repo = AppDataSource.getRepository(Match);
      const matches = await repo.find({
        order: { created_at: 'DESC' },
        take: 50,
      });
      res.json(matches);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao listar negócios.' });
    }
  }
}
