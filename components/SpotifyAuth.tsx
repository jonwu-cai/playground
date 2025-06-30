import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SpotifyAuthService } from '../services/spotifyAuth';
import { SpotifyApiService } from '../services/spotifyApi';
import { SpotifyUser } from '../types/spotify';
import { LoadingSpinner } from './LoadingSpinner';

interface SpotifyAuthProps {
  onAuthSuccess: (user: SpotifyUser, token: string) => void;
  onAuthError: (error: string) => void;
}

export const SpotifyAuth: React.FC<SpotifyAuthProps> = ({ onAuthSuccess, onAuthError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const authService = SpotifyAuthService.getInstance();
  const apiService = SpotifyApiService.getInstance();

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      const tokenResponse = await authService.authenticate();
      
      if (!tokenResponse) {
        throw new Error('Authentication was cancelled or failed');
      }

      apiService.setAccessToken(tokenResponse.access_token);
      
      const user = await apiService.getCurrentUser();
      
      onAuthSuccess(user, tokenResponse.access_token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      console.error('Spotify authentication error:', errorMessage);
      onAuthError(errorMessage);
      
      Alert.alert(
        'Authentication Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Authenticating with Spotify..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🎵</Text>
        <Text style={styles.title}>Connect to Spotify</Text>
        <Text style={styles.subtitle}>
          Access your playlists and discover music
        </Text>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        accessibilityRole="button"
        accessibilityLabel="Login with Spotify"
        accessibilityHint="Authenticate with your Spotify account to access playlists"
      >
        <Text style={styles.loginButtonText}>Login with Spotify</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        We only access your public playlists and basic profile information.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 16,
  },
});