import mongoose from 'mongoose';

// Define the Withdrawal schema
const WithdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Withdrawal amount must be greater than 0'],
    },
    taxCode: {
      type: String,
      required: true,
    },
    taxVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'completed', 'rejected'],
      default: 'pending',
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Generate a unique reference number
WithdrawalSchema.pre('save', async function(next) {
  if (this.isNew) {
    const refDate = new Date().toISOString().replace(/[-:]/g, '').slice(0, 14);
    const refRandom = Math.floor(100000 + Math.random() * 900000);
    this.reference = `WD${refDate}${refRandom}`;
  }
  next();
});

// Define the Withdrawal model if it doesn't exist
const Withdrawal = mongoose.models.Withdrawal || mongoose.model('Withdrawal', WithdrawalSchema);

export default Withdrawal;
