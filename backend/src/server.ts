import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import { Redis } from 'ioredis';

import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import { authenticateSocket } from './middleware/auth.js';
import { generateMockTransaction } from './services/transactionService.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Redis client
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all routes
app.use(limiter);

// Create a stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Define empty event map interfaces as per Socket.IO documentation for default types
interface ClientToServerEvents {}
interface ServerToClientEvents {}
interface InterServerEvents {}
interface SocketData {}

// Extend Socket type to include userId, using the newly defined empty interfaces
interface AuthenticatedSocket extends Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
  userId?: string;
}

// Socket.IO connection handling
io.use(authenticateSocket);

io.on('connection', (socket: AuthenticatedSocket) => {
  console.log(`User connected: ${socket.userId}`);
  
  socket.join(`user_${socket.userId}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Simulate real-time transactions
const simulateRealTimeTransactions = () => {
  setInterval(async () => {
    try {
      const transaction = await generateMockTransaction();
      
      // Cache in Redis
      await redisClient.setex(
        `transaction:${transaction._id}`, 
        3600, 
        JSON.stringify(transaction)
      );
      
      // Emit to all connected clients
      io.emit('newTransaction', transaction);
      
      console.log('New transaction emitted:', transaction._id);
    } catch (error) {
      console.error('Error generating mock transaction:', error);
    }
  }, Math.random() * 10000 + 5000); // Random interval between 5-15 seconds
};

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard');
    console.log('MongoDB connected successfully');
    
    if (redisClient.status !== 'connecting' && redisClient.status !== 'ready') {
      await redisClient.connect();
      console.log('Redis connected successfully');
    } else {
      console.log(`Redis already ${redisClient.status}`);
    }
    
    // Start real-time simulation
    simulateRealTimeTransactions();
    
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});

export { io, redisClient };