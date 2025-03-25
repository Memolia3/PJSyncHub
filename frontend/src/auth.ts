import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

import type { Session } from "next-auth";
import { authQueries } from "@/graphql";
import { OAUTH_PROVIDER } from "@/constants";

const fetchGraphQL = async (query: string, variables: any) => {
  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }
  return json;
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  events: {
    async signIn({ user, account }) {
      if (
        account?.provider === OAUTH_PROVIDER.GOOGLE ||
        account?.provider === OAUTH_PROVIDER.GITHUB
      ) {
        try {
          const { data } = await fetchGraphQL(authQueries.getUser, {
            email: user.email,
          });

          if (data?.userByEmail) {
            Object.assign(user, {
              id: data.userByEmail.id,
              name: data.userByEmail.name,
              email: data.userByEmail.email,
              avatarUrl: data.userByEmail.avatarUrl,
            });
          } else {
            const createUserResponse = await fetchGraphQL(
              authQueries.createUser,
              {
                input: {
                  email: user.email,
                  name: user.name,
                  password: "",
                  avatarUrl: user.image,
                },
              }
            );

            if (createUserResponse.data?.createUser) {
              Object.assign(user, {
                id: createUserResponse.data.createUser.id,
                name: createUserResponse.data.createUser.name,
                email: createUserResponse.data.createUser.email,
                avatarUrl: createUserResponse.data.createUser.avatarUrl,
              });
            } else {
              console.error("Failed to create user:", createUserResponse);
              throw new Error("User creation failed");
            }
          }
        } catch (error) {
          console.error("Failed to handle user:", error);
        }
      }
    },
    async signOut() {
      if (typeof window !== "undefined") {
        window.sessionStorage.clear();
        window.localStorage.clear();
      }
    },
  },
  callbacks: {
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
      };
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },
  },
});
