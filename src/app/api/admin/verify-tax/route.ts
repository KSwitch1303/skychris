import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Withdrawal from '@/models/Withdrawal';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Check if the request is from an admin (you might implement more robust authentication)
    const adminAuth = req.cookies.get('adminAuth');
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
      }, { status: 401 });
    }
    
    // Parse the request body
    const { withdrawalId } = await req.json();
    
    if (!withdrawalId) {
      return NextResponse.json({
        success: false,
        message: 'Withdrawal ID is required',
      }, { status: 400 });
    }
    
    // Find the withdrawal record
    const withdrawal = await Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
      return NextResponse.json({
        success: false,
        message: 'Withdrawal record not found',
      }, { status: 404 });
    }
    
    // Update the withdrawal status
    withdrawal.taxVerified = true;
    
    // If it's in pending status, update it to verified
    if (withdrawal.status === 'pending') {
      withdrawal.status = 'verified';
    }
    
    // Save the updated withdrawal record
    await withdrawal.save();
    
    // Find the user to update their tax code if needed
    const user = await User.findById(withdrawal.user);
    if (user && !user.taxCode) {
      user.taxCode = withdrawal.taxCode;
      await user.save();
    }
    
    // Return success response
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
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Return method not allowed for GET requests
  return NextResponse.json({
    success: false,
    message: 'Method not allowed',
  }, { status: 405 });
}
