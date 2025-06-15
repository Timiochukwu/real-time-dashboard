// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
  userId?: string;
}

export interface AuthSocket extends Socket {
  userId?: string;
  userEmail?: string;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Authenticate token middleware triggered.');
  console.log('Authorization header:', authHeader);
  console.log('Extracted token:', token);

  if (!token) {
    console.log('No token provided.');
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    console.log('Token decoded successfully:', decoded);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const authenticateSocket = (socket: AuthSocket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    socket.userId = decoded.userId;
    socket.userEmail = decoded.email;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};