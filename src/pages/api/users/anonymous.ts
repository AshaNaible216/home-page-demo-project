import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

type AnonymousUser = {
  id: string;
  createdAt: string;
  isAnonymous: boolean;
}

type ErrorResponse = {
  error: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnonymousUser | ErrorResponse>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create anonymous user with unique ID
    const anonymousUser: AnonymousUser = {
      id: `anon_${uuidv4()}`,
      createdAt: new Date().toISOString(),
      isAnonymous: true
    };

    // In a real implementation, this would be stored in a database
    // For this prototype, we'll just return the user object
    
    return res.status(201).json(anonymousUser);
  } catch (error) {
    console.error('Error creating anonymous user:', error);
    return res.status(500).json({ error: 'Failed to create anonymous user' });
  }
}
