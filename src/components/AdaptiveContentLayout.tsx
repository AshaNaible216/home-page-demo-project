import React from 'react';
import { useViewport } from '../hooks';

interface AdaptiveContentLayoutProps {
  children: React.ReactNode;
  mobileContent?: React.ReactNode;
  tabletContent?: React.ReactNode;
  desktopContent?: React.ReactNode;
  className?: string;
}

const AdaptiveContentLayout: React.FC<AdaptiveContentLayoutProps> = ({
  children,
  mobileContent,
  tabletContent,
  desktopContent,
  className = ''
}) => {
  const { width } = useViewport();
  
  // Determine which content to render based on viewport width
  const renderContent = () => {
    if (width < 640 && mobileContent) {
      return mobileContent;
    } else if (width < 1024 && tabletContent) {
      return tabletContent;
    } else if (width >= 1024 && desktopContent) {
      return desktopContent;
    } else {
      return children;
    }
  };
  
  return (
    <div className={`adaptive-content ${className}`}>
      {renderContent()}
    </div>
  );
};

export default AdaptiveContentLayout;
