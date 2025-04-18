import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export enum ConversationStepType {
  INTRODUCTION = 'introduction',
  COLOR_PREFERENCE = 'color_preference',
  VALUES = 'values',
  GOALS = 'goals'
}

interface ConversationPromptProps {
  question: string;
  step: ConversationStepType | string;
  onResponse: (response: string) => void;
  onAudioInput?: (audioBlob: Blob) => void;
  isProcessing: boolean;
  totalSteps: number;
  currentStepIndex: number;
}

const ConversationPrompt: React.FC<ConversationPromptProps> = ({
  question,
  step,
  onResponse,
  onAudioInput,
  isProcessing,
  totalSteps,
  currentStepIndex
}) => {
  const [response, setResponse] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [typedQuestion, setTypedQuestion] = useState<string>('');
  const [questionTypingComplete, setQuestionTypingComplete] = useState<boolean>(false);
  
  // For typewriter animation with optimized performance
  useEffect(() => {
    setIsVisible(false);
    setTypedQuestion('');
    setQuestionTypingComplete(false);
    
    // Short delay before starting animations for dramatic effect
    const animationDelay = setTimeout(() => {
      setIsVisible(true);
      
      // Optimized typewriter effect using requestAnimationFrame
      let startTime = 0;
      let index = 0;
      const speed = 15; // Faster typing speed (milliseconds per character)
      const batchSize = 3; // Process multiple characters per frame for longer texts
      
      const animateTypewriter = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        // Calculate how many characters should be typed by now
        const targetIndex = Math.min(
          Math.floor(elapsed / speed),
          question.length
        );
        
        // If we need to update the text
        if (targetIndex > index) {
          // For longer texts, batch characters for smoother animation
          const charsToAdd = question.length > 50
            ? Math.min(batchSize, targetIndex - index)
            : 1;
          
          index += charsToAdd;
          setTypedQuestion(question.substring(0, index));
          
          // Check if we're done
          if (index >= question.length) {
            setQuestionTypingComplete(true);
            return; // Stop animation
          }
        }
        
        // Continue animation
        requestAnimationFrame(animateTypewriter);
      };
      
      // Start animation
      requestAnimationFrame(animateTypewriter);
    }, 300);
    
    return () => clearTimeout(animationDelay);
  }, [question]);
  
  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResponse(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (response.trim() && !isProcessing) {
      // Create submission effect
      createSubmissionEffects();
      
      // Slight delay to allow effects to play
      setTimeout(() => {
        onResponse(response);
        setResponse('');
      }, 500);
    }
  };
  
  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        if (onAudioInput) {
          // Create submission effect
          createSubmissionEffects();
          
          // Slight delay to allow effects to play
          setTimeout(() => {
            onAudioInput(blob);
          }, 500);
        }
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Reset recording state
        setIsRecording(false);
        setRecordingTime(0);
        if (recordingInterval) {
          clearInterval(recordingInterval);
          setRecordingInterval(null);
        }
      };
      
      // Start recording
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  };
  
  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Create visual effects for submission
  const createSubmissionEffects = () => {
    // This function would create particles or other effects
    // This is a placeholder - the actual effects will be created in CSS/motion
  };
  
  // Get input type based on step
  const getInputType = () => {
    if (step === ConversationStepType.COLOR_PREFERENCE) {
      return (
        <motion.div 
          className="mt-8" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: questionTypingComplete ? 1 : 0, y: questionTypingComplete ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <label className="block text-lg font-medium mb-4">Select a color that resonates with you:</label>
          <div className="flex flex-wrap gap-4 justify-center">
            {['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'].map((color) => (
              <motion.button
                key={color}
                type="button"
                className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 relative overflow-hidden"
                style={{ backgroundColor: color }}
                onClick={() => onResponse(color)}
                aria-label={`Select color ${color}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: Math.random() * 0.3 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-white rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ 
                    opacity: 0.3, 
                    scale: [0, 1.5, 0],
                    transition: { duration: 1.5, repeat: Infinity }
                  }}
                />
              </motion.button>
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
              className="flex items-center justify-center"
            >
              <input
                type="color"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 cursor-pointer overflow-hidden shadow-lg"
                aria-label="Select custom color"
              />
              <motion.div 
                className="absolute text-white text-xs font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Custom
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      );
    }
    
    return (
      <motion.div 
        className="mt-8 relative" 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: questionTypingComplete ? 1 : 0, y: questionTypingComplete ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <textarea
          value={response}
          onChange={handleInputChange}
          placeholder="Type your response..."
          className="w-full p-5 pr-16 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-white bg-opacity-20 dark:bg-gray-900 dark:bg-opacity-40 backdrop-blur-lg shadow-lg"
          rows={4}
          disabled={isProcessing}
        />
        
        {/* Animated gradient border */}
        <motion.div 
          className="absolute -inset-0.5 rounded-xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0],
            background: [
              `linear-gradient(45deg, transparent, ${response ? '#ffffff30' : 'transparent'})`,
              `linear-gradient(45deg, transparent, ${response ? '#ffffff60' : '#ffffff10'}, transparent)`,
              `linear-gradient(45deg, transparent, ${response ? '#ffffff30' : 'transparent'})`
            ]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
        
        <div className="absolute right-3 bottom-3 flex space-x-3">
          {onAudioInput && (
            <motion.button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-full shadow-lg backdrop-blur-sm ${
                isRecording ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200'
              }`}
              disabled={isProcessing}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10,
                delay: 0.5
              }}
            >
              {isRecording ? (
                <>
                  <motion.span 
                    className="sr-only"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Stop recording
                  </motion.span>
                  <motion.div 
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 0.8, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <rect x="5" y="5" width="10" height="10" rx="2" />
                    </svg>
                  </motion.div>
                  <motion.span 
                    className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-white text-red-500 rounded-full shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {formatTime(recordingTime)}
                  </motion.span>
                  
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.5 }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      ease: "easeOut" 
                    }}
                    style={{ 
                      border: "2px solid rgba(239, 68, 68, 0.5)",
                      zIndex: -1 
                    }}
                  />
                </>
              ) : (
                <>
                  <span className="sr-only">Start recording</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ 
            type: "spring",
            mass: 0.8, 
            damping: 15, 
            stiffness: 100,
            duration: 0.8 
          }}
          className="glassmorphism p-8 rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden"
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full opacity-10 bg-primary"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-10 bg-primary"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -15, 0],
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
          
          {/* Progress indicator with effects */}
          <div className="mb-6">
            <div className="flex flex-col items-center mb-4">
              <div className="flex space-x-2 mb-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-1.5 rounded-full ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                    style={{ width: index < currentStepIndex ? '32px' : '24px' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 500,
                      delay: index * 0.1
                    }}
                  />
                ))}
              </div>
              <motion.span 
                className="text-sm text-gray-500 dark:text-gray-400 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Step {currentStepIndex} of {totalSteps}
              </motion.span>
            </div>
          </div>
          
          {/* Question with typewriter effect */}
          <motion.h2
            className="text-2xl font-medium mb-2 relative inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {typedQuestion}
            {!questionTypingComplete && (
              <motion.span 
                className="absolute inline-block h-full w-0.5 bg-current ml-0.5"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              />
            )}
            
            {/* Glowing effect beneath the text */}
            <motion.div 
              className="absolute inset-0 -z-10 rounded-lg"
              animate={{ 
                boxShadow: questionTypingComplete 
                  ? [
                      "0 0 5px rgba(255,255,255,0)", 
                      "0 0 15px rgba(255,255,255,0.3)", 
                      "0 0 5px rgba(255,255,255,0)"
                    ]
                  : "none"
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          </motion.h2>
          
          <form onSubmit={handleSubmit}>
            {getInputType()}
            
            <motion.div 
              className="mt-6 flex justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: questionTypingComplete ? 1 : 0, y: questionTypingComplete ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-colors disabled:opacity-50 shadow-lg flex items-center gap-2 relative overflow-hidden"
                disabled={isProcessing || (!response && !isRecording)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  style={{ opacity: 0.2 }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "loop", 
                    duration: 2,
                    repeatDelay: 3
                  }}
                />
                
                {isProcessing ? (
                  <>
                    <motion.svg 
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </motion.svg>
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Processing...
                    </motion.span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConversationPrompt;