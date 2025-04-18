import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioRecorder } from '../hooks';

interface VoiceInputHandlerProps {
  onTranscription: (text: string) => void;
  onAudioBlob?: (blob: Blob) => void;
  isDisabled?: boolean;
}

const VoiceInputHandler: React.FC<VoiceInputHandlerProps> = ({
  onTranscription,
  onAudioBlob,
  isDisabled = false
}) => {
  const { isRecording, audioBlob, startRecording, stopRecording, clearRecording } = useAudioRecorder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Handle recording duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Process audio blob when recording stops
  useEffect(() => {
    if (audioBlob && !isRecording) {
      processAudioBlob(audioBlob);
    }
  }, [audioBlob, isRecording]);

  const handleToggleRecording = async () => {
    if (isDisabled) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      try {
        await startRecording();
        setPermissionDenied(false);
      } catch (error) {
        console.error('Error starting recording:', error);
        setPermissionDenied(true);
      }
    }
  };

  const processAudioBlob = async (blob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Pass the blob to parent component if needed
      if (onAudioBlob) {
        onAudioBlob(blob);
      }
      
      // Create a mock transcription for demo purposes
      // In a real implementation, this would call the OpenAI API
      setTimeout(() => {
        const mockTranscription = "This is a simulated voice transcription.";
        onTranscription(mockTranscription);
        setIsProcessing(false);
        clearRecording();
      }, 1500);
    } catch (error) {
      console.error('Error processing audio:', error);
      setIsProcessing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleRecording}
        disabled={isDisabled || isProcessing}
        className={`flex items-center justify-center p-3 rounded-full transition-all ${
          isRecording 
            ? 'bg-red-500 text-white' 
            : isProcessing 
              ? 'bg-gray-200 text-gray-500 cursor-wait' 
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={isRecording ? "Stop recording" : "Start voice input"}
      >
        {isRecording ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect x="6" y="6" width="12" height="12" strokeWidth="2" />
          </svg>
        ) : isProcessing ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
      
      {/* Recording indicator */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            className="absolute top-0 left-full ml-3 whitespace-nowrap glassmorphism px-3 py-1 rounded-full text-sm"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              <span>Recording... {formatDuration(recordingDuration)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Permission denied message */}
      <AnimatePresence>
        {permissionDenied && (
          <motion.div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 glassmorphism px-3 py-2 rounded-lg text-sm text-red-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Microphone access denied. Please enable it in your browser settings.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInputHandler;
