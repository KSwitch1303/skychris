// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import User from '@/models/User';
// import { adminAuth } from '../../../middleware';

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   // Check admin authentication
//   const authResponse = adminAuth(request);
//   if (authResponse) return authResponse;

//   try {
//     await dbConnect();
    
//     const userId = params.id;
//     const { balance } = await request.json();
    
//     if (typeof balance !== 'number' || isNaN(balance)) {
//       return NextResponse.json(
//         { message: 'Invalid balance value' }, 
//         { status: 400 }
//       );
//     }
    
//     const user = await User.findById(userId).select('-password -__v');
    
//     if (!user) {
//       return NextResponse.json(
//         { message: 'User not found' }, 
//         { status: 404 }
//       );
//     }
    
//     // Update user balance
//     user.balance = balance;
//     await user.save();
    
//     return NextResponse.json(user);
//   } catch (error) {
//     console.error('Error updating user balance:', error);
//     return NextResponse.json(
//       { message: 'Failed to update user balance' }, 
//       { status: 500 }
//     );
//   }
// }
