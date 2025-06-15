// routes/auth.ts
import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
// Login route
router.post('/login', authController.login);
// Register route
router.post('/register', authController.register);
// Get authenticated user's data route
router.get('/me', authenticateToken, authController.getMe);
export default router;
