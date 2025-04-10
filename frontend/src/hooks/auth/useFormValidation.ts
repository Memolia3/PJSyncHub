import { useState, ChangeEvent, useCallback } from "react";
import { useTranslations } from "next-intl";

import { FormErrors, ValidationRules } from "@/types";
import { HOOK } from "@/constants";

/**
 * フォームの入力値を検証するフック
 * @param initialData 初期データ
 * @param validations 検証ルール
 * @returns フォームの入力値とエラー
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  validationRules: ValidationRules<T>
) => {
  const t = useTranslations(HOOK.AUTH.FORM_VALIDATION);
  const [formData, setFormData] = useState<T>(initialData);
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
    const rules = validationRules[name];
    if (!rules) return undefined;

    // if (rules.required && !value) {
    //   return t("required");
    // }

    // if (name === "password") {
    //   return validatePassword(value);
    // }

    // if (rules.minLength && value.length < rules.minLength) {
    //   return t("minLength", { count: rules.minLength });
    // }

    // if (rules.maxLength && value.length > rules.maxLength) {
    //   return t("maxLength", { count: rules.maxLength });
    // }

    // if (rules.pattern && !rules.pattern.test(value)) {
    //   return t("invalidFormat");
    // }

    // if (rules.match && value !== formData[rules.match]) {
    //   return t("mismatch");
    // }

    // if (rules.custom && !rules.custom(value)) {
    //   return t("invalidValue");
    // }

    return undefined;
  };

  /**
   * フォームの入力値を変更する
   * @param e イベント
   */
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | {
          target: {
            name: string;
            value: string;
            validationMessages?: string[];
          };
        }
  ) => {
    const target = e.target as {
      name: string;
      value: string;
      validationMessages?: string[];
    };
    const { name, value, validationMessages } = target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // カスタムバリデーションメッセージがある場合はそれを優先
    if (validationMessages) {
      console.log("validationMessage", validationMessages);
      setErrors((prev) => ({
        ...prev,
        [name]: Array.isArray(validationMessages)
          ? validationMessages[0] // 最初のエラーメッセージを表示
          : validationMessages,
      }));
      return;
    }

    // 通常のバリデーション処理を実行
    validateField(name, value);
  };

  /**
   * フォームの入力値が有効かどうかを返す
   * @returns フォームの入力値が有効かどうか
   */
  const isValid = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validationRules, validateField]);

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
