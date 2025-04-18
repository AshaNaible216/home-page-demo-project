# Naible Conversation-First Homepage Experience
## Handover Documentation

This document provides comprehensive information for maintaining, extending, and deploying the Naible conversation-first homepage experience.

## Project Overview

The Naible conversation-first homepage experience is a revolutionary approach to web design that puts conversation at the center of user interaction. It creates a deeply personalized digital journey that feels alive, empathetic, and tailored in real-time for each user.

Key features include:
- Minimalist blank canvas with blinking cursor
- Natural conversation flow with typewriter animations
- Real-time personalization of content and design
- Modern glassmorphism UI with subtle animations
- Voice input capabilities for natural interaction
- Privacy-first approach with transparent data handling
- Comprehensive accessibility features

## Project Structure

```
naible-homepage/
├── config/                 # Configuration files
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── AccessibilityMenu.tsx
│   │   ├── AccessibilityProvider.tsx
│   │   ├── AccessibleButton.tsx
│   │   ├── AccessibleInput.tsx
│   │   ├── AdaptiveContentLayout.tsx
│   │   ├── AnimatedCursor.tsx
│   │   ├── BlankCanvas.tsx
│   │   ├── ConfettiCelebration.tsx
│   │   ├── ConversationFeedback.tsx
│   │   ├── ConversationFlow.tsx
│   │   ├── ConversationManager.tsx
│   │   ├── ConversationPrompt.tsx
│   │   ├── DataPrivacyManager.tsx
│   │   ├── DynamicContentGenerator.tsx
│   │   ├── FeedbackAnimation.tsx
│   │   ├── GlassmorphismCard.tsx
│   │   ├── KeyboardNavigationManager.tsx
│   │   ├── MicroInteraction.tsx
│   │   ├── PersonalizedHero.tsx
│   │   ├── PrivacyConsent.tsx
│   │   ├── ResponsiveContainer.tsx
│   │   ├── ResponsiveImage.tsx
│   │   ├── ResponsiveLayout.tsx
│   │   ├── ResponsiveTypography.tsx
│   │   ├── ScrollAnimation.tsx
│   │   ├── SiteAssemblyAnimation.tsx
│   │   ├── SkipToContent.tsx
│   │   ├── ThemeManager.tsx
│   │   ├── TouchFriendlyButton.tsx
│   │   ├── TypewriterAnimation.tsx
│   │   └── VoiceInputHandler.tsx
│   ├── context/            # React context providers
│   │   ├── AuthContext.tsx
│   │   └── PersonalizationContext.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── index.ts
│   │   ├── useBackendIntegration.ts
│   │   ├── useOpenAIConversation.ts
│   │   └── usePersonalizationEngine.ts
│   ├── pages/              # Next.js pages
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx
│   │   └── api/            # API routes
│   │       ├── conversation/
│   │       │   ├── audio.ts
│   │       │   └── process.ts
│   │       ├── personalization/
│   │       │   ├── content.ts
│   │       │   └── preferences.ts
│   │       └── users/
│   │           └── anonymous.ts
│   ├── services/           # Service modules
│   │   ├── api.ts
│   │   └── openai.ts
│   ├── styles/             # CSS styles
│   │   ├── accessibility.css
│   │   ├── globals.css
│   │   └── responsive.css
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── tests/                  # Test files
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── deploy.sh               # Deployment script
├── next.config.js          # Next.js configuration
├── package.json            # NPM package configuration
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Technology Stack

- **Frontend Framework**: Next.js with React
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom glassmorphism effects
- **Animations**: Framer Motion
- **AI Integration**: OpenAI GPT-4.1
- **Voice Processing**: OpenAI Whisper
- **State Management**: React Context API
- **API Handling**: Axios
- **Form Handling**: React Hook Form
- **Testing**: Jest, React Testing Library
- **Accessibility**: ARIA, axe-core

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd naible-homepage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_API_URL=your_api_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Start the production server**
   ```bash
   npm start
   ```

## Deployment

### Static Export Deployment

1. **Build the static export**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy the `out` directory**
   The `out` directory contains the static export that can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

3. **Using the deployment script**
   ```bash
   ./deploy.sh
   ```
   This script automates the build, export, and deployment process.

### Server Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Using process managers**
   For production environments, use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "naible-homepage" -- start
   ```

