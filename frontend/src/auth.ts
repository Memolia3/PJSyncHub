import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

import type { Session } from "next-auth";
import { authQueries } from "@/graphql";
import { OAUTH_PROVIDER } from "@/constants";
import { fetchMutation } from "@/graphql/utils/client.util";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error("認証情報が必要です");
          }

          const { data, errors } = await fetchMutation(authQueries.login, {
            input: {
              email: credentials.email,
              password: credentials.password,
            },
          });

          if (errors) {
            // GraphQLのエラーメッセージをそのまま返す
            throw new Error(errors[0]?.message || "認証に失敗しました");
          }

          if (!data?.login) {
            throw new Error("ログインに失敗しました");
          }

          const { user, tokens } = data.login;
          if (!user || !tokens) {
            throw new Error("サーバーからの応答が不正です");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.expiresAt,
          };
        } catch (error) {
          // エラーメッセージを上位に伝播
          throw error;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 14 * 24 * 60 * 60, // 14 days
  },
  events: {
    // サインイン時
    async signIn({ user, account }) {
      if (
        account?.provider === OAUTH_PROVIDER.GOOGLE ||
        account?.provider === OAUTH_PROVIDER.GITHUB
      ) {
        try {
          const { data } = await fetchMutation(authQueries.oauthAuthenticate, {
            input: {
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
            },
          });

          if (!data?.oauthAuthenticate) {
            throw new Error("OAuth認証に失敗しました");
          }

          // userオブジェクトを更新
          Object.assign(user, {
            id: data.oauthAuthenticate.user.id,
            accessToken: data.oauthAuthenticate.tokens.accessToken,
            refreshToken: data.oauthAuthenticate.tokens.refreshToken,
            expiresAt: data.oauthAuthenticate.tokens.expiresAt,
            avatarUrl: data.oauthAuthenticate.user.avatarUrl,
          });
        } catch (error) {
          console.error("OAuth認証に失敗:", error);
        }
      }
    },
    // サインアウト時
    async signOut() {
      // クライアントサイドの情報をクリア
      if (typeof window !== "undefined") {
        window.sessionStorage.clear();
        window.localStorage.clear();
      }
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // 初回サインイン時またはユーザー情報更新時
      if (account && user) {
        try {
          const { data } = await fetchMutation(authQueries.oauthAuthenticate, {
            input: {
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
            },
          });

          if (!data?.oauthAuthenticate) {
            throw new Error("OAuth認証に失敗しました");
          }

          // トークン情報を更新
          return {
            ...token,
            id: data.oauthAuthenticate.user.id,
            accessToken: data.oauthAuthenticate.tokens.accessToken,
            refreshToken: data.oauthAuthenticate.tokens.refreshToken,
            expiresAt: data.oauthAuthenticate.tokens.expiresAt,
            avatarUrl: data.oauthAuthenticate.user.avatarUrl,
          };
        } catch (error) {
          console.error("OAuth認証に失敗:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      // トークンの有効期限チェック
      if (!token.expiresAt || Date.now() >= Number(token.expiresAt) * 1000) {
        if (!token.refreshToken) {
          return { ...token, error: "RefreshAccessTokenError" };
        }

        try {
          // リフレッシュトークンを使用して新しいアクセストークンを取得
          const { data } = await fetchMutation(authQueries.refreshToken, {
            refreshToken: token.refreshToken,
          });

          if (data?.refreshToken) {
            return {
              ...token,
              accessToken: data.refreshToken.accessToken,
              refreshToken: data.refreshToken.refreshToken,
              expiresAt: data.refreshToken.expiresAt,
              error: undefined,
            };
          }
        } catch (error) {
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },
    /**
     * セッション情報を更新
     * セッションベースでトークンを更新
     * @param session セッション情報
     * @param token トークン情報
     * @returns セッション情報
     */
    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id?.toString() ?? undefined,
          name: token.name ?? undefined,
          email: token.email ?? undefined,
          avatarUrl: token.picture ?? undefined,
        },
        accessToken: token.accessToken as string | undefined,
        refreshToken: token.refreshToken as string | undefined,
        expiresAt: token.expiresAt as number | undefined,
        error: token.error as "RefreshAccessTokenError" | undefined,
      };
    },
  },
});
