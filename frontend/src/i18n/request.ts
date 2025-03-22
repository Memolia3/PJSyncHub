import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * リクエスト設定
 * リクエストされた言語を取得し、メッセージを取得する
 * メッセージが取得できない場合は、デフォルトの言語(英語)を設定する
 * @param requestLocale リクエストされた言語
 * @returns リクエスト設定
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
