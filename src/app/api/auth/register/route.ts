import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password } = body;

    // Validate input
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json({
        success: false,
        message: 'Please provide all required fields'
      }, { status: 400 });
    }

    await dbConnect();

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { phone }]
    });

    if (userExists) {
      return NextResponse.json({
        success: false,
        message: userExists.email === email 
          ? 'User with this email already exists' 
          : 'User with this phone number already exists'
      }, { status: 400 });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Generate a unique account number (10-digit)
    const generateAccountNumber = (): string => {
      // US bank-style account number format (10 digits)
      return '23' + Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    // Create transaction PIN (4-digit)
    const generatePin = (): string => {
      const pin = Math.floor(1000 + Math.random() * 9000).toString();
      return pin;
    };

    const accountNumber = generateAccountNumber();
    const pin = generatePin();

    // Create user with account information in a single object
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      accountNumber,
      bankName: 'Swift Mint Flow',
      balance: 0, // Starting amount for demo purposes
      pin: await bcryptjs.hash(pin, salt), // Hash the PIN for security
      twoFactorEnabled: false,
      loginNotificationsEnabled: true
    });

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_jwt_secret',
      { expiresIn: '30d' }
    );

    // Return success response with token and user data
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        accountNumber: user.accountNumber,
        bankName: user.bankName,
        balance: user.balance
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}
