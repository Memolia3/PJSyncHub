"use client";

import styles from "./SignupCard.module.scss";

import { Text } from "@/components/common";
import { COMPONENT } from "@/constants";
import { GoogleAuthButton } from "@/components/features/auth";
import { SignupForm } from "@/components/features/auth/";
import { useTranslations } from "next-intl";

export default function SignupCard() {
  const t = useTranslations(COMPONENT.AUTH.SIGNUPCARD);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.title}>
          <Text variant="h1">{t("title")}</Text>
        </div>

        <SignupForm />

        <div className={styles.divider}>
          <span>{t("or")}</span>
        </div>

        <GoogleAuthButton mode="signup" />
      </div>
    </div>
  );
}
