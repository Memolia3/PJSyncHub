import styles from "./Button.module.scss";

import type { ButtonProps } from "@/types";

/**
 * ボタンコンポーネント
 * @param param ボタンのプロパティ
 * @returns ボタンコンポーネント
 */
export default function Button({
  children,
  variant = "primary",
  buttonSize = "medium",
  fullWidth = false,
  className = "",
  isLoading = false,
  disabled,
  startAdornment,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[buttonSize]} ${
        fullWidth ? styles.fullWidth : ""
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {startAdornment && (
        <span className={styles.startAdornment}>{startAdornment}</span>
      )}
      {isLoading ? <span className={styles.loading}></span> : children}
    </button>
  );
}
