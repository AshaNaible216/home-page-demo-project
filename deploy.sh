#!/bin/bash

# Build script for Naible conversation-first homepage experience
echo "Starting build process for Naible homepage..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Create production build
echo "Creating production build..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Build failed. Please check the errors above."
  exit 1
fi

# Create out directory if it doesn't exist
if [ ! -d "out" ]; then
  echo "Error: Build output directory not found."
  exit 1
fi

echo "Build completed successfully!"
echo "Static files are available in the 'out' directory."
echo "Ready for deployment to static hosting service."

# Instructions for deployment
echo ""
echo "=== Deployment Instructions ==="
echo "1. Upload the contents of the 'out' directory to your hosting service."
echo "2. Ensure your hosting service is configured to serve static files."
echo "3. Set up environment variables on your hosting service if needed."
echo ""
echo "For local preview, you can run: npx serve out"
