import React, { useEffect } from 'react';
import { motion, useAnimation, useScroll, useTransform } from 'framer-motion';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'zoom' | 'parallax' | 'reveal';
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  animation = 'fade',
  direction = 'up',
  threshold = 0.1,
  duration = 0.6,
  delay = 0,
  className = ''
}) => {
  const controls = useAnimation();
  const ref = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls, threshold]);
  
  // Define animation variants based on animation type and direction
  const getVariants = () => {
    switch (animation) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { duration, delay, ease: 'easeOut' }
          }
        };
      
      case 'slide':
        const slideOffset = 50;
        const slideDirection = {
          up: { y: slideOffset },
          down: { y: -slideOffset },
          left: { x: slideOffset },
          right: { x: -slideOffset }
        };
        
        return {
          hidden: { 
            opacity: 0,
            ...slideDirection[direction]
          },
          visible: { 
            opacity: 1,
            x: 0,
            y: 0,
            transition: { duration, delay, ease: 'easeOut' }
          }
        };
      
      case 'zoom':
        return {
          hidden: { 
            opacity: 0,
            scale: direction === 'up' ? 0.8 : 1.2
          },
          visible: { 
            opacity: 1,
            scale: 1,
            transition: { duration, delay, ease: 'easeOut' }
          }
        };
      
      case 'reveal':
        const originMap = {
          up: 'bottom',
          down: 'top',
          left: 'right',
          right: 'left'
        };
        
        return {
          hidden: { clipPath: `inset(0 0 0 0)` },
          visible: { 
            clipPath: `inset(0 0 0 0)`,
            transition: { duration, delay, ease: 'easeOut' }
          }
        };
      
      case 'parallax':
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 }
        };
      
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };
  
  // Special case for parallax animation which uses scroll position
  if (animation === 'parallax') {
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ['start end', 'end start']
    });
    
    const parallaxFactor = direction === 'up' || direction === 'left' ? -100 : 100;
    
    const y = useTransform(
      scrollYProgress,
      [0, 1],
      direction === 'up' || direction === 'down' ? [parallaxFactor, 0] : [0, 0]
    );
    
    const x = useTransform(
      scrollYProgress,
      [0, 1],
      direction === 'left' || direction === 'right' ? [parallaxFactor, 0] : [0, 0]
    );
    
    return (
      <motion.div
        ref={ref}
        className={`scroll-animation parallax ${className}`}
        style={{ x, y }}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      ref={ref}
      className={`scroll-animation ${animation} ${className}`}
      initial="hidden"
      animate={controls}
      variants={getVariants()}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
