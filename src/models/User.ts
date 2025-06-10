import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  profileImage?: string;
  dateOfBirth?: Date;
  accountNumber: string;
  bankName: string;
  bvn?: string;
  balance: number;
  pin: string;
  role?: string;
  twoFactorEnabled: boolean;
  loginNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    dateOfBirth: {
      type: Date,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      length: 10,
    },
    bankName: {
      type: String,
      default: 'Swift Mint Flow',
    },
    bvn: {
      type: String,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    pin: {
      type: String,
      required: [true, 'Please set a transaction PIN'],
      length: 4,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    loginNotificationsEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function(): string {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || 'fallback_jwt_secret',
    { expiresIn: '30d' }
  );
};

// Need to create a model if it doesn't exist
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
