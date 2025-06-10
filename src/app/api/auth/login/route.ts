import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, password } = body;

    // Check if we have email or phone for login
    if (!email && !phone) {
      return NextResponse.json({
        success: false,
        message: 'Please provide email or phone number'
      }, { status: 400 });
    }

    await dbConnect();

    // Build query based on what was provided
    const query: { email?: string, phone?: string } = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;

    // Check for user
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check if password matches
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({
        success: false,
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_jwt_secret',
      { expiresIn: '30d' }
    );

    // Return success response with token and user data
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage || 'default-avatar.png'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
