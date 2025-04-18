import React, { createContext, useContext, useState, useEffect } from 'react';
import usePersonalizationEngine from '../hooks/usePersonalizationEngine';

interface PersonalizationContextType {
  userPreferences: {
    color?: string;
    values?: string;
    goal?: string;
    theme?: 'light' | 'dark' | 'system';
  };
  personalizedContent: {
    headline: string;
    subheading: string;
    ctaText: string;
    welcomeMessage: string;
  };
  generatedTheme: {
    colorPalette: {
      primary: string;
      light: string;
      dark: string;
      accent: string;
      glass: string;
    };
    typography: {
      fontFamily: string;
      headingFont: string;
      baseSize: string;
      scale: number;
    };
  };
  saveUserPreferences: (preferences: any) => void;
  savePersonalizedContent: (content: any) => void;
}

const PersonalizationContext = createContext<PersonalizationContextType>({
  userPreferences: {
    color: '#4F46E5',
    values: '',
    goal: '',
    theme: 'system'
  },
  personalizedContent: {
    headline: 'Own Your AI: Introducing Personal Intelligence by Naible',
    subheading: 'A private, evolving AI that\'s 100% yours—trained on your data, serving your needs, and controlled by you alone.',
    ctaText: 'Get Early Access',
    welcomeMessage: 'Welcome to your personalized Naible experience!'
  },
  generatedTheme: {
    colorPalette: {
      primary: '#4F46E5',
      light: '#EEF2FF',
      dark: '#312E81',
      accent: '#E879F9',
      glass: 'rgba(79, 70, 229, 0.2)'
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      headingFont: 'system-ui, sans-serif',
      baseSize: '1rem',
      scale: 1.2
    }
  },
  saveUserPreferences: () => {},
  savePersonalizedContent: () => {}
});

export const usePersonalization = () => useContext(PersonalizationContext);

interface PersonalizationProviderProps {
  children: React.ReactNode;
}

export const PersonalizationProvider: React.FC<PersonalizationProviderProps> = ({ children }) => {
  const personalization = usePersonalizationEngine();
  
  return (
    <PersonalizationContext.Provider value={personalization}>
      {children}
    </PersonalizationContext.Provider>
  );
};

export default PersonalizationProvider;
