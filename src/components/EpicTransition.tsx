import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface EpicTransitionProps {
  isActive: boolean;
  color?: string;
  onComplete?: () => void;
  duration?: number;
}

const EpicTransition: React.FC<EpicTransitionProps> = ({
  isActive,
  color = '#4F46E5',
  onComplete,
  duration = 1.5
}) => {
  const controls = useAnimation();
  
  useEffect(() => {
    const runTransition = async () => {
      if (isActive) {
        // Start with the masked reveal
        await controls.start({
          clipPath: "circle(150% at center)",
          transition: { 
            duration: duration,
            ease: [0.22, 1, 0.36, 1] // Custom cubic bezier for dramatic effect
          }
        });
        
        // Call completion callback
        if (onComplete) {
          setTimeout(onComplete, 100);
        }
      } else {
        // Reset to initial state
        controls.set({
          clipPath: "circle(0% at center)",
        });
      }
    };
    
    runTransition();
  }, [isActive, controls, duration, onComplete]);
  
  // Create color enhancement
  const enhanceColor = (hex: string): string => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Brighten the color
    const brighterR = Math.min(255, Math.floor(r * 1.2));
    const brighterG = Math.min(255, Math.floor(g * 1.2));
    const brighterB = Math.min(255, Math.floor(b * 1.2));
    
    // Convert back to hex
    return `#${brighterR.toString(16).padStart(2, '0')}${brighterG.toString(16).padStart(2, '0')}${brighterB.toString(16).padStart(2, '0')}`;
  };

  // If not active, don't render anything
  if (!isActive) return null;

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ clipPath: "circle(0% at center)" }}
      animate={controls}
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle, ${enhanceColor(color)} 0%, ${color} 50%, rgba(0, 0, 0, 0.8) 100%)`
        }}
      />
      
      {/* Central glow */}
      <motion.div 
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: `radial-gradient(circle, ${enhanceColor(color)} 0%, transparent 70%)`,
          filter: "blur(40px)"
        }}
        animate={{
          scale: [1, 1.5, 2, 3],
          opacity: [0.8, 0.6, 0.3, 0]
        }}
        transition={{ duration: duration * 0.8, ease: "easeOut" }}
      />
      
      {/* Particle burst */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-10 rounded-full origin-center"
          style={{
            background: "white",
            opacity: 0.7,
            boxShadow: `0 0 10px 2px ${enhanceColor(color)}`
          }}
          initial={{
            scale: 0,
            rotate: i * 18 // 360 / 20 = 18 degrees per line
          }}
          animate={{
            scale: [0, 3, 0],
            opacity: [0.7, 0.3, 0]
          }}
          transition={{ 
            duration: duration * 0.7,
            delay: duration * 0.1,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Central flash */}
      <motion.div 
        className="absolute w-full h-full bg-white"
        animate={{
          opacity: [0, 0.7, 0]
        }}
        transition={{
          duration: duration * 0.3, 
          ease: "easeOut"
        }}
      />
    </motion.div>
  );
};

export default EpicTransition;