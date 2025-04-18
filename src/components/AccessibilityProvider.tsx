import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardFocusVisible: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReaderMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReaderMode: false,
  keyboardFocusVisible: false,
  toggleHighContrast: () => {},
  toggleLargeText: () => {},
  toggleReducedMotion: () => {},
  toggleScreenReaderMode: () => {},
});

export const useAccessibility = () => useContext(AccessibilityContext);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // Initialize state from localStorage if available
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('naible_a11y_high_contrast') === 'true';
    }
    return false;
  });
  
  const [largeText, setLargeText] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('naible_a11y_large_text') === 'true';
    }
    return false;
  });
  
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // Check both localStorage and prefers-reduced-motion media query
      const fromStorage = localStorage.getItem('naible_a11y_reduced_motion') === 'true';
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return fromStorage || prefersReducedMotion;
    }
    return false;
  });
  
  const [screenReaderMode, setScreenReaderMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('naible_a11y_screen_reader') === 'true';
    }
    return false;
  });
  
  const [keyboardFocusVisible, setKeyboardFocusVisible] = useState<boolean>(false);
  
  // Toggle functions
  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const newValue = !prev;
      localStorage.setItem('naible_a11y_high_contrast', String(newValue));
      return newValue;
    });
  };
  
  const toggleLargeText = () => {
    setLargeText(prev => {
      const newValue = !prev;
      localStorage.setItem('naible_a11y_large_text', String(newValue));
      return newValue;
    });
  };
  
  const toggleReducedMotion = () => {
    setReducedMotion(prev => {
      const newValue = !prev;
      localStorage.setItem('naible_a11y_reduced_motion', String(newValue));
      return newValue;
    });
  };
  
  const toggleScreenReaderMode = () => {
    setScreenReaderMode(prev => {
      const newValue = !prev;
      localStorage.setItem('naible_a11y_screen_reader', String(newValue));
      return newValue;
    });
  };
  
  // Listen for keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setKeyboardFocusVisible(true);
      }
    };
    
    const handleMouseDown = () => {
      setKeyboardFocusVisible(false);
    };
    
    // Listen for prefers-reduced-motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setReducedMotion(true);
        localStorage.setItem('naible_a11y_reduced_motion', 'true');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    mediaQuery.addEventListener('change', handleReducedMotionChange);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);
  
  // Apply accessibility styles to document
  useEffect(() => {
    // High contrast mode
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Large text mode
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
    
    // Reduced motion mode
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    
    // Screen reader optimized mode
    if (screenReaderMode) {
      document.documentElement.classList.add('screen-reader-mode');
    } else {
      document.documentElement.classList.remove('screen-reader-mode');
    }
    
    // Keyboard focus visibility
    if (keyboardFocusVisible) {
      document.documentElement.classList.add('keyboard-focus-visible');
    } else {
      document.documentElement.classList.remove('keyboard-focus-visible');
    }
  }, [highContrast, largeText, reducedMotion, screenReaderMode, keyboardFocusVisible]);
  
  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        largeText,
        reducedMotion,
        screenReaderMode,
        keyboardFocusVisible,
        toggleHighContrast,
        toggleLargeText,
        toggleReducedMotion,
        toggleScreenReaderMode,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
