import { useState, useEffect } from 'react';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface ColorPalette {
  primary: string;
  light: string;
  dark: string;
  accent: string;
  glass: string;
}

interface Typography {
  fontFamily: string;
  headingFont: string;
  baseSize: string;
  scale: number;
}

interface UserPreferences {
  color?: string;
  values?: string;
  goal?: string;
  theme?: 'light' | 'dark' | 'system';
}

interface PersonalizedContent {
  headline: string;
  subheading: string;
  ctaText: string;
  welcomeMessage: string;
}

const usePersonalizationEngine = () => {
  // Default preferences
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    color: '#4F46E5',
    values: '',
    goal: '',
    theme: 'system'
  });
  
  // Default content
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent>({
    headline: 'Own Your AI: Introducing Personal Intelligence by Naible',
    subheading: 'A private, evolving AI that\'s 100% yours—trained on your data, serving your needs, and controlled by you alone.',
    ctaText: 'Get Early Access',
    welcomeMessage: 'Welcome to your personalized Naible experience!'
  });
  
  // Generated theme
  const [generatedTheme, setGeneratedTheme] = useState({
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
  });
  
  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const storedPreferences = localStorage.getItem('naible_user_preferences');
      if (storedPreferences) {
        setUserPreferences(JSON.parse(storedPreferences));
      }
      
      const storedContent = localStorage.getItem('naible_personalized_content');
      if (storedContent) {
        setPersonalizedContent(JSON.parse(storedContent));
      }
    } catch (err) {
      console.error('Error loading preferences from localStorage:', err);
    }
  }, []);
  
  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('naible_user_preferences', JSON.stringify(userPreferences));
    } catch (err) {
      console.error('Error saving preferences to localStorage:', err);
    }
  }, [userPreferences]);
  
  // Save content to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('naible_personalized_content', JSON.stringify(personalizedContent));
    } catch (err) {
      console.error('Error saving content to localStorage:', err);
    }
  }, [personalizedContent]);
  
  // Generate theme based on user preferences
  useEffect(() => {
    const colorPalette = generateColorPalette(userPreferences.color || '#4F46E5');
    const typography = generateTypography(userPreferences.values || '');
    
    setGeneratedTheme({
      colorPalette,
      typography
    });
    
    // Apply CSS variables to document root
    applyThemeToDocument(colorPalette, typography);
  }, [userPreferences.color, userPreferences.values]);
  
  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): RGB => {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return { r, g, b };
  };
  
  // Helper function to convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): HSL => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };
  
  // Helper function to convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): RGB => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };
  
  // Helper function to convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  // Generate color palette based on primary color
  const generateColorPalette = (primaryColor: string): ColorPalette => {
    const rgb = hexToRgb(primaryColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Generate light color (higher lightness, lower saturation)
    const lightRgb = hslToRgb(hsl.h, Math.max(0, hsl.s - 10), Math.min(95, hsl.l + 25));
    
    // Generate dark color (lower lightness, higher saturation)
    const darkRgb = hslToRgb(hsl.h, Math.min(100, hsl.s + 10), Math.max(5, hsl.l - 20));
    
    // Generate accent color (complementary color)
    const accentRgb = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l);
    
    const palette = {
      primary: primaryColor,
      light: rgbToHex(lightRgb.r, lightRgb.g, lightRgb.b),
      dark: rgbToHex(darkRgb.r, darkRgb.g, darkRgb.b),
      accent: rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b),
      glass: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
    };
    
    return palette;
  };
  
  // Generate typography based on user values
  const generateTypography = (values: string): Typography => {
    const valuesArray = values.toLowerCase().split(',').map(v => v.trim());
    
    let fontFamily = 'system-ui, sans-serif';
    let headingFont = 'system-ui, sans-serif';
    let baseSize = '1rem';
    let scale = 1.2;
    
    // Adjust typography based on values
    if (valuesArray.some(v => v.includes('minimal') || v.includes('clean'))) {
      fontFamily = 'system-ui, -apple-system, sans-serif';
      headingFont = 'system-ui, -apple-system, sans-serif';
      scale = 1.1;
    } else if (valuesArray.some(v => v.includes('elegant') || v.includes('sophisticated'))) {
      fontFamily = 'Georgia, serif';
      headingFont = 'Georgia, serif';
      scale = 1.25;
    } else if (valuesArray.some(v => v.includes('modern') || v.includes('tech'))) {
      fontFamily = 'Inter, system-ui, sans-serif';
      headingFont = 'Inter, system-ui, sans-serif';
      scale = 1.2;
    } else if (valuesArray.some(v => v.includes('creative') || v.includes('artistic'))) {
      fontFamily = 'system-ui, sans-serif';
      headingFont = 'Playfair Display, Georgia, serif';
      scale = 1.3;
    }
    
    return {
      fontFamily,
      headingFont,
      baseSize,
      scale
    };
  };
  
  // Apply theme to document as CSS variables
  const applyThemeToDocument = (colorPalette: ColorPalette, typography: Typography) => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    // Apply color palette
    root.style.setProperty('--color-primary', colorPalette.primary);
    root.style.setProperty('--color-light', colorPalette.light);
    root.style.setProperty('--color-dark', colorPalette.dark);
    root.style.setProperty('--color-accent', colorPalette.accent);
    root.style.setProperty('--color-glass', colorPalette.glass);
    
    // Extract RGB values for primary color for CSS variables
    const rgb = hexToRgb(colorPalette.primary);
    root.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    
    // Apply typography
    root.style.setProperty('--font-family', typography.fontFamily);
    root.style.setProperty('--heading-font', typography.headingFont);
    root.style.setProperty('--base-size', typography.baseSize);
    root.style.setProperty('--scale', typography.scale.toString());
  };
  
  // Save user preferences
  const saveUserPreferences = (preferences: UserPreferences) => {
    setUserPreferences(prev => ({
      ...prev,
      ...preferences
    }));
  };
  
  // Save personalized content
  const savePersonalizedContent = (content: PersonalizedContent) => {
    setPersonalizedContent(content);
  };
  
  return {
    userPreferences,
    personalizedContent,
    generatedTheme,
    saveUserPreferences,
    savePersonalizedContent
  };
};

export default usePersonalizationEngine;