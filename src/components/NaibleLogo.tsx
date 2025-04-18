import React from 'react';
import Image from 'next/image';

interface NaibleLogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'monochrome' | 'white';
  className?: string;
}

const NaibleLogo: React.FC<NaibleLogoProps> = ({
  size = 'medium',
  variant = 'default',
  className = '',
}) => {
  // Define sizes in pixels
  const sizes = {
    small: 32,
    medium: 48,
    large: 64,
  };

  // Simple mapping of variants to logo files - using the same logo file for all sizes
  const logoFiles = {
    default: '/logos/naible.png',
    monochrome: '/logos/naible.png',
    white: '/logos/White_Naible_Logo.png',
  };

  const logoSize = sizes[size];
  const logoSrc = logoFiles[variant];

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: logoSize, height: logoSize }}
    >
      <Image 
        src={logoSrc}
        alt="Naible Logo"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  );
};

export default NaibleLogo;
