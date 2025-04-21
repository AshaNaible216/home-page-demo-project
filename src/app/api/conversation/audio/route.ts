import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "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",
    });

    // In a real implementation, this would process the audio file
    // For this prototype, we'll simulate a response
    
    // List of possible user responses (more natural and detailed than before)
    const possibleResponses = [
      "I want to explore how AI can help me streamline my design workflow and automate repetitive tasks",
      "I value privacy, security, and the ability to customize my tools to fit my specific needs",
      "I'm looking for a personal AI assistant that respects my data privacy while helping me organize my work and personal life",
      "I need an AI solution that can help my team collaborate more effectively while maintaining security compliance",
      "Innovation, transparency, and ethical AI use are extremely important to me in any technology I adopt",
      "I'm exploring AI options that can help with content creation while maintaining my brand's unique voice"
    ];
    
    // Select a random response
    const selectedResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return the transcribed text
    return NextResponse.json({ text: selectedResponse });
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Failed to process audio' },
      { status: 500 }
    );
  }
} 