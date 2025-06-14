import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Currency from '@/models/Currency';
import { cookies } from 'next/headers';

// Get the current default currency
export async function GET() {
  try {
    await dbConnect();
    
    const defaultCurrency = await Currency.findOne({ isDefault: true });
    
    // If no currency found, return the default USD
    if (!defaultCurrency) {
      // Create default USD currency
      const newCurrency = await Currency.create({
        symbol: '$',
        code: 'USD',
        name: 'US Dollar',
        isDefault: true
      });
      
      return NextResponse.json({
        success: true,
        data: newCurrency
      });
    }
    
    return NextResponse.json({
      success: true,
      data: defaultCurrency
    });
    
  } catch (error: any) {
    console.error('Error fetching currency:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch currency information',
      error: error.message
    }, { status: 500 });
  }
}

// Update the currency settings
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Admin authorization check
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('adminAuth');
    
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized. Admin access required.'
      }, { status: 401 });
    }
    
    const body = await req.json();
    const { symbol, code, name } = body;
    
    if (!symbol || !code || !name) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }
    
    // Find the current default currency or create if doesn't exist
    let currency = await Currency.findOne({ isDefault: true });
    
    if (!currency) {
      currency = new Currency({
        symbol,
        code,
        name,
        isDefault: true
      });
    } else {
      // Update the existing default currency
      currency.symbol = symbol;
      currency.code = code;
      currency.name = name;
    }
    
    await currency.save();
    
    return NextResponse.json({
      success: true,
      message: 'Currency updated successfully',
      data: currency
    });
    
  } catch (error: any) {
    console.error('Error updating currency:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update currency',
      error: error.message
    }, { status: 500 });
  }
}
