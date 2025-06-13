import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Card from '@/models/Card';
import Withdrawal from '@/models/Withdrawal';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Basic admin authentication check
    const cookieStore = cookies();
    // const adminAuth = cookieStore.get('adminAuth');
    // console.log('Admin auth cookie for edit:', adminAuth);
    
    // Skip auth check temporarily for debugging
    // if (!adminAuth || adminAuth.value !== 'true') {
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Unauthorized access',
    //   }, { status: 401 });
    // }
    
    // Get request body
    const body = await req.json();
    const { collection, id, updates } = body;
    
    if (!collection || !id || !updates) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
      }, { status: 400 });
    }
    
    let result;
    
    // Handle updates based on collection
    switch(collection) {
      case 'users':
        // Handle password separately if provided
        if (updates.password) {
          // Hash the password
          const salt = await bcrypt.genSalt(10);
          updates.password = await bcrypt.hash(updates.password, salt);
        }
        
        result = await User.findByIdAndUpdate(
          id, 
          updates, 
          { new: true, runValidators: true }
        ).select('-password');
        break;
        
      case 'cards':
        result = await Card.findByIdAndUpdate(
          id, 
          updates, 
          { new: true, runValidators: true }
        );
        break;
        
      case 'withdrawals':
        result = await Withdrawal.findByIdAndUpdate(
          id, 
          updates, 
          { new: true, runValidators: true }
        );
        break;
        
      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid collection',
        }, { status: 400 });
    }
    
    if (!result) {
      return NextResponse.json({
        success: false,
        message: 'Item not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
      data: result,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error updating item:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while updating the item',
      error: error.message,
    }, { status: 500 });
  }
}
