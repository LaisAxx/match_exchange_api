import jwt from 'jsonwebtoken';
import { AppDataSource } from '../db/data-source';
import { User } from './authEntity';

const userRepository = AppDataSource.getRepository(User);

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export class AuthService {

  static async register(username: string): Promise<{ token: string; user: User }> {
    const existingUser = await userRepository.findOneBy({ username });

    if (existingUser) {
      throw new Error('Usuário já existe');
    }

    const user = userRepository.create({
      username,
      usdBalance: 100000,
      btcBalance: 100,
    });

    await userRepository.save(user);

    const token = jwt.sign(
      { username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user };
  }

  static async login(username: string): Promise<{ token: string; user: User }> {
    const user = await userRepository.findOneBy({ username });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const token = jwt.sign(
      { username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, user };
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}
