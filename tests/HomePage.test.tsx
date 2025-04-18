import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../src/pages/index';

// Mock the hooks and components
jest.mock('../src/hooks/useOpenAIConversation', () => ({
  __esModule: true,
  default: () => ({
    conversationState: {
      userColor: '#4F46E5',
      userValues: 'Privacy, Security, Trust',
      userGoal: 'Exploring AI for my business',
      personalizedContent: {
        headline: 'Test Headline',
        subheading: 'Test Subheading',
        ctaText: 'Test CTA',
        welcomeMessage: 'Test Welcome'
      }
    },
    processInitialQuestion: jest.fn().mockResolvedValue(true),
    processColorQuestion: jest.fn().mockResolvedValue(true),
    processValuesQuestion: jest.fn().mockResolvedValue(true),
    processFinalQuestion: jest.fn().mockResolvedValue(true),
    processAudioInput: jest.fn().mockResolvedValue('Test transcription'),
    isLoading: false,
    error: null
  })
}));

jest.mock('../src/hooks/useBackendIntegration', () => ({
  __esModule: true,
  default: () => ({
    isLoading: false,
    error: null,
    user: { id: 'test-user-id' },
    preferences: { color: '#4F46E5', values: 'Privacy, Security, Trust' },
    personalizedContent: {
      headline: 'Test Headline',
      subheading: 'Test Subheading',
      ctaText: 'Test CTA',
      welcomeMessage: 'Test Welcome'
    },
    createAnonymousUser: jest.fn().mockResolvedValue({ id: 'test-user-id' }),
    saveUserPreferences: jest.fn().mockResolvedValue(true),
    savePersonalizedContent: jest.fn().mockResolvedValue(true),
    processUserMessage: jest.fn().mockResolvedValue({ response: 'Test response' }),
    processAudioInput: jest.fn().mockResolvedValue('Test transcription')
  })
}));

jest.mock('../src/context/PersonalizationContext', () => ({
  __esModule: true,
  usePersonalization: () => ({
    userPreferences: { color: '#4F46E5', values: 'Privacy, Security, Trust' },
    personalizedContent: {
      headline: 'Test Headline',
      subheading: 'Test Subheading',
      ctaText: 'Test CTA',
      welcomeMessage: 'Test Welcome'
    },
    saveUserPreferences: jest.fn(),
    savePersonalizedContent: jest.fn()
  }),
  PersonalizationProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('../src/context/AuthContext', () => ({
  __esModule: true,
  useAuth: () => ({
    user: { id: 'test-user-id' },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    createAnonymousUser: jest.fn().mockResolvedValue({ id: 'test-user-id' }),
    updateUserProfile: jest.fn()
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));

// Mock components
jest.mock('../src/components/BlankCanvas', () => ({
  __esModule: true,
  default: ({ onUserResponse }) => (
    <div data-testid="blank-canvas">
      <button onClick={() => onUserResponse('Test response')}>Respond</button>
    </div>
  )
}));

jest.mock('../src/components/ConversationManager', () => ({
  __esModule: true,
  default: ({ onResponse, children }) => (
    <div data-testid="conversation-manager">
      {children}
      <button onClick={() => onResponse('Test response')}>Respond</button>
    </div>
  )
}));

jest.mock('../src/components/ConversationPrompt', () => ({
  __esModule: true,
  default: ({ onResponse }) => (
    <div data-testid="conversation-prompt">
      <button onClick={() => onResponse('Test response')}>Respond</button>
    </div>
  )
}));

jest.mock('../src/components/SiteAssemblyAnimation', () => ({
  __esModule: true,
  default: ({ onComplete }) => (
    <div data-testid="site-assembly-animation">
      <button onClick={onComplete}>Complete</button>
    </div>
  )
}));

jest.mock('../src/components/PersonalizedHero', () => ({
  __esModule: true,
  default: ({ onCtaClick }) => (
    <div data-testid="personalized-hero">
      <button onClick={onCtaClick}>CTA</button>
    </div>
  )
}));

jest.mock('../src/components/PrivacyConsent', () => ({
  __esModule: true,
  default: ({ onAccept, onDecline }) => (
    <div data-testid="privacy-consent">
      <button onClick={onAccept}>Accept</button>
      <button onClick={onDecline}>Decline</button>
    </div>
  )
}));

jest.mock('../src/components/DataPrivacyManager', () => ({
  __esModule: true,
  default: ({ onClose }) => (
    <div data-testid="data-privacy-manager">
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  test('renders privacy consent when no consent is given', () => {
    render(<HomePage />);
    expect(screen.getByTestId('privacy-consent')).toBeInTheDocument();
  });

  test('progresses through conversation steps', async () => {
    // Mock localStorage to skip privacy consent
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });

    render(<HomePage />);

    // Initial step (BlankCanvas)
    expect(screen.getByTestId('blank-canvas')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Respond'));
    
    // Goal step (ConversationManager)
    await waitFor(() => {
      expect(screen.getByTestId('conversation-manager')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Respond'));
    
    // Color step (ConversationPrompt)
    await waitFor(() => {
      expect(screen.getByTestId('conversation-prompt')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Respond'));
    
    // Values step (ConversationPrompt)
    await waitFor(() => {
      expect(screen.getByTestId('conversation-prompt')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Respond'));
    
    // Final question step (ConversationManager)
    await waitFor(() => {
      expect(screen.getByTestId('conversation-manager')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Respond'));
    
    // Assembly animation step
    await waitFor(() => {
      expect(screen.getByTestId('site-assembly-animation')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Complete'));
    
    // Final personalized hero step
    await waitFor(() => {
      expect(screen.getByTestId('personalized-hero')).toBeInTheDocument();
    });
  });

  test('handles privacy consent acceptance', () => {
    render(<HomePage />);
    
    expect(screen.getByTestId('privacy-consent')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Accept'));
    
    // Should move to initial step
    expect(screen.getByTestId('blank-canvas')).toBeInTheDocument();
  });

  test('opens data privacy manager when clicking CTA in personalized hero', async () => {
    // Mock localStorage to skip to final step
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });
    
    // Mock the current step to be Complete
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [5, jest.fn()]); // 5 = ConversationStep.Complete
    
    render(<HomePage />);
    
    // Should show personalized hero
    expect(screen.getByTestId('personalized-hero')).toBeInTheDocument();
    
    // Click CTA button
    fireEvent.click(screen.getByText('CTA'));
    
    // Should open data privacy manager
    await waitFor(() => {
      expect(screen.getByTestId('data-privacy-manager')).toBeInTheDocument();
    });
  });
});
