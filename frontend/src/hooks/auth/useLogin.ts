import { useTranslations } from "next-intl";
import { useFormValidation } from "./useFormValidation";
import type { LoginCredentials } from "@/types/auth.type";

// 初期データ
const initialData: LoginCredentials = {
  email: "",
  password: "",
};

// バリデーションルール
const validationRules = {
  email: {
    required: true,
    maxLength: 255,
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 100,
  },
};

/**
 * ログインフォームのフック
 * @param componentName コンポーネント名
 * @returns ログインフォームのフック
 */
export const useLogin = (componentName: string) => {
  const t = useTranslations(componentName);
  const { formData, errors, handleChange, isValid, resetForm } =
    useFormValidation<LoginCredentials>(initialData, validationRules);

  return {
    formData,
    errors,
    handleChange,
    resetForm,
    t,
    isValid,
  };
};