## Configuration Options

### OpenAI Configuration

The OpenAI integration can be configured in `src/services/openai.ts`:

- **Model Selection**: Change the model used for conversation processing
- **Temperature Setting**: Adjust creativity vs. determinism
- **Max Tokens**: Control response length
- **Voice Settings**: Configure voice input processing

### Personalization Options

Personalization settings can be configured in `src/hooks/usePersonalizationEngine.ts`:

- **Question Flow**: Modify the sequence and content of questions
- **Color Schemes**: Adjust the available color options and their application
- **Content Generation**: Configure how user responses influence generated content

### Accessibility Settings

Accessibility options can be configured in `src/components/AccessibilityProvider.tsx`:

- **High Contrast Mode**: Adjust contrast ratios
- **Large Text Mode**: Configure text scaling
- **Reduced Motion**: Customize animation reductions
- **Screen Reader Optimizations**: Modify ARIA attributes and screen reader behavior

## Extending the Application

### Adding New Questions

To add new questions to the conversation flow:

1. Update the question sequence in `src/hooks/useOpenAIConversation.ts`
2. Add corresponding UI components in `src/components/ConversationFlow.tsx`
3. Extend the personalization logic in `src/hooks/usePersonalizationEngine.ts`

### Creating New UI Components

To create new UI components:

1. Create a new component file in `src/components/`
2. Import and use the glassmorphism styling from `GlassmorphismCard.tsx`
3. Implement responsive design using the utilities in `src/styles/responsive.css`
4. Add accessibility features using the components in `AccessibilityProvider.tsx`

### Integrating Additional AI Features

To integrate additional AI capabilities:

1. Extend the OpenAI service in `src/services/openai.ts`
2. Create new API endpoints in `src/pages/api/`
3. Implement frontend hooks to consume the new capabilities
4. Update the UI components to utilize the new features

## Maintenance

### Regular Maintenance Tasks

- **Dependency Updates**: Regularly update npm packages for security and feature improvements
- **API Key Rotation**: Periodically rotate the OpenAI API key
- **Performance Monitoring**: Monitor application performance and optimize as needed
- **User Feedback Collection**: Implement mechanisms to collect and analyze user feedback

### Troubleshooting Common Issues

#### OpenAI API Issues

- **Rate Limiting**: Implement retry logic with exponential backoff
- **API Changes**: Monitor OpenAI documentation for API changes
- **Cost Management**: Implement usage tracking and limits

#### Frontend Issues

- **Browser Compatibility**: Test regularly across different browsers
- **Mobile Responsiveness**: Verify responsive design on various devices
- **Accessibility Compliance**: Run regular accessibility audits

#### Performance Issues

- **Load Time**: Optimize asset loading and code splitting
- **Animation Performance**: Monitor and optimize animation frame rates
- **API Response Time**: Implement caching strategies for frequent requests

## Security Considerations

- **API Key Protection**: Ensure OpenAI API keys are never exposed client-side
- **Data Encryption**: Implement encryption for sensitive user data
- **CORS Configuration**: Configure proper CORS headers for API endpoints
- **Input Validation**: Validate all user inputs before processing
- **Content Security Policy**: Implement appropriate CSP headers

## Contact Information

For questions or support regarding this application, please contact:

- **Technical Support**: [support@naible.com](mailto:support@naible.com)
- **Feature Requests**: [features@naible.com](mailto:features@naible.com)
- **Security Issues**: [security@naible.com](mailto:security@naible.com)

## License Information

This project is licensed under [appropriate license]. See the LICENSE file for details.

---

This handover documentation is designed to provide all necessary information for maintaining and extending the Naible conversation-first homepage experience. For additional details, please refer to the technical documentation and code comments throughout the project.
