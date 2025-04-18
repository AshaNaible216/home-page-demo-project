import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './Footer';
import AppShowcase from './AppShowcase';
import NaibleLogo from './NaibleLogo';
import { NAIBLE_GREEN, NAIBLE_LIGHT_GREEN, NAIBLE_DARK_GREEN } from '../utils/brandConstants';

interface UserPreferencesType {
  color?: string;
  values?: string;
  goal?: string;
  theme?: 'light' | 'dark' | 'system';
}

interface PersonalizedHeroProps {
  headline: string;
  subheading: string;
  ctaText: string;
  welcomeMessage: string;
  userPreferences: UserPreferencesType;
  onViewDataPrivacy: () => void;
}

const PersonalizedHero: React.FC<PersonalizedHeroProps> = ({
  headline,
  subheading,
  ctaText,
  welcomeMessage,
  userPreferences,
  onViewDataPrivacy
}) => {
  // Get primary color from user preferences or use Naible green as default
  const primaryColor = userPreferences.color || NAIBLE_GREEN;
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showFeatureSection, setShowFeatureSection] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [showCallout, setShowCallout] = useState(false);
  // Define proper types for the content state
  interface ContentStateType {
    features: any[];
    testimonials: any[];
    bulletPoints: string[];
    randomVariationIndex?: number;
    randomTestimonialIndex?: number;
  }
  
  const [contentState, setContentState] = useState<ContentStateType>({
    features: [],
    testimonials: [],
    bulletPoints: [],
    randomVariationIndex: undefined,
    randomTestimonialIndex: undefined
  });
  
  // Control entry animation sequencing
  useEffect(() => {
    const animationSequence = [
      { setter: setHasAnimated, delay: 1500 },
      { setter: setShowFeatureSection, delay: 2500 },
      { setter: setShowTestimonials, delay: 3500 },
      { setter: setShowCallout, delay: 4500 }
    ];
    
    animationSequence.forEach(({ setter, delay }) => {
      const timer = setTimeout(() => setter(true), delay);
      return () => clearTimeout(timer);
    });
  }, []);
  
  // Extract values into an array to use for testimonials/features
  const valueArray = userPreferences.values 
    ? userPreferences.values.split(',').map(value => value.trim()) 
    : ['Privacy', 'Security', 'Innovation'];
  
  const goalText = userPreferences.goal || 'exploring AI capabilities';
  
  // Create a lighter version of the primary color for backgrounds
  const getLighterColor = (hex: string, opacity: number = 0.1) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10
      }
    }
  };
  
  // Create floating particles effect
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, color: string, duration: number}>>([]);
  
  useEffect(() => {
    const createParticles = () => {
      const particleCount = 30;
      const newParticles = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // %
          y: Math.random() * 100, // %
          size: Math.random() * 15 + 5, // px
          color: i % 5 === 0 ? NAIBLE_GREEN :
                 i % 5 === 1 ? primaryColor :
                 i % 5 === 2 ? getLighterColor(primaryColor, 0.7) :
                 i % 5 === 3 ? '#ffffff' : '#e2e8f0',
          duration: Math.random() * 15 + 10 // seconds
        });
      }
      
      setParticles(newParticles);
    };
    
    createParticles();
  }, [primaryColor]);

  // Define features based on user goals and values
  // Define multiple variations of features
  const featureVariations = [
    // Variation 1
    [
      {
        title: "Personal Intelligence",
        description: `Your AI companion evolves with you, learning your preferences and adapting to your ${goalText}.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      },
      {
        title: "100% Data Ownership",
        description: `Complete control of your information with data ownership that respects your ${valueArray[0] || 'privacy'}.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )
      },
      {
        title: "Seamless Integration",
        description: `Easily integrate with your existing workflow for ${goalText} with minimal disruption.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        )
      }
    ],
    // Variation 2
    [
      {
        title: "Neural Adaptation",
        description: `Advanced AI that continuously learns from your interactions to enhance your ${goalText} experience.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      },
      {
        title: "Privacy Fortress",
        description: `Military-grade protection for your data that aligns with your ${valueArray[0] || 'privacy'} requirements.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      },
      {
        title: "Cognitive Harmony",
        description: `Intelligent systems that synchronize with your thought patterns for enhanced ${goalText}.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      }
    ],
    // Variation 3
    [
      {
        title: "Adaptive Intelligence",
        description: `Smart systems that evolve with your needs, creating a personalized approach to ${goalText}.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        )
      },
      {
        title: "Sovereign Data Control",
        description: `You maintain complete authority over your information, honoring your commitment to ${valueArray[0] || 'privacy'}.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        )
      },
      {
        title: "Frictionless Experience",
        description: `Technology that blends seamlessly into your life, enhancing ${goalText} without complexity.`,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        )
      }
    ]
  ];
  
  // Select variation but preserve it in state
  useEffect(() => {
    if (contentState.features.length === 0) {
      const randomIndex = Math.floor(Math.random() * featureVariations.length);
      const bulletPointSets = [
        [
          "Learns your preferences over time",
          "Complete data privacy & control",
          "Personalized recommendations",
          "Adapts to your unique style"
        ],
        [
          "Evolves with your feedback",
          "Respects your data boundaries",
          "Anticipates your needs",
          "Matches your communication style"
        ],
        [
          "Understands your context",
          "Secures your information",
          "Optimizes for your goals",
          "Reflects your priorities"
        ]
      ];
      
      setContentState(prev => ({
        ...prev,
        features: featureVariations[randomIndex],
        bulletPoints: bulletPointSets[randomIndex] || bulletPointSets[0],
        randomVariationIndex: randomIndex
      }));
    }
  }, []);
  
  // Use the preserved features from state
  const features = contentState.features.length > 0 ? contentState.features : featureVariations[0];
  const randomVariationIndex = contentState.randomVariationIndex !== undefined ? contentState.randomVariationIndex : 0;

  // Define multiple variations of testimonials
  const testimonialVariations = [
    // Variation 1
    [
      {
        text: `"Naible helped me achieve ${goalText} while maintaining complete control of my data. The personalized experience is unlike anything I've used before."`,
        author: "Sarah K.",
        role: "Tech Entrepreneur"
      },
      {
        text: `"As someone who values ${valueArray[0] || 'privacy'}, I was impressed by how Naible respects my data while delivering incredible AI capabilities."`,
        author: "Michael T.",
        role: "Data Scientist"
      },
      {
        text: `"The personalized intelligence adapts to my needs for ${goalText}. It's like having a digital twin that understands me."`,
        author: "Elena R.",
        role: "Product Manager"
      }
    ],
    // Variation 2
    [
      {
        text: `"Since implementing Naible for ${goalText}, my productivity has increased by 40%. The AI truly understands how I work and thinks like I do."`,
        author: "James L.",
        role: "Creative Director"
      },
      {
        text: `"I never thought an AI could align so perfectly with my ${valueArray[0] || 'privacy'} concerns. Naible has changed my perspective on what's possible."`,
        author: "Priya S.",
        role: "Privacy Advocate"
      },
      {
        text: `"The personalization is uncanny. Within days, Naible was anticipating my needs for ${goalText} before I even expressed them."`,
        author: "Marcus J.",
        role: "Software Engineer"
      }
    ],
    // Variation 3
    [
      {
        text: `"Naible's approach to ${goalText} is revolutionary. It's not just an AI - it's an extension of my thought process that enhances everything I do."`,
        author: "Olivia C.",
        role: "Research Scientist"
      },
      {
        text: `"As a ${valueArray[0] || 'privacy'} enthusiast, I was skeptical about AI. Naible changed my mind by putting me in complete control of my data."`,
        author: "David W.",
        role: "Cybersecurity Expert"
      },
      {
        text: `"The difference with Naible is how it adapts to you, not the other way around. It's transformed how I approach ${goalText}."`,
        author: "Sophia R.",
        role: "Digital Strategist"
      }
    ]
  ];
  
  // Select testimonial variation but preserve it in state
  useEffect(() => {
    if (contentState.testimonials.length === 0) {
      const randomIndex = Math.floor(Math.random() * testimonialVariations.length);
      setContentState(prev => ({
        ...prev,
        testimonials: testimonialVariations[randomIndex],
        randomTestimonialIndex: randomIndex
      }));
    }
  }, []);
  
  // Use the preserved testimonials from state
  const testimonials = contentState.testimonials.length > 0 ? contentState.testimonials : testimonialVariations[0];
  const randomTestimonialIndex = contentState.randomTestimonialIndex !== undefined ? contentState.randomTestimonialIndex : 0;

  return (
    <div className="w-full relative overflow-hidden">
      {/* Ambient particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full z-0 opacity-30 pointer-events-none"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            filter: 'blur(2px)'
          }}
          animate={{
            x: [
              `${Math.random() * 100 - 50}px`,
              `${Math.random() * 100 - 50}px`,
              `${Math.random() * 100 - 50}px`
            ],
            y: [
              `${Math.random() * 100 - 50}px`,
              `${Math.random() * 100 - 50}px`,
              `${Math.random() * 100 - 50}px`
            ],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
      
      {/* Main hero section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome message with epic entrance */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              transition: { type: "spring", stiffness: 50, damping: 10 } 
            }}
            className="glassmorphism p-6 rounded-2xl mb-12 text-center relative overflow-hidden"
          >
            <motion.div 
              className="absolute inset-0 -z-10" 
              style={{ backgroundColor: getLighterColor(primaryColor, 0.1) }}
              animate={{
                backgroundImage: [
                  `radial-gradient(circle at 30% 50%, ${getLighterColor(primaryColor, 0.3)} 0%, transparent 60%)`,
                  `radial-gradient(circle at 70% 50%, ${getLighterColor(primaryColor, 0.3)} 0%, transparent 60%)`,
                  `radial-gradient(circle at 30% 50%, ${getLighterColor(primaryColor, 0.3)} 0%, transparent 60%)`
                ]
              }}
              transition={{ duration: 15, repeat: Infinity }}
            />
            
            {/* Animated shimmer effect */}
            <motion.div 
              className="absolute inset-0 -z-5 magic-shine"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <p className="text-xl font-medium relative z-10">{welcomeMessage}</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Hero content with staggered animation */}
            <motion.div
              className="space-y-6 z-10"
              variants={itemVariants}
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight glow-text"
                style={{ color: primaryColor }}
                animate={{ 
                  textShadow: [
                    `0 0 3px ${getLighterColor(primaryColor, 0.2)}`,
                    `0 0 8px ${getLighterColor(primaryColor, 0.3)}`,
                    `0 0 3px ${getLighterColor(primaryColor, 0.2)}`
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
              >
                {headline}
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300"
                variants={itemVariants}
              >
                {subheading}
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg text-white font-medium relative overflow-hidden"
                  style={{ backgroundColor: primaryColor }}
                  animate={{
                    boxShadow: hasAnimated ? [
                      `0 4px 10px ${getLighterColor(primaryColor, 0.2)}`,
                      `0 4px 15px ${getLighterColor(primaryColor, 0.4)}`,
                      `0 4px 10px ${getLighterColor(primaryColor, 0.2)}`
                    ] : `0 4px 10px ${getLighterColor(primaryColor, 0.2)}`
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                >
                  {/* Animated shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    style={{ opacity: 0.3 }}
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatDelay: 3, 
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  />
                  {ctaText}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-lg border-2 font-medium"
                  style={{ 
                    borderColor: primaryColor, 
                    color: primaryColor,
                    backgroundColor: getLighterColor(primaryColor, 0.05)
                  }}
                  onClick={onViewDataPrivacy}
                >
                  View Your Data
                </motion.button>
              </motion.div>
              
              <motion.div 
                className="pt-4"
                variants={itemVariants}
              >
                <h3 className="text-lg font-medium mb-2">Key Benefits:</h3>
                <ul className="space-y-3">
                  {[
                    "Your Data, Your Rules",
                    "Continuously Evolving",
                    "Deep Customization",
                    "Built on Trust & Privacy"
                  ].map((benefit, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 + (index * 0.2), duration: 0.6 }}
                    >
                      <motion.div 
                        className="mr-2 flex-shrink-0 mt-1"
                        animate={{ rotateZ: [0, 10, 0, -10, 0] }}
                        transition={{ 
                          delay: 2 + (index * 0.3),
                          duration: 1,
                          repeat: 1
                        }}
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6 flex-shrink-0" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          style={{ color: primaryColor }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
            
            {/* Hero visual with epic animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotateY: 0,
                transition: {
                  type: "spring",
                  damping: 20,
                  stiffness: 90,
                  delay: 0.8
                }
              }}
              className="relative"
            >
              {/* Background glow */}
              <motion.div 
                className="absolute inset-0 rounded-2xl opacity-20"
                style={{ backgroundColor: primaryColor }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              {/* Main visual container */}
              <div className="glassmorphism rounded-2xl p-8 relative z-10 aspect-square flex items-center justify-center overflow-hidden">
                {/* Animated background radial gradient */}
                <motion.div 
                  className="absolute inset-0"
                  animate={{
                    background: [
                      `radial-gradient(circle at 25% 25%, ${getLighterColor(primaryColor, 0.2)} 0%, transparent 50%)`,
                      `radial-gradient(circle at 75% 75%, ${getLighterColor(primaryColor, 0.2)} 0%, transparent 50%)`,
                      `radial-gradient(circle at 25% 75%, ${getLighterColor(primaryColor, 0.2)} 0%, transparent 50%)`,
                      `radial-gradient(circle at 75% 25%, ${getLighterColor(primaryColor, 0.2)} 0%, transparent 50%)`,
                      `radial-gradient(circle at 25% 25%, ${getLighterColor(primaryColor, 0.2)} 0%, transparent 50%)`
                    ]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Content */}
                <div className="text-center relative z-10">
                  {/* Logo circle with pulsing effect */}
                  <motion.div
                    className="w-40 h-40 mx-auto rounded-full mb-6 flex items-center justify-center relative overflow-hidden"
                    style={{
                      backgroundColor: getLighterColor(NAIBLE_GREEN, 0.2),
                      boxShadow: `0 0 20px ${getLighterColor(NAIBLE_GREEN, 0.2)}`
                    }}
                    animate={{
                      boxShadow: [
                        `0 0 15px ${getLighterColor(NAIBLE_GREEN, 0.2)}`,
                        `0 0 25px ${getLighterColor(NAIBLE_GREEN, 0.4)}`,
                        `0 0 15px ${getLighterColor(NAIBLE_GREEN, 0.2)}`
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
                  >
                    {/* Animated rings */}
                    <motion.div
                      className="absolute inset-0 border-2 rounded-full"
                      style={{ borderColor: getLighterColor(NAIBLE_GREEN, 0.5) }}
                      animate={{ scale: [0.6, 1, 0.6], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      className="absolute inset-0 border-2 rounded-full"
                      style={{ borderColor: getLighterColor(NAIBLE_GREEN, 0.3) }}
                      animate={{ scale: [1, 0.7, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Naible Logo */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                      }}
                      className="relative z-10"
                    >
                      <NaibleLogo size="large" variant="default" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Titles with reveal animation */}
                  <motion.h3 
                    className="text-2xl font-bold mb-2"
                    style={{ color: primaryColor }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    Personal Intelligence
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 dark:text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                  >
                    Your AI twin that evolves with you
                  </motion.p>
                  
                  {/* Animated feature list */}
                  <motion.ul
                    className="mt-6 text-left space-y-2 max-w-xs mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                  >
                    {contentState.bulletPoints.length > 0
                      ? contentState.bulletPoints.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.8 + (index * 0.15), duration: 0.5 }}
                      >
                        <motion.div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: NAIBLE_GREEN }}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ 
                            delay: 2 + (index * 0.15),
                            duration: 0.5,
                            repeat: 1
                          }}
                        />
                        {feature}
                      </motion.li>
                    ))
                    : [
                        "Learns your preferences over time",
                        "Complete data privacy & control",
                        "Personalized recommendations",
                        "Adapts to your unique style"
                      ].map((feature, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center text-sm"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.8 + (index * 0.15), duration: 0.5 }}
                        >
                          <motion.div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: NAIBLE_GREEN }}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{
                              delay: 2 + (index * 0.15),
                              duration: 0.5,
                              repeat: 1
                            }}
                          />
                          {feature}
                        </motion.li>
                      ))
                    }
                  </motion.ul>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-6 -right-6 w-12 h-12 rounded-xl"
                style={{ 
                  background: `linear-gradient(135deg, ${NAIBLE_GREEN}, ${getLighterColor(primaryColor, 0.7)})`,
                  opacity: 0.7
                }}
                animate={{ 
                  y: [0, -20, 0], 
                  rotate: [0, 10, 0], 
                  opacity: [0.7, 0.9, 0.7] 
                }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
              />
              
              <motion.div 
                className="absolute -bottom-4 -left-4 w-10 h-10 rounded-full"
                style={{ 
                  background: `linear-gradient(135deg, ${getLighterColor(primaryColor, 0.7)}, ${NAIBLE_GREEN})`,
                  opacity: 0.6
                }}
                animate={{ 
                  y: [0, 15, 0], 
                  x: [0, 10, 0], 
                  opacity: [0.6, 0.8, 0.6] 
                }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", delay: 1 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Feature section */}
      <AnimatePresence>
        {showFeatureSection && (
          <motion.section 
            className="py-16 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-center mb-16"
              >
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ color: NAIBLE_GREEN }}
                >
                  Personalized for Your Unique Journey
                </motion.h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Based on your preferences, we've crafted an AI experience that's perfectly aligned with your needs.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="glassmorphism p-6 rounded-xl relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (index * 0.2), duration: 0.8 }}
                  >
                    {/* Background gradient */}
                    <motion.div 
                      className="absolute inset-0 -z-10" 
                      style={{ backgroundColor: getLighterColor(primaryColor, 0.05) }}
                      animate={{
                        background: [
                          `radial-gradient(circle at ${30 + index * 20}% ${40 + index * 10}%, ${getLighterColor(primaryColor, 0.2)} 0%, transparent 70%)`,
                          `radial-gradient(circle at ${60 - index * 15}% ${70 - index * 10}%, ${getLighterColor(primaryColor, 0.2)} 0%, transparent 70%)`,
                          `radial-gradient(circle at ${30 + index * 20}% ${40 + index * 10}%, ${getLighterColor(primaryColor, 0.2)} 0%, transparent 70%)`
                        ]
                      }}
                      transition={{ duration: 15, repeat: Infinity, delay: index * 2 }}
                    />
                    
                    <motion.div 
                      className="bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                      style={{ color: primaryColor }}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
      {/* Testimonials section */}
      <AnimatePresence>
        {showTestimonials && (
          <motion.section 
            className="py-16 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                style={{ color: primaryColor }}
              >
                What Others Are Saying
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="glassmorphism p-6 rounded-xl relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.4 + (index * 0.2), duration: 0.8 }}
                  >
                    {/* Quote mark */}
                    <div className="absolute top-6 left-6 text-6xl opacity-10" style={{ color: primaryColor }}>
                      "
                    </div>
                    
                    <div className="pt-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">{testimonial.text}</p>
                      
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: getLighterColor(primaryColor, 0.3) }}
                        >
                          <span className="font-bold text-lg" style={{ color: primaryColor }}>
                            {testimonial.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
      {/* Call to action section */}
      <AnimatePresence>
        {showCallout && (
          <motion.section 
            className="py-16 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="glassmorphism p-12 rounded-2xl relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {/* Background effect */}
                <motion.div 
                  className="absolute inset-0 -z-10" 
                  style={{ backgroundColor: getLighterColor(primaryColor, 0.15) }}
                  animate={{
                    background: [
                      `linear-gradient(120deg, ${getLighterColor(primaryColor, 0.3)} 0%, transparent 70%)`,
                      `linear-gradient(200deg, ${getLighterColor(primaryColor, 0.3)} 0%, transparent 70%)`,
                      `linear-gradient(120deg, ${getLighterColor(primaryColor, 0.3)} 0%, transparent 70%)`
                    ]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
                
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-8 md:mb-0 md:mr-8">
                    <motion.h2 
                      className="text-3xl font-bold mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      Ready to Begin Your Journey?
                    </motion.h2>
                    <motion.p 
                      className="text-lg text-gray-600 dark:text-gray-300 max-w-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    >
                      Join the thousands of users who have transformed their AI experience with Naible's personal intelligence platform.
                    </motion.p>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 rounded-lg text-white font-medium text-lg relative overflow-hidden"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {/* Animated shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                        style={{ opacity: 0.3 }}
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ 
                          repeat: Infinity, 
                          repeatDelay: 3, 
                          duration: 1.5,
                          ease: "easeInOut"
                        }}
                      />
                      {ctaText}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      
      {/* App Showcase Section */}
      <AnimatePresence>
        {showFeatureSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <AppShowcase primaryColor={primaryColor} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <AnimatePresence>
        {showCallout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalizedHero;