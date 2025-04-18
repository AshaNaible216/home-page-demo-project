# Naible Conversation-First Homepage Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Component Documentation](#component-documentation)
4. [Installation Guide](#installation-guide)
5. [User Guide](#user-guide)
6. [API Documentation](#api-documentation)
7. [Personalization Features](#personalization-features)
8. [Accessibility Features](#accessibility-features)
9. [Maintenance Guide](#maintenance-guide)
10. [Extending the Application](#extending-the-application)

## Introduction

The Naible Conversation-First Homepage is a revolutionary web experience that puts conversation at the center of user interaction. Instead of presenting users with a traditional static homepage, it engages them in a personalized dialogue that shapes the content and appearance of the site in real-time.

### Key Features

- **Conversation-First Interface**: Starts with just a blinking cursor that invites user interaction
- **Modern Glassmorphism Design**: Implements contemporary UI with glass-like transparency effects
- **Voice Input Capabilities**: Supports both text and voice input using OpenAI's latest models
- **Real-Time Personalization**: Adapts content, colors, and messaging based on user preferences
- **Privacy-First Approach**: Transparent data handling with user control over information
- **Accessibility Optimized**: Designed to be usable by everyone, including those with disabilities
- **Responsive Design**: Works seamlessly across all device sizes from mobile to desktop

### Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: TailwindCSS with custom glassmorphism effects
- **Animation**: Framer Motion for fluid animations and transitions
- **AI Integration**: OpenAI GPT-4.1 for conversation processing and content generation
- **Voice Processing**: OpenAI Whisper for audio transcription
- **State Management**: React Context API for global state management
- **Deployment**: Static site generation with Next.js

## Architecture Overview

The application follows a modern component-based architecture with clear separation of concerns:

```
naible-homepage/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── BlankCanvas.tsx             # Initial screen with blinking cursor
│   │   ├── ConversationPrompt.tsx      # Handles user questions and responses
│   │   ├── GlassmorphismCard.tsx       # Reusable glassmorphism styling component
│   │   ├── SiteAssemblyAnimation.tsx   # Animated sequence showing site construction
│   │   ├── PersonalizedHero.tsx        # Final personalized homepage
│   │   ├── AccessibilityProvider.tsx   # Manages accessibility settings
│   │   └── ...
│   ├── context/            # React context providers
│   │   ├── AuthContext.tsx             # Authentication state management
│   │   ├── PersonalizationContext.tsx  # User preferences management
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useOpenAIConversation.ts    # OpenAI integration hook
│   │   ├── usePersonalizationEngine.ts # Personalization logic
│   │   └── ...
│   ├── pages/              # Next.js pages
│   │   ├── index.tsx                   # Main homepage
│   │   ├── _app.tsx                    # App wrapper with providers
│   │   ├── _document.tsx               # Custom document for SEO
│   │   └── api/                        # API routes
│   ├── services/           # External service integrations
│   │   ├── openai.ts                   # OpenAI API client
│   │   └── api.ts                      # Internal API client
│   ├── styles/             # Global styles
│   │   ├── globals.css                 # Global CSS
│   │   ├── responsive.css              # Responsive design styles
│   │   └── accessibility.css           # Accessibility-specific styles
│   └── types/              # TypeScript type definitions
├── config/                 # Configuration files
├── .env                    # Environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # TailwindCSS configuration
└── tsconfig.json           # TypeScript configuration
```

### Data Flow

1. User interacts with the BlankCanvas component
2. Interaction triggers the conversation flow in ConversationPrompt
3. User responses are processed by useOpenAIConversation hook
4. Processed data is stored in PersonalizationContext
5. UI components adapt based on personalization data
6. Final personalized content is displayed in PersonalizedHero

## Component Documentation

### BlankCanvas

The initial screen that users see when visiting the site. Features a blinking cursor that invites interaction.

**Props:**
- `onStart`: Function to call when user interaction begins

**Key Features:**
- Adapts background based on time of day
- Implements blinking cursor animation
- Responds to both click and keyboard input

### ConversationPrompt

Manages the conversation flow with the user, displaying questions and collecting responses.

**Props:**
- `question`: The current question to display
- `step`: Current step in the conversation flow
- `onResponse`: Function to call with user's response
- `onAudioInput`: Function to handle audio input (optional)
- `isProcessing`: Boolean indicating if response is being processed
- `totalSteps`: Total number of steps in the conversation
- `currentStepIndex`: Current step index for progress indication

**Key Features:**
- Supports text input for all questions
- Provides color picker for color preference question
- Includes voice input capability with recording indicator
- Shows progress through conversation steps

### GlassmorphismCard

Reusable component that provides the glassmorphism styling used throughout the application.

**Props:**
- `children`: React nodes to render inside the card
- `className`: Additional CSS classes (optional)

**Key Features:**
- Implements backdrop blur effect
- Provides subtle transparency
- Adapts to light and dark modes

### SiteAssemblyAnimation

Animated sequence that shows the site being built in real-time based on user preferences.

**Props:**
- `userPreferences`: Object containing user's preferences

**Key Features:**
- Particle animation with colors based on user preference
- Progressive assembly of UI elements
- Loading progress indicator

### PersonalizedHero

The final personalized homepage that displays content tailored to the user's preferences.

**Props:**
- `headline`: Personalized headline text
- `subheading`: Personalized subheading text
- `ctaText`: Call-to-action button text
- `welcomeMessage`: Personalized welcome message
- `userPreferences`: Object containing user's preferences
- `onViewDataPrivacy`: Function to show data privacy manager

**Key Features:**
- Adapts color scheme based on user preference
- Displays personalized content generated from conversation
- Includes key benefits section
- Features glassmorphism hero visual

## Installation Guide

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/your-organization/naible-homepage.git
cd naible-homepage
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Export static site:
```bash
npm run export
```

7. Serve the static site:
```bash
npx serve out
```

## User Guide

### Initial Interaction

1. When you first visit the site, you'll see a blinking cursor on a minimal background
2. Click anywhere on the screen or press any key to begin the conversation
3. The first question will appear with a typewriter animation effect

### Conversation Flow

1. Read each question carefully and provide your response
2. You can type your response in the text field or use the voice input button
3. For color preference, you can select from predefined colors or use the color picker
4. A progress indicator at the top shows your position in the conversation flow
5. Click "Continue" or press Enter to submit your response

### Voice Input

1. Click the microphone icon to start recording
2. Speak your response clearly
3. Click the stop button (square icon) when finished
4. Your audio will be processed and transcribed automatically

### Personalized Result

1. After answering all questions, you'll see an animation of your site being assembled
2. The final result will be a personalized hero page based on your preferences
3. The color scheme, headline, subheading, and content will reflect your responses
4. You can click "View Your Data" to see what information has been stored

### Data Privacy

1. Click "View Your Data" on the personalized hero page
2. The Data Privacy Manager shows what data is stored and how it's used
3. You can export your data in JSON or CSV format
4. You can delete all your data if desired

## API Documentation

### Authentication API

#### `/api/users/anonymous`

Creates an anonymous user session.

**Method:** POST

**Response:**
```json
{
  "userId": "unique-user-id",
  "isAnonymous": true
}
```

### Personalization API

#### `/api/personalization/preferences`

Stores user preferences.

**Method:** POST

**Request Body:**
```json
{
  "userId": "user-id",
  "preferences": {
    "color": "#4F46E5",
    "values": "privacy, innovation",
    "goal": "business automation"
  }
}
```

**Response:**
```json
{
  "success": true
}
```

#### `/api/personalization/content`

Retrieves personalized content.

**Method:** GET

**Query Parameters:**
- `userId`: User ID

**Response:**
```json
{
  "headline": "Own Your AI: Introducing Personal Intelligence by Naible",
  "subheading": "A private, evolving AI that's 100% yours—trained on your data, serving your needs, and controlled by you alone.",
  "ctaText": "Get Early Access",
  "welcomeMessage": "Welcome to your personalized Naible experience!"
}
```

### Conversation API

#### `/api/conversation/process`

Processes text input from the conversation.

**Method:** POST

**Request Body:**
```json
{
  "userId": "user-id",
  "message": "I value privacy and innovation",
  "step": "values"
}
```

**Response:**
```json
{
  "response": "Thank you for sharing your values. Privacy and innovation are core to Naible's mission.",
  "nextStep": "goals"
}
```

#### `/api/conversation/audio`

Processes audio input from the conversation.

**Method:** POST

**Request Body:**
- Form data with audio file

**Response:**
```json
{
  "transcription": "I value privacy and innovation",
  "response": "Thank you for sharing your values. Privacy and innovation are core to Naible's mission.",
  "nextStep": "goals"
}
```

## Personalization Features

The application personalizes several aspects of the user experience:

### Visual Personalization

- **Color Scheme**: The primary color is based on the user's color preference
- **Typography**: Font weights and sizes adapt based on user's stated values
- **Animation Style**: Animation timing and effects adjust based on user interaction patterns

### Content Personalization

- **Headline**: Generated based on user's goals and values
- **Subheading**: Adapts to emphasize aspects that align with user's stated preferences
- **CTA Text**: Customized based on the user's goal
- **Welcome Message**: Personalized greeting that references user's preferences

### Behavioral Personalization

- **Conversation Flow**: Questions may adapt based on previous responses
- **Interaction Style**: UI feedback adjusts based on user's interaction patterns
- **Help Content**: Suggestions and help text adapt based on user's expertise level

## Accessibility Features

The application is designed to be accessible to all users, including those with disabilities:

### Keyboard Navigation

- Full keyboard navigation support throughout the application
- Skip to content link for keyboard users
- Focus indicators that only appear during keyboard navigation

### Screen Reader Support

- Proper ARIA roles, labels, and descriptions
- Semantic HTML structure
- Announcements for dynamic content changes

### Visual Adaptations

- High contrast mode for users with low vision
- Large text mode that increases font sizes
- Reduced motion mode for users with vestibular disorders

### Input Alternatives

- Voice input for users who have difficulty typing
- Text input for users who cannot use voice
- Color selection via both visual picker and text input

## Maintenance Guide

### Regular Maintenance Tasks

1. **API Key Rotation**:
   - Rotate the OpenAI API key every 90 days
   - Update the `.env` file with the new key

2. **Dependency Updates**:
   - Run `npm outdated` to check for outdated packages
   - Run `npm update` to update packages to their latest compatible versions
   - For major version updates, review changelogs before updating

3. **Performance Monitoring**:
   - Review browser console for any errors or warnings
   - Check API response times and optimize if necessary

### Troubleshooting Common Issues

1. **OpenAI API Issues**:
   - Check API key validity
   - Verify rate limits haven't been exceeded
   - Confirm API endpoints haven't changed

2. **Build Errors**:
   - Clear the `.next` directory and node_modules, then reinstall
   - Check for TypeScript errors with `npm run type-check`
   - Verify all required environment variables are set

3. **Styling Issues**:
   - Run `npm run build:css` to rebuild the CSS
   - Check for TailwindCSS configuration changes
   - Verify browser compatibility for CSS features

## Extending the Application

### Adding New Conversation Steps

1. Add a new step to the `ConversationStep` enum in `index.tsx`
2. Create a new question in the `getCurrentQuestion` function
3. Add handling for the new step in the `handleResponse` function
4. Update the progress indicator by adjusting `totalSteps` and `currentStepIndex`

### Creating New UI Components

1. Create a new component file in the `components` directory
2. Define the component's props interface with TypeScript
3. Implement the component using React and TailwindCSS
4. Add glassmorphism styling by using the `GlassmorphismCard` component or the `glassmorphism` CSS class

### Enhancing Personalization

1. Add new fields to the user preferences in `PersonalizationContext.tsx`
2. Update the `usePersonalizationEngine.ts` hook to handle the new preferences
3. Modify UI components to adapt based on the new preferences
4. Update the OpenAI prompts in `useOpenAIConversation.ts` to incorporate the new data

### Adding New API Endpoints

1. Create a new file in the `pages/api` directory
2. Implement the API handler function
3. Add the endpoint to the API client in `services/api.ts`
4. Create a custom hook to use the new API functionality
