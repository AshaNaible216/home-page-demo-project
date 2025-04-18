import React from 'react';
import { motion } from 'framer-motion';

const SplashCards: React.FC = () => {
  const cards = [
    {
      title: 'Your Data, Your Control',
      description: 'All your personal data stays on your device. Nothing leaves without your explicit permission.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: 'Personalization Engine',
      description: 'Advanced AI creates a unique experience based on your preferences without sharing your data.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: 'Transparent Processing',
      description: 'See exactly what happens with your information at every step. No black boxes.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 12 
      }
    }
  };
  
  return (
    <motion.div 
      className="mt-4 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="glassmorphism p-6 rounded-xl text-white"
            variants={cardVariants}
            whileHover={{ 
              y: -5, 
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            <div className="flex items-center mb-4">
              <div className="mr-3 text-white">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold">{card.title}</h3>
            </div>
            <p className="text-sm opacity-90">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SplashCards;