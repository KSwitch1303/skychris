import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  category: string;
  recipient?: {
    accountNumber?: string;
    bankName?: string;
    name?: string;
  };
  sender?: {
    accountNumber?: string;
    bankName?: string;
    name?: string;
  };
  balanceAfter: number;
  metadata?: object;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    category: {
      type: String,
      required: true,
    },
    recipient: {
      accountNumber: String,
      bankName: String,
      name: String,
    },
    sender: {
      accountNumber: String,
      bankName: String,
      name: String,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    }
  },
  {
    timestamps: true,
  }
);

// Create reference index for faster queries
TransactionSchema.index({ reference: 1 });

// Create compound index for user's transactions for faster queries
TransactionSchema.index({ userId: 1, createdAt: -1 });

// Need to create a model if it doesn't exist
const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
