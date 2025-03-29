"use client";

import styles from "./SignupCard.module.scss";

import { Text, Router } from "@/components/common";
import { COMPONENT } from "@/constants";
import {
  SignupForm,
  GoogleAuthButton,
  GithubAuthButton,
} from "@/components/features/auth";

import { useTranslations } from "next-intl";

/**
 * 新規登録画面
 * 新規登録のコンポーネントを集約
 * @returns 新規登録カードコンポーネント
 */
export default function SignupCard() {
  const t = useTranslations(COMPONENT.AUTH.SIGNUPCARD);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.title}>
          <Text variant="h3">{t("title")}</Text>
        </div>
        <SignupForm />
        <div className={styles.divider}>
          <span>{t("or")}</span>
        </div>
        <GoogleAuthButton mode="signup" />
        <GithubAuthButton mode="signup" />
        <Router href="/auth/login" className={styles.link}>
          <Text>{t("hasAccount")}</Text>
        </Router>
      </div>
    </div>
  );
}
