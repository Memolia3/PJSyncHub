"use client"; // クライアントコンポーネントに変更

import Image from "next/image";
import styles from "./Header.module.scss";

import { Router, Text, Button } from "@/components/common";
import {
  COMPONENT,
  SITE_NAME,
  INDEX_NAVIGATE,
  LOGIN_NAVIGATE,
} from "@/constants";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

/**
 * ヘッダー
 * @returns ヘッダーコンポーネント
 */
export default function Header() {
  const t = useTranslations(COMPONENT.HEADER);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session?.accessToken;
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();

  // ローディング中の表示
  if (status === "loading") {
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
          </div>
          <div className={styles.header__right}>
            <div className={styles.header__loading}>
              <div className={styles.header__loading_spinner} />
            </div>
          </div>
        </div>
      </header>
    );
  }

  const handleSignOutClick = async () => {
    const locale = pathname.startsWith("/en") ? "en" : "ja";
    await signOut({
      redirect: true,
      callbackUrl: `/${locale}`,
    });
  };

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
                {LOGIN_NAVIGATE.map((navigate, index) => (
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
              </>
            )}
          </nav>
        </div>

        <div className={styles.header__right}>
          {isLoggedIn ? (
            <div className={styles.header__user}>
              <Text className={styles.header__user_name}>
                {session.user.name}
              </Text>
              <div
                className={styles.header__avatar}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <Image
                  src={session.user.avatarUrl || "/images/default-avatar.png"}
                  alt="User Icon"
                  width={45}
                  height={45}
                  className={styles.header__avatar_image}
                />
                {showDropdown && (
                  <div className={styles.header__dropdown}>
                    <Button onClick={handleSignOutClick}>
                      <Text>{t("logout")}</Text>
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
