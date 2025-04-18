import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyConsentProps {
  onAccept: () => void;
  onDecline: () => void;
  showDetailedOptions?: boolean;
}

const PrivacyConsent: React.FC<PrivacyConsentProps> = ({
  onAccept,
  onDecline,
  showDetailedOptions = false
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [consentOptions, setConsentOptions] = useState({
    essentialData: true, // Always required
    personalPreferences: true,
    analytics: true,
    thirdPartySharing: false
  });

  const handleToggleOption = (option: keyof typeof consentOptions) => {
    if (option === 'essentialData') return; // Cannot toggle essential data
    setConsentOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const handleAccept = () => {
    // Store consent preferences
    localStorage.setItem('naible_privacy_consent', JSON.stringify({
      consentOptions,
      timestamp: new Date().toISOString()
    }));
    onAccept();
  };

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto glassmorphism rounded-xl p-6 shadow-lg border border-glass-light dark:border-glass-dark">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-2">Your Privacy Matters</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              We use your data to create a personalized experience that's 100% yours. Your data never leaves your device without your explicit consent.
            </p>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline focus:outline-none"
            >
              {showDetails ? 'Hide details' : 'View details'}
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onDecline}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Accept & Continue
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium mb-3">Customize Your Privacy Settings</h4>
                
                <div className="space-y-3">
                  {/* Essential Data - Always required */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Essential Data</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Required for the application to function</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={consentOptions.essentialData}
                        disabled
                        className="sr-only"
                        id="essential-data"
                      />
                      <label
                        htmlFor="essential-data"
                        className="block w-10 h-6 rounded-full bg-primary-600 cursor-not-allowed"
                      >
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Personal Preferences */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Personal Preferences</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Store your preferences for personalization</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={consentOptions.personalPreferences}
                        onChange={() => handleToggleOption('personalPreferences')}
                        className="sr-only"
                        id="personal-preferences"
                      />
                      <label
                        htmlFor="personal-preferences"
                        className={`block w-10 h-6 rounded-full transition-colors cursor-pointer ${
                          consentOptions.personalPreferences ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span 
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            consentOptions.personalPreferences ? 'left-5' : 'left-1'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Analytics */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Analytics</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Help us improve by collecting anonymous usage data</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={consentOptions.analytics}
                        onChange={() => handleToggleOption('analytics')}
                        className="sr-only"
                        id="analytics"
                      />
                      <label
                        htmlFor="analytics"
                        className={`block w-10 h-6 rounded-full transition-colors cursor-pointer ${
                          consentOptions.analytics ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span 
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            consentOptions.analytics ? 'left-5' : 'left-1'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Third-party Sharing */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Third-party Sharing</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Allow sharing data with trusted partners</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={consentOptions.thirdPartySharing}
                        onChange={() => handleToggleOption('thirdPartySharing')}
                        className="sr-only"
                        id="third-party"
                      />
                      <label
                        htmlFor="third-party"
                        className={`block w-10 h-6 rounded-full transition-colors cursor-pointer ${
                          consentOptions.thirdPartySharing ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span 
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            consentOptions.thirdPartySharing ? 'left-5' : 'left-1'
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>
                    By accepting, you agree to our{' '}
                    <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a>.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PrivacyConsent;
