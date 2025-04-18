import React from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface AccessibilityMenuProps {
  className?: string;
}

const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ className = '' }) => {
  const {
    highContrast,
    largeText,
    reducedMotion,
    screenReaderMode,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleScreenReaderMode
  } = useAccessibility();

  return (
    <div 
      className={`accessibility-menu glassmorphism p-4 rounded-lg ${className}`}
      role="region"
      aria-label="Accessibility options"
    >
      <h2 className="text-xl font-semibold mb-4" id="a11y-menu-title">Accessibility Options</h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="high-contrast" className="flex items-center cursor-pointer">
            <span className="mr-2">High Contrast</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">(Improves text visibility)</span>
          </label>
          <button
            id="high-contrast"
            role="switch"
            aria-checked={highContrast}
            onClick={toggleHighContrast}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              highContrast ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className="sr-only">Enable high contrast mode</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="large-text" className="flex items-center cursor-pointer">
            <span className="mr-2">Large Text</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">(Increases font size)</span>
          </label>
          <button
            id="large-text"
            role="switch"
            aria-checked={largeText}
            onClick={toggleLargeText}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              largeText ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className="sr-only">Enable large text mode</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                largeText ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="reduced-motion" className="flex items-center cursor-pointer">
            <span className="mr-2">Reduced Motion</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">(Minimizes animations)</span>
          </label>
          <button
            id="reduced-motion"
            role="switch"
            aria-checked={reducedMotion}
            onClick={toggleReducedMotion}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              reducedMotion ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className="sr-only">Enable reduced motion mode</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                reducedMotion ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="screen-reader" className="flex items-center cursor-pointer">
            <span className="mr-2">Screen Reader Optimization</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">(Enhances screen reader experience)</span>
          </label>
          <button
            id="screen-reader"
            role="switch"
            aria-checked={screenReaderMode}
            onClick={toggleScreenReaderMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              screenReaderMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span className="sr-only">Enable screen reader optimization</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                screenReaderMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Keyboard navigation: Use <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Tab</kbd> to navigate, 
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Space</kbd> or 
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd> to toggle options
        </p>
      </div>
    </div>
  );
};

export default AccessibilityMenu;
