import { Server } from 'socket.io';
import http from 'http';

let io: Server;

export function initSocket(server: http.Server) {
    io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', socket => {
        console.log(`📡 Novo cliente conectado: ${socket.id}`);
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.io não inicializado');
    }
    return io;
}
