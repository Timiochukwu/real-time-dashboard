// routes/transactions.ts
import express from 'express';
import { Transaction, User } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { redisClient } from '../server.js';
const router = express.Router();
// Get transactions with pagination, sorting, and filtering
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, // Set default limit to 20
        sortBy = 'createdAt', sortOrder = 'desc', type, status, category, search } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build filter query
        const filter = {};
        if (type)
            filter.type = type;
        if (status)
            filter.status = status;
        if (category)
            filter.category = category;
        if (search) {
            filter.$or = [
                { description: { $regex: search, $options: 'i' } },
                { reference: { $regex: search, $options: 'i' } }
            ];
        }
        // Check Redis cache first
        const cacheKey = `transactions:${JSON.stringify({ filter, skip, limitNum, sortBy, sortOrder })}`;
        const cachedResult = await redisClient.get(cacheKey);
        if (cachedResult) {
            return res.json(JSON.parse(cachedResult));
        }
        // Build sort object
        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const [transactions, total] = await Promise.all([
            Transaction.find(filter)
                .sort(sortObj)
                .skip(skip)
                .limit(limitNum)
                .populate('userId', 'name email')
                .lean(),
            Transaction.countDocuments(filter)
        ]);
        const result = {
            transactions,
            pagination: {
                current: pageNum,
                pages: Math.ceil(total / limitNum),
                total,
                hasNext: pageNum < Math.ceil(total / limitNum),
                hasPrev: pageNum > 1,
                limit: limitNum
            }
        };
        // Cache result for 5 minutes
        await redisClient.setex(cacheKey, 300, JSON.stringify(result));
        res.json(result);
    }
    catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Get dashboard summary
router.get('/summary', authenticateToken, async (req, res) => {
    try {
        const cacheKey = 'dashboard:summary';
        const cachedSummary = await redisClient.get(cacheKey);
        if (cachedSummary) {
            return res.json(JSON.parse(cachedSummary));
        }
        const [totalUsers, totalTransactions, completedTransactions, pendingTransactions, failedTransactions, totalCredits, totalDebits] = await Promise.all([
            User.countDocuments(),
            Transaction.countDocuments(),
            Transaction.countDocuments({ status: 'completed' }),
            Transaction.countDocuments({ status: 'pending' }),
            Transaction.countDocuments({ status: 'failed' }),
            Transaction.aggregate([
                { $match: { type: 'credit', status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Transaction.aggregate([
                { $match: { type: 'debit', status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);
        const totalCreditAmount = totalCredits[0]?.total || 0;
        const totalDebitAmount = totalDebits[0]?.total || 0;
        const totalBalance = totalCreditAmount - totalDebitAmount;
        const summary = {
            totalUsers,
            totalTransactions,
            totalBalance,
            totalCredits: totalCreditAmount,
            totalDebits: totalDebitAmount,
            transactionsByStatus: {
                completed: completedTransactions,
                pending: pendingTransactions,
                failed: failedTransactions
            }
        };
        // Cache for 2 minutes
        await redisClient.setex(cacheKey, 120, JSON.stringify(summary));
        res.json(summary);
    }
    catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
