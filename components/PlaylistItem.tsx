import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { SpotifyPlaylist } from '../types/spotify';

interface PlaylistItemProps {
  playlist: SpotifyPlaylist;
  onPress?: (playlist: SpotifyPlaylist) => void;
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist, onPress }) => {
  const handlePress = () => {
    onPress?.(playlist);
  };

  const getImageUrl = () => {
    if (playlist.images && playlist.images.length > 0) {
      return playlist.images[0].url;
    }
    return null;
  };

  const formatTrackCount = (count: number) => {
    return `${count} track${count !== 1 ? 's' : ''}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Playlist ${playlist.name} by ${playlist.owner.display_name}, ${formatTrackCount(playlist.tracks.total)}`}
      accessibilityHint="Tap to view playlist details"
    >
      <View style={styles.imageContainer}>
        <Image
          source={getImageUrl() ? { uri: getImageUrl() } : require('../assets/icon.png')}
          style={styles.image}
          placeholder={require('../assets/icon.png')}
          contentFit="cover"
          transition={200}
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {playlist.name}
        </Text>
        
        <Text style={styles.owner} numberOfLines={1} ellipsizeMode="tail">
          By {playlist.owner.display_name}
        </Text>
        
        {playlist.description && (
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {playlist.description}
          </Text>
        )}
        
        <View style={styles.statsContainer}>
          <Text style={styles.trackCount}>
            {formatTrackCount(playlist.tracks.total)}
          </Text>
          {playlist.public && (
            <View style={styles.publicBadge}>
              <Text style={styles.publicText}>Public</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    marginRight: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  owner: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackCount: {
    fontSize: 12,
    color: '#1DB954',
    fontWeight: '500',
  },
  publicBadge: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  publicText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
});