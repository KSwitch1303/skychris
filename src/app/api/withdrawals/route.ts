import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Withdrawal from '@/models/Withdrawal';
import jwt from 'jsonwebtoken';

// Define JWT payload interface
interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Verify JWT token and get user ID
const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret') as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract the auth token from the request headers
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required',
      }, { status: 401 });
    }

    // Get the token from the Authorization header
    const token = authHeader.split(' ')[1];

    // Verify the token and get the user ID
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token',
      }, { status: 401 });
    }

    // Parse the request body
    const { amount, taxCode } = await req.json();

    // Basic validation
    if (!amount || amount < 1) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid withdrawal amount (minimum $1)',
      }, { status: 400 });
    }

    if (!taxCode || taxCode.trim().length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid tax code',
      }, { status: 400 });
    }

    // Find the user
    const user = await User.findById(payload.id);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 });
    }

    // Check if the user has sufficient balance
    if (user.balance < amount) {
      return NextResponse.json({
        success: false,
        message: 'Insufficient funds in your account',
      }, { status: 400 });
    }

    // Generate a unique reference number for the withdrawal
    const refDate = new Date().toISOString().replace(/[-:]/g, '').slice(0, 14);
    const refRandom = Math.floor(100000 + Math.random() * 900000);
    const reference = `WD${refDate}${refRandom}`;
    
    // Create a new withdrawal record
    const withdrawal = new Withdrawal({
      user: user._id,
      amount,
      taxCode,
      status: 'pending',
      taxVerified: false,
      reference: reference,
    });

    // Save the withdrawal to the database
    await withdrawal.save();
    
    // Update user's tax code for future use
    if (!user.taxCode) {
      user.taxCode = taxCode;
      await user.save();
    }

    // Return success response with withdrawal details
    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully and pending tax verification',
      withdrawalId: withdrawal.reference,
    }, { status: 200 });

  } catch (error) {
    console.error('Error processing withdrawal request:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request',
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Extract the auth token from the request headers
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Authentication required',
      }, { status: 401 });
    }

    // Get the token from the Authorization header
    const token = authHeader.split(' ')[1];

    // Verify the token and get the user ID
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token',
      }, { status: 401 });
    }

    // Get the user's withdrawals
    const withdrawals = await Withdrawal.find({ user: payload.id })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .lean(); // Convert to plain JavaScript objects

    return NextResponse.json({
      success: true,
      data: withdrawals,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching withdrawals',
    }, { status: 500 });
  }
}
