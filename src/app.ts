import 'reflect-metadata';
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { swaggerUi, swaggerDocument } from './common/swagger';
import authRoutes from './auth/authRoutes';
import userRoutes from './user/userRoutes';
import orderRoutes from './orders/routes/orderRoutes';
import matchRoutes from './orders/routes/matchRoutes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Documentação Swagger servida com base no arquivo .yaml
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('API Match Exchange Start! 🚀');
});

app.use('/api/v1/auth', authRoutes); 
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/matches', matchRoutes);

// Log das rotas registradas para debug
console.log('Rotas de /api/v1/orders registradas:');
orderRoutes.stack.forEach((r: any) => {
  if (r.route) {
    console.log(`➡️  ${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
  }
});

export default app;
