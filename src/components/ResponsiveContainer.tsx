import React from 'react';
import { useViewport } from '../hooks';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  const { width, height, isMobile } = useViewport();
  
  // Add orientation-specific classes
  const isLandscape = width > height;
  const orientationClass = isLandscape 
    ? height < 500 ? 'landscape-optimize' : 'landscape'
    : 'portrait';
  
  // Add touch-specific classes
  const touchClass = 'ontouchstart' in window ? 'touch-device' : 'no-touch';
  
  return (
    <div className={`responsive-container ${orientationClass} ${touchClass} ${isMobile ? 'mobile' : 'desktop'} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
