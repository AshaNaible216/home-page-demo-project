# Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  Naible Conversation-First Homepage             │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                      │
├─────────────┬─────────────┬────────────────┬────────────────────┤
│             │             │                │                    │
│ BlankCanvas │ Conversation│ SiteAssembly   │ PersonalizedHero   │
│ Component   │ Prompt      │ Animation      │ Component          │
│             │ Component   │ Component      │                    │
│             │             │                │                    │
└─────────────┴─────────────┴────────────────┴────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Application Layer                         │
├─────────────┬─────────────┬────────────────┬────────────────────┤
│             │             │                │                    │
│ Auth        │ Personali-  │ Accessibility  │ Theme              │
│ Context     │ zation      │ Provider       │ Manager            │
│             │ Context     │                │                    │
│             │             │                │                    │
└─────────────┴─────────────┴────────────────┴────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Service Layer                             │
├─────────────┬─────────────┬────────────────┬────────────────────┤
│             │             │                │                    │
│ OpenAI      │ Personali-  │ API            │ Data Privacy       │
│ Integration │ zation      │ Services       │ Manager            │
│             │ Engine      │                │                    │
│             │             │                │                    │
└─────────────┴─────────────┴────────────────┴────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer                                 │
├─────────────┬─────────────┬────────────────┬────────────────────┤
│             │             │                │                    │
│ User        │ Personali-  │ Conversation   │ Audio              │
│ API         │ zation      │ API            │ Processing API     │
│             │ API         │                │                    │
│             │             │                │                    │
└─────────────┴─────────────┴────────────────┴────────────────────┘
```

# Component Interaction Flow

```
┌──────────────┐     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│              │     │               │     │               │     │               │
│  BlankCanvas │────▶│ Conversation  │────▶│ SiteAssembly  │────▶│ Personalized  │
│  Component   │     │ Prompt        │     │ Animation     │     │ Hero          │
│              │     │               │     │               │     │               │
└──────────────┘     └───────┬───────┘     └───────────────┘     └───────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │               │
                     │ OpenAI        │
                     │ Integration   │
                     │               │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │               │
                     │ Personali-    │
                     │ zation Engine │
                     │               │
                     └───────────────┘
```

# User Journey Map

```
┌──────────────┐     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ Initial      │     │ Conversation  │     │ Site          │     │ Personalized  │
│ Interaction  │     │ Flow          │     │ Assembly      │     │ Experience    │
└──────┬───────┘     └───────┬───────┘     └───────┬───────┘     └───────┬───────┘
       │                     │                     │                     │
       ▼                     ▼                     ▼                     ▼
┌──────────────┐     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ User sees    │     │ User answers  │     │ User watches  │     │ User views    │
│ blinking     │     │ questions     │     │ site being    │     │ personalized  │
│ cursor       │     │ about:        │     │ built based   │     │ content with: │
│              │     │ - Goals       │     │ on their      │     │ - Custom      │
│ User clicks  │     │ - Color       │     │ preferences   │     │   headline    │
│ or presses   │     │   preference  │     │               │     │ - Tailored    │
│ any key      │     │ - Values      │     │ Progress bar  │     │   subheading  │
│              │     │               │     │ shows         │     │ - Personalized│
│              │     │ Can use text  │     │ completion    │     │   CTA         │
│              │     │ or voice      │     │ percentage    │     │ - Color scheme│
│              │     │ input         │     │               │     │   matching    │
│              │     │               │     │               │     │   preference  │
└──────────────┘     └───────────────┘     └───────────────┘     └───────────────┘
```

# Technology Stack Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  Frontend Technologies                          │
│                                                                 │
├─────────────┬─────────────┬────────────────┬────────────────────┤
│             │             │                │                    │
│ Next.js     │ React       │ TypeScript     │ TailwindCSS        │
│             │             │                │                    │
└─────────────┴─────────────┴────────────────┴────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  UI Enhancement Technologies                    │
│                                                                 │
├─────────────┬─────────────┬────────────────┬────────────────────┤
│             │             │                │                    │
│ Framer      │ Glassmor-   │ Responsive     │ Accessibility      │
│ Motion      │ phism CSS   │ Design         │ Features           │
│             │             │                │                    │
└─────────────┴─────────────┴────────────────┴────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  AI and Integration Technologies                │
│                                                                 │
├─────────────┬─────────────┬────────────────┬────────────────────┤
│             │             │                │                    │
│ OpenAI      │ OpenAI      │ Context API    │ Local Storage      │
│ GPT-4.1     │ Whisper     │ for State      │ for Data           │
│             │             │                │ Persistence        │
└─────────────┴─────────────┴────────────────┴────────────────────┘
```

