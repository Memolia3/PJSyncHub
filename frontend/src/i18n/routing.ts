import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * ルーティング
 * 言語とデフォルトの言語を設定する
 * 言語は英語と日本語のみ
 * デフォルトの言語は英語
 */
export const routing = defineRouting({
  locales: ["en", "ja"],
  defaultLocale: "en",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
