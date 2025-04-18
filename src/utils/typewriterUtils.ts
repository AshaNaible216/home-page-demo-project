/**
 * Utility functions for typewriter animations
 */

/**
 * Parses a string with an identifier prefix and returns only the display text
 * Format: "H: Actual text to display"
 * 
 * @param text The input text with an identifier prefix
 * @returns The text without the identifier prefix
 */
export const parseTypewriterText = (text: string): string => {
  // Check if the text has the correct format with "H: " prefix
  if (text.startsWith("H: ")) {
    return text.substring(3); // Return text after "H: "
  } else if (text.startsWith("H:")) {
    return text.substring(2); // Return text after "H:"
  }
  
  // If no identifier is found, return the original text
  return text;
};

/**
 * Creates a typewriter effect by gradually revealing text
 * 
 * @param fullText The complete text to be typed
 * @param currentIndex Current character index in the typing progress
 * @returns The partially typed text up to the current index
 */
export const createTypewriterEffect = (fullText: string, currentIndex: number): string => {
  return fullText.substring(0, currentIndex);
};

/**
 * Determines if a text message has the correct typewriter start identifier
 * 
 * @param text The text to check for the identifier
 * @returns True if the text has a valid identifier, false otherwise
 */
export const hasTypewriterIdentifier = (text: string): boolean => {
  return text.startsWith("H:") || text.startsWith("h:");
};

/**
 * Adds a typewriter identifier to text if it doesn't already have one
 * 
 * @param text The text to ensure has an identifier
 * @returns Text with a proper typewriter identifier
 */
export const ensureTypewriterIdentifier = (text: string): string => {
  if (!hasTypewriterIdentifier(text)) {
    return `H: ${text}`;
  }
  return text;
};

/**
 * Calculate appropriate typing speed based on text length
 * 
 * @param text The text to be typed
 * @param baseSpeed Base typing speed in milliseconds
 * @returns Adjusted typing speed in milliseconds
 */
export const calculateTypingSpeed = (text: string, baseSpeed: number = 40): number => {
  // Adjust speed based on text length - shorter texts type slower for dramatic effect
  if (text.length < 20) {
    return baseSpeed * 1.2;
  } else if (text.length > 100) {
    return baseSpeed * 0.5; // Much faster for very long texts
  } else if (text.length > 50) {
    return baseSpeed * 0.7; // Faster for medium-length texts
  }
  return baseSpeed;
};