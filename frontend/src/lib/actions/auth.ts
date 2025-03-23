"use server";

import { signIn, signOut } from "@/auth";
import { headers } from "next/headers";

export const signInWithGoogle = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.startsWith("/en") ? "en" : "ja";

  await signIn("google", {
    redirectTo: `/${locale}/dashboard`,
  });
};

export const signInWithGithub = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.startsWith("/en") ? "en" : "ja";

  await signIn("github", {
    redirectTo: `/${locale}/dashboard`,
  });
};

export const handleSignOut = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.startsWith("/en") ? "en" : "ja";

  await signOut({
    redirectTo: `/${locale}`,
  });
};
