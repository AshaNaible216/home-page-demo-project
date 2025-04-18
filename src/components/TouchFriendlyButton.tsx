import React from 'react';
import { useViewport } from '../hooks';

interface TouchFriendlyButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  ariaLabel?: string;
}

const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ariaLabel
}) => {
  const { isMobile } = useViewport();
  
  // Base classes for all buttons
  let baseClasses = 'rounded-lg transition-all duration-300 flex items-center justify-center';
  
  // Size classes - larger on touch devices
  const sizeClasses = {
    small: isMobile ? 'py-2.5 px-3.5 text-sm' : 'py-2 px-3 text-sm',
    medium: isMobile ? 'py-3.5 px-5 text-base' : 'py-3 px-4 text-base',
    large: isMobile ? 'py-4.5 px-6.5 text-lg' : 'py-4 px-6 text-lg'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    text: 'text-primary-600 hover:bg-primary-50 active:bg-primary-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-primary-400 dark:hover:bg-gray-800'
  };
  
  // Disabled classes
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  // Full width class
  const fullWidthClass = fullWidth ? 'w-full' : '';
  
  // Touch-specific optimizations
  const touchClasses = isMobile ? 'touch-manipulation' : '';
  
  // Combine all classes
  const combinedClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${disabled ? disabledClasses : ''} 
    ${fullWidthClass} 
    ${touchClasses} 
    ${className}
  `;
  
  return (
    <button
      onClick={onClick}
      className={combinedClasses}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default TouchFriendlyButton;
