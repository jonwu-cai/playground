import { SPOTIFY_CONFIG, SPOTIFY_ENDPOINTS } from '../constants/spotify';
import { 
  SpotifyPlaylistsResponse, 
  SpotifyUser, 
  SpotifyError,
  SpotifyPlaylist 
} from '../types/spotify';

export class SpotifyApiService {
  private static instance: SpotifyApiService;
  private accessToken: string | null = null;

  private constructor() {}

  public static getInstance(): SpotifyApiService {
    if (!SpotifyApiService.instance) {
      SpotifyApiService.instance = new SpotifyApiService();
    }
    return SpotifyApiService.instance;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const url = `${SPOTIFY_CONFIG.API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          throw new Error(`Rate limited. Retry after ${retryAfter} seconds`);
        }
        
        const errorData: SpotifyError = await response.json();
        throw new Error(`Spotify API Error: ${errorData.error.message} (${errorData.error.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Spotify API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<SpotifyUser> {
    return this.makeRequest<SpotifyUser>(SPOTIFY_ENDPOINTS.USER_PROFILE);
  }

  public async getUserPlaylists(limit: number = 20, offset: number = 0): Promise<SpotifyPlaylistsResponse> {
    const endpoint = `${SPOTIFY_ENDPOINTS.USER_PLAYLISTS}?limit=${limit}&offset=${offset}`;
    return this.makeRequest<SpotifyPlaylistsResponse>(endpoint);
  }

  public async getAllUserPlaylists(): Promise<SpotifyPlaylist[]> {
    const allPlaylists: SpotifyPlaylist[] = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await this.getUserPlaylists(limit, offset);
        allPlaylists.push(...response.items);
        
        hasMore = response.next !== null;
        offset += limit;
        
        // Rate limiting protection
        if (hasMore) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Error fetching playlists batch:', error);
        throw error;
      }
    }

    return allPlaylists;
  }

  public async getPlaylistTracks(playlistId: string, limit: number = 50, offset: number = 0) {
    const endpoint = `${SPOTIFY_ENDPOINTS.PLAYLIST_TRACKS(playlistId)}?limit=${limit}&offset=${offset}`;
    return this.makeRequest(endpoint);
  }
}