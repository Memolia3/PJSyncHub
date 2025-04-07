"use server";

import { signIn } from "@/auth";
import { fetchMutation } from "@/graphql";
import { authQueries } from "@/graphql";
import type { LoginCredentials, SignupCredentials } from "@/types";

// ログイン
export async function login(credentials: LoginCredentials) {
  try {
    const response = await fetchMutation(authQueries.login, {
      input: credentials,
    });

    if (response.errors) {
      const error = response.errors[0];
      if (error.extensions?.validationErrors) {
        return { validationErrors: error.extensions.validationErrors };
      }
      return { error: error.message };
    }

    // 認証成功時のみsignInを実行
    const result = await signIn("credentials", {
      ...credentials,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Authentication failed" };
    }

    return { success: true };
  } catch (error) {
    return { error: "Internal server error" };
  }
}

// アカウント作成と同時にログイン
export async function signup(credentials: SignupCredentials) {
  try {
    const { data, errors } = await fetchMutation(authQueries.signup, {
      input: {
        email: credentials.email,
        name: credentials.name,
        password: credentials.password,
      },
    });

    if (errors) {
      return { error: errors[0]?.message };
    }

    return await login(credentials);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Internal server error" };
  }
}
