import { Request, Response } from 'express';
import { transactionService } from '../services/transactionService.js';
import { AuthRequest } from '../middleware/auth.js';

export const transactionController = {
  async getTransactions(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { page, limit, sortBy, sortOrder, type, status, category, search } = req.query;

      const result = await transactionService.getTransactions({
        userId: req.userId,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as string,
        type: type as string,
        status: status as string,
        category: category as string,
        search: search as string,
      });

      res.json(result);
    } catch (error) {
      console.error('Get transactions controller error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getSummary(req: AuthRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const summary = await transactionService.getSummary(req.userId);

      res.json(summary);
    } catch (error) {
      console.error('Get summary controller error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
}; 