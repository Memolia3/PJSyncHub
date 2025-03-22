import "../globals.css";

import type { Metadata } from "next";

import { SITE_NAME } from "@/constants/meta";
import { getTranslations, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

/**
 * メタデータを動的に生成
 * en.json, ja.jsonのLocaleLayoutに対応
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LocaleLayout");
  return {
    title: `${SITE_NAME} | ${t("meta.title")}`,
    description: t("meta.description"),
  };
}

/**
 * ブラウザの言語設定を反映する
 * en.json, ja.jsonのLocaleLayoutに対応
 * @param params ブラウザの言語設定
 * @returns htmlタグのlang属性にlocaleを設定する
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // ブラウザの言語設定を取得
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
