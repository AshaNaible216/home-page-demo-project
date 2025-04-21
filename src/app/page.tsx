'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConversationPrompt from '../components/ConversationPrompt';
import SiteAssemblyAnimation from '../components/SiteAssemblyAnimation';
import PersonalizedHero from '../components/PersonalizedHero';
import DataPrivacyManager from '../components/DataPrivacyManager';
import DataInfoCards from '../components/DataInfoCards';
import PrivacyConsentPopup from '../components/PrivacyConsentPopup';
import IntroScreen from '../components/IntroScreen';
import DayNightBackground from '../components/DayNightBackground';
import AIResponsiveBackground from '../components/AIResponsiveBackground';
import AIChatBubble from '../components/AIChatBubble';
import AIContentSuggestions from '../components/AIContentSuggestions';
import NaibleLogo from '../components/NaibleLogo';
import { useAuth } from '../context/AuthContext';
import { usePersonalization } from '../context/PersonalizationContext';
import useOpenAIConversation from '../hooks/useOpenAIConversation';
import { NAIBLE_GREEN } from '../utils/brandConstants';

enum ConversationStep {
  PRIVACY_CONSENT = 'privacy_consent',
  INTRODUCTION = 'introduction',
  COLOR_PREFERENCE = 'color_preference',
  VALUES = 'values',
  GOALS = 'goals',
  SITE_ASSEMBLY = 'site_assembly',
  PERSONALIZED_HERO = 'personalized_hero',
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { userPreferences, saveUserPreferences, personalizedContent, savePersonalizedContent } = usePersonalization();
  const { processMessage, processAudio, isProcessing } = useOpenAIConversation();
  
