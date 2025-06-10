import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import Card from '@/models/Card';

// Verify JWT token and get user ID
const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
    return decoded;
  } catch (error) {
    return null;
  }
};

// Get user dashboard data
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
    
    // Connect to the database
    await dbConnect();

    // Find the user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get pending deposits
    const pendingDeposits = await Transaction.find({ 
      userId: user._id,
      type: 'deposit',
      status: 'pending'
    }).sort({ createdAt: -1 });

    // Get saved cards
    const savedCards = await Card.find({
      userId: user._id,
      isActive: true
    }).sort({ isDefault: -1, createdAt: -1 });

    // Calculate account summary
    const totalDeposits = await Transaction.aggregate([
      { 
        $match: { 
          userId: user._id,
          type: 'deposit',
          status: 'completed'
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalWithdrawals = await Transaction.aggregate([
      { 
        $match: { 
          userId: user._id,
          type: 'withdrawal',
          status: 'completed'
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalTransfers = await Transaction.aggregate([
      { 
        $match: { 
          userId: user._id,
          type: 'transfer',
          status: 'completed'
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Compile dashboard data
    const dashboardData = {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        accountNumber: user.accountNumber,
        bankName: user.bankName,
        balance: user.balance,
        role: user.role || 'user'
      },
      transactions: {
        recent: recentTransactions,
        pendingDeposits: pendingDeposits.length,
      },
      cards: {
        count: savedCards.length,
        hasDefaultCard: savedCards.some((card) => card.isDefault)
      },
      summary: {
        totalDeposits: totalDeposits[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0,
        totalTransfers: totalTransfers[0]?.total || 0
      },
      lastUpdated: new Date()
    };
    
    return NextResponse.json({
      success: true,
      data: dashboardData
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}
