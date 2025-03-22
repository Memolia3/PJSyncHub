"use client";

import styles from "./SignupForm.module.scss";

import { Text, Label, Input, Button } from "@/components/common";
import { COMPONENT } from "@/constants";
import { useTranslations } from "next-intl";
import { useFormValidation } from "@/hooks/auth/useFormValidation";

export default function SignupForm() {
  const t = useTranslations(COMPONENT.AUTH.SIGNUPFORM);

  /**
   * フォームの入力値とエラーを管理
   * バリデーションの設定
   */
  const { formData, errors, handleChange, isValid, resetForm } =
    useFormValidation(
      {
        email: "",
        name: "",
        password: "",
        passwordConfirm: "",
      },
      {
        email: {
          required: true,
          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        },
        name: {
          required: true,
          minLength: 3,
        },
        password: {
          required: true,
          pattern:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        },
        passwordConfirm: {
          required: true,
          match: "password",
        },
      }
    );

  /**
   * フォームの送信
   * @param e イベント
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid()) {
      console.log("送信可能", formData);
    }
  };

  /**
   * フォームの入力値をリセットする
   */
  const handleReset = () => {
    resetForm();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <Label htmlFor="email" required>
          <Text variant="h3">{t("email")}</Text>
        </Label>
        <div className={styles.inputGroup}>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="name" required>
          <Text variant="h3">{t("name")}</Text>
        </Label>
        <div className={styles.inputGroup}>
          <Input
            id="name"
            type="text"
            placeholder="username"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="password" required>
          <Text variant="h3">{t("password")}</Text>
        </Label>
        <div className={styles.inputGroup}>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            fullWidth
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <Label htmlFor="passwordConfirm" required>
          <Text variant="h3">{t("passwordConfirm")}</Text>
        </Label>
        <div className={styles.inputGroup}>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="••••••••"
            fullWidth
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            error={errors.passwordConfirm}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={handleReset}>
          {t("reset")}
        </Button>
        <Button type="submit">{t("signup")}</Button>
      </div>
    </form>
  );
}