  const [currentStep, setCurrentStep] = useState<ConversationStep>(ConversationStep.PRIVACY_CONSENT);
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(false);
  const [showDataPrivacyManager, setShowDataPrivacyManager] = useState<boolean>(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  
  // For AI responsive background
  const [userInput, setUserInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiMood, setAiMood] = useState<'neutral' | 'positive' | 'excited' | 'thoughtful'>('neutral');
  
  // For content suggestions
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  
  // Determine time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
    } else if (hour >= 17 && hour < 21) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('night');
    }
  }, []);
  
  // Check if user has already given consent
  useEffect(() => {
    // Add a delay to ensure the page has fully loaded before checking localStorage
    const timer = setTimeout(() => {
      const hasConsent = localStorage.getItem('naible_privacy_consent') === 'true';
      if (hasConsent) {
        setPrivacyConsent(true);
        // Go directly to INTRODUCTION instead of BLANK_CANVAS
        setCurrentStep(ConversationStep.INTRODUCTION);
      } else {
        // Ensure the privacy consent is shown if no consent exists
        setCurrentStep(ConversationStep.PRIVACY_CONSENT);
      }
      setInitialLoadComplete(true);
    }, 500); // Short delay to ensure proper loading
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle privacy consent
  const handlePrivacyConsent = (consent: boolean) => {
    setPrivacyConsent(consent);
    localStorage.setItem('naible_privacy_consent', consent.toString());
    if (consent) {
      // Go directly to INTRODUCTION instead of BLANK_CANVAS
      setCurrentStep(ConversationStep.INTRODUCTION);
    }
  };
  
  // Handle conversation responses
  const handleResponse = async (response: string, step: ConversationStep) => {
    // Update user input for AI responsive background
    setUserInput(response);
    
    // Process the response based on the current step
    switch (step) {
      case ConversationStep.INTRODUCTION:
        // Move to color preference question
        setCurrentStep(ConversationStep.COLOR_PREFERENCE);
        break;
        
      case ConversationStep.COLOR_PREFERENCE:
        // Save color preference
        saveUserPreferences({ ...userPreferences, color: response });
        setCurrentStep(ConversationStep.VALUES);
        break;
        
      case ConversationStep.VALUES:
        // Save values
        saveUserPreferences({ ...userPreferences, values: response });
        setCurrentStep(ConversationStep.GOALS);
        break;
        
      case ConversationStep.GOALS:
        // Save goals and generate personalized content
        saveUserPreferences({ ...userPreferences, goal: response });
        
        // Process the final response with OpenAI to generate personalized content
        const prompt = `Based on the user's preferences:
          - Color: ${userPreferences.color || 'Not specified'}
          - Values: ${userPreferences.values || 'Not specified'}
          - Goal: ${response}
          
          Generate a personalized hero section with:
          1. An engaging headline (5-8 words) that connects AI with their goals
          2. A compelling subheading (15-20 words) that emphasizes how Naible's personal intelligence aligns with their values
          3. A call-to-action text (3-5 words) that creates urgency and excitement
          4. A personalized welcome message (1 sentence) that makes them feel seen and understood
          
          Make the content feel tailored specifically to this user's unique combination of preferences.`;
        
        const aiResponseText = await processMessage(prompt);
        
        // Update AI response for responsive background
        setAiResponse(aiResponseText);
        setAiMood('excited'); // Set mood to excited for the final step
        
        try {
          // Parse the AI response (assuming it returns JSON)
          const content = JSON.parse(aiResponseText);
          savePersonalizedContent(content);
        } catch (error) {
          console.error('Error parsing AI response:', error);
          // Fallback content if parsing fails
          savePersonalizedContent({
            headline: "Own Your AI: Introducing Personal Intelligence by Naible",
            subheading: "A private, evolving AI that's 100% yours—trained on your data, serving your needs, and controlled by you alone.",
            ctaText: "Get Early Access",
            welcomeMessage: "Welcome to your personalized Naible experience! We've created this based on your preferences."
          });
        }
        
        // Move to site assembly animation
        setCurrentStep(ConversationStep.SITE_ASSEMBLY);
        
        // After a delay, show the personalized hero
        setTimeout(() => {
          setCurrentStep(ConversationStep.PERSONALIZED_HERO);
        }, 5000); // 5 seconds for the animation
        
        break;
        
      default:
        break;
    }
  };
  
  // Handle audio input
  const handleAudioInput = async (audioBlob: Blob) => {
    if (!audioBlob) return;
    
    try {
      const transcription = await processAudio(audioBlob);
      if (transcription) {
        // Process the transcription based on the current step
        handleResponse(transcription, currentStep);
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };
  
  // Get the current question based on the step
  const getCurrentQuestion = () => {
    switch (currentStep) {
      case ConversationStep.INTRODUCTION:
        return "Welcome to your personal AI journey! I'm excited to create something uniquely yours. What sparked your interest in exploring AI today? I'd love to understand your perspective.";
      case ConversationStep.COLOR_PREFERENCE:
        return "Colors speak to us on an emotional level and help shape our digital environment. Which color creates the perfect atmosphere for your AI experience? This will influence how your personalized space feels.";
      case ConversationStep.VALUES:
        return "Your values are the foundation of a meaningful AI relationship. What principles matter most to you? Privacy? Innovation? Transparency? Efficiency? Creativity? These will guide how your AI experience evolves.";
      case ConversationStep.GOALS:
        return "Let's align your AI experience with your aspirations. What specific outcomes are you hoping to achieve? Whether it's enhancing productivity, sparking creativity, or something entirely different - I'll tailor everything to support your unique goals.";
      default:
        return "";
    }
  };

  // Handle view privacy details click
  const handleViewPrivacyDetails = () => {
    setShowDataPrivacyManager(true);
  };
  
  // Handle start of conversation from intro screen
  const handleStartConversation = () => {
    // Move to COLOR_PREFERENCE (skipping INTRODUCTION for better flow)
    setCurrentStep(ConversationStep.COLOR_PREFERENCE);
  };
  
  // Render the appropriate component based on the current step
  const renderCurrentStep = () => {
    // Show spinner while loading
    if (!initialLoadComplete) {
      return (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    
    // Show privacy consent first
    if (!privacyConsent) {
      return (
        <>
          <DayNightBackground timeOfDay={timeOfDay} />
          <PrivacyConsentPopup
            onAccept={() => handlePrivacyConsent(true)}
            onViewDetails={handleViewPrivacyDetails}
          />
        </>
      );
    }
    
    // Then show other steps based on current state
    switch (currentStep) {
      case ConversationStep.INTRODUCTION:
        return (
          <div className="w-full">
            <DayNightBackground timeOfDay={timeOfDay} />
            <IntroScreen onStart={handleStartConversation} />
            <div className="absolute bottom-10 left-0 right-0">
              <DataInfoCards />
            </div>
          </div>
        );
        
      case ConversationStep.COLOR_PREFERENCE:
      case ConversationStep.VALUES:
      case ConversationStep.GOALS:
        return (
          <>
            <DayNightBackground timeOfDay={timeOfDay} />
            <ConversationPrompt
              question={getCurrentQuestion()}
              step={currentStep}
              onResponse={(response) => handleResponse(response, currentStep)}
              onAudioInput={handleAudioInput}
              isProcessing={isProcessing}
              totalSteps={4}
              currentStepIndex={
                currentStep === ConversationStep.COLOR_PREFERENCE ? 2 :
                currentStep === ConversationStep.VALUES ? 3 : 4
              }
            />
          </>
        );
        
      case ConversationStep.SITE_ASSEMBLY:
        return (
          <>
            <DayNightBackground timeOfDay={timeOfDay} />
            <SiteAssemblyAnimation 
              userPreferences={userPreferences}
            />
          </>
        );
        
      case ConversationStep.PERSONALIZED_HERO:
        return (
          <div className="w-full">
            <DayNightBackground timeOfDay={timeOfDay} />
            
            {/* AI Content Suggestions with higher z-index and more prominent styling */}
            <div className="max-w-4xl mx-auto mt-8 mb-8 px-4 relative z-50">
              <motion.div 
                className="glassmorphism p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <AIContentSuggestions
                  userPreferences={{
                    ...userPreferences,
                    values: "privacy, security, innovation" // Ensure these values are prioritized
                  }}
                  primaryColor={userPreferences.color || NAIBLE_GREEN}
                  onSuggestionSelect={(suggestion) => {
                    setSelectedSuggestion(suggestion);
                    setUserInput(suggestion);
                    setAiResponse(`Here's more information about "${suggestion}": Naible's approach to ${suggestion.toLowerCase()} focuses on personalization and user control. Would you like to learn more?`);
                    setAiMood('thoughtful');
                  }}
                />
                
                {selectedSuggestion && (
                  <motion.div
                    className="mt-4 p-4 rounded-lg"
                    style={{ 
                      backgroundColor: `${userPreferences.color || NAIBLE_GREEN}20`,
                      border: `1px solid ${userPreferences.color || NAIBLE_GREEN}30`
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4 className="font-medium mb-2">About {selectedSuggestion}</h4>
                    <p className="text-sm">
                      Naible's approach to {selectedSuggestion.toLowerCase()} is centered around personal intelligence -
                      AI that's private, continuously learning, and trained by you. This ensures that your experience
                      is truly personalized while maintaining complete data ownership.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            <PersonalizedHero
              headline={personalizedContent.headline}
              subheading={personalizedContent.subheading}
              ctaText={personalizedContent.ctaText}
              welcomeMessage={personalizedContent.welcomeMessage}
              userPreferences={userPreferences}
              onViewDataPrivacy={() => setShowDataPrivacyManager(true)}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render the data privacy manager if shown
  if (showDataPrivacyManager) {
    return (
      <DataPrivacyManager
        isOpen={showDataPrivacyManager}
        onClose={() => setShowDataPrivacyManager(false)}
      />
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Naible Logo */}
      <header className="absolute top-0 left-0 z-50 p-4">
        <NaibleLogo size="medium" variant={currentStep === ConversationStep.PERSONALIZED_HERO ? "default" : "white"} />
      </header>
      
      {/* Add AI Responsive Background */}
      <AIResponsiveBackground
        userInput={userInput}
        aiResponse={aiResponse}
        mood={aiMood}
        primaryColor={userPreferences.color || NAIBLE_GREEN}
      />
      
      <main className="flex-grow flex items-center justify-center p-4">
        {renderCurrentStep()}
      </main>
      
      {/* Add AI Chat Bubble */}
      {privacyConsent && currentStep === ConversationStep.PERSONALIZED_HERO && (
        <AIChatBubble
          primaryColor={userPreferences.color || NAIBLE_GREEN}
          userPreferences={{
            color: userPreferences.color,
            values: userPreferences.values,
            goal: userPreferences.goal
          }}
        />
      )}
      
      <footer className="p-4 text-center text-sm text-gray-500 flex flex-col items-center">
        <NaibleLogo size="small" variant="monochrome" className="mb-2" />
        <p>© {new Date().getFullYear()} Naible. All rights reserved.</p>
      </footer>
    </div>
  );
} 