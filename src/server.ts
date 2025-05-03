import 'reflect-metadata';
import { AppDataSource } from './db/data-source';
import app from './app';
import { initSocket } from './socket';
import http from 'http';

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Banco de dados conectado com sucesso!');

    server.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar no banco de dados:', error);
  });