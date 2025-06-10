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

// Get user profile
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
    
    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
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
    
    // Fields that are allowed to be updated
    const updatableFields = [
      'firstName', 
      'lastName', 
      'phone',
      'address',
      'city',
      'state',
      'zipCode',
      'country',
      'profileImage'
    ];
    
    // Create update object with only allowed fields
    const updateData: { [key: string]: any } = {};
    updatableFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });
    
    // Find and update the user
    const user = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}
