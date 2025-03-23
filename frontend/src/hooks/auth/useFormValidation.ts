import { useState, ChangeEvent, useCallback } from "react";
import { useTranslations } from "next-intl";

import { FormData, Validations, FormErrors } from "@/types";
import { HOOK } from "@/constants";

/**
 * フォームの入力値を検証するフック
 * @param initialData 初期データ
 * @param validations 検証ルール
 * @returns フォームの入力値とエラー
 */
export const useFormValidation = (
  initialData: FormData,
  validations: Validations
) => {
  const t = useTranslations(HOOK.AUTH.FORM_VALIDATION);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * パスワードの検証
   * @param value パスワード
   * @returns エラーメッセージ
   */
  const validatePassword = (value: string) => {
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    // 長さチェック（別のフォーマットで表示）
    if (value.length < 8) {
      return t("minLength", { count: 8 });
    }
    if (value.length > 100) {
      return t("maxLength", { count: 100 });
    }

    // 文字種チェック（passwordRequirementsのフォーマットで表示）
    const errors: string[] = [];

    if (!hasLower) {
      errors.push(t("lowercase"));
    }
    if (!hasUpper) {
      errors.push(t("uppercase"));
    }
    if (!hasNumber) {
      errors.push(t("number"));
    }
    if (!hasSymbol) {
      errors.push(t("symbol"));
    }

    if (errors.length > 0) {
      return t("passwordRequirements", { requirements: errors.join("、") });
    }

    return undefined;
  };

  /**
   * フィールドの検証
   * @param name フィールド名
   * @param value フィールドの値
   * @returns エラーメッセージ
   */
  const validateField = (name: string, value: string) => {
    const rules = validations[name];
    if (!rules) return undefined;

    if (rules.required && !value) {
      return t("required");
    }

    if (name === "password") {
      return validatePassword(value);
    }

    if (rules.minLength && value.length < rules.minLength) {
      return t("minLength", { count: rules.minLength });
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return t("maxLength", { count: rules.maxLength });
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return t("invalidFormat");
    }

    if (rules.match && value !== formData[rules.match]) {
      return t("mismatch");
    }

    if (rules.custom && !rules.custom(value)) {
      return "入力値が正しくありません";
    }

    return undefined;
  };

  /**
   * フォームの入力値を変更する
   * @param e イベント
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  /**
   * フォームの入力値が有効かどうかを返す
   * @returns フォームの入力値が有効かどうか
   */
  const isValid = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validations).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validations, validateField]);

  /**
   * フォームの入力値をリセットする
   */
  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    isValid,
    resetForm,
  };
};
