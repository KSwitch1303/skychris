import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

// Verify JWT token and get user ID
const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
    return decoded;
  } catch (error) {
    return null;
  }
};

// Generate unique transaction reference
const generateReference = () => {
  return 'DEP' + Date.now() + Math.random().toString(36).slice(2, 7).toUpperCase();
};

// Route to handle deposits
export async function POST(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - No token provided'
      }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Invalid token'
      }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const { amount, paymentMethod, paymentDetails } = body;
    
    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({
        success: false,
        message: 'Invalid deposit amount'
      }, { status: 400 });
    }
    
    if (!paymentMethod || !['card', 'paypal'].includes(paymentMethod)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid payment method'
      }, { status: 400 });
    }
    
    // Connect to the database
    await dbConnect();

    // Find the user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }
    
    // Generate unique reference for this transaction
    const reference = generateReference();
    
    // Current balance (won't be updated until transaction is approved)
    const currentBalance = user.balance || 0;
    
    // Payment method details
    const methodDetails = paymentMethod === 'card' 
      ? `Card ending in ${(paymentDetails?.cardNumber || '').slice(-4)}` 
      : 'PayPal';
    
    // Create transaction record with pending status
    const transaction = await Transaction.create({
      userId: user._id,
      type: 'credit',
      amount: amount,
      description: `Deposit via ${methodDetails}`,
      reference: reference,
      status: 'pending', // Mark as pending instead of completed
      category: 'deposit',
      balanceAfter: currentBalance, // Balance won't change until approved
      metadata: {
        paymentMethod,
        submittedAt: new Date(),
        expectedProcessingTime: '1-2 business days'
      }
    });
    
    // Note: We don't update the user balance until the transaction is approved
    // This would be processed by an admin or automated system later
    
    // Return success response with transaction details
    return NextResponse.json({
      success: true,
      message: 'Deposit submitted successfully and pending approval',
      data: {
        transactionId: transaction._id,
        reference: reference,
        amount: amount,
        currentBalance: currentBalance,
        status: 'pending',
        expectedProcessingTime: '1-2 business days',
        timestamp: new Date()
      }
    });
    
  } catch (error: any) {
    console.error('Error processing deposit:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}
