import React from 'react';
import { useViewport } from '../hooks';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  mobileLayout?: 'stack' | 'grid' | 'compact';
  tabletLayout?: 'split' | 'grid' | 'standard';
  desktopLayout?: 'wide' | 'centered' | 'sidebar';
  className?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  mobileLayout = 'stack',
  tabletLayout = 'standard',
  desktopLayout = 'centered',
  className = ''
}) => {
  const { width, isMobile } = useViewport();
  
  // Determine layout based on viewport width
  let layoutClass = '';
  
  if (width < 640) {
    // Mobile layout
    layoutClass = `mobile-${mobileLayout}`;
  } else if (width < 1024) {
    // Tablet layout
    layoutClass = `tablet-${tabletLayout}`;
  } else {
    // Desktop layout
    layoutClass = `desktop-${desktopLayout}`;
  }
  
  // Apply appropriate max-width based on layout
  let maxWidthClass = '';
  if (desktopLayout === 'centered' && width >= 1024) {
    maxWidthClass = 'max-w-4xl mx-auto';
  } else if (desktopLayout === 'wide' && width >= 1024) {
    maxWidthClass = 'max-w-7xl mx-auto';
  }
  
  // Apply padding based on device size
  const paddingClass = isMobile ? 'px-4 py-6' : 'px-6 py-8';
  
  return (
    <div className={`responsive-layout ${layoutClass} ${maxWidthClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

export default ResponsiveLayout;
