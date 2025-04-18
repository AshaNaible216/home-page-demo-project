import type { NextApiRequest, NextApiResponse } from 'next';

type PersonalizedContent = {
  userId: string;
  headline: string;
  subheading: string;
  ctaText: string;
  welcomeMessage: string;
  createdAt: string;
  updatedAt: string;
}

type ErrorResponse = {
  error: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PersonalizedContent | ErrorResponse>
) {
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getPersonalizedContent(req, res);
    case 'POST':
      return savePersonalizedContent(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get personalized content
function getPersonalizedContent(
  req: NextApiRequest,
  res: NextApiResponse<PersonalizedContent | ErrorResponse>
) {
  try {
    // Get user ID from query or auth token
    const userId = req.query.userId as string || 'default_user';
    
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
    
    return res.status(200).json(mockContent);
  } catch (error) {
    console.error('Error getting personalized content:', error);
    return res.status(500).json({ error: 'Failed to get personalized content' });
  }
}

// Save personalized content
function savePersonalizedContent(
  req: NextApiRequest,
  res: NextApiResponse<PersonalizedContent | ErrorResponse>
) {
  try {
    const { userId, headline, subheading, ctaText, welcomeMessage } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!headline || !subheading) {
      return res.status(400).json({ error: 'Headline and subheading are required' });
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
    
    return res.status(201).json(content);
  } catch (error) {
    console.error('Error saving personalized content:', error);
    return res.status(500).json({ error: 'Failed to save personalized content' });
  }
}
