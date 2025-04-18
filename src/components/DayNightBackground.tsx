import React from 'react';
import { motion } from 'framer-motion';

interface DayNightBackgroundProps {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

const DayNightBackground: React.FC<DayNightBackgroundProps> = ({ timeOfDay }) => {
  // Get the time-specific styles
  const getTimeLabel = () => {
    switch(timeOfDay) {
      case 'morning': return 'Morning';
      case 'afternoon': return 'Afternoon';
      case 'evening': return 'Evening';
      case 'night': return 'Night';
      default: return '';
    }
  };

  return (
    <div className="absolute inset-0 bg-black transition-colors duration-1000 overflow-hidden">
      {/* Datetime window with rounded edges and border */}
      <motion.div 
        className="absolute top-6 right-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="glassmorphism rounded-xl border-2 border-gray-700 shadow-lg overflow-hidden">
          <div className="px-4 py-2 flex items-center justify-between bg-gray-800 border-b border-gray-700">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs text-gray-400">Time</span>
          </div>
          <div className="p-3 text-white flex items-center space-x-3">
            <span className="text-sm font-medium">{getTimeLabel()}</span>
            <span className="text-xs text-gray-400">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DayNightBackground;