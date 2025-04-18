import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackAnimationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  duration?: number;
  onComplete?: () => void;
  position?: 'top' | 'bottom' | 'center';
  className?: string;
}

const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  type,
  message,
  isVisible,
  duration = 3000,
  onComplete,
  position = 'bottom',
  className = ''
}) => {
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isVisible && duration > 0) {
      timeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, duration);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isVisible, duration, onComplete]);
  
  // Get position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      case 'bottom':
      default:
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
    }
  };
  
  // Get type-specific styles
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800/30';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30';
    }
  };
  
  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };
  
  // Animation variants
  const variants = {
    hidden: (position: string) => {
      if (position === 'top') return { y: -50, opacity: 0 };
      if (position === 'center') return { scale: 0.8, opacity: 0 };
      return { y: 50, opacity: 0 };
    },
    visible: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    },
    exit: (position: string) => {
      if (position === 'top') return { y: -20, opacity: 0 };
      if (position === 'center') return { scale: 0.8, opacity: 0 };
      return { y: 20, opacity: 0 };
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed z-50 ${getPositionStyles()} ${className}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          custom={position}
        >
          <div className={`px-4 py-3 rounded-lg shadow-lg border ${getTypeStyles()} glassmorphism max-w-md`}>
            <div className="flex items-center">
              {getIcon()}
              <span>{message}</span>
            </div>
            
            {/* Progress bar for duration */}
            {duration > 0 && (
              <motion.div
                className="h-1 bg-current opacity-30 rounded-full mt-2"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackAnimation;
