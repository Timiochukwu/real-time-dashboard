// services/transactionService.ts
import mongoose from 'mongoose';
import { Transaction, User } from '../models/index.js';
import { redisClient } from '../server.js';

const categories = ['transfer', 'payment', 'deposit', 'withdrawal', 'refund', 'fee'];
const descriptions = [
  'Online purchase payment',
  'ATM withdrawal',
  'Bank transfer received',
  'Salary deposit',
  'Utility bill payment',
  'Refund processed',
  'Service fee',
  'International transfer',
  'Mobile payment',
  'Investment return'
];

export const generateMockTransaction = async () => {
  try {
    // Get random user
    const users = await User.find().select('_id');
    if (users.length === 0) {
      throw new Error('No users found');
    }
    
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    const transaction = new Transaction({
      userId: randomUser._id,
      type: Math.random() > 0.5 ? 'credit' : 'debit',
      amount: Math.floor(Math.random() * 10000) + 100, // $1 - $100
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      status: Math.random() > 0.1 ? 'completed' : (Math.random() > 0.5 ? 'pending' : 'failed'),
      reference: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
    });
    
    await transaction.save();
    await transaction.populate('userId', 'name email');
    
    return transaction;
  } catch (error) {
    console.error('Error generating mock transaction:', error);
    throw error;
  }
};

interface GetTransactionsParams {
  userId: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  type?: string;
  status?: string;
  category?: string;
  search?: string;
}

export const transactionService = {
  async getTransactions({ userId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', type, status, category, search }: GetTransactionsParams) {
    const pageNum = parseInt(page as any);
    const limitNum = parseInt(limit as any);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { userId };
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }

    const cacheKey = `transactions:${userId}:${JSON.stringify({ filter, skip, limitNum, sortBy, sortOrder })}`;
    const cachedResult = await redisClient.get(cacheKey);
    
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const sortObj: any = {};
    sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

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

    await redisClient.setex(cacheKey, 300, JSON.stringify(result));

    return result;
  },

  async getSummary(userId: string) {
    const cacheKey = `dashboard:summary:${userId}`;
    const cachedSummary = await redisClient.get(cacheKey);
    
    if (cachedSummary) {
      return JSON.parse(cachedSummary);
    }

    const [
      totalTransactions,
      completedTransactions,
      pendingTransactions,
      failedTransactions,
      totalCredits,
      totalDebits
    ] = await Promise.all([
      Transaction.countDocuments({ userId }),
      Transaction.countDocuments({ userId, status: 'completed' }),
      Transaction.countDocuments({ userId, status: 'pending' }),
      Transaction.countDocuments({ userId, status: 'failed' }),
      Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'credit', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'debit', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const totalCreditAmount = totalCredits[0]?.total || 0;
    const totalDebitAmount = totalDebits[0]?.total || 0;
    const totalBalance = totalCreditAmount - totalDebitAmount;

    // Create a formatter for USD currency
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const summary = {
      totalTransactions,
      totalBalance: {
        raw: totalBalance,
        formatted: formatter.format(totalBalance)
      },
      totalCredits: {
        raw: totalCreditAmount,
        formatted: formatter.format(totalCreditAmount)
      },
      totalDebits: {
        raw: totalDebitAmount,
        formatted: formatter.format(totalDebitAmount)
      },
      transactionsByStatus: {
        completed: completedTransactions,
        pending: pendingTransactions,
        failed: failedTransactions
      }
    };

    await redisClient.setex(cacheKey, 120, JSON.stringify(summary));

    return summary;
  }
};