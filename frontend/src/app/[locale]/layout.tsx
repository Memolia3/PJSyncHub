import "../globals.css";

import type { Metadata } from "next";

import { Footer, Header } from "@/components/layouts";
import { COMPONENT } from "@/constants";
import { generateCommonMetadata } from "@/utils";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";

/**
 * メタデータを動的に生成
 * en.json, ja.jsonのLocaleLayoutに対応
 * @returns メタデータ
 */
export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata(COMPONENT.LAYOUT.LOCALE);
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
        <SessionProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
