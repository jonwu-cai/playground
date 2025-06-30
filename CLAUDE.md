# Claude Code Project Configuration

## Project Overview
Expo React Native project with TypeScript following Claude Code best practices.

## Development Commands
```bash
# Start development server
npm start

# Run on specific platforms
npm run android
npm run ios  
npm run web

# Type checking
npx tsc --noEmit

# Linting
npx expo lint
```

## Code Style Guidelines
- Use TypeScript for all components and utilities
- Follow React Native and Expo conventions
- Use functional components with hooks
- Keep components small and focused
- Use descriptive names for components and functions

## Testing Instructions
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Development Environment Setup
1. Install Node.js and npm
2. Install Expo CLI: `npm install -g @expo/cli`
3. Install dependencies: `npm install`
4. Start development server: `npm start`

## Project Structure
- `App.tsx` - Main application component
- `components/` - Reusable UI components
- `screens/` - Screen components
- `utils/` - Utility functions
- `types/` - TypeScript type definitions

## Notes
- This is an Expo managed workflow project
- Uses TypeScript for type safety
- Configured for iOS, Android, and web platforms
- Update this file as the project evolves