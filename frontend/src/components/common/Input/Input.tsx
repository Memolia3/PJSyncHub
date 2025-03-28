"use client";

import styles from "./Input.module.scss";

import type { InputProps } from "@/types";

/**
 * 入力フィールドコンポーネント
 * ※クライアントコンポーネント
 * 子コンポーネントはクライアントコンポーネントになる
 * @param param 入力フィールドのプロパティ
 * @returns 入力フィールドコンポーネント
 */
export default function Input({
  variant = "outlined",
  inputSize = "medium",
  fullWidth = false,
  className = "",
  error,
  endAdornment,
  ...props
}: InputProps) {
  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          className={`${styles.input} ${styles[variant]} ${styles[inputSize]} ${
            fullWidth ? styles.fullWidth : ""
          } ${error ? styles.error : ""} ${className}`}
          {...props}
        />
        {endAdornment && (
          <div className={styles.endAdornment}>{endAdornment}</div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
