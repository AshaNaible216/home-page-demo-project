// Brand colors and constants
export const NAIBLE_GREEN = '#00B67A';
export const NAIBLE_DARK_GREEN = '#009966';
export const NAIBLE_LIGHT_GREEN = '#33CC99';
export const NAIBLE_ACCENT_BLUE = '#4F46E5';
export const NAIBLE_DARK = '#1A1A2E';

// Function to generate complementary colors based on user preferences
export const generateComplementaryColors = (baseColor: string) => {
  // Simple implementation - in a real app, this would use color theory
  // to generate truly complementary colors
  return {
    primary: baseColor,
    secondary: NAIBLE_GREEN,
    accent: NAIBLE_ACCENT_BLUE,
    background: '#f8f9fa',
    text: '#333333',
  };
};

// Function to blend user color with Naible green for a branded experience
export const blendWithBrand = (userColor: string, blendRatio: number = 0.3) => {
  // This is a placeholder - in a real app, this would do actual color blending
  // For now, we'll just return the Naible green to ensure brand consistency
  return NAIBLE_GREEN;
};