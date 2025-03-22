export type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  match?: string;
  custom?: (value: string) => boolean;
};

export type Validations = {
  [key: string]: ValidationRules;
};

export type FormData = {
  [key: string]: string;
};

export type FormErrors = {
  [key: string]: string | undefined;
};
