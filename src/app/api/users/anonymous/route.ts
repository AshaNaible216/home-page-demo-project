import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

type AnonymousUser = {
  id: string;
  createdAt: string;
  isAnonymous: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Create anonymous user with unique ID
    const anonymousUser: AnonymousUser = {
      id: `anon_${uuidv4()}`,
      createdAt: new Date().toISOString(),
      isAnonymous: true
    };

    // In a real implementation, this would be stored in a database
    // For this prototype, we'll just return the user object
    
    return NextResponse.json(anonymousUser, { status: 201 });
  } catch (error) {
    console.error('Error creating anonymous user:', error);
    return NextResponse.json(
      { error: 'Failed to create anonymous user' },
      { status: 500 }
    );
  }
} 