// バリデーションルール
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  match?: string;
  custom?: (value: string) => boolean;
}

// バリデーションルール
export type ValidationRules<T> = {
  [K in keyof T]: ValidationRule;
};

// バリデーションルール
export type Validations = {
  [key: string]: ValidationRules<any>;
};

// フォームに入力するデータ
export type FormData = {
  [key: string]: string;
};

// フォームに出力するエラー
export type FormErrors = {
  [key: string]: string | undefined;
};
