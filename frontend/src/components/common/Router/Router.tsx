"use client";

import { Link } from "@/i18n/routing";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * ルーティング
 * i18nのLinkをラップしたコンポーネント
 * ※クライアントコンポーネント
 * 子コンポーネントはクライアントコンポーネントになる
 * @param href リンク先
 * @param className クラス名
 * @param children 子要素
 * @returns ルーティングコンポーネント
 */
export default function Router({ href, className, children }: Props) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
