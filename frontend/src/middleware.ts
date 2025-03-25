import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// next-intlのミドルウェア
const intlMiddleware = createMiddleware(routing);

// 認証が必要なパスかチェック
const isProtectedRoute = (pathname: string) => {
  const protectedPaths = ["/dashboard"];
  return protectedPaths.some(
    (path) =>
      pathname === path ||
      pathname.startsWith(`/en${path}`) ||
      pathname.startsWith(`/ja${path}`)
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

export default async function middleware(request: NextRequest) {
  // 先にセッションを確認
  const session = await auth();
  const pathname = request.nextUrl.pathname;
  const locale = pathname.startsWith("/en") ? "en" : "ja";

  // 認証ページの場合
  if (isAuthPage(pathname)) {
    if (session) {
      // 既にログインしている場合はダッシュボードへ
      return NextResponse.redirect(
        new URL(`/${locale}/dashboard`, request.url)
      );
    }
  }

  // 保護されたルートの場合
  if (isProtectedRoute(pathname)) {
    if (!session) {
      // 未認証の場合はログインページへ
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login`, request.url)
      );
    }
  }

  // 最後にi18nミドルウェアを実行
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|ja)/:path*"],
};
