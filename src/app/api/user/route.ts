import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
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

// Route to get current user data
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

    // Find the user by ID
    const user = await User.findById(decoded.id).select('-password -pin');

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        accountNumber: user.accountNumber,
        bankName: user.bankName,
        balance: user.balance,
        twoFactorEnabled: user.twoFactorEnabled,
        loginNotificationsEnabled: user.loginNotificationsEnabled
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}
