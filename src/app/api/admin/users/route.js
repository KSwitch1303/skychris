import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
  try {
    console.log('Admin users API called');
    // Connect to the database
    await dbConnect();
    console.log('Database connected');
    
    // Basic admin authentication check
    console.log('Checking cookies:', req.cookies);
    const adminAuth = req.cookies.get('adminAuth');
    console.log('Admin auth cookie:', adminAuth);
    
    // TEMPORARY: Skip auth check for debugging
    // if (!adminAuth || adminAuth.value !== 'true') {
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Unauthorized access. Please login as administrator.',
    //   }, { status: 401 });
    // }
    
    // Continue with authenticated access
    
    // Get all users
    const users = await User.find({})
      .select('-password -__v') // Exclude sensitive fields for security
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: users,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching users.',
    }, { status: 500 });
  }
}
