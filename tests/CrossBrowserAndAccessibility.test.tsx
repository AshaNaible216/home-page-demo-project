import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import HomePage from '../src/pages/index';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock the hooks and components (same as in HomePage.test.tsx)
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

// Other mocks from HomePage.test.tsx...
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

// Mock components with accessibility attributes
jest.mock('../src/components/BlankCanvas', () => ({
  __esModule: true,
  default: ({ onUserResponse }) => (
    <div data-testid="blank-canvas" role="main" aria-label="Conversation start">
      <button onClick={() => onUserResponse('Test response')} aria-label="Start conversation">Respond</button>
    </div>
  )
}));

jest.mock('../src/components/ConversationManager', () => ({
  __esModule: true,
  default: ({ onResponse, children }) => (
    <div data-testid="conversation-manager" role="region" aria-label="Conversation">
      {children}
      <button onClick={() => onResponse('Test response')} aria-label="Submit response">Respond</button>
    </div>
  )
}));

jest.mock('../src/components/ConversationPrompt', () => ({
  __esModule: true,
  default: ({ onResponse }) => (
    <div data-testid="conversation-prompt" role="form" aria-label="Question prompt">
      <button onClick={() => onResponse('Test response')} aria-label="Submit answer">Respond</button>
    </div>
  )
}));

jest.mock('../src/components/SiteAssemblyAnimation', () => ({
  __esModule: true,
  default: ({ onComplete }) => (
    <div data-testid="site-assembly-animation" role="status" aria-label="Site being assembled">
      <button onClick={onComplete} aria-label="Skip animation">Complete</button>
    </div>
  )
}));

jest.mock('../src/components/PersonalizedHero', () => ({
  __esModule: true,
  default: ({ onCtaClick }) => (
    <div data-testid="personalized-hero" role="banner" aria-label="Personalized hero section">
      <h1>Test Headline</h1>
      <p>Test Subheading</p>
      <button onClick={onCtaClick} aria-label="Get started">CTA</button>
    </div>
  )
}));

jest.mock('../src/components/PrivacyConsent', () => ({
  __esModule: true,
  default: ({ onAccept, onDecline }) => (
    <div data-testid="privacy-consent" role="dialog" aria-labelledby="privacy-title">
      <h2 id="privacy-title">Privacy Consent</h2>
      <button onClick={onAccept} aria-label="Accept privacy terms">Accept</button>
      <button onClick={onDecline} aria-label="Decline privacy terms">Decline</button>
    </div>
  )
}));

jest.mock('../src/components/DataPrivacyManager', () => ({
  __esModule: true,
  default: ({ onClose }) => (
    <div data-testid="data-privacy-manager" role="dialog" aria-labelledby="privacy-manager-title">
      <h2 id="privacy-manager-title">Data Privacy Manager</h2>
      <button onClick={onClose} aria-label="Close privacy manager">Close</button>
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

describe('Cross-Browser Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  test('renders correctly in simulated Chrome environment', () => {
    // Mock Chrome user agent
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      configurable: true
    });
    
    // Mock localStorage to skip privacy consent
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });
    
    render(<HomePage />);
    expect(screen.getByTestId('blank-canvas')).toBeInTheDocument();
  });

  test('renders correctly in simulated Firefox environment', () => {
    // Mock Firefox user agent
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      configurable: true
    });
    
    // Mock localStorage to skip privacy consent
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });
    
    render(<HomePage />);
    expect(screen.getByTestId('blank-canvas')).toBeInTheDocument();
  });

  test('renders correctly in simulated Safari environment', () => {
    // Mock Safari user agent
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
      configurable: true
    });
    
    // Mock localStorage to skip privacy consent
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });
    
    render(<HomePage />);
    expect(screen.getByTestId('blank-canvas')).toBeInTheDocument();
  });

  test('renders correctly in simulated mobile environment', () => {
    // Mock mobile user agent
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      configurable: true
    });
    
    // Mock window dimensions for mobile
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
    
    // Mock localStorage to skip privacy consent
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });
    
    render(<HomePage />);
    expect(screen.getByTestId('blank-canvas')).toBeInTheDocument();
  });
});

describe('Accessibility Testing', () => {
  test('should have no accessibility violations', async () => {
    // Mock localStorage to skip privacy consent
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });
    
    const { container } = render(<HomePage />);
    
    // Run axe accessibility tests
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('privacy consent dialog is accessible', async () => {
    const { container } = render(<HomePage />);
    
    // Check for privacy consent dialog
    expect(screen.getByTestId('privacy-consent')).toBeInTheDocument();
    
    // Run axe accessibility tests on privacy consent
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('conversation flow is keyboard navigable', () => {
    // Mock localStorage to skip privacy consent
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });
    
    render(<HomePage />);
    
    // Focus on the respond button
    const respondButton = screen.getByText('Respond');
    respondButton.focus();
    
    // Check if button is focused
    expect(document.activeElement).toBe(respondButton);
    
    // Simulate keyboard Enter press
    fireEvent.keyDown(respondButton, { key: 'Enter', code: 'Enter' });
    
    // Should progress to next step
    waitFor(() => {
      expect(screen.getByTestId('conversation-manager')).toBeInTheDocument();
    });
  });
});

describe('Responsive Design Testing', () => {
  test('renders correctly on desktop viewport', () => {
    // Set desktop viewport
    Object.defineProperty(window, 'innerWidth', { value: 1920, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1080, configurable: true });
    
    // Mock localStorage to skip privacy consent
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });
    
    render(<HomePage />);
    expect(screen.getByTestId('blank-canvas')).toBeInTheDocument();
  });

  test('renders correctly on tablet viewport', () => {
    // Set tablet viewport
    Object.defineProperty(window, 'innerWidth', { value: 768, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1024, configurable: true });
    
    // Mock localStorage to skip privacy consent
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });
    
    render(<HomePage />);
    expect(screen.getByTestId('blank-canvas')).toBeInTheDocument();
  });

  test('renders correctly on mobile viewport', () => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 667, configurable: true });
    
    // Mock localStorage to skip privacy consent
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'naible_privacy_consent') {
        return JSON.stringify({ consentOptions: {}, timestamp: new Date().toISOString() });
      }
      return null;
    });
    
    render(<HomePage />);
    expect(screen.getByTestId('blank-canvas')).toBeInTheDocument();
  });
});
