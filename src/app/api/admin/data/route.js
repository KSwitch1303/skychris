import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

// Import models or use dynamic models
import User from '@/models/User';

export async function GET(request) {
  try {
    // Get the collection name from query parameters
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');

    if (!collection) {
      return NextResponse.json({ 
        success: false, 
        message: 'Collection name is required' 
      }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();
    
    let data = [];

    // Fetch data based on collection name
    switch (collection.toLowerCase()) {
      case 'users':
        data = await User.find({}).select('-password').lean();
        break;
        
      case 'cards':
        // Check if Cards model exists in your schema
        // If not, try to get it dynamically
        try {
          const Card = mongoose.models.Card || mongoose.model('Card', new mongoose.Schema({}));
          data = await Card.find({}).lean();
        } catch (cardError) {
          console.error('Error fetching cards:', cardError);
          
          // Return empty array if model doesn't exist instead of error
          data = [];
        }
        break;
        
      default:
        // Try to fetch from any collection dynamically
        try {
          const model = mongoose.models[collection] || 
            mongoose.model(collection, new mongoose.Schema({}, { strict: false }));
          data = await model.find({}).lean();
        } catch (modelError) {
          return NextResponse.json({ 
            success: false, 
            message: `Collection '${collection}' not found` 
          }, { status: 404 });
        }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Admin data fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error fetching data',
      error: error.message
    }, { status: 500 });
  }
}
