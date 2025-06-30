import { AuthRequest, AuthRequestConfig, exchangeCodeAsync, makeRedirectUri, AuthRequestPromptOptions } from 'expo-auth-session';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { SPOTIFY_CONFIG } from '../constants/spotify';
import { SpotifyTokenResponse } from '../types/spotify';

export class SpotifyAuthService {
  private static instance: SpotifyAuthService;
  private authRequest: AuthRequest | null = null;
  private codeVerifier: string | null = null;
  private redirectUri: string | null = null;

  private constructor() {}

  public static getInstance(): SpotifyAuthService {
    if (!SpotifyAuthService.instance) {
      SpotifyAuthService.instance = new SpotifyAuthService();
    }
    return SpotifyAuthService.instance;
  }

  private generateRedirectUri(): string {
    const redirectUri = __DEV__ 
      ? makeRedirectUri({})  // Uses proxy by default in development
      : makeRedirectUri({
          scheme: 'playgroundapp',
          path: 'spotify-auth'
        });
    
    console.log('🔍 DEBUG: Generated redirect URI:', redirectUri);
    console.log('🔍 DEBUG: Environment __DEV__:', __DEV__);
    console.log('🔍 DEBUG: Using proxy:', __DEV__);
    console.log('🔍 DEBUG: Custom scheme:', __DEV__ ? 'none (proxy)' : 'playgroundapp');
    
    return redirectUri;
  }

  public async createAuthRequest(): Promise<AuthRequest> {
    const codeChallenge = await this.generateCodeChallenge();
    
    // Generate and store redirect URI for consistent usage
    this.redirectUri = this.generateRedirectUri();
    
    const config: AuthRequestConfig = {
      responseType: AuthSession.ResponseType.Code,
      clientId: SPOTIFY_CONFIG.CLIENT_ID,
      scopes: SPOTIFY_CONFIG.SCOPES,
      usePKCE: true,
      codeChallenge,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      redirectUri: this.redirectUri,
      extraParams: {
        show_dialog: 'true'
      }
    };

    this.authRequest = new AuthRequest(config);
    return this.authRequest;
  }

  public async authenticate(): Promise<SpotifyTokenResponse | null> {
    try {
      console.log('🚀 Starting Spotify authentication flow');
      
      if (!this.authRequest) {
        await this.createAuthRequest();
      }

      if (!this.authRequest) {
        throw new Error('Failed to create auth request');
      }

      console.log('🔍 DEBUG: Authorization request redirect URI:', this.redirectUri);

      const result = await this.authRequest.promptAsync({
        authorizationEndpoint: `${SPOTIFY_CONFIG.AUTH_BASE_URL}/authorize`
      });

      console.log('🔍 DEBUG: Auth result type:', result.type);
      
      if (result.type === 'success') {
        console.log('🔍 DEBUG: Auth result params:', result.params);
        if (result.params.code) {
          console.log('✅ Authorization successful, exchanging code for tokens');
          return await this.exchangeCodeForTokens(result.params.code);
        }
      }

      if (result.type === 'error') {
        console.error('🚨 Authorization error:', result.params);
      }
      
      console.log('🔍 DEBUG: Auth result (non-success):', result);

      return null;
    } catch (error) {
      console.error('🚨 Spotify authentication error:', error);
      throw error;
    }
  }

  private async exchangeCodeForTokens(code: string): Promise<SpotifyTokenResponse> {
    if (!this.codeVerifier) {
      throw new Error('Code verifier not found');
    }

    if (!this.redirectUri) {
      throw new Error('Redirect URI not found - must call createAuthRequest first');
    }

    console.log('🔍 DEBUG: Token exchange redirect URI:', this.redirectUri);
    console.log('🔍 DEBUG: Code verifier length:', this.codeVerifier.length);

    try {
      const tokenResult = await exchangeCodeAsync(
        {
          clientId: SPOTIFY_CONFIG.CLIENT_ID,
          code,
          redirectUri: this.redirectUri,
          extraParams: {
            code_verifier: this.codeVerifier
          }
        },
        {
          tokenEndpoint: `${SPOTIFY_CONFIG.AUTH_BASE_URL}/api/token`
        }
      );

      console.log('✅ Token exchange successful');
      console.log('🔍 DEBUG: Access token received:', tokenResult.accessToken ? 'Yes' : 'No');

      return {
        access_token: tokenResult.accessToken,
        token_type: tokenResult.tokenType || 'Bearer',
        expires_in: tokenResult.expiresIn || 3600,
        refresh_token: tokenResult.refreshToken,
        scope: tokenResult.scope || SPOTIFY_CONFIG.SCOPES.join(' ')
      };
    } catch (error) {
      console.error('🚨 Token exchange failed:', error);
      console.error('🔍 DEBUG: Used redirect URI:', this.redirectUri);
      console.error('🔍 DEBUG: Client ID:', SPOTIFY_CONFIG.CLIENT_ID);
      throw error;
    }
  }

  private async generateCodeChallenge(): Promise<string> {
    this.codeVerifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const codeChallenge = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      this.codeVerifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );
    return codeChallenge.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  public async refreshAccessToken(refreshToken: string): Promise<SpotifyTokenResponse> {
    try {
      const response = await fetch(`${SPOTIFY_CONFIG.AUTH_BASE_URL}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: SPOTIFY_CONFIG.CLIENT_ID,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
}