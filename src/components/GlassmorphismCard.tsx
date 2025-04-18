import React from 'react';
import { motion } from 'framer-motion';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  delay = 0
}) => {
  return (
    <motion.div
      className={`glassmorphism rounded-xl p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassmorphismCard;
