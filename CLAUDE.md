# Claude Code Project Configuration

## Project Overview
Expo React Native project with TypeScript following Claude Code best practices. Features Spotify Web API integration for playlist management.

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
- `App.tsx` - Main application component with Spotify integration
- `components/` - Reusable UI components
  - `SpotifyAuth.tsx` - Spotify authentication component
  - `PlaylistList.tsx` - Optimized FlatList for playlists
  - `PlaylistItem.tsx` - Individual playlist item component
  - `LoadingSpinner.tsx` - Loading state component
  - `ErrorBoundary.tsx` - Error handling component
- `services/` - API and authentication services
  - `spotifyAuth.ts` - OAuth 2.0 PKCE authentication service
  - `spotifyApi.ts` - Spotify Web API service
- `types/` - TypeScript type definitions
  - `spotify.ts` - Spotify API response types
- `constants/` - App constants
  - `spotify.ts` - Spotify configuration and endpoints

## Spotify Integration Features
- OAuth 2.0 authentication with PKCE flow
- Fetch and display user playlists
- Optimized FlatList with performance optimizations
- Comprehensive error handling and loading states
- Accessibility support
- Pull to refresh functionality

## Dependencies Added
- `expo-auth-session@~6.2.0` - OAuth authentication
- `expo-crypto@~14.1.5` - Cryptographic functions for PKCE
- `expo-image@~2.3.0` - Optimized image loading

## Setup Instructions

### Spotify Developer Configuration
1. Create a Spotify Developer App at https://developer.spotify.com/dashboard
2. Configure redirect URIs in your Spotify app settings:
   - **Development**: Copy the generated proxy URI from console logs (e.g., `https://auth.expo.io/@username/playground`)
   - **Production**: Add `playgroundapp://spotify-auth`
3. Update CLIENT_ID in `constants/spotify.ts` with your app's Client ID
4. Ensure your Spotify app has the required scopes enabled

### Environment-Specific Redirect URIs
The app automatically handles different redirect URIs based on environment:
- **Development (Expo Go)**: Uses Expo's auth proxy service
- **Production (Standalone)**: Uses custom scheme `playgroundapp://spotify-auth`

### Testing Authentication
1. **Development**: Run `npm start` and check console logs for the generated proxy URI
2. **Production**: Build standalone app and test authentication flow
3. Update Spotify Developer Dashboard with the correct URIs for each environment

## Notes
- This is an Expo managed workflow project
- Uses TypeScript for type safety
- Configured for iOS, Android, and web platforms
- Implements React Native performance best practices
- Update this file as the project evolves