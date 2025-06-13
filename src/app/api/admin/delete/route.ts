import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Card from '@/models/Card';
import Withdrawal from '@/models/Withdrawal';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();
    
    // Basic admin authentication check
    const cookieStore = cookies();
    // const adminAuth = cookieStore.get('adminAuth');
    // console.log('Admin auth cookie for delete:', adminAuth);
    
    // Skip auth check temporarily for debugging
    // if (!adminAuth || adminAuth.value !== 'true') {
    //   return NextResponse.json({
    //     success: false,
    //     message: 'Unauthorized access',
    //   }, { status: 401 });
    // }
    
    // Get request body
    const body = await req.json();
    const { collection, id } = body;
    
    console.log('Delete request for collection:', collection, 'with id:', id);
    
    if (!collection || !id) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
      }, { status: 400 });
    }
    
    let result;
    
    // Handle deletion based on collection
    switch(collection) {
      case 'users':
        result = await User.findByIdAndDelete(id);
        break;
        
      case 'cards':
        result = await Card.findByIdAndDelete(id);
        break;
        
      case 'withdrawals':
        result = await Withdrawal.findByIdAndDelete(id);
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
      message: 'Item deleted successfully',
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error deleting item:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while deleting the item',
      error: error.message,
    }, { status: 500 });
  }
}
