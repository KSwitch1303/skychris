import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Card from '@/models/Card';
import { adminAuth } from '@/app/api/admin/middleware';

export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResponse = adminAuth(request);
  if (authResponse) return authResponse;

  try {
    await dbConnect();
    
    // Fetch all cards with user information, including all sensitive data
    const cards = await Card.find({}).populate({
      path: 'userId',
      select: 'firstName lastName email _id'
    }).select('-__v');
    
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json(
      { message: 'Failed to fetch cards' }, 
      { status: 500 }
    );
  }
}
