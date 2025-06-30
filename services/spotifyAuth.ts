import { AuthRequest, AuthRequestConfig, exchangeCodeAsync, makeRedirectUri, AuthRequestPromptOptions } from 'expo-auth-session';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { SPOTIFY_CONFIG } from '../constants/spotify';
import { SpotifyTokenResponse } from '../types/spotify';

export class SpotifyAuthService {
  private static instance: SpotifyAuthService;
  private authRequest: AuthRequest | null = null;
  private codeVerifier: string | null = null;

  private constructor() {}

  public static getInstance(): SpotifyAuthService {
    if (!SpotifyAuthService.instance) {
      SpotifyAuthService.instance = new SpotifyAuthService();
    }
    return SpotifyAuthService.instance;
  }

  public async createAuthRequest(): Promise<AuthRequest> {
    const codeChallenge = await this.generateCodeChallenge();
    
    // Environment-aware redirect URI configuration
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
    
    const config: AuthRequestConfig = {
      responseType: AuthSession.ResponseType.Code,
      clientId: SPOTIFY_CONFIG.CLIENT_ID,
      scopes: SPOTIFY_CONFIG.SCOPES,
      usePKCE: true,
      codeChallenge,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
      redirectUri,
      extraParams: {
        show_dialog: 'true'
      }
    };

    this.authRequest = new AuthRequest(config);
    return this.authRequest;
  }

  public async authenticate(): Promise<SpotifyTokenResponse | null> {
    try {
      if (!this.authRequest) {
        await this.createAuthRequest();
      }

      if (!this.authRequest) {
        throw new Error('Failed to create auth request');
      }

      const result = await this.authRequest.promptAsync({
        authorizationEndpoint: `${SPOTIFY_CONFIG.AUTH_BASE_URL}/authorize`
      });

      if (result.type === 'success' && result.params.code) {
        return await this.exchangeCodeForTokens(result.params.code);
      }

      return null;
    } catch (error) {
      console.error('Spotify authentication error:', error);
      throw error;
    }
  }

  private async exchangeCodeForTokens(code: string): Promise<SpotifyTokenResponse> {
    if (!this.codeVerifier) {
      throw new Error('Code verifier not found');
    }

    const tokenResult = await exchangeCodeAsync(
      {
        clientId: SPOTIFY_CONFIG.CLIENT_ID,
        code,
        redirectUri: makeRedirectUri({
          scheme: 'exp',
          path: 'spotify-auth'
        }),
        extraParams: {
          code_verifier: this.codeVerifier
        }
      },
      {
        tokenEndpoint: `${SPOTIFY_CONFIG.AUTH_BASE_URL}/api/token`
      }
    );

    return {
      access_token: tokenResult.accessToken,
      token_type: tokenResult.tokenType || 'Bearer',
      expires_in: tokenResult.expiresIn || 3600,
      refresh_token: tokenResult.refreshToken,
      scope: tokenResult.scope || SPOTIFY_CONFIG.SCOPES.join(' ')
    };
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