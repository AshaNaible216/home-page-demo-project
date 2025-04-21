'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalization } from '../context/PersonalizationContext';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  const { userPreferences } = usePersonalization();
  const [currentStep, setCurrentStep] = useState(0);
  const primaryColor = userPreferences.color || '#4F46E5';
  
  // Array of welcome messages for the carousel
  const welcomeSteps = [
    {
      title: "Welcome to Naible",
      description: "Your journey into personal AI intelligence begins here. We're about to craft a unique experience just for you.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Your Data, Your Rules",
      description: "Naible puts you in complete control of your data. We never share or use your information without explicit permission.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "Personalized Intelligence",
      description: "Through a few simple questions, we'll create an AI experience that fits your preferences, goals, and values.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (isOpen && currentStep < welcomeSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen]);

  // Reset to first step when closed
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);
  
  // Handle manual navigation
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Variants for animations
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren" 
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.3,
        when: "afterChildren" 
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 40 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.6
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: -40,
      transition: { duration: 0.3 }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: custom * 0.2,
        duration: 0.5
      }
    }),
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
    pulse: { 
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 rgba(0,0,0,0)",
        `0 0 20px ${primaryColor}50`,
        "0 0 0 rgba(0,0,0,0)"
      ],
      transition: { 
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          {/* Card container - prevent click propagation */}
          <motion.div 
            className="w-full max-w-2xl relative"
            onClick={e => e.stopPropagation()}
            variants={cardVariants}
          >
            {/* Decorative background elements */}
            <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}></div>
            
            {/* Glowing border effect */}
            <motion.div 
              className="absolute -inset-px rounded-2xl z-0"
              animate={{
                boxShadow: [
                  `0 0 10px ${primaryColor}40`,
                  `0 0 30px ${primaryColor}60`,
                  `0 0 10px ${primaryColor}40`
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Main card */}
            <div className="glassmorphism rounded-2xl shadow-2xl overflow-hidden relative z-10">
              {/* Animated shimmer */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              />
              
              {/* Header */}
              <div className="p-6 md:p-8 text-center relative">
                <button 
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`step-${currentStep}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col items-center"
                  >
                    {/* Icon with glow effect */}
                    <motion.div
                      className="mb-6 p-4 rounded-full"
                      style={{ 
                        backgroundColor: `${primaryColor}15`,
                        color: primaryColor
                      }}
                      variants={contentVariants}
                      custom={0}
                    >
                      <motion.div
                        animate={{
                          boxShadow: [
                            `0 0 0px ${primaryColor}00`,
                            `0 0 20px ${primaryColor}40`,
                            `0 0 0px ${primaryColor}00`
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="rounded-full"
                      >
                        {welcomeSteps[currentStep].icon}
                      </motion.div>
                    </motion.div>
                    
                    {/* Title */}
                    <motion.h2 
                      className="text-2xl md:text-3xl font-bold mb-4"
                      variants={contentVariants}
                      custom={1}
                      style={{ color: primaryColor }}
                    >
                      {welcomeSteps[currentStep].title}
                    </motion.h2>
                    
                    {/* Description */}
                    <motion.p 
                      className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg text-center"
                      variants={contentVariants}
                      custom={2}
                    >
                      {welcomeSteps[currentStep].description}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
                
                {/* Progress dots */}
                <div className="flex justify-center space-x-2 mt-6">
                  {welcomeSteps.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentStep 
                          ? 'bg-primary' 
                          : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => goToStep(index)}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Footer */}
              <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 flex justify-between">
                {/* Previous step button (hidden on first step) */}
                {currentStep > 0 ? (
                  <motion.button
                    className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Previous
                  </motion.button>
                ) : (
                  <div></div> // Spacer to maintain layout
                )}
                
                {/* Next or Start button */}
                <motion.button
                  className="px-6 py-2 rounded-lg text-white shadow-lg flex items-center"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => {
                    if (currentStep < welcomeSteps.length - 1) {
                      setCurrentStep(prev => prev + 1);
                    } else {
                      onClose();
                    }
                  }}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  animate="pulse"
                >
                  {currentStep < welcomeSteps.length - 1 ? (
                    <>
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </>
                  ) : (
                    'Begin Your Journey'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;