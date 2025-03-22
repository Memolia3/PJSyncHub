import { ButtonHTMLAttributes, ReactNode, InputHTMLAttributes } from "react";

// ボタンで設定可能なプロパティの型
export type ButtonVariant = "primary" | "secondary" | "text";
export type ButtonSize = "small" | "medium" | "large";

// ボタンのプロパティの型
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  buttonSize?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  startAdornment?: ReactNode;
};

// テキストで設定可能なプロパティの型
export type TextVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

// テキストのプロパティの型
export type TextProps = {
  variant?: TextVariant;
  className?: string;
  children: ReactNode;
};

// 入力フィールドで設定可能なプロパティの型
export type InputVariant = "outlined" | "filled" | "standard";
export type InputSize = "small" | "medium" | "large";

// 入力フィールドのプロパティの型
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  variant?: InputVariant;
  inputSize?: InputSize;
  fullWidth?: boolean;
  className?: string;
  error?: string;
};

// ラベルのプロパティの型
export type LabelProps = {
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};
