import OpenAI from 'openai';

// Initialize Azure OpenAI client
const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://aoaieastus0001.openai.azure.com/";
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4.1";

console.log("Azure endpoint:", azureEndpoint);
console.log("Deployment name:", deploymentName);

const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY || "",
  baseURL: `${azureEndpoint}/openai/deployments/${deploymentName}`,
  defaultQuery: { "api-version": "2025-01-01-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY || "" },
});

// Interface for conversation messages
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: Array<{
    type: 'text' | 'image_url' | 'audio';
    text?: string;
    image_url?: {
      url: string;
    };
    audio?: {
      url: string;
    };
  }>;
}

// Function to generate text responses using GPT-4.1 model
export async function generateTextResponse(messages: Message[]) {
  try {
    console.log("Generating text response with Azure deployment:", deploymentName);
    const response = await openai.chat.completions.create({
      model: deploymentName,
      messages: messages as any,
    });
    
    return response.choices[0].message;
  } catch (error) {
    console.error('Error generating text response:', error);
    throw error;
  }
}

// Function to handle voice input using OpenAI's audio transcription
export async function transcribeAudio(audioBlob: Blob) {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    
    const response = await fetch(`${azureEndpoint}/openai/audio/transcriptions?api-version=2025-01-01-preview`, {
      method: 'POST',
      headers: {
        'api-key': process.env.AZURE_OPENAI_API_KEY || "",
      },
      body: formData,
    });
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

// Function to generate personalized content based on user inputs
export async function generatePersonalizedContent(
  userColor: string,
  userValues: string[],
  userGoal: string
) {
  try {
    const messages: Message[] = [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: `You are an AI assistant for Naible, a company focused on Personal Intelligence AI. 
            Generate personalized content for a user's homepage based on their preferences.
            The content should reflect Naible's brand values of user data ownership, privacy, and personalization.
            Use a clean, minimalist style inspired by Reflect.app design.`
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Generate personalized homepage content with the following user preferences:
            - Favorite color: ${userColor}
            - Important values: ${userValues.join(', ')}
            - Goal: ${userGoal}
            
            Please provide:
            1. A personalized headline
            2. A subheading that explains the value proposition
            3. A call-to-action text
            4. A brief welcome message`
          }
        ]
      }
    ];

    console.log("Generating personalized content with Azure deployment:", deploymentName);
    const response = await openai.chat.completions.create({
      model: deploymentName,
      messages: messages as any,
    });
    
    return response.choices[0].message;
  } catch (error) {
    console.error('Error generating personalized content:', error);
    throw error;
  }
}

export default {
  generateTextResponse,
  transcribeAudio,
  generatePersonalizedContent
};