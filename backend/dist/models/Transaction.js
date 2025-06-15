// models/Transaction.ts
import mongoose, { Schema } from 'mongoose';
const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['transfer', 'payment', 'deposit', 'withdrawal', 'refund', 'fee']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    reference: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 });
transactionSchema.index({ status: 1 });
export const Transaction = mongoose.model('Transaction', transactionSchema);
