import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import User from './models/User.js';
import Board from './models/Board.js';
import DrawingEvent from './models/DrawingEvent.js';
import ChatMessage from './models/ChatMessage.js';

dotenv.config();

const app = express();
const server = createServer(app);

// Get allowed origins for CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://collaborative-white-board-wheat.vercel.app',
];

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.static('dist'));

// MongoDB Connection with retry logic
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/whiteboard';
const DB_NAME = process.env.DB_NAME || 'whiteboard';
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(`🌍 Environment: ${NODE_ENV}`);
console.log(`📡 MongoDB URI: ${MONGO_URI.substring(0, 50)}...`);
console.log(`📦 Database: ${DB_NAME}`);

let isDBConnected = false;

const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGO_URI, {
        dbName: DB_NAME,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log('✅ MongoDB connected successfully');
      isDBConnected = true;
      
      // Monitor connection events
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB disconnected');
        isDBConnected = false;
      });
      
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
        isDBConnected = false;
      });
      
      return;
    } catch (err: any) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in 3 seconds... (${retries - i - 1} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }
  console.error('❌ MongoDB connection failed after all retries');
  console.error('⚠️ Check your MongoDB Atlas Network Access settings:');
  console.error('   1. Go to MongoDB Atlas → Security → Network Access');
  console.error('   2. Click "Add IP Address"');
  console.error('   3. Either add your current IP or allow 0.0.0.0/0 for testing');
  process.exit(1);
};

connectDB();

// Middleware to check DB connection
const checkDBConnection = (req: any, res: any, next: any) => {
  if (!isDBConnected) {
    return res.status(503).json({ 
      error: 'Database connection unavailable',
      message: 'MongoDB is not connected. Please check your connection settings.'
    });
  }
  next();
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    db: isDBConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
});

// Apply DB check to all protected routes
app.use('/api/', checkDBConnection);