# Installation and Setup Guide

## Prerequisites

Before installing the Naible Conversation-First Homepage, ensure you have the following:

- Node.js (version 16.x or higher)
- npm (version 7.x or higher)
- An OpenAI API key with access to GPT-4.1 and Whisper models

## Step-by-Step Installation

1. **Clone the Repository**

```bash
git clone https://github.com/your-organization/naible-homepage.git
cd naible-homepage
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the root directory with the following content:

```
NEXT_PUBLIC_OPENAI_API_KEY=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
```

4. **Development Mode**

To run the application in development mode:

```bash
npm run dev
```

This will start the development server at http://localhost:3000

5. **Production Build**

To create a production build:

```bash
npm run build
```

6. **Export Static Site**

To export the application as a static site:

```bash
npm run export
```

This will generate a static version of the site in the `out` directory.

7. **Serve Static Site**

To serve the static site locally:

```bash
npx serve out
```

This will serve the static site at http://localhost:3000

## Deployment

The application is designed to be deployed as a static site to any hosting service that supports static websites. Here are the steps for deployment:

1. Build and export the static site as described above
2. Upload the contents of the `out` directory to your hosting service
3. Ensure your hosting service is configured to serve static files
4. Set up any required environment variables on your hosting service

## Maintenance

### Regular Updates

To keep the application up-to-date:

1. Pull the latest changes from the repository
2. Install any new dependencies
3. Rebuild and redeploy the application

### API Key Rotation

For security, rotate the OpenAI API key periodically:

1. Generate a new API key from the OpenAI dashboard
2. Update the `.env` file with the new key
3. Rebuild and redeploy the application

# Quick Start Guide

## For Users

1. Visit the homepage at https://3000-i70lmkh1783h24i1uq7m2-bb2c6770.manus.computer
2. Click anywhere on the screen or press any key to begin
3. Answer the questions about your goals, color preferences, and values
4. Watch as your personalized site is assembled
5. Explore your personalized homepage with content tailored to your preferences

## For Developers

1. Clone the repository and install dependencies
2. Set up your OpenAI API key in the `.env` file
3. Run the development server with `npm run dev`
4. Explore the code structure in the `src` directory
5. Make changes to components in the `src/components` directory
6. Test your changes in the browser
7. Build and export the site for deployment

# Troubleshooting Common Issues

## OpenAI API Issues

**Issue**: Error messages related to OpenAI API calls

**Solution**:
- Verify your API key is correct in the `.env` file
- Check if you've exceeded your API rate limits
- Ensure you have access to the required models (GPT-4.1, Whisper)

## Build Errors

**Issue**: Errors during the build process

**Solution**:
- Clear the `.next` directory and node_modules folder
- Reinstall dependencies with `npm install`
- Check for TypeScript errors with `npm run type-check`
- Verify all required environment variables are set

## Styling Issues

**Issue**: UI elements don't appear as expected

**Solution**:
- Ensure TailwindCSS is properly configured
- Check for CSS conflicts in your custom styles
- Verify browser compatibility for CSS features like backdrop-filter
- Test in different browsers to identify browser-specific issues
