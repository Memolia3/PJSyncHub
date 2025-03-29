import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { refreshToken } from "@/lib/actions/auth";
import { LOGIN_NAVIGATE } from "@/constants";

// next-intlのミドルウェア
const intlMiddleware = createMiddleware(routing);

// スタートページかチェック
const isStartPage = (pathname: string) => {
  return pathname === "/" || pathname === "/en" || pathname === "/ja";
};

// 認証が必要なパスかチェック
const isProtectedRoute = (pathname: string) => {
  return LOGIN_NAVIGATE.some(
    ({ href }) =>
      pathname === href ||
      pathname.startsWith(`/en${href}`) ||
      pathname.startsWith(`/ja${href}`)
  );
};

// 認証ページかチェック
const isAuthPage = (pathname: string) => {
  return (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/en/auth") ||
    pathname.startsWith("/ja/auth")
  );
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname.startsWith("/en") ? "en" : "ja";

  // セッションチェック
  const session = await auth();

  // 保護されたルートの場合
  if (isProtectedRoute(pathname)) {
    // セッションまたはアクセストークンが存在しない場合はログインページにリダイレクト
    if (!session || !session.accessToken) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }

    // トークンエラーがある場合はログアウト
    if (session.error === "RefreshAccessTokenError") {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }

    // アクセストークンの有効期限チェック
    if (Number(session.expiresAt) * 1000 < Date.now()) {
      const success = await refreshToken();
      if (!success) {
        return NextResponse.redirect(
          new URL(`/${locale}/auth/login`, request.url)
        );
      }
    }
  }

  // 認証ページまたはスタートページの場合で、ログイン済み(セッション+アクセストークンが存在する場合)
  if (
    (isStartPage(pathname) || isAuthPage(pathname)) &&
    session &&
    session.accessToken
  ) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // 最後にi18nミドルウェアを実行 - 言語に合わせてパスを返す
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|ja)/:path*"],
};
