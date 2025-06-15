import { Transaction, User } from '../models';
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
    }
    catch (error) {
        console.error('Error generating mock transaction:', error);
        throw error;
    }
};
