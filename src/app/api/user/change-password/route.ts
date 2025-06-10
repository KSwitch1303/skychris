import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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

// Change user password
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
    
    // Connect to the database
    await dbConnect();

    // Parse request body
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({
        success: false,
        message: 'Current password and new password are required'
      }, { status: 400 });
    }
    
    // Find the user with password
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }
    
    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return NextResponse.json({
        success: false,
        message: 'Current password is incorrect'
      }, { status: 400 });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    console.error('Error changing password:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}
