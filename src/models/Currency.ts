import mongoose, { Document, Schema } from 'mongoose';

export interface ICurrency extends Document {
  symbol: string;
  code: string;
  name: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CurrencySchema = new Schema<ICurrency>(
  {
    symbol: {
      type: String,
      required: [true, 'Currency symbol is required'],
      default: '$'
    },
    code: {
      type: String,
      required: [true, 'Currency code is required'],
      default: 'USD'
    },
    name: {
      type: String,
      required: [true, 'Currency name is required'],
      default: 'US Dollar'
    },
    isDefault: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Add a pre-save hook to ensure only one default currency exists
CurrencySchema.pre('save', async function(next) {
  // If this currency is being set as default
  if (this.isDefault) {
    // Set all other currencies to not be default
    const CurrencyModel = mongoose.models.Currency || mongoose.model('Currency', CurrencySchema);
    await CurrencyModel.updateMany(
      { _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Use mongoose.models to check if the model exists already to prevent overwriting
const Currency = mongoose.models.Currency || mongoose.model<ICurrency>('Currency', CurrencySchema);

export default Currency;
