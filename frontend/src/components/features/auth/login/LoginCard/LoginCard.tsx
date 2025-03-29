"use client";

import styles from "./LoginCard.module.scss";

import { Router, Text } from "@/components/common";
import { COMPONENT } from "@/constants";
import {
  LoginForm,
  GoogleAuthButton,
  GithubAuthButton,
} from "@/components/features/auth";

import { useTranslations } from "next-intl";

/**
 * ログイン画面
 * ログインのコンポーネントを集約
 * @returns ログインカードコンポーネント
 */
export default function LoginCard() {
  const t = useTranslations(COMPONENT.AUTH.LOGINCARD);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.title}>
          <Text variant="h3">{t("title")}</Text>
        </div>
        <LoginForm />
        <div className={styles.divider}>
          <span>{t("or")}</span>
        </div>
        <GoogleAuthButton mode="login" />
        <GithubAuthButton mode="login" />
        <Router href="/auth/signup" className={styles.link}>
          <Text>{t("noAccount")}</Text>
        </Router>
      </div>
    </div>
  );
}
