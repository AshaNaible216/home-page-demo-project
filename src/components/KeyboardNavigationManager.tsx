import React from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface KeyboardNavigationManagerProps {
  children: React.ReactNode;
}

const KeyboardNavigationManager: React.FC<KeyboardNavigationManagerProps> = ({ children }) => {
  const { keyboardFocusVisible } = useAccessibility();
  
  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Tab key for focus management
      if (e.key === 'Tab') {
        // Already handled by AccessibilityProvider
      }
      
      // Handle arrow keys for custom navigation in certain components
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Find all focusable elements
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        // Get the currently focused element
        const focusedElement = document.activeElement;
        
        // Find the index of the focused element
        const focusedIndex = Array.from(focusableElements).indexOf(focusedElement as Element);
        
        // Handle arrow navigation based on the key pressed
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          // Move focus to the next element
          const nextIndex = (focusedIndex + 1) % focusableElements.length;
          (focusableElements[nextIndex] as HTMLElement).focus();
          e.preventDefault();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          // Move focus to the previous element
          const prevIndex = (focusedIndex - 1 + focusableElements.length) % focusableElements.length;
          (focusableElements[prevIndex] as HTMLElement).focus();
          e.preventDefault();
        }
      }
      
      // Handle Enter key for activating focused elements
      if (e.key === 'Enter') {
        const focusedElement = document.activeElement;
        
        // If the focused element is not a button, input, or anchor, simulate a click
        if (
          focusedElement &&
          !['BUTTON', 'INPUT', 'A', 'TEXTAREA', 'SELECT'].includes(focusedElement.tagName)
        ) {
          if (focusedElement.getAttribute('role') === 'button' || 
              focusedElement.getAttribute('tabindex') === '0') {
            (focusedElement as HTMLElement).click();
            e.preventDefault();
          }
        }
      }
    };
    
    // Add event listener for keyboard navigation
    window.addEventListener('keydown', handleKeyDown);
    
    // Add a class to the body for keyboard focus styles
    if (keyboardFocusVisible) {
      document.body.classList.add('keyboard-focus-visible');
    } else {
      document.body.classList.remove('keyboard-focus-visible');
    }
    
    // Clean up event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyboardFocusVisible]);
  
  return <>{children}</>;
};

export default KeyboardNavigationManager;
