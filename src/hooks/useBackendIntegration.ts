import { useEffect, useState } from 'react';
import { userApi, personalizationApi, conversationApi } from '../services/api';

// Hook for connecting frontend components to backend API
export const useBackendIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [personalizedContent, setPersonalizedContent] = useState<any>(null);

  // Create anonymous user
  const createAnonymousUser = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userApi.createAnonymousUser();
      const userData = response.data;
      
      // Store user data in localStorage
      localStorage.setItem('naible_user', JSON.stringify(userData));
      
      setUser(userData);
      return userData;
    } catch (err: any) {
      console.error('Error creating anonymous user:', err);
      setError(err.response?.data?.error || 'Failed to create anonymous user');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Save user preferences
  const saveUserPreferences = async (preferencesData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add user ID to preferences
      const dataWithUserId = {
        ...preferencesData,
        userId: user?.id || 'anonymous'
      };
      
      const response = await personalizationApi.savePreferences(dataWithUserId);
      const savedPreferences = response.data;
      
      // Store preferences in localStorage as fallback
      localStorage.setItem('naible_user_preferences', JSON.stringify(savedPreferences));
      
      setPreferences(savedPreferences);
      return savedPreferences;
    } catch (err: any) {
      console.error('Error saving user preferences:', err);
      setError(err.response?.data?.error || 'Failed to save preferences');
      
      // Store in localStorage even if API fails
      localStorage.setItem('naible_user_preferences', JSON.stringify(preferencesData));
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Save personalized content
  const savePersonalizedContent = async (contentData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add user ID to content
      const dataWithUserId = {
        ...contentData,
        userId: user?.id || 'anonymous'
      };
      
      const response = await personalizationApi.saveContent(dataWithUserId);
      const savedContent = response.data;
      
      // Store content in localStorage as fallback
      localStorage.setItem('naible_personalized_content', JSON.stringify(savedContent));
      
      setPersonalizedContent(savedContent);
      return savedContent;
    } catch (err: any) {
      console.error('Error saving personalized content:', err);
      setError(err.response?.data?.error || 'Failed to save content');
      
      // Store in localStorage even if API fails
      localStorage.setItem('naible_personalized_content', JSON.stringify(contentData));
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Process user message
  const processUserMessage = async (message: string, history: any[] = []) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await conversationApi.processMessage(message);
      const processedResponse = response.data;
      
      // If personalized content is returned, save it
      if (processedResponse.personalizedContent) {
        savePersonalizedContent(processedResponse.personalizedContent);
      }
      
      return processedResponse;
    } catch (err: any) {
      console.error('Error processing message:', err);
      setError(err.response?.data?.error || 'Failed to process message');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Process audio input
  const processAudioInput = async (audioBlob: Blob) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await conversationApi.processAudio(audioBlob);
      return response.data.transcription;
    } catch (err: any) {
      console.error('Error processing audio:', err);
      setError(err.response?.data?.error || 'Failed to process audio');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        // Load user
        const storedUser = localStorage.getItem('naible_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // Load preferences
        const storedPreferences = localStorage.getItem('naible_user_preferences');
        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences));
        }
        
        // Load personalized content
        const storedContent = localStorage.getItem('naible_personalized_content');
        if (storedContent) {
          setPersonalizedContent(JSON.parse(storedContent));
        }
      } catch (err) {
        console.error('Error loading user data from localStorage:', err);
      }
    };
    
    loadUserData();
  }, []);

  return {
    isLoading,
    error,
    user,
    preferences,
    personalizedContent,
    createAnonymousUser,
    saveUserPreferences,
    savePersonalizedContent,
    processUserMessage,
    processAudioInput
  };
};

export default useBackendIntegration;
