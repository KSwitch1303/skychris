import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    console.log('Admin withdrawals API called');
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
    
    // Get all withdrawals and populate the user details
    const withdrawals = await Withdrawal.find({})
      .populate('user', 'firstName lastName email accountNumber')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`Found ${withdrawals.length} withdrawals`);
    
    return NextResponse.json({
      success: true,
      data: withdrawals,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while fetching withdrawals',
      error: error.message,
    }, { status: 500 });
  }
}
