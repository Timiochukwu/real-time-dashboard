import { transactionService } from '../services/transactionService.js';
export const transactionController = {
    async getTransactions(req, res) {
        try {
            if (!req.userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            const { page, limit, sortBy, sortOrder, type, status, category, search } = req.query;
            const result = await transactionService.getTransactions({
                userId: req.userId,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                sortBy: sortBy,
                sortOrder: sortOrder,
                type: type,
                status: status,
                category: category,
                search: search,
            });
            res.json(result);
        }
        catch (error) {
            console.error('Get transactions controller error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async getSummary(req, res) {
        try {
            if (!req.userId) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            const summary = await transactionService.getSummary(req.userId);
            res.json(summary);
        }
        catch (error) {
            console.error('Get summary controller error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};
