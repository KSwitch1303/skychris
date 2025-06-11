import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/User';

export async function POST(request) {
  try {
    const body = await request.json();
    const { collection, id } = body;

    if (!collection || !id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Collection name and ID are required' 
      }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();
    
    let result;

    // Delete data based on collection name
    switch (collection.toLowerCase()) {
      case 'users':
        result = await User.findByIdAndDelete(id);
        break;
        
      case 'cards':
        // Check if Cards model exists in your schema
        try {
          const Card = mongoose.models.Card || mongoose.model('Card', new mongoose.Schema({}, { strict: false }));
          result = await Card.findByIdAndDelete(id);
        } catch (cardError) {
          console.error('Error deleting card:', cardError);
          return NextResponse.json({ 
            success: false, 
            message: 'Error deleting card'
          }, { status: 500 });
        }
        break;
        
      default:
        // Try to delete from any collection dynamically
        try {
          const model = mongoose.models[collection] || 
            mongoose.model(collection, new mongoose.Schema({}, { strict: false }));
          result = await model.findByIdAndDelete(id);
        } catch (modelError) {
          return NextResponse.json({ 
            success: false, 
            message: `Collection '${collection}' not found` 
          }, { status: 404 });
        }
    }

    if (!result) {
      return NextResponse.json({ 
        success: false, 
        message: `Item with ID ${id} not found in ${collection}` 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Item deleted successfully' 
    });
  } catch (error) {
    console.error('Admin delete error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error deleting item',
      error: error.message
    }, { status: 500 });
  }
}
