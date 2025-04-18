import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeMessageProps {
  onStart?: () => void;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onStart, timeOfDay }) => {
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  
  // Welcome text with proper spelling
  const welcomeText = "Hello, I have been waiting for you...please click anywhere";
  
  // Typewriter effect for the welcome text
  useEffect(() => {
    let index = 0;
    setTypedText(''); // Reset text on component mount
    
    const interval = setInterval(() => {
      if (index < welcomeText.length) {
        setTypedText(welcomeText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
        
        // Show hint after typing completes
        setTimeout(() => {
          setShowHint(true);
        }, 500);
      }
    }, 60); // Faster for smoother typing
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle click
  const handleClick = () => {
    if (isTypingComplete && onStart) {
      onStart();
    }
  };
  
  // Get text color based on time of day for better contrast
  const getTextColor = () => {
    switch (timeOfDay) {
      case 'morning':
      case 'afternoon':
        return 'text-gray-800'; // Dark text for light backgrounds
      case 'evening':
      case 'night':
      default:
        return 'text-white'; // Light text for dark backgrounds
    }
  };
  
  return (
    <motion.div 
      className={`glassmorphism p-8 rounded-2xl shadow-2xl relative cursor-pointer ${getTextColor()}`}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      whileHover={isTypingComplete ? { scale: 1.03, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)' } : {}}
      whileTap={isTypingComplete ? { scale: 0.97 } : {}}
    >
      <motion.div className="text-3xl mb-4 font-light tracking-wide">
        <span className="whitespace-normal">{typedText}</span>
        {!isTypingComplete ? (
          <motion.span 
            className={`inline-block w-[3px] h-6 ml-1 align-middle ${getTextColor()}`}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
        ) : null}
      </motion.div>
      
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="flex justify-center items-center mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                timeOfDay === 'morning' || timeOfDay === 'afternoon'
                  ? 'border-gray-800 border-opacity-50'
                  : 'border-white border-opacity-50'
              }`}
              animate={{ 
                y: [0, 8, 0],
                boxShadow: [
                  "0 0 0 rgba(255, 255, 255, 0.1)",
                  "0 0 20px rgba(255, 255, 255, 0.4)",
                  "0 0 0 rgba(255, 255, 255, 0.1)"
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 ${getTextColor()}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WelcomeMessage;