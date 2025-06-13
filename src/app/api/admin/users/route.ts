import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    console.log('Admin users API called');
    // Connect to the database
    await dbConnect();
    console.log('Database connected');
    
    // Basic admin authentication check
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('adminAuth');
    console.log('Admin auth cookie:', adminAuth);
    
    // Skip auth check temporarily for debugging
    // if (!adminAuth || adminAuth.value !== 'true') {
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Unauthorized access. Please login as administrator.',
    //   }, { status: 401 });
    // }
    
    // Get all users
    const users = await User.find({})
      .select('-password -__v') // Exclude sensitive fields for security
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`Found ${users.length} users`);
    
    return NextResponse.json({
      success: true,
      data: users,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching users.',
      error: error.message,
    }, { status: 500 });
  }
}
