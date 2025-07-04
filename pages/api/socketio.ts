import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';

export interface SocketServer extends SocketIOServer {
  room?: string;
}

export interface SocketWithIO extends NetServer {
  io?: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: {
    server: SocketWithIO;
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new SocketIOServer(res.socket.server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a session room
    socket.on('join-session', (data: { sessionId: string; userId: string; userType: string }) => {
      const { sessionId, userId, userType } = data;
      socket.join(sessionId);
      socket.to(sessionId).emit('user-joined', { userId, userType, socketId: socket.id });
      console.log(`User ${userId} joined session ${sessionId}`);
    });

    // Leave a session room
    socket.on('leave-session', (data: { sessionId: string; userId: string }) => {
      const { sessionId, userId } = data;
      socket.leave(sessionId);
      socket.to(sessionId).emit('user-left', { userId, socketId: socket.id });
      console.log(`User ${userId} left session ${sessionId}`);
    });

    // WebRTC signaling
    socket.on('offer', (data: { to: string; offer: any; from: string }) => {
      socket.to(data.to).emit('offer', { offer: data.offer, from: data.from });
    });

    socket.on('answer', (data: { to: string; answer: any; from: string }) => {
      socket.to(data.to).emit('answer', { answer: data.answer, from: data.from });
    });

    socket.on('ice-candidate', (data: { to: string; candidate: any; from: string }) => {
      socket.to(data.to).emit('ice-candidate', { candidate: data.candidate, from: data.from });
    });

    // Chat messages
    socket.on('send-message', (data: { sessionId: string; message: string; userId: string; userName: string }) => {
      socket.to(data.sessionId).emit('new-message', {
        message: data.message,
        userId: data.userId,
        userName: data.userName,
        timestamp: new Date().toISOString(),
      });
    });

    // Screen sharing
    socket.on('screen-share-start', (data: { sessionId: string; userId: string }) => {
      socket.to(data.sessionId).emit('screen-share-started', { userId: data.userId });
    });

    socket.on('screen-share-stop', (data: { sessionId: string; userId: string }) => {
      socket.to(data.sessionId).emit('screen-share-stopped', { userId: data.userId });
    });

    // Recording controls
    socket.on('start-recording', (data: { sessionId: string; userId: string }) => {
      socket.to(data.sessionId).emit('recording-started', { userId: data.userId });
    });

    socket.on('stop-recording', (data: { sessionId: string; userId: string }) => {
      socket.to(data.sessionId).emit('recording-stopped', { userId: data.userId });
    });

    // Session controls
    socket.on('mute-user', (data: { sessionId: string; targetUserId: string; muted: boolean }) => {
      socket.to(data.sessionId).emit('user-muted', { userId: data.targetUserId, muted: data.muted });
    });

    socket.on('remove-user', (data: { sessionId: string; targetUserId: string }) => {
      socket.to(data.sessionId).emit('user-removed', { userId: data.targetUserId });
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  res.socket.server.io = io;
  res.end();
};

export default SocketHandler; 