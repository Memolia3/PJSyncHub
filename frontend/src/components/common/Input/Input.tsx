import styles from "./Input.module.scss";

import type { InputProps } from "@/types";

/**
 * 入力フィールドコンポーネント
 * @param param 入力フィールドのプロパティ
 * @returns 入力フィールドコンポーネント
 */
export default function Input({
  variant = "outlined",
  inputSize = "medium",
  fullWidth = false,
  className = "",
  error,
  ...props
}: InputProps) {
  return (
    <div className={styles.container}>
      <input
        className={`${styles.input} ${styles[variant]} ${styles[inputSize]} ${
          fullWidth ? styles.fullWidth : ""
        } ${error ? styles.error : ""} ${className}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
