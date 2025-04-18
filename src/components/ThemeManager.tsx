import React, { useEffect } from 'react';
import { usePersonalization } from '../context/PersonalizationContext';

interface UserPreferencesType {
  color?: string;
  values?: string;
  goal?: string;
  theme?: 'light' | 'dark' | 'system';
}

interface ThemeManagerProps {
  children: React.ReactNode;
}

const ThemeManager: React.FC<ThemeManagerProps> = ({ children }) => {
  const { userPreferences, generatedTheme } = usePersonalization();
  
  // Apply theme based on user preferences
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const { colorPalette, typography } = generatedTheme;
    const root = document.documentElement;
    
    // Apply color palette
    root.style.setProperty('--color-primary', colorPalette.primary);
    root.style.setProperty('--color-light', colorPalette.light);
    root.style.setProperty('--color-dark', colorPalette.dark);
    root.style.setProperty('--color-accent', colorPalette.accent);
    root.style.setProperty('--color-glass', colorPalette.glass);
    
    // Apply typography
    root.style.setProperty('--font-family', typography.fontFamily);
    root.style.setProperty('--heading-font', typography.headingFont);
    root.style.setProperty('--base-size', typography.baseSize);
    root.style.setProperty('--scale', typography.scale.toString());
    
    // Apply theme (light/dark)
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = userPreferences.theme === 'system' 
      ? (prefersDarkMode ? 'dark' : 'light')
      : userPreferences.theme || 'light';
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (userPreferences.theme === 'system') {
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [userPreferences, generatedTheme]);
  
  return <>{children}</>;
};

export default ThemeManager;