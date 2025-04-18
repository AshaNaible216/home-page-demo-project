import React from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface AccessibleInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  ariaDescribedby?: string;
  helpText?: string;
  errorText?: string;
  maxLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
}

const AccessibleInput: React.FC<AccessibleInputProps> = ({
  id,
  value,
  onChange,
  label,
  placeholder = '',
  type = 'text',
  className = '',
  disabled = false,
  required = false,
  ariaDescribedby,
  helpText,
  errorText,
  maxLength,
  autoComplete,
  autoFocus = false
}) => {
  const { largeText } = useAccessibility();
  
  // Generate unique IDs for help and error text
  const helpTextId = helpText ? `${id}-help` : undefined;
  const errorTextId = errorText ? `${id}-error` : undefined;
  
  // Combine aria-describedby values
  const describedBy = [
    ariaDescribedby,
    helpTextId,
    errorTextId
  ].filter(Boolean).join(' ') || undefined;
  
  // Apply large text if needed
  const textSizeClass = largeText ? 'text-lg' : 'text-base';
  
  // Base classes for the input
  const baseClasses = 'w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';
  
  // Error state classes
  const errorClasses = errorText ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : '';
  
  return (
    <div className="w-full">
      <label 
        htmlFor={id} 
        className={`block font-medium text-gray-700 dark:text-gray-200 mb-1 ${textSizeClass}`}
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${baseClasses} ${errorClasses} ${textSizeClass} ${className}`}
        disabled={disabled}
        required={required}
        aria-describedby={describedBy}
        aria-invalid={!!errorText}
        maxLength={maxLength}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />
      
      {helpText && (
        <p 
          id={helpTextId} 
          className={`mt-1 text-gray-500 dark:text-gray-400 ${largeText ? 'text-base' : 'text-sm'}`}
        >
          {helpText}
        </p>
      )}
      
      {errorText && (
        <p 
          id={errorTextId} 
          className={`mt-1 text-red-600 dark:text-red-400 ${largeText ? 'text-base' : 'text-sm'}`}
          role="alert"
        >
          {errorText}
        </p>
      )}
    </div>
  );
};

export default AccessibleInput;
