import Image from "next/image";
import styles from "./Header.module.scss";

import { handleSignOut } from "@/lib/actions/auth";
import { Router, Text, Button } from "@/components/common";
import { COMPONENT, SITE_NAME, INDEX_NAVIGATE } from "@/constants";

import { getTranslations } from "next-intl/server";

/**
 * ヘッダー
 * @returns ヘッダーコンポーネント
 */
export default async function Header() {
  const t = await getTranslations(COMPONENT.HEADER);
  const isLoggedIn = false; // ここで認証状態を確認

  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <div className={styles.header__left}>
          <Router href="/" className={styles.header__logo}>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className={styles.header__logo_image}
              priority
            />
            <Text variant="h1" className={styles.header__title}>
              {SITE_NAME}
            </Text>
          </Router>
          <nav className={styles.header__nav}>
            {isLoggedIn ? (
              // ログイン済みユーザー向けナビ
              <>
                {INDEX_NAVIGATE.map((navigate, index) => (
                  <Router
                    href={navigate.href}
                    className={styles.header__link}
                    key={index}
                  >
                    <Text>{t(navigate.label)}</Text>
                  </Router>
                ))}
              </>
            ) : (
              // 未ログインユーザー向けナビ
              <>
                {INDEX_NAVIGATE.map((navigate, index) => (
                  <Router
                    href={navigate.href}
                    className={styles.header__link}
                    key={index}
                  >
                    <Text>{t(navigate.label)}</Text>
                  </Router>
                ))}
                <Button onClick={handleSignOut}>テストログアウトボタン</Button>
              </>
            )}
          </nav>
        </div>

        <div className={styles.header__right}>
          {isLoggedIn ? (
            <Router href="/dashboard" className={styles.header__button}>
              <Text>{t("dashboard")}</Text>
            </Router>
          ) : (
            <>
              <Router href="/auth/login" className={styles.header__button}>
                <Text>{t("login")}</Text>
              </Router>
              <Router
                href="/auth/signup"
                className={styles.header__button_primary}
              >
                <Text>{t("signup")}</Text>
              </Router>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
