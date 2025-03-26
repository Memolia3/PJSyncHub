import { COMPONENT, SITE_NAME } from "@/constants";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

/**
 * ダッシュボードページのメタデータを動的に生成
 * en.json, ja.jsonのDashboardLayoutに対応
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(COMPONENT.LAYOUT.DASHBOARD);
  return {
    title: `${SITE_NAME} | ${t("meta.title")}`,
    description: t("meta.description"),
  };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
