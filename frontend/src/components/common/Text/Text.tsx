import styles from "./Text.module.scss";

import type { TextProps } from "@/types";

/**
 * テキストコンポーネント
 * @param variant テキストの種類（デフォルト: p）
 * @param className 追加のクラス名
 * @param children 子要素
 */
export default function Text({
  variant = "p",
  className,
  children,
}: TextProps) {
  const Component = variant;
  return (
    <Component className={`${styles[variant]} ${className || ""}`}>
      {children}
    </Component>
  );
}
