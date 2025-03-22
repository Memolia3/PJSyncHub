import Image from "next/image";
import styles from "./Header.module.scss";

import { Router } from "@/components/common";
import { SITE_NAME } from "@/constants/meta";

import { getTranslations } from "next-intl/server";

/**
 * ヘッダー
 * @returns ヘッダーコンポーネント
 */
export default async function Header() {
  const t = await getTranslations("Header");
  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <div className={styles.header__left}>
          <Router href="/" className={styles.header__logo}>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={60}
              height={60}
              priority
            />
            <span className={styles.header__title}>{SITE_NAME}</span>
          </Router>
        </div>

        <nav className={styles.header__nav}>
          <Router href="/projects" className={styles.header__link}>
            {t("projects")}
          </Router>
          <Router href="/tasks" className={styles.header__link}>
            {t("tasks")}
          </Router>
        </nav>

        <div className={styles.header__right}>
          <Router href="/login" className={styles.header__button}>
            {t("login")}
          </Router>
          <Router href="/signup" className={styles.header__button_primary}>
            {t("signup")}
          </Router>
        </div>
      </div>
    </header>
  );
}
