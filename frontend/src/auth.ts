import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

import type { Session } from "next-auth";
import { authQueries } from "@/graphql";
import { OAUTH_PROVIDER } from "@/constants";
import { fetchMutation } from "@/graphql/utils/client.util";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
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
          // OAuth認証実行
          const { data } = await fetchMutation(authQueries.oauthAuthenticate, {
            input: {
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
            },
          });

          // 認証成功時のセッション情報を更新
          if (data?.oauthAuthenticate) {
            Object.assign(user, {
              id: data.oauthAuthenticate.user.id,
              name: data.oauthAuthenticate.user.name,
              email: data.oauthAuthenticate.user.email,
              avatarUrl: data.oauthAuthenticate.user.avatarUrl,
              accessToken: data.oauthAuthenticate.tokens.accessToken,
              refreshToken: data.oauthAuthenticate.tokens.refreshToken,
              expiresAt: data.oauthAuthenticate.tokens.expiresAt,
            });
          } else {
            throw new Error("OAuth認証に失敗しました");
          }
        } catch (error) {
          // エラーメッセージをコンテナに出力
          console.error("OAuth認証に失敗 : ", error);
          // 認証失敗時は元のページに戻る
          if (typeof window !== "undefined") {
            const returnUrl = new URL(window.location.href).searchParams.get(
              "callbackUrl"
            );
            if (returnUrl) window.location.href = returnUrl;
          }
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
    // JWTトークンの更新
    async jwt({ token, user, account }) {
      // 初回サインイン時
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresAt: user.expiresAt,
        };
      }

      // トークンの有効期限チェック
      if (Date.now() < Number(token.expiresAt) * 1000) {
        return token;
      }

      // トークンの更新
      try {
        const { data } = await fetchMutation(authQueries.refreshToken, {
          refreshToken: token.refreshToken,
        });

        // トークンの更新成功時
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
        // トークンの更新失敗時
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }

      return token;
    },
    // セッション情報の更新
    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? undefined,
          name: token.name ?? undefined,
          email: token.email ?? undefined,
          avatarUrl: token.picture ?? undefined,
        },
        // APIリクエスト用のトークン情報を追加
        accessToken: token.accessToken as string | undefined,
        refreshToken: token.refreshToken as string | undefined,
        expiresAt: token.expiresAt as number | undefined,
        error: token.error as "RefreshAccessTokenError" | undefined,
      };
    },
  },
});
