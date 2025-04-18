import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface TypewriterAnimationProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
  cursorColor?: string;
  showCursor?: boolean;
}

const TypewriterAnimation: React.FC<TypewriterAnimationProps> = ({
  text,
  speed = 50,
  delay = 0,
  onComplete,
  className = '',
  cursorColor = 'currentColor',
  showCursor = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const controls = useAnimation();
  
  // Typewriter effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (delay > 0) {
      timeout = setTimeout(startTyping, delay);
    } else {
      startTyping();
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [text, speed, delay]);
  
  // Cursor blinking effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isComplete && showCursor) {
      interval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isComplete, showCursor]);
  
  const startTyping = () => {
    let i = 0;
    setDisplayText('');
    setIsComplete(false);
    
    // Start with subtle fade in
    controls.start({
      opacity: 1,
      transition: { duration: 0.3 }
    });
    
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prev => prev + text.charAt(i));
        i++;
        
        // Add subtle animation when typing
        controls.start({
          y: [0, -2, 0],
          transition: { duration: 0.1 }
        });
      } else {
        setIsComplete(true);
        clearInterval(intervalId);
        
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);
    
    return () => clearInterval(intervalId);
  };
  
  return (
    <motion.span
      className={`typewriter-animation ${className}`}
      initial={{ opacity: 0 }}
      animate={controls}
    >
      {displayText}
      {showCursor && (
        <span 
          className="cursor" 
          style={{ 
            display: 'inline-block',
            width: '2px',
            height: '1em',
            backgroundColor: cursorColor,
            marginLeft: '2px',
            verticalAlign: 'middle',
            opacity: cursorVisible ? 1 : 0,
            transition: 'opacity 0.2s'
          }}
        />
      )}
    </motion.span>
  );
};

export default TypewriterAnimation;
