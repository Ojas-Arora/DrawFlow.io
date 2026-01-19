import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initSocket(): Socket {
  if (socket) return socket;

  // Use Vite's import.meta.env for environment variables
  // For production, set VITE_SOCKET_URL in Vercel environment variables
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://whiteboard-backend-rzxs.onrender.com';
  
  console.log('🔌 Connecting to socket server:', SOCKET_URL);
  
  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
}

export function getSocket(): Socket {
  if (!socket) {
    return initSocket();
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
