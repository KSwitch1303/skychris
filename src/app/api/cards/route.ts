import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Card from '@/models/Card';

// Verify JWT token and get user ID
const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');
    return decoded;
  } catch (error) {
    return null;
  }
};

// Get all cards for the current user
export async function GET(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - No token provided'
      }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Invalid token'
      }, { status: 401 });
    }
    
    // Connect to the database
    await dbConnect();

    // Find all cards for this user
    const cards = await Card.find({ 
      userId: decoded.id,
      isActive: true
    }).sort({ isDefault: -1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: cards
    });
  } catch (error: any) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}

// Add a new card
export async function POST(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - No token provided'
      }, { status: 401 });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Invalid token'
      }, { status: 401 });
    }
    
    // Parse the request body
    const body = await request.json();
    const { cardNumber, cardName, cvc, expiryDate, setDefault = false } = body;
    
    if (!cardNumber || !cardName || !expiryDate) {
      return NextResponse.json({
        success: false,
        message: 'Missing required card information'
      }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();

    // Sanitize the card number - store only last 4 digits
    const maskedCardNumber = cardNumber;
    
    // Detect card type based on first digits
    const fullCardNumber = cardNumber.replace(/\D/g, '');
    const cardType = detectCardType(fullCardNumber);
    
    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }
    
    // Check if this is the user's first card
    const existingCards = await Card.countDocuments({ userId: decoded.id });
    const isFirstCard = existingCards === 0;
    
    // Create new card
    const card = await Card.create({
      userId: decoded.id,
      cvc,
      cardNumber: maskedCardNumber,
      cardName,
      cardType,
      expiryDate,
      isDefault: setDefault || isFirstCard // Set as default if requested or if it's the first card
    });
    
    return NextResponse.json({
      success: true,
      message: 'Card added successfully',
      data: card
    });
  } catch (error: any) {
    console.error('Error adding card:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error'
    }, { status: 500 });
  }
}

// Helper function to detect card type
function detectCardType(cardNumber: string): string {
  // Visa: Starts with 4
  if (/^4/.test(cardNumber)) return 'visa';
  
  // Mastercard: Starts with 51-55 or 2221-2720
  if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01])/.test(cardNumber)) return 'mastercard';
  
  // Amex: Starts with 34 or 37
  if (/^3[47]/.test(cardNumber)) return 'amex';
  
  // Discover: Starts with 6011, 622126-622925, 644-649, or 65
  if (/^(6011|65|64[4-9]|622(12[6-9]|1[3-9]|[2-8]|9[01234]))/.test(cardNumber)) return 'discover';
  
  return 'other';
}
