import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('naible_auth_token') : null;
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User API endpoints
export const userApi = {
  // Create anonymous user
  createAnonymousUser: async () => {
    return api.post('/users/anonymous');
  },
  
  // Register new user
  register: async (email: string, password: string, name?: string) => {
    return api.post('/users/register', { email, password, name });
  },
  
  // Login user
  login: async (email: string, password: string) => {
    return api.post('/users/login', { email, password });
  },
  
  // Get current user profile
  getProfile: async () => {
    return api.get('/users/profile');
  },
  
  // Update user profile
  updateProfile: async (data: any) => {
    return api.put('/users/profile', data);
  },
  
  // Delete user account
  deleteAccount: async () => {
    return api.delete('/users/account');
  }
};

// Personalization API endpoints
export const personalizationApi = {
  // Save user preferences
  savePreferences: async (preferences: any) => {
    return api.post('/personalization/preferences', preferences);
  },
  
  // Get user preferences
  getPreferences: async () => {
    return api.get('/personalization/preferences');
  },
  
  // Save personalized content
  saveContent: async (content: any) => {
    return api.post('/personalization/content', content);
  },
  
  // Get personalized content
  getContent: async () => {
    return api.get('/personalization/content');
  }
};

// Conversation API endpoints
export const conversationApi = {
  // Save conversation history
  saveConversation: async (conversation: any) => {
    return api.post('/conversation/history', conversation);
  },
  
  // Get conversation history
  getConversation: async () => {
    return api.get('/conversation/history');
  },
  
  // Process user message
  processMessage: async (message: string) => {
    return api.post('/conversation/process', { message });
  },
  
  // Process audio input
  processAudio: async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    return api.post('/conversation/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

// Analytics API endpoints
export const analyticsApi = {
  // Track user event
  trackEvent: async (eventName: string, eventData: any) => {
    return api.post('/analytics/event', { eventName, eventData });
  },
  
  // Get user analytics
  getUserAnalytics: async () => {
    return api.get('/analytics/user');
  }
};

export default api;
