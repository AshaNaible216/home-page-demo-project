import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIChatBubbleProps {
  primaryColor: string;
  userName?: string;
  userPreferences?: {
    color?: string;
    values?: string;
    goal?: string;
  };
}

const AIChatBubble: React.FC<AIChatBubbleProps> = ({
  primaryColor,
  userName = 'there',
  userPreferences = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add initial greeting
  useEffect(() => {
    const greeting = `Hi ${userName}! I'm your personal AI assistant. How can I help you today?`;
    setMessages([{ role: 'assistant', content: greeting }]);
  }, [userName]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Simulate AI response with typing delay
      setTimeout(() => {
        // Generate a contextual response based on user preferences and message
        let aiResponse = generateContextualResponse(userMessage, userPreferences);
        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again in a moment." 
      }]);
      setIsTyping(false);
    }
  };
  
  // Simple function to generate contextual responses
  const generateContextualResponse = (message: string, preferences: any) => {
    const lowerMessage = message.toLowerCase();
    const { color, values, goal } = preferences;
    
    // Check for specific keywords and generate appropriate responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! How can I assist you today?`;
    }
    
    if (lowerMessage.includes('help')) {
      return `I'm here to help! I can answer questions about Naible's personal intelligence platform, discuss AI topics, or just chat.`;
    }
    
    if (lowerMessage.includes('color') && color) {
      return `I see you prefer ${color}. It's a great choice that reflects your personality!`;
    }
    
    if (lowerMessage.includes('values') && values) {
      return `Based on your values (${values}), I can help you find AI solutions that align with what matters to you.`;
    }
    
    if (lowerMessage.includes('goal') && goal) {
      return `Your goal of "${goal}" is something Naible's personal intelligence can definitely help with.`;
    }
    
    if (lowerMessage.includes('naible')) {
      return `Naible is focused on personal intelligence - AI that's private, continuously learning, and trained by you. It's designed to be your personal AI twin over time.`;
    }
    
    if (lowerMessage.includes('privacy') || lowerMessage.includes('data')) {
      return `Privacy is central to Naible's approach. Your data remains yours, and you control how your personal AI learns and evolves.`;
    }
    
    // Default responses for other queries
    const defaultResponses = [
      `That's an interesting point. Would you like to know more about how Naible's personal intelligence can help with that?`,
      `I understand. Naible's approach to AI is centered around personalization and privacy.`,
      `Great question! Naible's personal intelligence adapts to your specific needs and preferences.`,
      `I see what you mean. The personal AI experience at Naible is designed to evolve with you over time.`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat bubble button */}
      <motion.button
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center relative"
        style={{ backgroundColor: primaryColor }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          )}
        </motion.div>
        
        {/* Notification dot for new messages */}
        {!isOpen && messages.length > 1 && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          />
        )}
      </motion.button>
      
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="p-3 border-b dark:border-gray-700" style={{ backgroundColor: primaryColor }}>
              <h3 className="text-white font-medium">Naible Assistant</h3>
            </div>
            
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-3 flex flex-col space-y-3">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-gray-400"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-3 border-t dark:border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  style={{ borderColor: `${primaryColor}30` }}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 rounded-r-lg text-white"
                  style={{ backgroundColor: primaryColor }}
                  disabled={!inputValue.trim() || isTyping}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatBubble;