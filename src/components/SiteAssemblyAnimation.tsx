import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface UserPreferencesType {
  color?: string;
  values?: string;
  goal?: string;
  theme?: 'light' | 'dark' | 'system';
}

interface SiteAssemblyAnimationProps {
  userPreferences: UserPreferencesType;
}

const SiteAssemblyAnimation: React.FC<SiteAssemblyAnimationProps> = ({ userPreferences }) => {
  const [progress, setProgress] = useState<number>(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; delay: number }>>([]);
  const [energyBurst, setEnergyBurst] = useState(false);
  
  // Generate particles based on user preferences
  useEffect(() => {
    // Import Naible green color
    const { NAIBLE_GREEN, NAIBLE_DARK_GREEN, NAIBLE_LIGHT_GREEN } = require('../utils/brandConstants');
    
    // Use user color but blend with Naible green for brand consistency
    const color = userPreferences.color || NAIBLE_GREEN;
    const complementaryColor = getComplementaryColor(color);
    const lighterColor = getLighterColor(color);
    
    // Create a more organized array of particles for sharper visual effect
    const newParticles = Array.from({ length: 120 }, (_, i) => {
      // Calculate more precise positions for better alignment
      // Create a grid-like pattern with some randomness for organic feel
      const row = Math.floor(i / 12);
      const col = i % 12;
      
      // Base positions on a grid
      const baseX = (col / 12) * 100; // 0-100% in 12 columns
      const baseY = (row / 10) * 100; // 0-100% in 10 rows
      
      // Add slight randomness for organic feel
      const randomOffsetX = (Math.random() - 0.5) * 8;
      const randomOffsetY = (Math.random() - 0.5) * 8;
      
      return {
        id: i,
        x: baseX + randomOffsetX, // More controlled x position
        y: baseY + randomOffsetY, // More controlled y position
        size: Math.random() * 16 + 4, // Slightly smaller for sharper look
        color: i % 5 === 0 ? NAIBLE_GREEN :
               i % 5 === 1 ? color :
               i % 5 === 2 ? complementaryColor :
               i % 5 === 3 ? lighterColor : '#ffffff',
        delay: i * 0.01 // Staggered delay for particle animation
      };
    });
    
    setParticles(newParticles);

    // Trigger energy burst effect at 50% progress
    const burstTimer = setTimeout(() => {
      setEnergyBurst(true);
    }, 2500);

    return () => {
      clearTimeout(burstTimer);
    };
  }, [userPreferences.color]);
  
  // Animate progress
  useEffect(() => {
    // Slower progress at start, faster in the middle, slower at end for dramatic effect
    const intervals = [
      { until: 30, speed: 35 },   // Slower start
      { until: 60, speed: 25 },   // Faster middle
      { until: 85, speed: 35 },   // Slow down
      { until: 100, speed: 45 }   // Very slow at end for anticipation
    ];
    
    let currentInterval = intervals[0];
    
    const interval = setInterval(() => {
      setProgress(prev => {
        // Find the correct speed interval
        if (prev >= currentInterval.until) {
          const nextIntervalIndex = intervals.findIndex(i => i.until === currentInterval.until) + 1;
          if (nextIntervalIndex < intervals.length) {
            currentInterval = intervals[nextIntervalIndex];
          }
        }
        
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 0.5;
      });
    }, currentInterval.speed);
    
    return () => clearInterval(interval);
  }, []);

  // Get complementary color
  const getComplementaryColor = (hex: string): string => {
    // Convert hex to rgb
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Calculate complementary color
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    
    // Convert back to hex
    return `#${((1 << 24) + (compR << 16) + (compG << 8) + compB).toString(16).slice(1)}`;
  };
  
  // Get lighter color
  const getLighterColor = (hex: string): string => {
    // Convert hex to rgb
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Calculate lighter color (add 150 to each component)
    const lightR = Math.min(r + 150, 255);
    const lightG = Math.min(g + 150, 255);
    const lightB = Math.min(b + 150, 255);
    
    // Convert back to hex
    return `#${((1 << 24) + (lightR << 16) + (lightG << 8) + lightB).toString(16).slice(1)}`;
  };

  // Get message based on progress
  const getMessage = () => {
    if (progress < 25) {
      return "Gathering your preferences...";
    } else if (progress < 50) {
      return "Infusing your personal essence...";
    } else if (progress < 75) {
      return "Weaving digital magic...";
    } else if (progress < 95) {
      return "Finalizing your unique experience...";
    } else {
      return "Revelation imminent...";
    }
  };
  
  // Particle animation variants
  const particleVariants = {
    initial: (i: number) => ({
      opacity: 0,
      scale: 0,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      rotate: Math.random() * 360
    }),
    animate: (i: number) => ({
      opacity: [0, 0.8, 0.6],
      scale: [0, 1.1, 1],
      // More precise positioning for better alignment
      x: `calc(${50 + Math.cos(i * 0.5) * 40}% + ${(i % 12) - 6}px)`,
      y: `calc(${50 + Math.sin(i * 0.5) * 40}% + ${(Math.floor(i / 12)) * 2}px)`,
      rotate: [0, 180, 360],
      transition: {
        duration: 2.5 + (i % 3), // Slightly faster for sharper movement
        delay: i * 0.015, // Tighter timing
        ease: [0.2, 0.05, 0.2, 1], // Adjusted bezier curve for crisper motion
        rotate: {
          duration: 4,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      }
    }),
    burst: (i: number) => ({
      x: `calc(${Math.random() * 100}% - 50%)`,
      y: `calc(${Math.random() * 100}% - 50%)`,
      scale: [1, 1.5, 0],
      opacity: [0.5, 0.8, 0],
      transition: {
        duration: 2 + Math.random() * 2,
        ease: [0, 0.55, 0.45, 1]
      }
    })
  };
  
  // Container animation variants
  const containerVariants = {
    initial: {
      scale: 0.9,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.34, 1.56, 0.64, 1] // Spring-like motion
      }
    }
  };

  // UI element variants
  const uiElementVariants = {
    initial: {
      opacity: 0,
      y: 50,
      scale: 0.8
    },
    animate: (delay: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        delay,
        ease: [0.34, 1.56, 0.64, 1] // Spring-like motion
      }
    })
  };

  // Glow pulse animation
  const glowPulse = {
    initial: {
      boxShadow: "0 0 0px rgba(255, 255, 255, 0)"
    },
    animate: {
      boxShadow: [
        "0 0 10px rgba(255, 255, 255, 0.2)",
        "0 0 30px rgba(255, 255, 255, 0.6)",
        "0 0 10px rgba(255, 255, 255, 0.2)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const // Fix TypeScript error by using 'as const'
      }
    }
  };

  // Energy burst effect
  const burstVariants = {
    initial: { 
      scale: 0.1, 
      opacity: 0 
    },
    animate: { 
      scale: [0.1, 3, 5],
      opacity: [0, 0.8, 0],
      transition: { 
        duration: 1.5, 
        ease: "easeOut" 
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative">
      
      {/* Background color transition */}
      <motion.div 
        className="absolute inset-0 -z-10" 
        animate={{
          backgroundColor: [
            'rgba(0, 0, 0, 0)',
            // Blend with Naible green
            `rgba(${parseInt(userPreferences.color?.slice(1, 3) || '0', 16)}, ${parseInt(userPreferences.color?.slice(3, 5) || '182', 16)}, ${parseInt(userPreferences.color?.slice(5, 7) || '122', 16)}, 0.15)`,
            'rgba(0, 0, 0, 0)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Main container with epic entrance */}
      <motion.div 
        className="relative w-full max-w-2xl h-96 mb-12"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Central energy burst effect */}
        {energyBurst && (
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-10"
            style={{
              // Use Naible green for the energy burst
              backgroundColor: require('../utils/brandConstants').NAIBLE_GREEN,
              width: '100px',
              height: '100px',
              boxShadow: '0 0 30px rgba(0, 182, 122, 0.6)' // Add glow effect
            }}
            variants={burstVariants}
            initial="initial"
            animate="animate"
          />
        )}

        {/* Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full z-20"
            custom={particle.id}
            variants={particleVariants}
            initial="initial"
            animate={energyBurst && particle.id % 3 === 0 ? "burst" : "animate"}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              filter: 'blur(1px)', // Less blur for sharper appearance
              boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)' // Subtle glow for definition
            }}
          />
        ))}
        
        {/* Circular glow behind elements */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
          style={{
            // Blend user color with Naible green
            backgroundColor: require('../utils/brandConstants').NAIBLE_GREEN,
            opacity: 0.2,
            boxShadow: '0 0 40px rgba(0, 182, 122, 0.3)' // Add glow for better definition
          }}
          variants={glowPulse}
          initial="initial"
          animate="animate"
        />
        
        {/* Main card */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 glassmorphism p-8 rounded-2xl w-full h-64 z-30"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          initial={{ opacity: 0, scale: 0.5, y: 50, rotateX: 45 }}
          animate={{ 
            opacity: progress > 20 ? 1 : 0, 
            scale: progress > 20 ? 1 : 0.5,
            y: progress > 20 ? 0 : 50,
            rotateX: progress > 20 ? 0 : 45
          }}
          transition={{ 
            duration: 1.2, 
            ease: [0.25, 1, 0.5, 1],
            delay: 0.5
          }}
        >
          {/* Interior card content with staggered entrance */}
          <motion.div
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-2 bg-white rounded-full overflow-hidden z-40"
            style={{ width: '80%' }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ 
              opacity: progress > 40 ? 1 : 0, 
              scaleX: progress > 40 ? 1 : 0
            }}
            transition={{ duration: 1.5, delay: 1, ease: "circOut" }}
          >
            <motion.div 
              className="h-full rounded-full" 
              style={{
                // Use Naible green for progress bar
                backgroundColor: require('../utils/brandConstants').NAIBLE_GREEN,
                boxShadow: '0 0 10px rgba(0, 182, 122, 0.5)' // Add glow
              }}
              animate={{ width: `${Math.min(progress * 1.2, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* Main title */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold"
            custom={1.5}
            variants={uiElementVariants}
            initial="initial"
            animate={progress > 60 ? "animate" : "initial"}
            style={{
              // Use user color but ensure it's visible
              color: userPreferences.color || require('../utils/brandConstants').NAIBLE_GREEN,
              textShadow: '0 0 10px rgba(0, 0, 0, 0.2)' // Add shadow for better readability
            }}
          >
            Your Digital Magic Takes Form
          </motion.div>

          {/* Navigation elements */}
          <motion.div
            className="absolute top-8 left-0 right-0 flex justify-between px-8"
            custom={1.8}
            variants={uiElementVariants}
            initial="initial"
            animate={progress > 70 ? "animate" : "initial"}
          >
            <div 
              className="w-8 h-8 rounded-full" 
              style={{ backgroundColor: require('../utils/brandConstants').NAIBLE_GREEN }}
            />
            <div className="flex space-x-3">
              {[1, 2, 3].map(i => (
                <motion.div 
                  key={i} 
                  className="w-16 h-2 rounded-full"
                  style={{
                    backgroundColor: i === 1 ? require('../utils/brandConstants').NAIBLE_GREEN : '#d1d5db',
                    boxShadow: i === 1 ? '0 0 5px rgba(0, 182, 122, 0.5)' : 'none' // Add glow to active element
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: progress > 75 + (i * 5) ? 1 : 0,
                    x: progress > 75 + (i * 5) ? 0 : 20
                  }}
                  transition={{ duration: 0.5, delay: 1.8 + (i * 0.1) }}
                />
              ))}
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white font-medium"
            style={{
              backgroundColor: require('../utils/brandConstants').NAIBLE_GREEN,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' // Add shadow for depth
            }}
            custom={2.2}
            variants={uiElementVariants}
            initial="initial"
            animate={progress > 85 ? "animate" : "initial"}
          >
            Continue to Your Experience
          </motion.div>
        </motion.div>
        
        {/* Floating elements that appear as the site "builds" */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-16 h-16 rounded-lg z-20"
          style={{
            backgroundColor: require('../utils/brandConstants').NAIBLE_GREEN,
            opacity: 0.8,
            boxShadow: '0 0 15px rgba(0, 182, 122, 0.4)' // Add glow
          }}
          initial={{ opacity: 0, scale: 0, rotate: -45, x: 100 }}
          animate={{ 
            opacity: progress > 30 ? 0.8 : 0, 
            scale: progress > 30 ? 1 : 0,
            rotate: 0, 
            x: 0
          }}
          transition={{ duration: 1.5, ease: "backOut" }}
        />
        
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-12 h-12 rounded-full z-20"
          style={{
            backgroundColor: userPreferences.color || require('../utils/brandConstants').NAIBLE_GREEN,
            opacity: 0.6,
            boxShadow: '0 0 15px rgba(0, 182, 122, 0.4)' // Add glow
          }}
          initial={{ opacity: 0, scale: 0, y: -80 }}
          animate={{ 
            opacity: progress > 45 ? 0.6 : 0, 
            scale: progress > 45 ? 1 : 0,
            y: 0
          }}
          transition={{ duration: 1.2, ease: "circOut" }}
        />
        
        <motion.div
          className="absolute top-1/3 left-1/5 w-20 h-6 rounded-md z-20"
          style={{
            backgroundColor: getComplementaryColor(userPreferences.color || require('../utils/brandConstants').NAIBLE_GREEN),
            opacity: 0.7,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)' // Add glow
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ 
            opacity: progress > 60 ? 0.7 : 0, 
            scaleX: progress > 60 ? 1 : 0
          }}
          transition={{ duration: 1, ease: "circOut" }}
        />
      </motion.div>
      
      <div className="text-center z-40 relative">
        {/* Animated message that changes with progress */}
        <motion.p 
          className="mb-6 text-xl font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          key={getMessage()} // Force re-animation when message changes
        >
          {getMessage()}
        </motion.p>
        
        {/* Epic progress bar */}
        <div className="w-80 h-3 glassmorphism rounded-full overflow-hidden mb-4 relative">
          <motion.div 
            className="h-full rounded-full"
            style={{
              backgroundColor: require('../utils/brandConstants').NAIBLE_GREEN,
              boxShadow: '0 0 10px rgba(0, 182, 122, 0.5)' // Add glow
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Light effect that travels along the progress bar */}
          <motion.div
            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ opacity: 0.4 }}
            initial={{ left: '-10%' }}
            animate={{ left: '110%' }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear",
              delay: 1
            }}
          />
        </div>
        
        {/* Percentage counter with animated numbers */}
        <div className="relative inline-block">
          <motion.p 
            className="text-2xl font-bold"
            style={{
              color: require('../utils/brandConstants').NAIBLE_GREEN,
              textShadow: '0 0 5px rgba(0, 182, 122, 0.3)' // Add subtle glow
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.p>
          
          {/* Pulsing glow effect behind percentage */}
          <motion.div
            className="absolute inset-0 rounded-xl -z-10"
            style={{ backgroundColor: require('../utils/brandConstants').NAIBLE_GREEN }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8],
              filter: ["blur(8px)", "blur(12px)", "blur(8px)"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SiteAssemblyAnimation;