"use client";

import styles from "./SignupForm.module.scss";
import { useState, useEffect, useMemo } from "react";
import { Text, Label, Input, Button } from "@/components/common";
import { useSignup } from "@/hooks/auth";
import { COMPONENT } from "@/constants";
import { VisibilityIcon, VisibilityOffIcon } from "@/components/common";

/**
 * 新規登録フォームコンポーネント
 * @returns 新規登録フォームコンポーネント
 */
export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    t,
    isValid,
  } = useSignup(COMPONENT.AUTH.SIGNUPFORM);

  // isFormValidをuseMemoで計算
  const isFormValid = useMemo(() => isValid(), [formData]);

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
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            fullWidth
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            endAdornment={
              <div
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
                role="button"
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <VisibilityIcon className={styles.icon} aria-hidden="true" />
                ) : (
                  <VisibilityOffIcon
                    className={styles.icon}
                    aria-hidden="true"
                  />
                )}
              </div>
            }
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
            type={showPasswordConfirm ? "text" : "password"}
            placeholder="••••••••"
            fullWidth
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            error={errors.passwordConfirm}
            endAdornment={
              <div
                className={styles.togglePassword}
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                role="button"
                tabIndex={0}
                aria-label={
                  showPasswordConfirm ? "Hide password" : "Show password"
                }
              >
                {showPasswordConfirm ? (
                  <VisibilityIcon className={styles.icon} aria-hidden="true" />
                ) : (
                  <VisibilityOffIcon
                    className={styles.icon}
                    aria-hidden="true"
                  />
                )}
              </div>
            }
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={resetForm}>
          <Text>{t("reset")}</Text>
        </Button>
        <Button type="submit" disabled={!isFormValid}>
          <Text>{t("signup")}</Text>
        </Button>
      </div>
    </form>
  );
}
