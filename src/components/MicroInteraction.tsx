import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MicroInteractionProps {
  children: React.ReactNode;
  hoverEffect?: 'scale' | 'glow' | 'lift' | 'pulse' | 'none';
  clickEffect?: 'bounce' | 'ripple' | 'flash' | 'shake' | 'none';
  className?: string;
  onClick?: () => void;
}

const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  hoverEffect = 'scale',
  clickEffect = 'bounce',
  className = '',
  onClick
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  
  // Reset click state after animation completes
  useEffect(() => {
    if (isClicked) {
      const timeout = setTimeout(() => {
        setIsClicked(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [isClicked]);
  
  // Define hover animations
  const getHoverVariants = () => {
    switch (hoverEffect) {
      case 'scale':
        return {
          initial: { scale: 1 },
          hover: { scale: 1.05, transition: { duration: 0.2 } }
        };
      case 'glow':
        return {
          initial: { boxShadow: '0 0 0 rgba(var(--color-primary-rgb), 0)' },
          hover: { 
            boxShadow: '0 0 15px rgba(var(--color-primary-rgb), 0.5)',
            transition: { duration: 0.3 }
          }
        };
      case 'lift':
        return {
          initial: { y: 0, boxShadow: '0 0 0 rgba(0, 0, 0, 0)' },
          hover: { 
            y: -5, 
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
            transition: { duration: 0.2 }
          }
        };
      case 'pulse':
        return {
          initial: { scale: 1 },
          hover: { 
            scale: [1, 1.02, 1],
            transition: { duration: 0.5, repeat: Infinity }
          }
        };
      case 'none':
      default:
        return {
          initial: {},
          hover: {}
        };
    }
  };
  
  // Define click animations
  const getClickVariants = () => {
    switch (clickEffect) {
      case 'bounce':
        return {
          initial: { scale: 1 },
          click: { 
            scale: [1, 0.95, 1.05, 1],
            transition: { duration: 0.4, times: [0, 0.2, 0.6, 1] }
          }
        };
      case 'shake':
        return {
          initial: { x: 0 },
          click: { 
            x: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
          }
        };
      case 'flash':
        return {
          initial: { backgroundColor: 'transparent' },
          click: { 
            backgroundColor: ['transparent', 'rgba(var(--color-primary-rgb), 0.2)', 'transparent'],
            transition: { duration: 0.3, times: [0, 0.5, 1] }
          }
        };
      case 'none':
      default:
        return {
          initial: {},
          click: {}
        };
    }
  };
  
  const hoverVariants = getHoverVariants();
  const clickVariants = getClickVariants();
  
  // Handle click with ripple effect
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clickEffect === 'ripple') {
      // Get click position relative to the element
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setRipplePosition({ x, y });
    }
    
    setIsClicked(true);
    
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <motion.div
      className={`micro-interaction ${className}`}
      initial="initial"
      whileHover={hoverEffect !== 'none' ? "hover" : undefined}
      animate={isClicked && clickEffect !== 'ripple' && clickEffect !== 'none' ? "click" : "initial"}
      variants={{
        ...hoverVariants,
        ...clickVariants
      }}
      onClick={handleClick}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {children}
      
      {/* Ripple effect */}
      <AnimatePresence>
        {isClicked && clickEffect === 'ripple' && (
          <motion.div
            className="ripple"
            style={{
              position: 'absolute',
              top: ripplePosition.y,
              left: ripplePosition.x,
              backgroundColor: 'rgba(var(--color-primary-rgb), 0.3)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ 
              width: 300, 
              height: 300, 
              opacity: 0 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MicroInteraction;
