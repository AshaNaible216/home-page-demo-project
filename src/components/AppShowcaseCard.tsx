import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AppShowcaseCardProps {
  title: string;
  description: string;
  imageSrc: string;
  color?: string;
  onClick?: () => void;
}

const AppShowcaseCard: React.FC<AppShowcaseCardProps> = ({
  title,
  description,
  imageSrc,
  color = '#6366F1', // Default to indigo
  onClick
}) => {
  // Create a lighter version of the color for backgrounds
  const getLighterColor = (hex: string, opacity: number = 0.1) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
      style={{ backgroundColor: getLighterColor(color, 0.05) }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            background: `linear-gradient(to bottom, transparent 50%, ${getLighterColor(color, 0.9)} 100%)` 
          }}
        />
        <Image
          src={imageSrc}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
      </div>
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h3 
            className="text-xl font-bold mb-2" 
            style={{ color }}
          >
            {title}
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300">
            {description}
          </p>
          
          <div className="mt-4 flex justify-end">
            <motion.button
              className="px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AppShowcaseCard;