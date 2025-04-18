import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface DataPrivacyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataPrivacyManager: React.FC<DataPrivacyManagerProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'data' | 'settings' | 'export'>('data');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [exportStatus, setExportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  
  if (!isOpen) return null;
  
  const handleExportData = () => {
    setExportStatus('processing');
    
    // Simulate export process
    setTimeout(() => {
      try {
        // Get all user data
        const userData = {
          user: user,
          preferences: localStorage.getItem('naible_preferences') ? 
            JSON.parse(localStorage.getItem('naible_preferences') || '{}') : {},
          content: localStorage.getItem('naible_content') ?
            JSON.parse(localStorage.getItem('naible_content') || '{}') : {},
        };
        
        // Format data based on selected format
        let dataStr = '';
        let filename = '';
        
        if (exportFormat === 'json') {
          dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userData, null, 2));
          filename = "naible_data_export.json";
        } else {
          // Simple CSV conversion (in a real app, this would be more sophisticated)
          let csvContent = "data:text/csv;charset=utf-8,";
          csvContent += "user_id,is_anonymous\n";
          csvContent += `${user?.id},${user?.isAnonymous}\n`;
          dataStr = csvContent;
          filename = "naible_data_export.csv";
        }
        
        // Create download link
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", filename);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        setExportStatus('success');
      } catch (error) {
        console.error('Error exporting data:', error);
        setExportStatus('error');
      }
    }, 1500);
  };
  
  const handleDeleteAllData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      // Clear all localStorage data
      localStorage.removeItem('naible_user');
      localStorage.removeItem('naible_preferences');
      localStorage.removeItem('naible_content');
      
      // Reload the page to reset the app state
      window.location.reload();
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="glassmorphism w-full max-w-2xl max-h-[90vh] overflow-auto rounded-lg p-6 text-gray-800 dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Data Privacy Manager</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`py-2 px-4 ${activeTab === 'data' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('data')}
          >
            Your Data
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'settings' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('settings')}
          >
            Privacy Settings
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'export' ? 'border-b-2 border-primary font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('export')}
          >
            Export & Delete
          </button>
        </div>
        
        {activeTab === 'data' && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">What Data We Store</h3>
              <p className="mb-4">
                Naible is committed to privacy and transparency. Here's what data we store:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>User ID (anonymous or authenticated)</li>
                <li>Your preferences (color, values, goals)</li>
                <li>Personalized content generated for you</li>
              </ul>
              <p className="mt-4 text-sm">
                All data is stored locally on your device and is never sent to our servers without your explicit consent.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Your Current Data</h3>
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium mb-2">User Information</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {user?.isAnonymous 
                      ? 'You are using the app anonymously. No email is stored.' 
                      : 'You are using a registered account.'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    User ID: {user?.id}
                  </p>
                </div>
                
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h4 className="font-medium mb-2">Preferences</h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(
                      localStorage.getItem('naible_preferences') 
                        ? JSON.parse(localStorage.getItem('naible_preferences') || '{}') 
                        : {}, 
                      null, 2
                    )}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Generated Content</h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(
                      localStorage.getItem('naible_content') 
                        ? JSON.parse(localStorage.getItem('naible_content') || '{}') 
                        : {}, 
                      null, 2
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Privacy Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Anonymous Usage</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Use Naible without creating an account
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input
                      type="checkbox"
                      id="anonymous-toggle"
                      className="opacity-0 w-0 h-0"
                      checked={user?.isAnonymous}
                      readOnly
                    />
                    <label
                      htmlFor="anonymous-toggle"
                      className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full ${
                        user?.isAnonymous ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          user?.isAnonymous ? 'transform translate-x-6' : ''
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Local Storage Only</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Keep all data on your device only
                    </p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input
                      type="checkbox"
                      id="local-storage-toggle"
                      className="opacity-0 w-0 h-0"
                      checked={true}
                      readOnly
                    />
                    <label
                      htmlFor="local-storage-toggle"
                      className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-primary rounded-full"
                    >
                      <span
                        className="absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform transform translate-x-6"
                      ></span>
                    </label>
                  </div>
                </div>
                
                <p className="text-sm italic mt-4">
                  Note: In this prototype, all data is stored locally by default and the settings cannot be changed.
                  In a production version, you would have more granular control over your privacy settings.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Export Your Data</h3>
              <p className="mb-4">
                Download all your data in your preferred format:
              </p>
              
              <div className="flex space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="exportFormat"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={() => setExportFormat('json')}
                  />
                  <span className="ml-2">JSON</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="exportFormat"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={() => setExportFormat('csv')}
                  />
                  <span className="ml-2">CSV</span>
                </label>
              </div>
              
              <button
                onClick={handleExportData}
                disabled={exportStatus === 'processing'}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {exportStatus === 'idle' && 'Export Data'}
                {exportStatus === 'processing' && 'Processing...'}
                {exportStatus === 'success' && 'Download Complete!'}
                {exportStatus === 'error' && 'Error - Try Again'}
              </button>
            </div>
            
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-red-500">Delete Your Data</h3>
              <p className="mb-4">
                Permanently delete all your data from Naible. This action cannot be undone.
              </p>
              
              <button
                onClick={handleDeleteAllData}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete All My Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPrivacyManager;
