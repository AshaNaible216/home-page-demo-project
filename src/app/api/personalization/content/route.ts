import { NextRequest, NextResponse } from 'next/server';

type PersonalizedContent = {
  userId: string;
  headline: string;
  subheading: string;
  ctaText: string;
  welcomeMessage: string;
  createdAt: string;
  updatedAt: string;
}

// Get personalized content
export async function GET(request: NextRequest) {
  try {
    // Get user ID from query or auth token
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'default_user';
    
    // In a real implementation, this would fetch from a database
    // For this prototype, we'll return mock data
    const mockContent: PersonalizedContent = {
      userId,
      headline: 'Own Your AI: Introducing Personal Intelligence by Naible',
      subheading: 'A private, evolving AI that\'s 100% yours—trained on your data, serving your needs, and controlled by you alone.',
      ctaText: 'Get Early Access',
      welcomeMessage: 'Welcome to your personalized Naible experience!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(mockContent);
  } catch (error) {
    console.error('Error getting personalized content:', error);
    return NextResponse.json(
      { error: 'Failed to get personalized content' },
      { status: 500 }
    );
  }
}

// Save personalized content
export async function POST(request: NextRequest) {
  try {
    const { userId, headline, subheading, ctaText, welcomeMessage } = await request.json();
    
    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!headline || !subheading) {
      return NextResponse.json(
        { error: 'Headline and subheading are required' },
        { status: 400 }
      );
    }
    
    // Create content object
    const content: PersonalizedContent = {
      userId,
      headline,
      subheading,
      ctaText: ctaText || 'Get Started',
      welcomeMessage: welcomeMessage || 'Welcome!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // In a real implementation, this would be stored in a database
    // For this prototype, we'll just return the content object
    
    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error saving personalized content:', error);
    return NextResponse.json(
      { error: 'Failed to save personalized content' },
      { status: 500 }
    );
  }
} 