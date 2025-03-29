"use client";

import styles from "./LoginForm.module.scss";

import { Button, Input, Text, Label, Router } from "@/components/common";
import { VisibilityIcon, VisibilityOffIcon } from "@/components/common/icons";
import { COMPONENT } from "@/constants";
import { useLogin } from "@/hooks";
import { useState, useMemo } from "react";
import { useRouter } from "@/i18n/routing";
import { login } from "@/app/_actions/auth";
import { useSession } from "next-auth/react";

/**
 * ログインフォーム
 * @returns ログインフォームコンポーネント
 */
export default function LoginForm() {
  const { formData, errors, handleChange, resetForm, t, isValid } = useLogin(
    COMPONENT.AUTH.LOGINFORM
  );
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dirtyFields, setDirtyFields] = useState({
    email: false,
    password: false,
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
      password: false,
    });
    resetForm();
  };

  /**
   * ログインフォームの送信
   * サーバーアクション
   * @param e イベント
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid() || isLoading) return;

    try {
      setIsLoading(true);
      const result = await login(formData);

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
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={dirtyFields.email ? errors.email : undefined}
            required
            fullWidth
            placeholder="example@email.com"
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
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={dirtyFields.password ? errors.password : undefined}
            required
            fullWidth
            placeholder="••••••••"
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

      <div className={styles.actions}>
        <div className={styles.actions__button}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            buttonSize="medium"
          >
            <Text>{t("reset")}</Text>
          </Button>
          <Button
            type="submit"
            variant="primary"
            buttonSize="medium"
            disabled={!isFormValid || isLoading}
            isLoading={isLoading}
          >
            <Text>{t("login")}</Text>
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
