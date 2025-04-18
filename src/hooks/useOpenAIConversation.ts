import { useState } from 'react';
import OpenAI from 'openai';

// Define the conversation state interface
interface ConversationState {
  color?: string;
  values?: string;
  goal?: string;
}

// Hook for OpenAI conversation
const useOpenAIConversation = () => {
  const [conversationState, setConversationState] = useState<ConversationState>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize OpenAI client for Azure
  const azureEndpoint = process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT || "https://aoaieastus0001.openai.azure.com/";
  const deploymentName = process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT || "gpt-4.1";
  
  console.log("Azure endpoint:", azureEndpoint);
  console.log("Deployment name:", deploymentName);
  
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || "",
    baseURL: `${azureEndpoint}/openai/deployments/${deploymentName}`,
    defaultQuery: { "api-version": "2025-01-01-preview" },
    defaultHeaders: { "api-key": process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY || "" },
    dangerouslyAllowBrowser: true, // For client-side usage
  });

  // Process message to generate personalized content
  const processMessage = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Processing message with OpenAI...");
      
      // Construct a detailed system prompt with personalization context
      const systemPrompt = `You are an AI assistant for Naible, a company focused on personal intelligence.
        Naible helps users own their AI experience through private, continuously learning AI that each user
        trains themselves. Key differentiators include user data ownership, persistent context, and custom
        'DNAi' that enables each AI instance to become the user's personal twin over time.
        
        The user has shared these preferences:
        - Color preference: ${conversationState.color || 'Not specified'}
        - Values: ${conversationState.values || 'Not specified'}
        - Goals: ${conversationState.goal || 'Not specified'}
        
        Based on this information, generate HIGHLY personalized content that feels custom-crafted for this specific user.
        Make references to their values and goals in natural, creative ways.
        Format your response as JSON with the following structure:
        {
          "headline": "A compelling headline that speaks to the user's goals",
          "subheading": "A subheading that elaborates on the headline and mentions the user's values",
          "ctaText": "Call-to-action text that encourages the user to take the next step",
          "welcomeMessage": "A personalized welcome message that makes the user feel understood and references specific details they shared"
        }`;

      // Use the Azure OpenAI deployment
      console.log("Attempting to call Azure OpenAI API with deployment:", deploymentName);
      console.log("Using API key starting with:", process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY?.substring(0, 5) + "...");
      
      const completion = await openai.chat.completions.create({
        model: deploymentName,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.8, // Higher creativity for more personalized responses
        max_tokens: 800,
      });

      // Extract the response content
      const content = completion.choices[0]?.message?.content || '';
      console.log("Received OpenAI response:", content);
      return content;
      
    } catch (err) {
      console.error('Error processing message with OpenAI:', err);
      // More detailed error logging
      if (err instanceof Error) {
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      }
      setError('Failed to generate personalized content. Please try again.');
      
      // Return a fallback response in case of error
      return JSON.stringify({
        headline: "Own Your AI: Introducing Personal Intelligence by Naible",
        subheading: `A private, evolving AI that's 100% yours—trained on your data, serving your needs, and controlled by you alone.`,
        ctaText: "Get Early Access",
        welcomeMessage: `Welcome to Naible! We've created a personalized experience based on your preferences.`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Process initial question
  const processInitialQuestion = async (response: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Store the initial response for context in later stages
      setConversationState(prev => ({ ...prev, initialResponse: response }));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      return true;
    } catch (err) {
      console.error('Error processing initial question:', err);
      setError('Failed to process your response. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Process color preference question
  const processColorQuestion = async (color: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      setConversationState(prev => ({ ...prev, color }));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      return true;
    } catch (err) {
      console.error('Error processing color question:', err);
      setError('Failed to process your color preference. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Process values question
  const processValuesQuestion = async (values: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      setConversationState(prev => ({ ...prev, values }));
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
      return true;
    } catch (err) {
      console.error('Error processing values question:', err);
      setError('Failed to process your values. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Process final question about goals
  const processFinalQuestion = async (goal: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      setConversationState(prev => ({ ...prev, goal }));
      await new Promise(resolve => setTimeout(resolve, 800)); // Shorter delay before AI generation
      return true;
    } catch (err) {
      console.error('Error processing final question:', err);
      setError('Failed to process your response. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Process audio input using Whisper API
  const processAudio = async (audioBlob: Blob): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create a form data object to send the audio file
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      
      // Make a direct call to the OpenAI API
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.text;
    } catch (err) {
      console.error('Error processing audio:', err);
      setError('Failed to process your audio. Please try again or type your response.');
      
      // Fallback mechanism if API fails
      const mockTranscriptions = [
        "I want to explore AI for my business",
        "I value privacy, security, and innovation",
        "I'm looking for a personal AI assistant that respects my privacy",
        "I prefer solutions that are customizable and intuitive"
      ];
      
      return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    conversationState,
    isLoading,
    error,
    processInitialQuestion,
    processColorQuestion,
    processValuesQuestion,
    processFinalQuestion,
    processAudio,
    processMessage,
    isProcessing: isLoading
  };
};

export default useOpenAIConversation;