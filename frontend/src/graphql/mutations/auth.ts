export const authQueries = {
  /**
   * OAuth認証
   * @param input OAuth認証情報
   * @returns トークンとユーザー情報
   */
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

  /**
   * トークンを更新
   * @param refreshToken リフレッシュトークン
   * @returns 新しいトークン
   */
  refreshToken: `
    mutation RefreshToken($refreshToken: String!) {
      refreshToken(refreshToken: $refreshToken) {
        accessToken
        refreshToken
        expiresAt
      }
    }
  `,

  /**
   * ログイン
   * @param input ログイン情報
   * @returns トークンとユーザー情報
   */
  login: `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
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

  signup: `
    mutation Signup($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
        avatarUrl
      }
    }
  `,
};
