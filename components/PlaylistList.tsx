import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import { SpotifyApiService } from '../services/spotifyApi';
import { SpotifyPlaylist, SpotifyUser } from '../types/spotify';
import { PlaylistItem } from './PlaylistItem';
import { LoadingSpinner } from './LoadingSpinner';

interface PlaylistListProps {
  user: SpotifyUser;
  accessToken: string;
}

const { height } = Dimensions.get('window');
const ITEM_HEIGHT = 112;

export const PlaylistList: React.FC<PlaylistListProps> = ({ user, accessToken }) => {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiService = SpotifyApiService.getInstance();

  const fetchPlaylists = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      apiService.setAccessToken(accessToken);
      
      const playlistsData = await apiService.getAllUserPlaylists();
      setPlaylists(playlistsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch playlists';
      setError(errorMessage);
      console.error('Error fetching playlists:', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessToken, apiService]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleRefresh = useCallback(() => {
    fetchPlaylists(true);
  }, [fetchPlaylists]);

  const handlePlaylistPress = useCallback((playlist: SpotifyPlaylist) => {
    console.log('Playlist selected:', playlist.name);
  }, []);

  const renderPlaylistItem = useCallback(({ item }: { item: SpotifyPlaylist }) => (
    <PlaylistItem
      playlist={item}
      onPress={handlePlaylistPress}
    />
  ), [handlePlaylistPress]);

  const keyExtractor = useCallback((item: SpotifyPlaylist) => item.id, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const renderEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No playlists found</Text>
      <Text style={styles.emptySubtext}>
        Create some playlists in Spotify to see them here!
      </Text>
    </View>
  ), []);

  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>Welcome back, {user.display_name}!</Text>
      <Text style={styles.playlistCount}>
        {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
      </Text>
    </View>
  ), [user.display_name, playlists.length]);

  if (loading) {
    return <LoadingSpinner message="Loading your playlists..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load playlists</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={playlists}
        renderItem={renderPlaylistItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        getItemLayout={getItemLayout}
        initialNumToRender={Math.ceil(height / ITEM_HEIGHT)}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1DB954']}
            tintColor="#1DB954"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Spotify playlists list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    paddingVertical: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 4,
  },
  playlistCount: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});