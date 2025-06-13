import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Card from '@/models/Card';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    console.log('Admin cards API called');
    // Connect to the database
    await dbConnect();
    
    // Basic admin authentication check
    const cookieStore = cookies();
    // const adminAuth = cookieStore.get('adminAuth');
    // console.log('Admin auth cookie:', adminAuth);
    
    // Skip auth check temporarily for debugging
    // if (!adminAuth || adminAuth.value !== 'true') {
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Unauthorized access',
    //   }, { status: 401 });
    // }
    
    // Get all cards and populate the user details
    const cards = await Card.find({})
      .populate('user', 'firstName lastName email accountNumber')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`Found ${cards.length} cards`);
    
    return NextResponse.json({
      success: true,
      data: cards,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching cards',
      error: error.message,
    }, { status: 500 });
  }
}
