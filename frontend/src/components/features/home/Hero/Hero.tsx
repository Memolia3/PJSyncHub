import styles from "./Hero.module.scss";
import { Router, Text } from "@/components/common";
import { useTranslations } from "next-intl";
import { COMPONENT } from "@/constants";

/**
 * ヒーローコンポーネント
 * ホーム画面のビッグイメージ
 * @returns Hero
 */
export default function Hero() {
  const t = useTranslations(COMPONENT.HERO);

  return (
    <section className={styles.hero}>
      <div className={styles.hero__inner}>
        <div className={styles.hero__content}>
          <Text variant="h2" className={styles.hero__title}>
            {t("title")}
          </Text>
          <Text className={styles.hero__description}>{t("description")}</Text>
          <div className={styles.hero__actions}>
            <Router href="/auth/signup" className={styles.hero__button_primary}>
              {t("start")}
            </Router>
            <Router href="/features" className={styles.hero__button}>
              {t("learn_more")}
            </Router>
          </div>
        </div>
      </div>
    </section>
  );
}
