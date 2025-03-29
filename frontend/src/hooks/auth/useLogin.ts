import { useTranslations } from "next-intl";
import { useFormValidation } from "./useFormValidation";

// 初期データ
const initialData = {
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
    useFormValidation(initialData, validationRules);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid()) {
      // GraphQL mutation
      console.log("送信可能", formData);
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    t,
    isValid,
  };
};
