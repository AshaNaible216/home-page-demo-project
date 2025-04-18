import React from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface SkipToContentProps {
  mainContentId: string;
  className?: string;
}

const SkipToContent: React.FC<SkipToContentProps> = ({
  mainContentId,
  className = ''
}) => {
  const { largeText } = useAccessibility();
  
  // Apply large text if needed
  const textSizeClass = largeText ? 'text-lg' : 'text-base';
  
  return (
    <a
      href={`#${mainContentId}`}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        focus:z-50 focus:p-4 focus:bg-white focus:dark:bg-gray-800 
        focus:shadow-lg focus:rounded-md focus:outline-none focus:ring-2 
        focus:ring-indigo-500 ${textSizeClass} ${className}
      `}
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
