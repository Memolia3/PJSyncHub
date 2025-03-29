/**
 * パスやナビゲーションのパスを取り扱う
 */

// インデックスページのナビゲーション
export const INDEX_NAVIGATE = [
  {
    href: "/features",
    label: "features",
  },
  {
    href: "/pricing",
    label: "pricing",
  },
];

// ログイン後のナビゲーション
export const LOGIN_NAVIGATE = [
  {
    href: "/dashboard",
    label: "dashboard",
  },
  {
    href: "/teams",
    label: "teams",
  },
  {
    href: "/projects",
    label: "projects",
  },
  {
    href: "/timelines",
    label: "timelines",
  },
];

// スタートページのパスパターン
export const START_PAGE_PATH = ["/", "/en", "/ja"];

// 認証ページのパスパターン
export const AUTH_PAGE_PATH = ["/auth", "/en/auth", "/ja/auth"];
