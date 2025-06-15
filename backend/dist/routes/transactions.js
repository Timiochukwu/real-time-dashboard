// routes/transactions.ts
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { transactionController } from '../controllers/transactionController.js';
const router = express.Router();
// Get transactions with pagination, sorting, and filtering
router.get('/', authenticateToken, transactionController.getTransactions);
// Get dashboard summary
router.get('/summary', authenticateToken, transactionController.getSummary);
export default router;
