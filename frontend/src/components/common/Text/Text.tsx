import { ReactNode } from "react";
import styles from "./Text.module.scss";

type TextProps = {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
  className?: string;
};

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
