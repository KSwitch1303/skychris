import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';

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
    
    // Get all withdrawals and populate the user details
    const withdrawals = await Withdrawal.find({})
      .populate('user', 'firstName lastName email accountNumber') // populate user details
      .sort({ createdAt: -1 }) // newest first
      .lean(); // convert to plain JS objects
    
    return NextResponse.json({
      success: true,
      data: withdrawals,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching withdrawals',
    }, { status: 500 });
  }
}
