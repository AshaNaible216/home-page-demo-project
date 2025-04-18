import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface MagicEffectsProps {
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const MagicEffects: React.FC<MagicEffectsProps> = ({
  color = '#4F46E5',
  intensity = 'medium'
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);
  
  // Define intensity factors
  const intensityFactors = {
    low: { count: 15, opacity: 0.3, size: 0.7 },
    medium: { count: 30, opacity: 0.5, size: 1 },
    high: { count: 50, opacity: 0.7, size: 1.3 }
  };
  
  // Create magic particles
  useEffect(() => {
    const { count } = intensityFactors[intensity];
    
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // % position
      y: Math.random() * 100, // % position
      size: (Math.random() * 10 + 5) * intensityFactors[intensity].size, // size in px
      duration: Math.random() * 10 + 15, // animation duration
      delay: Math.random() * 5 // animation delay
    }));
    
    setParticles(newParticles);
  }, [color, intensity]);
  
  // Particles animation variant
  const particleVariants = {
    animate: (i: any) => ({
      x: [
        `${i.x}%`,
        `${i.x + (Math.random() * 20 - 10)}%`,
        `${i.x + (Math.random() * 20 - 10)}%`,
        `${i.x}%`
      ],
      y: [
        `${i.y}%`,
        `${i.y + (Math.random() * 20 - 10)}%`,
        `${i.y + (Math.random() * 20 - 10)}%`,
        `${i.y}%`
      ],
      opacity: [0, 0.3, 0.3, 0],
      scale: [0, 1, 1, 0],
      transition: {
        duration: i.duration,
        delay: i.delay,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    })
  };
  
  // Helper function to lighten color
  const getLighterColor = (hex: string, opacity: number = 0.5) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Ambient background glow */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${getLighterColor(color, 0.1)} 0%, transparent 50%)`,
            `radial-gradient(circle at 70% 70%, ${getLighterColor(color, 0.1)} 0%, transparent 50%)`,
            `radial-gradient(circle at 30% 70%, ${getLighterColor(color, 0.1)} 0%, transparent 50%)`,
            `radial-gradient(circle at 70% 30%, ${getLighterColor(color, 0.1)} 0%, transparent 50%)`,
            `radial-gradient(circle at 30% 30%, ${getLighterColor(color, 0.1)} 0%, transparent 50%)`
          ]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${getLighterColor(color, 0.6)} 0%, transparent 70%)`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            filter: "blur(1px)"
          }}
          custom={{
            x: particle.x,
            y: particle.y,
            duration: particle.duration,
            delay: particle.delay
          }}
          variants={particleVariants}
          animate="animate"
        />
      ))}
    </div>
  );
};

export default MagicEffects;