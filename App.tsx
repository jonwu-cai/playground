import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { SpotifyAuth } from './components/SpotifyAuth';
import { PlaylistList } from './components/PlaylistList';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SpotifyUser } from './types/spotify';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleAuthSuccess = (spotifyUser: SpotifyUser, token: string) => {
    setUser(spotifyUser);
    setAccessToken(token);
    setIsAuthenticated(true);
  };

  const handleAuthError = (error: string) => {
    console.error('Authentication error:', error);
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        {isAuthenticated && user && accessToken ? (
          <PlaylistList user={user} accessToken={accessToken} />
        ) : (
          <SpotifyAuth 
            onAuthSuccess={handleAuthSuccess}
            onAuthError={handleAuthError}
          />
        )}
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
