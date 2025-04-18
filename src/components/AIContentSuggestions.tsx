import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIContentSuggestionsProps {
  userPreferences: {
    color?: string;
    values?: string;
    goal?: string;
  };
  primaryColor: string;
  onSuggestionSelect?: (suggestion: string) => void;
}

const AIContentSuggestions: React.FC<AIContentSuggestionsProps> = ({
  userPreferences,
  primaryColor,
  onSuggestionSelect
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  
  useEffect(() => {
    // Always generate suggestions regardless of user preferences
    // This ensures suggestions are always shown
    const generateSuggestions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate suggestions based on user preferences
        const generatedSuggestions = generateContextualSuggestions(userPreferences);
        setSuggestions(generatedSuggestions);
      } catch (error) {
        console.error('Error generating suggestions:', error);
        setError('Failed to generate suggestions');
        setSuggestions([
          'Personalized AI assistants',
          'Data privacy features',
          'Custom AI training options'
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    generateSuggestions();
  }, [userPreferences]);
  
  // Function to generate contextual suggestions based on user preferences
  const generateContextualSuggestions = (prefs: any): string[] => {
    const { color, values, goal } = prefs;
    
    // Priority suggestions that should always be included (as requested by user)
    const prioritySuggestions = [
      'Context-aware reminders',
      'Adaptive learning models',
      'AI workflow automation',
      'Personalized knowledge graphs',
      'Neural interface customization'
    ];
    
    const allSuggestions = [
      // Privacy-focused suggestions
      'Data ownership controls',
      'Privacy-first AI assistants',
      'Secure data vaults',
      'Encrypted AI training',
      'Zero-knowledge proof systems',
      'Federated learning models',
      'Local-only processing options',
      
      // Personalization suggestions
      'Custom AI personalities',
      'Personalized content filters',
      'Tailored recommendation engines',
      'Adaptive UI/UX systems',
      'Preference learning algorithms',
      'Behavioral pattern recognition',
      'Contextual awareness features',
      
      // Productivity suggestions
      'Smart task prioritization',
      'Intelligent scheduling',
      'Workflow optimization tools',
      'Focus enhancement systems',
      'Automated report generation',
      'Meeting summarization',
      'Decision support frameworks',
      
      // Creative suggestions
      'AI-enhanced creativity tools',
      'Collaborative content creation',
      'Style-matching writing assistance',
      'Visual concept generation',
      'Multimodal content synthesis',
      'Creative prompt engineering',
      'Inspiration recommendation systems'
    ];
    
    // Filter suggestions based on values
    let filteredSuggestions = allSuggestions;
    if (values) {
      const lowerValues = values.toLowerCase();
      
      if (lowerValues.includes('privacy') || lowerValues.includes('security')) {
        filteredSuggestions = filteredSuggestions.filter(s =>
          s.toLowerCase().includes('privacy') ||
          s.toLowerCase().includes('secure') ||
          s.toLowerCase().includes('encrypt') ||
          s.toLowerCase().includes('data')
        );
      }
      
      if (lowerValues.includes('productivity') || lowerValues.includes('efficiency')) {
        filteredSuggestions = filteredSuggestions.filter(s =>
          s.toLowerCase().includes('workflow') ||
          s.toLowerCase().includes('task') ||
          s.toLowerCase().includes('schedule') ||
          s.toLowerCase().includes('automation')
        );
      }
      
      if (lowerValues.includes('creativity') || lowerValues.includes('innovation')) {
        filteredSuggestions = filteredSuggestions.filter(s =>
          s.toLowerCase().includes('creative') ||
          s.toLowerCase().includes('creation') ||
          s.toLowerCase().includes('generation') ||
          s.toLowerCase().includes('writing')
        );
      }
    }
    
    // If we filtered too aggressively, add some back
    if (filteredSuggestions.length < 1) {
      filteredSuggestions = allSuggestions;
    }
    
    // Shuffle the filtered suggestions
    const shuffled = filteredSuggestions.sort(() => 0.5 - Math.random());
    
    // Take 0-2 additional suggestions (beyond the priority ones)
    const additionalCount = Math.floor(Math.random() * 3) + 2; // 2-4 additional suggestions
    const additionalSuggestions = shuffled.slice(0, additionalCount);
    
    // Combine priority suggestions with additional suggestions
    return [...prioritySuggestions, ...additionalSuggestions];
  };
  
  // Function to generate detailed descriptions for suggestions
  const getDetailedDescription = (suggestion: string): string => {
    const descriptions: Record<string, string> = {
      'Context-aware reminders': 'Intelligent reminders that adapt based on your location, schedule, and past behavior patterns. They understand when and how you prefer to be reminded about different types of tasks.',
      'Adaptive learning models': 'AI systems that continuously evolve based on your interactions, becoming more accurate and personalized over time. These models identify patterns in your preferences and adjust accordingly.',
      'AI workflow automation': 'Smart systems that learn your regular processes and automate repetitive tasks, saving you time while maintaining your preferred methods and standards.',
      'Personalized knowledge graphs': 'Custom information networks that connect concepts based on your unique understanding and interests, creating a personalized knowledge structure.',
      'Neural interface customization': 'Advanced AI interfaces that adapt their communication style, complexity level, and presentation format based on your cognitive preferences.',
      'Data ownership controls': 'Comprehensive tools that give you complete control over how your data is stored, used, and shared, with granular permission settings.',
      'Privacy-first AI assistants': 'AI helpers designed with privacy as the core principle, processing sensitive information locally and minimizing data transmission.',
      'Secure data vaults': 'Encrypted storage systems for your personal data with multi-factor authentication and complete user control over access permissions.',
      'Encrypted AI training': 'Methods for training AI on your data while keeping that information encrypted, ensuring privacy even during the learning process.',
      'Zero-knowledge proof systems': 'Cryptographic methods that allow AI to verify information without actually seeing the underlying data, preserving complete privacy.',
      'Federated learning models': 'Distributed learning approaches where AI improves by learning patterns across many devices without centralizing or sharing the actual data.',
      'Local-only processing options': 'AI capabilities that run entirely on your device, ensuring your data never leaves your personal hardware.',
      'Custom AI personalities': 'Assistants with adjustable personality traits that match your communication preferences and work style for more natural interactions.',
      'Personalized content filters': 'Smart filters that learn your preferences to highlight relevant information and reduce noise based on your interests and goals.',
      'Tailored recommendation engines': 'Systems that suggest content, products, or actions based on your unique preference patterns rather than generic algorithms.',
      'Adaptive UI/UX systems': 'Interfaces that reorganize and adjust based on how you use them, creating a more intuitive experience tailored to your workflow.',
      'Preference learning algorithms': 'Advanced systems that identify your preferences through both explicit choices and implicit behavior patterns.',
      'Behavioral pattern recognition': 'AI that identifies your unique habits and routines to provide more relevant assistance at the right moments.',
      'Contextual awareness features': 'Systems that understand your current situation and adjust their behavior based on time, location, and ongoing activities.',
      'Smart task prioritization': 'AI that learns how you prioritize work and helps organize tasks according to your personal values and deadlines.',
      'Intelligent scheduling': 'Calendar systems that understand your energy patterns, focus times, and preferences to optimize your schedule.',
      'Workflow optimization tools': 'AI assistants that analyze your work patterns and suggest improvements while respecting your preferred methods.',
      'Focus enhancement systems': 'Tools that create optimal conditions for concentration based on your personal focus triggers and distraction patterns.',
      'Automated report generation': 'Systems that compile and format information according to your preferences and communication style.',
      'Meeting summarization': 'AI that captures the key points from conversations based on what you typically find most relevant or actionable.',
      'Decision support frameworks': 'Tools that help evaluate options based on your personal values, risk tolerance, and decision-making style.',
      'AI-enhanced creativity tools': 'Systems that amplify your creative process by understanding your aesthetic preferences and creative patterns.',
      'Collaborative content creation': 'AI partners that adapt to your creative style and help generate content that matches your unique voice.',
      'Style-matching writing assistance': 'Writing tools that learn your tone, vocabulary, and sentence structure to suggest text that sounds authentically like you.',
      'Visual concept generation': 'AI that creates images and designs aligned with your aesthetic preferences and visual style.',
      'Multimodal content synthesis': 'Tools that combine text, images, and other media in ways that match your communication and presentation style.',
      'Creative prompt engineering': 'Systems that generate inspiring starting points tailored to your creative process and interests.',
      'Inspiration recommendation systems': 'AI that suggests creative influences and references based on your taste and current projects.'
    };
    
    // Return the detailed description or a generic one if not found
    return descriptions[suggestion] ||
      `${suggestion} is a personalized AI capability that adapts to your unique preferences and needs, providing a tailored experience that evolves with you over time.`;
  };
  
  return (
    <div className="my-6 z-50 relative">
      <motion.h3
        className="text-lg font-medium mb-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore these AI capabilities:
      </motion.h3>
      
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {isLoading ? (
            // Loading placeholders
            Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`loading-${i}`}
                className="h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
                style={{ width: `${80 + Math.random() * 60}px` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              />
            ))
          ) : (
            suggestions.map((suggestion, index) => (
              <motion.button
                key={`suggestion-${index}`}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{ 
                  backgroundColor: `${primaryColor}25`, // Increased opacity
                  color: primaryColor,
                  border: `1px solid ${primaryColor}50` // Increased border opacity
                }}
                onClick={() => {
                  setSelectedSuggestion(suggestion);
                  if (onSuggestionSelect) {
                    onSuggestionSelect(suggestion);
                  }
                }}
                whileHover={{ scale: 1.05, backgroundColor: `${primaryColor}40` }} // Increased hover opacity
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {suggestion}
              </motion.button>
            ))
          )}
        </AnimatePresence>
        
        {error && (
          <motion.p
            className="text-sm text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}
      </div>
      
      {selectedSuggestion && (
        <motion.div
          className="mt-4 p-4 rounded-lg text-sm"
          style={{
            backgroundColor: `${primaryColor}20`, // Increased opacity
            border: `1px solid ${primaryColor}30` // Increased border opacity
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h4 className="font-medium mb-2">About {selectedSuggestion}</h4>
          <p>
            {getDetailedDescription(selectedSuggestion)}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AIContentSuggestions;