import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { adminAuth } from '../middleware';

export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResponse = adminAuth(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    
    // Fetch all users
    const users = await User.find({}).select('-password -__v');
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users' }, 
      { status: 500 }
    );
  }
}
