import { COMPONENT, SITE_NAME } from "@/constants";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

/**
 * 新規登録ページのメタデータを動的に生成
 * en.json, ja.jsonのSignupLayoutに対応
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(COMPONENT.LAYOUT.SIGNUP);
  return {
    title: `${SITE_NAME} | ${t("meta.title")}`,
    description: t("meta.description"),
  };
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
