// scripts/seedData.ts
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User, Transaction } from '../models/index.js';
dotenv.config();
const users = [
    {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin'
    },
    {
        email: 'user@example.com',
        password: 'password123',
        name: 'Regular User',
        role: 'user'
    },
    {
        email: 'john@example.com',
        password: 'password123',
        name: 'John Doe',
        role: 'user'
    }
];
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
const generateTransactions = (userId, count) => {
    const transactions = [];
    for (let i = 0; i < count; i++) {
        const isCredit = Math.random() > 0.5;
        transactions.push({
            userId,
            type: isCredit ? 'credit' : 'debit',
            amount: Math.floor(Math.random() * 10000) + 100,
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            category: categories[Math.floor(Math.random() * categories.length)],
            status: Math.random() > 0.1 ? 'completed' : (Math.random() > 0.5 ? 'pending' : 'failed'),
            reference: `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date in last 30 days
        });
    }
    return transactions;
};
const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard');
        console.log('Connected to MongoDB');
        // Clear existing data
        await User.deleteMany({});
        await Transaction.deleteMany({});
        console.log('Cleared existing data');
        // Hash passwords for all users
        console.log('Hashing passwords...');
        const usersWithHashedPasswords = await Promise.all(users.map(async (user) => ({
            ...user,
            password: await bcrypt.hash(user.password, 12) // Salt rounds = 12 for good security
        })));
        // Create users with hashed passwords
        const createdUsers = await User.insertMany(usersWithHashedPasswords);
        console.log(`Created ${createdUsers.length} users with hashed passwords`);
        // Create transactions for each user
        const allTransactions = [];
        for (const user of createdUsers) {
            const userTransactions = generateTransactions(user._id.toString(), 50);
            allTransactions.push(...userTransactions);
        }
        await Transaction.insertMany(allTransactions);
        console.log(`Created ${allTransactions.length} transactions`);
        console.log('Data seeding completed successfully!');
        console.log('\nTest credentials (passwords are now hashed in database):');
        console.log('Admin: admin@example.com / password123');
        console.log('User: user@example.com / password123');
        console.log('John: john@example.com / password123');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};
seedData();
