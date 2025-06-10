import { NextRequest, NextResponse } from 'next/server';

// Admin authentication middleware
export function adminAuth(request: NextRequest) {
  const adminKey = request.headers.get('x-admin-key');
  
  // Check if the admin key is valid
  if (adminKey !== 'skyrick2244') {
    return NextResponse.json(
      { message: 'Unauthorized: Invalid admin credentials' }, 
      { status: 401 }
    );
  }
  
  // Admin is authenticated
  return null;
}
