import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypewriter } from '../hooks/index';

interface ConversationManagerProps {
  initialPrompt: string;
  onResponse: (response: string) => void;
  isWaiting?: boolean;
  showMicrophone?: boolean;
  suggestedResponses?: string[];
  children?: React.ReactNode;
}

const ConversationManager: React.FC<ConversationManagerProps> = ({
  initialPrompt,
  onResponse,
  isWaiting = false,
  showMicrophone = true,
  suggestedResponses = [],
  children
}) => {
  const [userInput, setUserInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { displayText, isComplete } = useTypewriter(initialPrompt, 50);

  // Focus input field when typewriter effect completes
  useEffect(() => {
    if (isComplete && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isComplete]);

  // Show suggestions after a delay of inactivity
  useEffect(() => {
    if (isComplete && suggestedResponses.length > 0) {
      const timer = setTimeout(() => {
        setShowSuggestions(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isComplete, suggestedResponses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() && !isWaiting) {
      onResponse(userInput);
      setUserInput('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isWaiting) {
      onResponse(suggestion);
      setShowSuggestions(false);
    }
  };

  const handleHelpToggle = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Typewriter prompt */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-light mb-4">
          {displayText}
          {!isComplete && <span className="cursor-blink">|</span>}
        </h2>
      </motion.div>

      {/* User input form */}
      <AnimatePresence>
        {isComplete && (
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your answer..."
                className="w-full p-4 pr-12 rounded-lg glassmorphism text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isWaiting}
                aria-label="Your response"
              />
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={!userInput.trim() || isWaiting}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full 
                  ${!userInput.trim() || isWaiting ? 'text-gray-400' : 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900'}`}
                aria-label="Submit your answer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Microphone button (if enabled) */}
              {showMicrophone && (
                <button
                  type="button"
                  className="absolute right-14 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-gray-500 hover:text-primary-500"
                  aria-label="Voice input"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Help and skip options */}
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              <button 
                type="button" 
                onClick={handleHelpToggle}
                className="mx-2 hover:text-primary-500 focus:outline-none focus:underline"
                aria-label="Need help?"
              >
                Need help?
              </button>
              <span>•</span>
              <button 
                type="button" 
                className="mx-2 hover:text-primary-500 focus:outline-none focus:underline"
                aria-label="Skip this question"
              >
                Skip this question
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Suggested responses */}
      <AnimatePresence>
        {isComplete && showSuggestions && suggestedResponses.length > 0 && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">
              Not sure what to say? Try one of these:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {suggestedResponses.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 rounded-lg glassmorphism text-left hover:shadow-md transition-shadow"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            className="mt-6 glassmorphism rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-medium mb-2">How to respond:</h3>
            <ul className="text-sm space-y-2">
              <li>• Be as specific or general as you like</li>
              <li>• Your answers help personalize your experience</li>
              <li>• You can use voice input by clicking the microphone icon</li>
              <li>• There are no wrong answers!</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Additional content (passed as children) */}
      {children}
    </div>
  );
};

export default ConversationManager;
