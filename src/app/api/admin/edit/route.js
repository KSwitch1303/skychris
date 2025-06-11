import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { collection, id, updates } = body;

    if (!collection || !id || !updates) {
      return NextResponse.json({ 
        success: false, 
        message: 'Collection name, ID, and updates are required' 
      }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();
    
    // Remove fields that shouldn't be directly updated
    const safeUpdates = { ...updates };
    delete safeUpdates._id; // Don't update the ID
    delete safeUpdates.__v; // Don't update version key
    
    let result;

    // Update data based on collection name
    switch (collection.toLowerCase()) {
      case 'users':
        // Special handling for password
        if (safeUpdates.password) {
          // Hash the password before updating
          const salt = await bcrypt.genSalt(10);
          safeUpdates.password = await bcrypt.hash(safeUpdates.password, salt);
        }
        
        result = await User.findByIdAndUpdate(
          id, 
          { $set: safeUpdates }, 
          { new: true, runValidators: true }
        );
        break;
        
      case 'cards':
        // Check if Cards model exists in your schema
        try {
          const Card = mongoose.models.Card || mongoose.model('Card', new mongoose.Schema({}, { strict: false }));
          result = await Card.findByIdAndUpdate(
            id, 
            { $set: safeUpdates }, 
            { new: true, runValidators: true }
          );
        } catch (cardError) {
          console.error('Error updating card:', cardError);
          return NextResponse.json({ 
            success: false, 
            message: 'Error updating card'
          }, { status: 500 });
        }
        break;
        
      default:
        // Try to update any collection dynamically
        try {
          const model = mongoose.models[collection] || 
            mongoose.model(collection, new mongoose.Schema({}, { strict: false }));
          result = await model.findByIdAndUpdate(
            id, 
            { $set: safeUpdates }, 
            { new: true, runValidators: true }
          );
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
      message: 'Item updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Admin edit error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error updating item',
      error: error.message
    }, { status: 500 });
  }
}
