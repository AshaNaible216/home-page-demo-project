import React, { useState, useEffect } from 'react';

interface BlankCanvasProps {
  onStart: () => void;
}

const BlankCanvas: React.FC<BlankCanvasProps> = ({ onStart }) => {
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  
  // Determine time of day for background styling
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
    } else if (hour >= 17 && hour < 21) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('night');
    }
  }, []);
  
  // Show prompt after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle click or key press to start
  const handleStart = () => {
    setShowCursor(false);
    onStart();
  };
  
  // Handle key press
  useEffect(() => {
    const handleKeyPress = () => {
      if (showPrompt) {
        handleStart();
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [showPrompt]);
  
  // Get background gradient based on time of day
  const getBackgroundGradient = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'bg-gradient-to-br from-blue-100 via-blue-50 to-white';
      case 'afternoon':
        return 'bg-gradient-to-br from-blue-200 via-blue-100 to-white';
      case 'evening':
        return 'bg-gradient-to-br from-purple-200 via-pink-100 to-orange-100';
      case 'night':
        return 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white';
      default:
        return 'bg-gradient-to-br from-blue-100 via-blue-50 to-white';
    }
  };
  
  return (
    <div 
      className={`w-full h-full flex flex-col items-center justify-center ${getBackgroundGradient()} transition-colors duration-1000`}
      onClick={showPrompt ? handleStart : undefined}
    >
      <div className="text-center">
        {showCursor && (
          <span className="text-4xl cursor-blink inline-block h-8 w-2 bg-current"></span>
        )}
        
        {showPrompt && (
          <div className="mt-4 opacity-0 animate-fade-in">
            <p className="text-lg mb-2">Hello, I have been waiting for you...please click anywhere</p>
            <p className="text-sm opacity-70">A conversation-first experience awaits</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlankCanvas;