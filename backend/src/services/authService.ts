import { User, IUser } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface AuthResult {
  success: boolean;
  message?: string;
  token?: string;
  user?: { id: string; email: string; name: string; role: string };
}

export const authService = {
  async registerUser(name: string, email: string, password: string): Promise<AuthResult> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return {
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  },

  async loginUser(email: string, password: string): Promise<AuthResult> {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return { success: false, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  },

  async getUserById(userId: string): Promise<AuthResult> {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }
}; 