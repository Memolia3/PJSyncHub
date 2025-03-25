"use server";

import { signIn, signOut } from "@/auth";
import { headers } from "next/headers";
import { OAUTH_PROVIDER } from "@/constants";

/**
 * Google認証を行う
 * @returns 認証成功時にはリダイレクト先のパスを返す
 */
export const signInWithGoogle = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.startsWith("/en") ? "en" : "ja";

  await signIn(OAUTH_PROVIDER.GOOGLE, {
    redirectTo: `/${locale}/dashboard`,
  });
};

/**
 * Github認証を行う
 * @returns 認証成功時にはリダイレクト先のパスを返す
 */
export const signInWithGithub = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.startsWith("/en") ? "en" : "ja";

  await signIn(OAUTH_PROVIDER.GITHUB, {
    redirectTo: `/${locale}/dashboard`,
  });
};

/**
 * ログアウトを行う
 * @returns ログアウト成功時にはリダイレクト先のパスを返す
 */
export const handleSignOut = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.startsWith("/en") ? "en" : "ja";

  await signOut({
    redirectTo: `/${locale}`,
  });
};
