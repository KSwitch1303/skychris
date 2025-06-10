import mongoose, { Schema } from 'mongoose';

export interface ICard {
  userId: mongoose.Types.ObjectId;
  cardNumber: string; // Last 4 digits only for security
  cardName: string;
  cvc: string;
  cardType: string; // visa, mastercard, amex, etc.
  expiryDate: string; // MM/YY format
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema<ICard>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    cvc: {
      type: String,
      trim: true
    },
    cardNumber: {
      type: String,
      required: true,
      trim: true,
      
    },
    cardName: {
      type: String,
      required: true,
      trim: true
    },
    cardType: {
      type: String,
      required: true,
      enum: ['visa', 'mastercard', 'amex', 'discover', 'other']
    },
    expiryDate: {
      type: String,
      required: true,
      validate: {
        validator: function(v: string) {
          return /^(0[1-9]|1[0-2])\/\d{2}$/.test(v);
        },
        message: 'Expiry date must be in MM/YY format'
      }
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Make sure only one default card per user
CardSchema.pre('save', async function(next) {
  const card = this;
  
  if (card.isDefault) {
    // If this card is being set as default, unset default on all other cards for this user
    await (this.constructor as any).updateMany(
      { userId: card.userId, _id: { $ne: card._id } },
      { $set: { isDefault: false } }
    );
  }
  
  next();
});

// Function to detect card type based on first digits
CardSchema.statics.detectCardType = function(cardNumber: string): string {
  // Remove all non-digit characters
  const number = cardNumber.replace(/\D/g, '');
  
  // Visa: Starts with 4
  if (/^4/.test(number)) return 'visa';
  
  // Mastercard: Starts with 51-55 or 2221-2720
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01])/.test(number)) return 'mastercard';
  
  // Amex: Starts with 34 or 37
  if (/^3[47]/.test(number)) return 'amex';
  
  // Discover: Starts with 6011, 622126-622925, 644-649, or 65
  if (/^(6011|65|64[4-9]|622(12[6-9]|1[3-9]|[2-8]|9[01234]))/.test(number)) return 'discover';
  
  return 'other';
};

const Card = mongoose.models.Card || mongoose.model<ICard>('Card', CardSchema);

export default Card;
