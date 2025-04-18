import type { NextApiRequest, NextApiResponse } from 'next';

type UserPreferences = {
  userId: string;
  color?: string;
  values?: string;
  goal?: string;
  theme?: 'light' | 'dark' | 'system';
  updatedAt: string;
}

type ErrorResponse = {
  error: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserPreferences | UserPreferences[] | ErrorResponse>
) {
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return getUserPreferences(req, res);
    case 'POST':
      return saveUserPreferences(req, res);
    case 'PUT':
      return updateUserPreferences(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get user preferences
function getUserPreferences(
  req: NextApiRequest,
  res: NextApiResponse<UserPreferences | ErrorResponse>
) {
  try {
    // Get user ID from query or auth token
    const userId = req.query.userId as string || 'default_user';
    
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
    
    return res.status(200).json(mockPreferences);
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return res.status(500).json({ error: 'Failed to get user preferences' });
  }
}

// Save new user preferences
function saveUserPreferences(
  req: NextApiRequest,
  res: NextApiResponse<UserPreferences | ErrorResponse>
) {
  try {
    const { userId, color, values, goal, theme } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
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
    
    return res.status(201).json(preferences);
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return res.status(500).json({ error: 'Failed to save user preferences' });
  }
}

// Update existing user preferences
function updateUserPreferences(
  req: NextApiRequest,
  res: NextApiResponse<UserPreferences | ErrorResponse>
) {
  try {
    const { userId, color, values, goal, theme } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
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
    
    return res.status(200).json(updatedPreferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return res.status(500).json({ error: 'Failed to update user preferences' });
  }
}
