import React from 'react';
import { useViewport } from '../hooks';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  mobileSrc?: string;
  tabletSrc?: string;
  desktopSrc?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  mobileSrc,
  tabletSrc,
  desktopSrc,
  className = '',
  width,
  height,
  priority = false,
  loading = 'lazy'
}) => {
  const { width: viewportWidth } = useViewport();
  
  // Determine which image source to use based on viewport width
  let imageSrc = src;
  
  if (viewportWidth < 640 && mobileSrc) {
    imageSrc = mobileSrc;
  } else if (viewportWidth < 1024 && tabletSrc) {
    imageSrc = tabletSrc;
  } else if (desktopSrc) {
    imageSrc = desktopSrc;
  }
  
  // Create srcSet for responsive images
  const createSrcSet = () => {
    const sources = [];
    
    if (mobileSrc) {
      sources.push(`${mobileSrc} 640w`);
    }
    
    if (tabletSrc) {
      sources.push(`${tabletSrc} 1024w`);
    }
    
    if (desktopSrc) {
      sources.push(`${desktopSrc} 1920w`);
    }
    
    return sources.join(', ');
  };
  
  const srcSet = mobileSrc || tabletSrc || desktopSrc ? createSrcSet() : undefined;
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      srcSet={srcSet}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={`responsive-image ${className}`}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
    />
  );
};

export default ResponsiveImage;
