// バリデーションルール
export type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  match?: string;
  custom?: (value: string) => boolean;
};

// バリデーションルール
export type Validations = {
  [key: string]: ValidationRules;
};

// フォームに入力するデータ
export type FormData = {
  [key: string]: string;
};

// フォームに出力するエラー
export type FormErrors = {
  [key: string]: string | undefined;
};
