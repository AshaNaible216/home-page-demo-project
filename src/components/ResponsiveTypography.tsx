import React from 'react';
import { useViewport } from '../hooks';

interface ResponsiveTypographyProps {
  children: React.ReactNode;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'button';
  className?: string;
}

const ResponsiveTypography: React.FC<ResponsiveTypographyProps> = ({
  children,
  variant,
  className = ''
}) => {
  const { isMobile } = useViewport();
  
  // Define base classes for each variant
  const variantClasses = {
    h1: 'font-bold tracking-tight',
    h2: 'font-semibold tracking-tight',
    h3: 'font-medium',
    h4: 'font-medium',
    h5: 'font-medium',
    h6: 'font-medium',
    body: 'font-normal',
    caption: 'text-sm',
    button: 'font-medium'
  };
  
  // Define responsive size classes
  const sizeClasses = {
    h1: isMobile ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-4xl md:text-5xl lg:text-6xl',
    h2: isMobile ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-3xl md:text-4xl lg:text-5xl',
    h3: isMobile ? 'text-xl md:text-2xl lg:text-3xl' : 'text-2xl md:text-3xl lg:text-4xl',
    h4: isMobile ? 'text-lg md:text-xl lg:text-2xl' : 'text-xl md:text-2xl lg:text-3xl',
    h5: isMobile ? 'text-base md:text-lg lg:text-xl' : 'text-lg md:text-xl lg:text-2xl',
    h6: isMobile ? 'text-sm md:text-base lg:text-lg' : 'text-base md:text-lg lg:text-xl',
    body: isMobile ? 'text-sm md:text-base' : 'text-base md:text-lg',
    caption: isMobile ? 'text-xs md:text-sm' : 'text-sm',
    button: isMobile ? 'text-sm md:text-base' : 'text-base'
  };
  
  // Define line height classes
  const lineHeightClasses = {
    h1: 'leading-tight',
    h2: 'leading-tight',
    h3: 'leading-snug',
    h4: 'leading-snug',
    h5: 'leading-normal',
    h6: 'leading-normal',
    body: 'leading-relaxed',
    caption: 'leading-normal',
    button: 'leading-none'
  };
  
  // Combine all classes
  const combinedClasses = `${variantClasses[variant]} ${sizeClasses[variant]} ${lineHeightClasses[variant]} ${className}`;
  
  // Render appropriate HTML element based on variant
  switch (variant) {
    case 'h1':
      return <h1 className={combinedClasses}>{children}</h1>;
    case 'h2':
      return <h2 className={combinedClasses}>{children}</h2>;
    case 'h3':
      return <h3 className={combinedClasses}>{children}</h3>;
    case 'h4':
      return <h4 className={combinedClasses}>{children}</h4>;
    case 'h5':
      return <h5 className={combinedClasses}>{children}</h5>;
    case 'h6':
      return <h6 className={combinedClasses}>{children}</h6>;
    case 'body':
      return <p className={combinedClasses}>{children}</p>;
    case 'caption':
      return <span className={combinedClasses}>{children}</span>;
    case 'button':
      return <span className={combinedClasses}>{children}</span>;
    default:
      return <p className={combinedClasses}>{children}</p>;
  }
};

export default ResponsiveTypography;
