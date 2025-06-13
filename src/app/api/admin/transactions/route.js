import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

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
    
    // Get all transactions
    const transactions = await Transaction.find({})
      .sort({ createdAt: -1 }) // newest first
      .lean(); // convert to plain JS objects
    
    return NextResponse.json({
      success: true,
      data: transactions,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching transactions',
    }, { status: 500 });
  }
}
