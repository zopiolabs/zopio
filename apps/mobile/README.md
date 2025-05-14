# Zopio Mobile

This directory contains two separate mobile solutions

1. **PWA (Progressive Web App)** - A web-based mobile experience that can be installed on devices
2. **Native** - A fully native mobile app built with React Native

## PWA Solution

The PWA solution leverages Next.js and provides a mobile-optimized web experience that can be installed on devices through the browser. It offers:

- Offline capabilities
- Home screen installation
- Responsive design optimized for mobile devices
- Shared design system with the main Zopio web application

### Key Features

- Built with Next.js 15.3.0
- Uses next-pwa for service worker and manifest management
- Integrates with the Zopio design system
- Mobile-optimized UI/UX

### Development

To run the PWA locally:

```bash
cd apps/mobile/pwa
npm run dev
```

The app will be available at http://localhost:3006

## Native Solution

The Native solution is built with React Native and provides a fully native mobile experience for iOS and Android. It offers:

- Native performance and feel
- Access to device features (camera, notifications, etc.)
- Offline-first architecture
- Platform-specific UI elements

### Key Features

- Built with React Native 0.76.0
- Uses React Navigation for routing
- Custom UI components designed for mobile
- Authentication flows

### Development

To run the Native app:

```bash
cd apps/mobile/native

# For iOS
npm run ios

# For Android
npm run android
```

## Shared Code and Resources

While these are separate implementations, they share:

- Design tokens and brand identity
- Authentication logic
- API integration patterns
- Business logic

## When to Use Which Solution

- **PWA**: Ideal for quick deployment, broader reach, and when native device features aren't critical
- **Native**: Best for performance-critical applications, full device integration, and premium user experience

## Project Structure

```
mobile/
├── pwa/                  # Progressive Web App solution
│   ├── app/              # Next.js app directory
│   ├── components/       # Shared UI components
│   ├── public/           # Static assets and PWA manifest
│   └── ...               # Configuration files
│
└── native/               # React Native solution
    ├── src/              # Application source code
    │   ├── assets/       # Images, fonts, etc.
    │   ├── components/   # Reusable UI components
    │   ├── navigation/   # Navigation configuration
    │   └── screens/      # App screens
    └── ...               # Configuration files
```
