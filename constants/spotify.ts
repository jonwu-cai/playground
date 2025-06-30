export const SPOTIFY_CONFIG = {
  CLIENT_ID: '5c36f777789f425dafd7e5dff4e09fb0', // Replace with actual Spotify Client ID
  // Note: Redirect URI is now dynamically generated in SpotifyAuthService
  // Development: Uses Expo proxy (e.g., https://auth.expo.io/@username/slug)
  // Production: Uses custom scheme (playgroundapp://spotify-auth)
  SCOPES: [
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-private',
    'user-read-email'
  ],
  API_BASE_URL: 'https://api.spotify.com/v1',
  AUTH_BASE_URL: 'https://accounts.spotify.com'
};

export const SPOTIFY_ENDPOINTS = {
  TOKEN: '/api/token',
  USER_PROFILE: '/me',
  USER_PLAYLISTS: '/me/playlists',
  PLAYLIST_TRACKS: (playlistId: string) => `/playlists/${playlistId}/tracks`
};