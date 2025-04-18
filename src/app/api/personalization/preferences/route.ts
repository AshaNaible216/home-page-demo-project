import { NextRequest, NextResponse } from 'next/server';

type UserPreferences = {
  userId: string;
  color?: string;
  values?: string;
  goal?: string;
  theme?: 'light' | 'dark' | 'system';
  updatedAt: string;
}

// Get user preferences
export async function GET(request: NextRequest) {
  try {
    // Get user ID from query or auth token
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default_user';
    
    // In a real implementation, this would fetch from a database
    // For this prototype, we'll return mock data
    const mockPreferences: UserPreferences = {
      userId,
      color: '#4F46E5',
      values: 'Privacy, Security, Trust',
      goal: 'Exploring AI for my business',
      theme: 'system',
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(mockPreferences);
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to get user preferences' },
      { status: 500 }
    );
  }
}

// Save new user preferences
export async function POST(request: NextRequest) {
  try {
    const { userId, color, values, goal, theme } = await request.json();
    
    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Create preferences object
    const preferences: UserPreferences = {
      userId,
      color,
      values,
      goal,
      theme,
      updatedAt: new Date().toISOString()
    };
    
    // In a real implementation, this would be stored in a database
    // For this prototype, we'll just return the preferences object
    
    return NextResponse.json(preferences, { status: 201 });
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to save user preferences' },
      { status: 500 }
    );
  }
}

// Update existing user preferences
export async function PUT(request: NextRequest) {
  try {
    const { userId, color, values, goal, theme } = await request.json();
    
    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would fetch and update in a database
    // For this prototype, we'll create a new object with updated values
    
    const updatedPreferences: UserPreferences = {
      userId,
      color,
      values,
      goal,
      theme,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(updatedPreferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update user preferences' },
      { status: 500 }
    );
  }
} 