app.post('/api/user/create', async (req, res) => {
  try {
    const { username, isAnonymous } = req.body;
    const userId = uuidv4();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    const userColor = colors[Math.floor(Math.random() * colors.length)];

    const user = await User.create({
      userId,
      username: username || `User-${Math.random().toString(36).substr(2, 9)}`,
      color: userColor,
      isAnonymous: isAnonymous !== false,
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
});

app.post('/api/board/create', async (req, res) => {
  try {
    const { userId, title } = req.body;
    const boardId = uuidv4();

    const board = await Board.create({
      boardId,
      title: title || 'Untitled Board',
      createdBy: userId,
      activeUsers: [userId],
    });

    res.json({ success: true, board });
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({ success: false, error: 'Failed to create board' });
  }
});

app.get('/api/board/:boardId/history', async (req, res) => {
  try {
    const { boardId } = req.params;
    const events = await DrawingEvent.find({ boardId }).sort({ createdAt: 1 }).exec();

    res.json({
      success: true,
      drawingEvents: events,
      // Chat messages are real-time only, not stored in DB
      chatMessages: [],
    });
  } catch (error) {
    console.error('Error fetching board history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch board history' });
  }
});

// Socket.io Events
const activeUsers: Map<string, { userId: string; boardId: string; username: string; color: string }> = new Map();
const boardRooms: Map<string, Set<string>> = new Map();
const userCursors: Map<string, { odId: string; boardId: string; x: number; y: number; isDrawing: boolean }> = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-board', async (data: { userId: string; boardId: string; username: string; color: string }) => {
    const { userId, boardId, username, color } = data;
    socket.join(boardId);

    activeUsers.set(socket.id, { userId, boardId, username, color });

    if (!boardRooms.has(boardId)) {
      boardRooms.set(boardId, new Set());
    }
    boardRooms.get(boardId)!.add(socket.id);

    // Update board active users
    try {
      await Board.findOneAndUpdate(
        { boardId },
        { $addToSet: { activeUsers: userId } },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating board:', error);
    }

    // Get all active users in the room with their details
    const roomUsers: { odId: string; username: string; color: string }[] = [];
    boardRooms.get(boardId)?.forEach((socketId) => {
      const user = activeUsers.get(socketId);
      if (user) {
        roomUsers.push({ odId: user.userId, username: user.username, color: user.color });
      }
    });

    // Notify all users in the room
    io.to(boardId).emit('user-joined', {
      odId: userId,
      username,
      color,
      activeUsersCount: boardRooms.get(boardId)?.size || 0,
      allUsers: roomUsers,
    });

    console.log(`User ${username} joined board ${boardId}`);
  });

  // Cursor movement tracking
  socket.on('cursor-move', (data: { boardId: string; x: number; y: number; isDrawing: boolean }) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    const { boardId, x, y, isDrawing } = data;
    
    // Store cursor position
    userCursors.set(socket.id, { odId: user.userId, boardId, x, y, isDrawing });

    // Broadcast cursor to all other users in the room
    socket.to(boardId).emit('cursor-update', {
      odId: user.userId,
      username: user.username,
      color: user.color,
      x,
      y,
      isDrawing,
    });
  });

  socket.on('draw', async (data: { boardId: string; x: number; y: number; prevX: number; prevY: number; color: string; lineWidth: number; tool: string }) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    const { boardId, x, y, prevX, prevY, color, lineWidth, tool } = data;

    // Broadcast to all users in the room
    socket.to(boardId).emit('draw', {
      x,
      y,
      prevX,
      prevY,
      color,
      lineWidth,
      tool,
      userId: user.userId,
      username: user.username,
    });

    // Save to database
    try {
      await DrawingEvent.create({
        boardId,
        userId: user.userId,
        eventType: tool === 'eraser' ? 'erase' : 'draw',
        data: {
          x,
          y,
          prevX,
          prevY,
          color: tool === 'eraser' ? '#FFFFFF' : color,
          lineWidth: tool === 'eraser' ? 20 : lineWidth,
          tool,
        },
      });
    } catch (error) {
      console.error('Error saving drawing event:', error);
    }
  });

  socket.on('clear-board', async (boardId: string) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    io.to(boardId).emit('clear-board');

    try {
      await DrawingEvent.create({
        boardId,
        userId: user.userId,
        eventType: 'clear',
        data: {},
      });
    } catch (error) {
      console.error('Error saving clear event:', error);
    }
  });

  socket.on('chat-message', (data: { boardId: string; message: string }) => {
    const user = activeUsers.get(socket.id);
    if (!user) return;

    const { boardId, message } = data;

    const chatMessage = {
      odId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.userId,
      username: user.username,
      message,
      userColor: user.color,
      createdAt: new Date(),
    };

    // Broadcast to all users in the room (including sender)
    io.to(boardId).emit('chat-message', chatMessage);
    console.log(`💬 Chat message from ${user.username} in board ${boardId.slice(0, 8)}...`);
  });

  socket.on('disconnect', async () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      const { boardId, userId, username } = user;

      // Remove from active users and cursors
      activeUsers.delete(socket.id);
      userCursors.delete(socket.id);
      const room = boardRooms.get(boardId);
      if (room) {
        room.delete(socket.id);
      }

      // Check if user has other connections
      const hasOtherConnections = Array.from(activeUsers.values()).some(
        (u) => u.userId === userId && u.boardId === boardId
      );

      if (!hasOtherConnections) {
        // Update board active users
        try {
          await Board.findOneAndUpdate(
            { boardId },
            { $pull: { activeUsers: userId } },
            { new: true }
          );
        } catch (error) {
          console.error('Error updating board on disconnect:', error);
        }
      }

      // Notify about cursor removal
      io.to(boardId).emit('cursor-remove', { odId: userId });

      io.to(boardId).emit('user-left', {
        odId: userId,
        username,
        activeUsersCount: room?.size || 0,
      });

      console.log(`User ${username} left board ${boardId}`);
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
