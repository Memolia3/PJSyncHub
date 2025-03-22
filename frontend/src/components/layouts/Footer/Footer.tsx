import styles from "./Footer.module.scss";

import { Router, Text } from "@/components/common";
import { COMPONENT, SITE_NAME } from "@/constants";

import { getTranslations } from "next-intl/server";

/**
 * フッター
 * @returns フッターコンポーネント
 */
export default async function Footer() {
  const t = await getTranslations(COMPONENT.FOOTER);
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <div className={styles.footer__content}>
          <div className={styles.footer__copyright}>
            <Text>
              &copy; {new Date().getFullYear()} {SITE_NAME}
            </Text>
          </div>
          <nav className={styles.footer__nav}>
            <Router href="/terms" className={styles.footer__link}>
              <Text>{t("terms")}</Text>
            </Router>
            <span className={styles.footer__separator}>|</span>
            <Router href="/privacy" className={styles.footer__link}>
              <Text>{t("privacy")}</Text>
            </Router>
            <span className={styles.footer__separator}>|</span>
            <Router href="/contact" className={styles.footer__link}>
              <Text>{t("contact")}</Text>
            </Router>
          </nav>
        </div>
      </div>
    </footer>
  );
}
