import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Basic admin authentication check
    const cookieStore = cookies();
    const adminAuth = cookieStore.get('adminAuth');
    console.log('Admin auth cookie for verify-tax:', adminAuth);
    
    // Skip auth check temporarily for debugging
    // if (!adminAuth || adminAuth.value !== 'true') {
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Unauthorized access',
    //   }, { status: 401 });
    // }
    
    // Get request body
    const body = await req.json();
    const { withdrawalId } = body;
    
    console.log('Verifying tax for withdrawal ID:', withdrawalId);
    
    if (!withdrawalId) {
      return NextResponse.json({
        success: false,
        message: 'Missing withdrawal ID',
      }, { status: 400 });
    }
    
    // Find and update the withdrawal
    const withdrawal = await Withdrawal.findById(withdrawalId);
    
    if (!withdrawal) {
      return NextResponse.json({
        success: false,
        message: 'Withdrawal not found',
      }, { status: 404 });
    }
    
    // Update the tax verification status
    withdrawal.taxVerified = true;
    await withdrawal.save();
    
    return NextResponse.json({
      success: true,
      message: 'Tax code verified successfully',
      data: withdrawal,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error verifying tax code:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while verifying the tax code',
      error: error.message,
    }, { status: 500 });
  }
}
