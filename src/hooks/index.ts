import { useState, useEffect, useRef } from 'react';

// Custom hook for recording audio
export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
  };

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording
  };
};

// Custom hook for typewriter effect with optimized performance
export const useTypewriter = (text: string, speed: number = 25) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    let startTime = 0;
    let index = 0;
    setDisplayText('');
    setIsComplete(false);
    
    // Calculate batch size based on text length
    const getBatchSize = () => {
      if (text.length > 100) return 3; // Process 3 chars at once for long text
      if (text.length > 50) return 2;  // Process 2 chars at once for medium text
      return 1;                        // Process 1 char at a time for short text
    };
    
    const batchSize = getBatchSize();
    
    // Animation frame callback
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Calculate how many characters should be typed by now
      const targetIndex = Math.min(
        Math.floor(elapsed / speed),
        text.length
      );
      
      // If we need to update the text
      if (targetIndex > index) {
        // Add characters in batches for smoother animation
        const charsToAdd = Math.min(batchSize, targetIndex - index);
        index += charsToAdd;
        
        setDisplayText(text.substring(0, index));
        
        // Check if we're done
        if (index >= text.length) {
          setIsComplete(true);
          return; // Stop animation
        }
      }
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, speed]);
  
  return { displayText, isComplete };
};

// Custom hook for detecting user inactivity
export const useInactivityDetector = (timeoutMs: number = 30000) => {
  const [isInactive, setIsInactive] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(timeoutId);
      setIsInactive(false);
      timeoutId = setTimeout(() => setIsInactive(true), timeoutMs);
    };
    
    // Set up event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Initialize timer
    resetTimer();
    
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    // Clean up
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeoutMs]);
  
  return isInactive;
};

// Custom hook for theme detection and switching
export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check system preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Apply theme to document
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };
  
  return { isDarkMode, toggleTheme };
};

// Custom hook for detecting viewport size
export const useViewport = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      setIsMobile(window.innerWidth < 768); // Standard mobile breakpoint
    };
    
    // Set initial values
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return { width, height, isMobile };
};
