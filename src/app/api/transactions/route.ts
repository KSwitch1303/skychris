import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

// Verify JWT token and get user ID
const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
    return decoded;
  } catch (error) {
    return null;
  }
};

// Route to get user transactions
export async function GET(request: NextRequest) {
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

    // Get query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Connect to the database
    await dbConnect();

    // Find transactions for this user
    const transactions = await Transaction.find({ 
      userId: decoded.id 
    })
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(limit);

    // Count total transactions for pagination
    const total = await Transaction.countDocuments({ userId: decoded.id });

    // Get user's current balance
    const user = await User.findById(decoded.id).select('balance');

    // Calculate monthly balance history (last 6 months)
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    // Get the first day of each month for the last 6 months
    const months: Date[] = [];
    const labels: string[] = [];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      date.setDate(1); // First day of month
      date.setHours(0, 0, 0, 0);
      
      // Store the date and format the label (e.g., "Jun")
      months.unshift(date);
      labels.unshift(date.toLocaleString('default', { month: 'short' }));
    }
    
    // Fetch the last transaction of each month to get the balance
    const balanceHistory: number[] = [];
    
    for (let i = 0; i < months.length; i++) {
      const startDate = months[i];
      const endDate = i < months.length - 1 
        ? months[i + 1] 
        : new Date(); // For the current month, use today's date
      
      const lastTransaction = await Transaction.findOne({
        userId: decoded.id,
        createdAt: { $gte: startDate, $lt: endDate }
      })
      .sort({ createdAt: -1 }) // Get the latest transaction in that month
      .limit(1);
      
      // Get the balance for this month (from the last transaction or use the previous month's balance)
      if (lastTransaction) {
        balanceHistory.push(lastTransaction.balanceAfter);
      } else if (balanceHistory.length > 0) {
        // If no transactions in this month, use the previous month's balance
        balanceHistory.push(balanceHistory[balanceHistory.length - 1]);
      } else {
        // If this is the first month and no transactions, use current balance or 0
        balanceHistory.push(user ? user.balance : 0);
      }
    }

    // Return transaction data and balance history
    return NextResponse.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        },
        balanceHistory: {
          labels,
          data: balanceHistory
        },
        currentBalance: user ? user.balance : 0
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching transaction data:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}
