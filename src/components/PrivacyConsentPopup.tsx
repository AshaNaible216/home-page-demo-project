import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyConsentPopupProps {
  onAccept: () => void;
  onViewDetails: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

const PrivacyConsentPopup: React.FC<PrivacyConsentPopupProps> = ({
  onAccept,
  onViewDetails
}) => {
  const [isAnimating, setIsAnimating] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.8,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -50,
      transition: {
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } }
  };

  // Magic particles effect
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles on mount
  React.useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      opacity: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 2,
      duration: Math.random() * 10 + 8
    }));
    
    setParticles(newParticles);
  }, []);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="glassmorphism p-8 sm:p-10 rounded-2xl max-w-lg mx-auto shadow-2xl relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Ambient particles */}
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                opacity: particle.opacity,
                filter: "blur(1px)"
              }}
              animate={{
                x: [
                  `${particle.x}%`,
                  `${particle.x + (Math.random() * 10 - 5)}%`,
                  `${particle.x}%`
                ],
                y: [
                  `${particle.y}%`,
                  `${particle.y + (Math.random() * 10 - 5)}%`,
                  `${particle.y}%`
                ],
                opacity: [
                  particle.opacity,
                  particle.opacity * 1.5,
                  particle.opacity
                ]
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
          
          {/* Header with glow effect */}
          <motion.div
            className="relative mb-6"
            variants={itemVariants}
          >
            <motion.h2 
              className="text-2xl sm:text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary"
              animate={{
                backgroundPosition: ["0% center", "100% center", "0% center"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Privacy First
            </motion.h2>
            
            <motion.div
              className="h-1 w-20 bg-primary rounded mx-auto"
              initial={{ width: 0 }}
              animate={{ width: "5rem" }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </motion.div>
          
          {/* Privacy content */}
          <motion.p
            className="mb-6 text-gray-600 dark:text-gray-300"
            variants={itemVariants}
          >
            At Naible, we believe in putting you in control of your data. Before we begin, we want to be transparent about how we use your information.
          </motion.p>
          
          <motion.p
            className="mb-8 text-gray-600 dark:text-gray-300"
            variants={itemVariants}
          >
            In this prototype, all data is stored locally on your device. Nothing is sent to our servers without your explicit consent.
          </motion.p>
          
          {/* Key points with icons */}
          <motion.div
            className="mb-8 space-y-4"
            variants={itemVariants}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your preferences and settings are stored only on your device</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">You can export or delete your data at any time</p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your experience is personalized privately, on your device</p>
            </div>
          </motion.div>
          
          {/* Animated buttons */}
          <motion.div
            className="flex flex-col space-y-4"
            variants={itemVariants}
          >
            <motion.button
              onClick={onAccept}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all shadow-lg relative overflow-hidden"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {/* Animated shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                initial={{ left: "-100%" }}
                animate={{ left: "200%" }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "loop", 
                  duration: 2,
                  repeatDelay: 3
                }}
              />
              I Understand, Let's Begin
            </motion.button>
            
            <motion.button
              onClick={onViewDetails}
              className="px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:bg-opacity-10 transition-all"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              View Data Privacy Details
            </motion.button>
          </motion.div>
          
          {/* Background glow effect */}
          <motion.div 
            className="absolute inset-0 -z-10 opacity-40 rounded-2xl"
            animate={{ 
              boxShadow: [
                "inset 0 0 15px rgba(79, 70, 229, 0.2)",
                "inset 0 0 30px rgba(79, 70, 229, 0.4)",
                "inset 0 0 15px rgba(79, 70, 229, 0.2)"
              ] 
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyConsentPopup;