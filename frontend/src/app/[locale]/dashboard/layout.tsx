import { COMPONENT } from "@/constants";
import { generateCommonMetadata } from "@/utils";
import type { Metadata } from "next";

/**
 * ダッシュボードページのメタデータを動的に生成
 * en.json, ja.jsonのDashboardLayoutに対応
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata(COMPONENT.LAYOUT.DASHBOARD);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
