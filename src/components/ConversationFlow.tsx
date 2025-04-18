import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversationFlowProps {
  steps: Array<{
    id: string;
    component: React.ReactNode;
  }>;
  currentStepIndex: number;
  onStepComplete: (stepId: string, response: any) => void;
  onStepBack?: (stepId: string) => void;
  allowBackNavigation?: boolean;
}

const ConversationFlow: React.FC<ConversationFlowProps> = ({
  steps,
  currentStepIndex,
  onStepComplete,
  onStepBack,
  allowBackNavigation = false
}) => {
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [previousIndex, setPreviousIndex] = useState<number>(0);

  // Detect direction of navigation
  useEffect(() => {
    if (currentStepIndex > previousIndex) {
      setDirection('forward');
    } else if (currentStepIndex < previousIndex) {
      setDirection('backward');
    }
    setPreviousIndex(currentStepIndex);
  }, [currentStepIndex, previousIndex]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      // Optional: Handle escape key (maybe show a "are you sure you want to quit" dialog)
    } else if (e.key === 'ArrowLeft' && allowBackNavigation && currentStepIndex > 0) {
      if (onStepBack) {
        onStepBack(steps[currentStepIndex].id);
      }
    }
  }, [allowBackNavigation, currentStepIndex, onStepBack, steps]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Animation variants
  const variants = {
    enter: (direction: string) => ({
      x: direction === 'forward' ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: string) => ({
      x: direction === 'forward' ? -100 : 100,
      opacity: 0
    })
  };

  // Get current step
  const currentStep = steps[currentStepIndex];

  return (
    <div className="relative w-full h-full">
      {/* Progress indicator */}
      {steps.length > 1 && (
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`h-1 w-8 rounded-full transition-colors duration-300 ${
                  index === currentStepIndex
                    ? 'bg-primary-500'
                    : index < currentStepIndex
                    ? 'bg-primary-300'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
                aria-label={`Step ${index + 1} of ${steps.length}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step content with animations */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentStep.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="w-full h-full"
        >
          {currentStep.component}
        </motion.div>
      </AnimatePresence>

      {/* Back button (if allowed) */}
      {allowBackNavigation && currentStepIndex > 0 && onStepBack && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 rounded-full glassmorphism text-gray-600 dark:text-gray-300 hover:text-primary-500"
          onClick={() => onStepBack(currentStep.id)}
          aria-label="Go back to previous step"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default ConversationFlow;
