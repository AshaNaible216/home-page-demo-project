import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NAIBLE_GREEN, NAIBLE_LIGHT_GREEN, NAIBLE_DARK_GREEN } from '../utils/brandConstants';

interface AIResponsiveBackgroundProps {
  userInput?: string;
  aiResponse?: string;
  mood?: 'neutral' | 'positive' | 'excited' | 'thoughtful';
  primaryColor: string;
}

const AIResponsiveBackground: React.FC<AIResponsiveBackgroundProps> = ({
  userInput,
  aiResponse,
  mood = 'neutral',
  primaryColor = NAIBLE_GREEN
}) => {
  const [particles, setParticles] = useState<any[]>([]);
  const [waveIntensity, setWaveIntensity] = useState(1);
  
  // Generate particles based on AI response
  useEffect(() => {
    if (aiResponse) {
      // More particles for longer responses
      const particleCount = Math.min(60, aiResponse.length / 8);
      const newParticles = Array.from({ length: particleCount }, (_, i) => {
        // Create a more organized grid-like pattern for sharper visuals
        const row = Math.floor(i / 10);
        const col = i % 10;
        
        // Base positions on a grid with slight randomness
        const baseX = (col / 10) * 100; // 0-100% in 10 columns
        const baseY = (row / 6) * 100;  // 0-100% in 6 rows
        
        // Add slight randomness for organic feel
        const randomOffsetX = (Math.random() - 0.5) * 15;
        const randomOffsetY = (Math.random() - 0.5) * 15;
        
        return {
          id: i,
          x: baseX + randomOffsetX,
          y: baseY + randomOffsetY,
          size: Math.random() * 20 + 10, // Larger size for better visibility
          speed: Math.random() * 4 + 3,
          color: i % 4 === 0 ? NAIBLE_GREEN :
                 i % 4 === 1 ? primaryColor :
                 i % 4 === 2 ? NAIBLE_LIGHT_GREEN :
                 '#ffffff'
        };
      });
      
      setParticles(newParticles);
      
      // Increase wave intensity briefly when AI responds
      setWaveIntensity(3);
      setTimeout(() => setWaveIntensity(1), 3000);
    } else {
      // Default particles for initial state - always create some particles
      const newParticles = Array.from({ length: 30 }, (_, i) => {
        // Create a more organized grid-like pattern for sharper visuals
        const row = Math.floor(i / 6);
        const col = i % 6;
        
        // Base positions on a grid with slight randomness
        const baseX = (col / 6) * 100; // 0-100% in 6 columns
        const baseY = (row / 5) * 100;  // 0-100% in 5 rows
        
        // Add slight randomness for organic feel
        const randomOffsetX = (Math.random() - 0.5) * 20;
        const randomOffsetY = (Math.random() - 0.5) * 20;
        
        return {
          id: i,
          x: baseX + randomOffsetX,
          y: baseY + randomOffsetY,
          size: Math.random() * 15 + 8, // Larger for better visibility
          speed: Math.random() * 4 + 3,
          color: i % 4 === 0 ? NAIBLE_GREEN :
                 i % 4 === 1 ? primaryColor :
                 i % 4 === 2 ? NAIBLE_LIGHT_GREEN :
                 '#ffffff'
        };
      });
      
      setParticles(newParticles);
    }
  }, [aiResponse, primaryColor]); // Added primaryColor as dependency
  
  // Get mood-based colors
  const getMoodColors = () => {
    switch(mood) {
      case 'positive':
        return { primary: primaryColor, secondary: NAIBLE_GREEN };
      case 'excited':
        return { primary: '#F59E0B', secondary: NAIBLE_GREEN };
      case 'thoughtful':
        return { primary: NAIBLE_GREEN, secondary: '#8B5CF6' };
      default:
        return { primary: primaryColor, secondary: NAIBLE_DARK_GREEN };
    }
  };
  
  const { primary, secondary } = getMoodColors();
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 30% 30%, ${primary}15 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 70%, ${secondary}15 0%, transparent 60%)`,
            `radial-gradient(circle at 30% 70%, ${primary}15 0%, transparent 60%)`,
            `radial-gradient(circle at 70% 30%, ${secondary}15 0%, transparent 60%)`
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Wave effect that responds to AI */}
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          fill={`${primary}25`}
          animate={{
            d: [
              "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,154.7C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,213.3C960,213,1056,171,1152,160C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,186.7C672,203,768,181,864,154.7C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ]
          }}
          transition={{ 
            duration: 10 / waveIntensity, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.path
          fill={`${secondary}20`}
          animate={{
            d: [
              "M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,181.3C960,171,1056,149,1152,160C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,256L48,240C96,224,192,192,288,181.3C384,171,480,181,576,186.7C672,192,768,192,864,181.3C960,171,1056,149,1152,160C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ]
          }}
          transition={{ 
            duration: 8 / waveIntensity, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </svg>
      
      {/* Particles that represent AI thinking */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: particle.color ?
              `radial-gradient(circle, ${particle.color}90 0%, transparent 70%)` : // Increased opacity
              `radial-gradient(circle, ${primary}90 0%, transparent 70%)`,
            filter: "blur(1px)", // Less blur for sharper appearance
            boxShadow: `0 0 8px ${particle.color || primary}60` // Increased glow
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0], // More movement
            y: [0, Math.random() * 100 - 50, 0], // More movement
            opacity: [0.3, 0.9, 0.3], // Higher opacity for better visibility
            scale: [0.8, 1.2, 0.8] // More pronounced pulsing effect
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );
};

export default AIResponsiveBackground;