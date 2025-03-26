export const authQueries = {
  oauthAuthenticate: `
    mutation OAuthAuthenticate($input: OAuthAuthenticateInput!) {
      oauthAuthenticate(input: $input) {
        tokens {
          accessToken
          refreshToken
          expiresAt
        }
        user {
          id
          name
          email
          avatarUrl
        }
      }
    }
  `,

  refreshToken: `
    mutation RefreshToken($refreshToken: String!) {
      refreshToken(refreshToken: $refreshToken) {
        accessToken
        refreshToken
        expiresAt
      }
    }
  `,
};
