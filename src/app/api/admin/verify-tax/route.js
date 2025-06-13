import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';

export async function POST(req) {
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
    
    // Get request body
    const body = await req.json();
    const { withdrawalId } = body;
    
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
    
  } catch (error) {
    console.error('Error verifying tax code:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while verifying the tax code',
      error: error.message,
    }, { status: 500 });
  }
}
