import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

type ResponseData = {
  content?: string;
  error?: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, userPreferences } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    // Initialize Azure OpenAI client
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://aoaieastus0001.openai.azure.com/";
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4.1";
    
    console.log("Azure API key available:", !!apiKey);
    console.log("Azure endpoint:", azureEndpoint);
    console.log("Deployment name:", deploymentName);
    
    const openai = new OpenAI({
      apiKey: apiKey || "",
      baseURL: `${azureEndpoint}/openai/deployments/${deploymentName}`,
      defaultQuery: { "api-version": "2025-01-01-preview" },
      defaultHeaders: { "api-key": apiKey || "" },
    });

    // Create system message with context about Naible
    const systemMessage = `You are an AI assistant for Naible, a company focused on personal intelligence.
    Naible helps users own their AI experience through private, continuously learning AI that each user
    trains themselves. Key differentiators include user data ownership, persistent context, and custom
    'DNAi' that enables each AI instance to become the user's personal twin over time.
    
    Based on the user's preferences, generate personalized content that aligns with their goals and values.
    Format your response as JSON with the following structure:
    {
      "headline": "A compelling headline that speaks to the user's goals",
      "subheading": "A subheading that elaborates on the headline and mentions the user's values",
      "ctaText": "Call-to-action text that encourages the user to take the next step",
      "welcomeMessage": "A personalized welcome message that makes the user feel understood"
    }`;

    // Generate content using Azure OpenAI
    console.log("Attempting to use Azure OpenAI API with deployment:", deploymentName);
    
    const completion = await openai.chat.completions.create({
      model: deploymentName, // For Azure, this should match the deployment name
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: `Generate personalized content for a user with these preferences: ${JSON.stringify(userPreferences)}. Their prompt: ${prompt}` }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Extract the response content
    const content = completion.choices[0]?.message?.content || '';

    return res.status(200).json({ content });
  } catch (error) {
    console.error('Error processing conversation:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return res.status(500).json({
      error: 'Failed to process conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}