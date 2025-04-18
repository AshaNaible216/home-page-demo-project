import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
  hideCursorOnComplete?: boolean;
}

/**
 * A component that displays text with a typewriter effect
 * Expects text with a format like "H: Text to display" where "H: " is the identifier
 */
const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 40, // Faster default speed
  onComplete,
  className = '',
  cursorClassName = 'inline-block w-[3px] h-6 bg-white ml-1 align-middle',
  showCursor = true,
  hideCursorOnComplete = false
}) => {
  // Parse the text to extract just the part that should be displayed (after "H: ")
  const displayText = text.startsWith("H:")
    ? text.startsWith("H: ") ? text.substring(3) : text.substring(2)
    : text;
  
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Optimized typewriter effect using requestAnimationFrame
  useEffect(() => {
    let index = 0;
    let lastUpdateTime = 0;
    setTypedText('');
    setIsTypingComplete(false);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Function to handle the animation frame
    const updateText = (timestamp: number) => {
      // Only update if enough time has passed
      if (!lastUpdateTime || timestamp - lastUpdateTime >= speed) {
        lastUpdateTime = timestamp;
        
        if (index < displayText.length) {
          // Batch multiple characters for smoother animation
          const charsToAdd = Math.min(3, displayText.length - index);
          const nextChunk = displayText.substring(index, index + charsToAdd);
          setTypedText(prev => prev + nextChunk);
          index += charsToAdd;
          
          // Schedule next frame
          timeoutRef.current = setTimeout(() => {
            requestAnimationFrame(updateText);
          }, speed / 2); // Use half the speed for smoother animation
        } else {
          setIsTypingComplete(true);
          
          // Call completion callback
          if (onComplete) {
            onComplete();
          }
        }
      } else {
        // If not enough time has passed, request next frame
        timeoutRef.current = setTimeout(() => {
          requestAnimationFrame(updateText);
        }, 5);
      }
    };
    
    // Start the animation
    requestAnimationFrame(updateText);
    
    // Clean up on unmount or text change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, speed, onComplete]);
  
  return (
    <span className={`typewriter-text ${className}`}>
      <span className="whitespace-pre-line">{typedText}</span>
      
      {showCursor && (!hideCursorOnComplete || !isTypingComplete) && (
        <motion.span 
          className={cursorClassName}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
      )}
    </span>
  );
};

export default TypewriterText;