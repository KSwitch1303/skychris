import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Currency from '@/models/Currency';

// This route ensures that the default currency exists in the database
export async function GET() {
  try {
    await dbConnect();
    
    // Check if any currency exists
    const currencyCount = await Currency.countDocuments();
    
    if (currencyCount === 0) {
      // Create default USD currency
      await Currency.create({
        symbol: '$',
        code: 'USD',
        name: 'US Dollar',
        isDefault: true
      });
      
      return NextResponse.json({
        success: true,
        message: 'Default currency initialized successfully.',
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Currency already initialized.',
    });
    
  } catch (error: any) {
    console.error('Error initializing currency:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize currency',
      error: error.message
    }, { status: 500 });
  }
}
