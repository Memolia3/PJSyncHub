import styles from "./Label.module.scss";

import type { LabelProps } from "@/types";

/**
 * ラベルコンポーネント
 * @param param ラベルのプロパティ
 * @returns ラベルコンポーネント
 */
export default function Label({
  htmlFor,
  required = false,
  className = "",
  children,
}: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={`${styles.label} ${className}`}>
      {children}
      {required && <span className={styles.required}>*</span>}
    </label>
  );
}
