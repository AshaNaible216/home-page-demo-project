import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WelcomeMessage from './WelcomeMessage';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('night');
  
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
  
  // Get background gradient based on time of day
  const getBackgroundGradient = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'bg-gradient-to-br from-blue-400 via-sky-300 to-blue-200';
      case 'afternoon':
        return 'bg-gradient-to-br from-blue-500 via-sky-400 to-blue-300';
      case 'evening':
        return 'bg-gradient-to-br from-purple-700 via-pink-600 to-orange-400';
      case 'night':
      default:
        return 'bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900';
    }
  };

  // Determine if sun should be visible
  const isSunVisible = timeOfDay === 'morning' || timeOfDay === 'afternoon';
  
  return (
    <motion.div 
      className={`w-full min-h-[60vh] flex flex-col items-center justify-center relative ${getBackgroundGradient()} transition-colors duration-1000`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      onClick={onStart}
    >
      {/* Sun effect for daytime */}
      {isSunVisible && (
        <motion.div
          className="absolute rounded-full bg-yellow-300"
          style={{
            width: timeOfDay === 'morning' ? '100px' : '120px',
            height: timeOfDay === 'morning' ? '100px' : '120px',
            top: timeOfDay === 'morning' ? '15%' : '10%',
            right: timeOfDay === 'morning' ? '10%' : '15%',
            boxShadow: '0 0 60px 30px rgba(253, 224, 71, 0.8), 0 0 100px 60px rgba(253, 224, 71, 0.6), 0 0 140px 90px rgba(253, 224, 71, 0.4)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 2 }}
        />
      )}

      {/* Blurred stars effect */}
      {Array.from({ length: 20 }).map((_, index) => (
        <motion.div
          key={`star-${index}`}
          className="absolute w-1 h-1 rounded-full bg-white z-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: "blur(0.5px)",
            opacity: timeOfDay === 'night' ? 0.8 : 0.3 // More visible at night
          }}
          animate={{
            opacity: timeOfDay === 'night' ? 
              [0.5, 0.9, 0.5] : // Night time stars brighter
              [0.1, 0.3, 0.1],  // Daytime stars dimmer
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}
      
      {/* Welcome Message Component - separated for cleaner code */}
      <div className="w-full max-w-xl px-4">
        <WelcomeMessage onStart={onStart} timeOfDay={timeOfDay} />
      </div>
    </motion.div>
  );
};

export default IntroScreen;