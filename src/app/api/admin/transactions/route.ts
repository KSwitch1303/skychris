import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    console.log('Admin transactions API called');
    // Connect to the database
    await dbConnect();
    
    // Basic admin authentication check
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('adminAuth');
    console.log('Admin auth cookie:', adminAuth);
    
    // Skip auth check temporarily for debugging
    // if (!adminAuth || adminAuth.value !== 'true') {
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Unauthorized access',
    //   }, { status: 401 });
    // }
    
    // Get all transactions
    const transactions = await Transaction.find({})
      .populate('sender recipient', 'firstName lastName email accountNumber')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`Found ${transactions.length} transactions`);
    
    return NextResponse.json({
      success: true,
      data: transactions,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching transactions',
      error: error.message,
    }, { status: 500 });
  }
}
