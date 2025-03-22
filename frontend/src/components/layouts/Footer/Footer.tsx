import styles from "./Footer.module.scss";

import { Router } from "@/components/common";
import { SITE_NAME } from "@/constants/meta";

import { getTranslations } from "next-intl/server";

/**
 * フッター
 * @returns フッターコンポーネント
 */
export default async function Footer() {
  const t = await getTranslations("Footer");
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <div className={styles.footer__content}>
          <div className={styles.footer__copyright}>
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </div>
          <nav className={styles.footer__nav}>
            <Router href="/terms" className={styles.footer__link}>
              {t("terms")}
            </Router>
            <span className={styles.footer__separator}>|</span>
            <Router href="/privacy" className={styles.footer__link}>
              {t("privacy")}
            </Router>
            <span className={styles.footer__separator}>|</span>
            <Router href="/contact" className={styles.footer__link}>
              {t("contact")}
            </Router>
          </nav>
        </div>
      </div>
    </footer>
  );
}
