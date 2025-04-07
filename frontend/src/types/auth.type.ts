export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  name: string;
  password: string;
}

export interface OAuthResponse {
  oauthAuthenticate?: {
    user: {
      id: string;
      name: string;
      email: string;
      avatarUrl?: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    };
  };
}

export interface RefreshTokenResponse {
  refreshToken?: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}
