import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Card from '@/models/Card';

export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Basic admin authentication check
    const adminAuth = req.cookies.get('adminAuth');
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
      }, { status: 401 });
    }
    
    // Get all cards and populate the user details
    const cards = await Card.find({})
      .populate('user', 'firstName lastName email accountNumber')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: cards,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching cards',
    }, { status: 500 });
  }
}
