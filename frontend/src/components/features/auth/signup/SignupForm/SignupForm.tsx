"use client";

import styles from "./SignupForm.module.scss";
import { useState, useMemo } from "react";
import { Text, Label, Input, Button, Router } from "@/components/common";
import { useSignup } from "@/hooks/auth";
import { COMPONENT } from "@/constants";
import { VisibilityIcon, VisibilityOffIcon } from "@/components/common";
import { useRouter } from "@/i18n/routing";
import { signup } from "@/app/_actions/auth";
import { useSession } from "next-auth/react";

/**
 * 新規登録フォームコンポーネント
 * @returns 新規登録フォームコンポーネント
 */
export default function SignupForm() {
  const { formData, errors, handleChange, resetForm, t, isValid } = useSignup(
    COMPONENT.AUTH.SIGNUPFORM
  );
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dirtyFields, setDirtyFields] = useState({
    email: false,
    name: false,
    password: false,
    passwordConfirm: false,
  });

  const isFormValid = useMemo(() => isValid(), [formData]);

  // フォームの入力があった時
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setDirtyFields((prev) => ({
      ...prev,
      [name]: true,
    }));
    handleChange(e);
  };

  // リセット時にフラグも戻す
  const handleReset = () => {
    setDirtyFields({
      email: false,
      name: false,
      password: false,
      passwordConfirm: false,
    });
    resetForm();
  };

  /**
   * サインアップフォームの送信
   * サーバーアクション
   * @param e イベント
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid() || isLoading) return;

    try {
      setIsLoading(true);
      const result = await signup(formData);

      if (result.error) {
        console.error(result.error);
        return;
      }

      // セッションを更新
      await updateSession();
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
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
            onChange={handleInputChange}
            error={dirtyFields.email ? errors.email : undefined}
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
            onChange={handleInputChange}
            error={dirtyFields.name ? errors.name : undefined}
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
            onChange={handleInputChange}
            error={dirtyFields.password ? errors.password : undefined}
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
            onChange={handleInputChange}
            error={
              dirtyFields.passwordConfirm ? errors.passwordConfirm : undefined
            }
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
        <div className={styles.actions__button}>
          <Button type="button" variant="secondary" onClick={handleReset}>
            <Text>{t("reset")}</Text>
          </Button>
          <Button
            type="submit"
            variant="primary"
            buttonSize="medium"
            disabled={!isFormValid}
          >
            <Text>{t("signup")}</Text>
          </Button>
        </div>
        <div className={styles.actions__link}>
          <Router href="/auth/forgot-password">
            <Text>{t("forgotPassword")}</Text>
          </Router>
        </div>
      </div>
    </form>
  );
}
