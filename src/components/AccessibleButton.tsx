import React from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface AccessibleButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  role?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaDescribedby?: string;
  tabIndex?: number;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  onClick,
  children,
  ariaLabel,
  className = '',
  disabled = false,
  type = 'button',
  role,
  ariaPressed,
  ariaExpanded,
  ariaControls,
  ariaDescribedby,
  tabIndex = 0
}) => {
  const { reducedMotion } = useAccessibility();
  
  // Base classes for the button
  const baseClasses = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all';
  
  // Apply reduced motion if needed
  const motionClasses = reducedMotion 
    ? 'transition-none' 
    : 'transition-all duration-200';
  
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${baseClasses} ${motionClasses} ${className}`}
      disabled={disabled}
      type={type}
      role={role}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-describedby={ariaDescribedby}
      tabIndex={tabIndex}
    >
      {children}
    </button>
  );
};

export default AccessibleButton;
