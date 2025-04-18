import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from './AccessibilityProvider';

interface AnimatedCursorProps {
  visible?: boolean;
  isTyping?: boolean;
  className?: string;
}

const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  visible = true,
  isTyping = false,
  className = ''
}) => {
  const { reducedMotion } = useAccessibility();
  const [cursorVisible, setCursorVisible] = useState(visible);
  
  // Update cursor visibility when prop changes
  useEffect(() => {
    setCursorVisible(visible);
  }, [visible]);
  
  // Define cursor variants for animations
  const cursorVariants = {
    blinking: {
      opacity: [1, 0, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    },
    typing: {
      opacity: 1,
      x: [0, 5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity
      }
    },
    idle: {
      opacity: 1
    }
  };
  
  // If reduced motion is enabled, use simplified animation
  const simplifiedCursorVariants = {
    blinking: {
      opacity: reducedMotion ? 1 : [1, 0, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    },
    typing: {
      opacity: 1,
      x: reducedMotion ? 0 : [0, 5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity
      }
    },
    idle: {
      opacity: 1
    }
  };
  
  // If cursor is not visible at all, don't render
  if (!cursorVisible && !isTyping) {
    return null;
  }
  
  return (
    <motion.span
      className={`inline-block w-0.5 h-5 bg-current ${className}`}
      aria-hidden="true"
      initial="idle"
      animate={isTyping ? "typing" : visible ? "idle" : "blinking"}
      variants={reducedMotion ? simplifiedCursorVariants : cursorVariants}
    />
  );
};

export default AnimatedCursor;
