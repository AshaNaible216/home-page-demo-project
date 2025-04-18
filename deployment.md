# Deployment Configuration for Naible Homepage

This document outlines the deployment configuration for the Naible conversation-first homepage experience.

## Static Export Configuration

The application is configured for static export using Next.js's export feature. This allows the application to be deployed to any static hosting service without requiring a Node.js server.

Key configuration in `next.config.js`:
```javascript
output: 'export',
experimental: {
  appDir: false,
}
```

## Environment Variables

The following environment variables need to be set in the production environment:

- `NEXT_PUBLIC_API_URL`: The URL of the API server (if using a separate backend)
- `OPENAI_API_KEY`: The OpenAI API key for conversation processing

## Build Process

The build process is automated through the `deploy.sh` script, which:

1. Installs dependencies if needed
2. Creates a production build using Next.js
3. Verifies the build was successful
4. Provides instructions for deploying to a static hosting service

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended hosting platform for Next.js applications:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Vercel will automatically build and deploy your application

### Option 2: Netlify

Netlify is another excellent option for static site hosting:

1. Connect your GitHub repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `out`
4. Configure environment variables in the Netlify dashboard

### Option 3: GitHub Pages

For a simple deployment option:

1. Run the build script locally: `./deploy.sh`
2. Push the contents of the `out` directory to the `gh-pages` branch
3. Configure GitHub Pages to serve from the `gh-pages` branch

### Option 4: AWS S3 + CloudFront

For a scalable, production-ready deployment:

1. Create an S3 bucket configured for static website hosting
2. Set up CloudFront for CDN capabilities
3. Upload the contents of the `out` directory to the S3 bucket
4. Configure CloudFront to serve from the S3 bucket

## Custom Domain Configuration

To use a custom domain:

1. Purchase a domain from a domain registrar
2. Configure DNS settings to point to your hosting provider
3. Set up SSL/TLS certificates for HTTPS

## Performance Optimization

The following performance optimizations are enabled:

- Code minification with SWC: `swcMinify: true`
- Static image optimization
- CSS optimization with Tailwind's purge feature

## Monitoring and Analytics

Consider adding the following for production monitoring:

- Google Analytics or Plausible for user analytics
- Sentry for error tracking
- Uptime monitoring with Pingdom or UptimeRobot
