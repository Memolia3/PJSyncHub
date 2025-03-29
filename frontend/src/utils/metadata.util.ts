import { SITE_NAME } from "@/constants";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

/**
 * メタデータを生成する
 * @param namespace 翻訳のネームスペース
 * @returns メタデータ
 */
export async function generateCommonMetadata(
  namespace: string
): Promise<Metadata> {
  const t = await getTranslations(namespace);
  return {
    title: `${SITE_NAME} | ${t("meta.title")}`,
    description: t("meta.description"),
  };
}
