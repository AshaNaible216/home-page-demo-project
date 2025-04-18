import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
  className?: string;
}

const ConfettiCelebration: React.FC<ConfettiProps> = ({
  isActive,
  duration = 3000,
  particleCount = 100,
  colors = ['#FFC700', '#FF0055', '#2D95BF', '#00CC88', '#9B10FF'],
  onComplete,
  className = ''
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    rotation: number;
    velocity: { x: number; y: number };
    rotationVelocity: number;
  }>>([]);
  
  // Generate confetti particles
  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage across screen
        y: -10, // start above viewport
        size: Math.random() * 10 + 5, // size between 5-15px
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        velocity: {
          x: (Math.random() - 0.5) * 3,
          y: Math.random() * 3 + 2
        },
        rotationVelocity: (Math.random() - 0.5) * 10
      }));
      
      setParticles(newParticles);
      
      // Clean up after duration
      const timeout = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, duration);
      
      return () => clearTimeout(timeout);
    }
    
    return undefined;
  }, [isActive, particleCount, colors, duration, onComplete]);
  
  return (
    <div className={`confetti-container fixed inset-0 pointer-events-none overflow-hidden z-50 ${className}`}>
      <AnimatePresence>
        {isActive && particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              rotate: particle.rotation,
              opacity: 1
            }}
            animate={{
              x: `calc(${particle.x}vw + ${particle.velocity.x * 100}px)`,
              y: `calc(${particle.y}vh + ${particle.velocity.y * 100}vh)`,
              rotate: particle.rotation + particle.rotationVelocity * 360,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration / 1000, ease: 'easeOut' }}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ConfettiCelebration;
