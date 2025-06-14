import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Currency from '@/models/Currency';
import { cookies } from 'next/headers';

/**
 * API route to initialize currency settings when the admin page loads
 * This ensures we have at least one currency in the database
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Admin authorization check
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('adminAuth');
    
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
      }, { status: 401 });
    }
    
    // Check if a currency already exists
    const currencyCount = await Currency.countDocuments();
    
    if (currencyCount === 0) {
      // Create default currency if none exists
      await Currency.create({
        symbol: '$',
        code: 'USD',
        name: 'US Dollar',
        isDefault: true
      });
      
      return NextResponse.json({
        success: true,
        message: 'Currency initialized successfully',
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Currency already exists',
    });
    
  } catch (error: any) {
    console.error('Error initializing currency:', error);
    return NextResponse.json({
      success: false,
      message: 'Error initializing currency',
      error: error.message,
    }, { status: 500 });
  }
}
