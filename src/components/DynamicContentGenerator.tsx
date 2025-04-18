import React from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface DynamicContentGeneratorProps {
  userPreferences: {
    color?: string;
    values?: string;
    goal?: string;
  };
  className?: string;
}

interface StyleObject {
  color?: string;
  backgroundColor?: string;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontSize?: string;
  lineHeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  padding?: string;
  margin?: string;
  borderRadius?: string;
  boxShadow?: string;
}

const DynamicContentGenerator: React.FC<DynamicContentGeneratorProps> = ({
  userPreferences,
  className = ''
}) => {
  const { highContrast, largeText } = useAccessibility();
  
  // Generate dynamic content based on user preferences
  const generateContent = () => {
    const { color, values, goal } = userPreferences;
    
    // Default content
    let headline = 'Own Your AI: Introducing Personal Intelligence by Naible';
    let subheading = 'A private, evolving AI that\'s 100% yours—trained on your data, serving your needs, and controlled by you alone.';
    
    // Style object for dynamic styling
    const style: StyleObject = {
      color: highContrast ? '#ffffff' : color || '#4F46E5',
      fontWeight: 'normal',
      fontSize: largeText ? '1.25rem' : '1rem',
      textAlign: 'left'
    };
    
    // Parse values if available
    const values_array = values ? values.toLowerCase().split(',').map(v => v.trim()) : [];
    
    // Adjust based on user values
    if (values_array.some(v => v.includes('bold') || v.includes('strong') || v.includes('impact'))) {
      style.fontWeight = 'bold';
    }
    
    if (values_array.some(v => v.includes('minimal') || v.includes('clean'))) {
      style.fontFamily = 'system-ui, sans-serif';
    } else if (values_array.some(v => v.includes('elegant') || v.includes('sophisticated'))) {
      style.fontFamily = 'Georgia, serif';
    }
    
    if (values_array.some(v => v.includes('center') || v.includes('balanced'))) {
      style.textAlign = 'center';
    }
    
    // Adjust content based on goal if available
    if (goal) {
      if (goal.toLowerCase().includes('business')) {
        headline = 'Transform Your Business with Personal Intelligence';
        subheading = 'Naible brings AI that adapts to your business needs, learns from your data, and delivers insights tailored to your goals.';
      } else if (goal.toLowerCase().includes('personal')) {
        headline = 'Your Personal AI Assistant, Evolved';
        subheading = 'Naible creates a truly personal AI experience that grows with you, understands your preferences, and respects your privacy.';
      } else if (goal.toLowerCase().includes('creative')) {
        headline = 'Unleash Creativity with Personal Intelligence';
        subheading = 'Naible amplifies your creative process with AI that learns your style, anticipates your needs, and evolves with your vision.';
      }
    }
    
    return {
      headline,
      subheading,
      style
    };
  };
  
  const { headline, subheading, style } = generateContent();
  
  return (
    <div className={`dynamic-content ${className}`} style={style}>
      <h1 className={`text-2xl font-bold mb-4 ${largeText ? 'text-3xl' : ''}`}>{headline}</h1>
      <p className={`mb-6 ${largeText ? 'text-xl' : 'text-base'}`}>{subheading}</p>
    </div>
  );
};

export default DynamicContentGenerator;
