/**
 * i18nを使用するコンポーネントのキー
 */

export const COMPONENT = {
  HEADER: "Header",
  FOOTER: "Footer",
  LOCALE_LAYOUT: "LocaleLayout",
  HERO: "Hero",
  AUTH: {
    SIGNUPCARD: "SignupCard",
    SIGNUPFORM: "SignupForm",
    GOOGLEAUTHBUTTON: "GoogleAuthButton",
    VALIDATION: "Validation",
  },
};

export const COMPONENT_PATH = {
  [COMPONENT.HEADER]: "/components/layouts/Header/Header",
  [COMPONENT.FOOTER]: "/components/layouts/Footer/Footer",
  [COMPONENT.LOCALE_LAYOUT]: "/app/[locale]/layout",
  [COMPONENT.HERO]: "/components/features/home/Hero/Hero",
  [COMPONENT.AUTH.SIGNUPCARD]:
    "/components/features/auth/signup/SignupCard/SignupCard",
  [COMPONENT.AUTH.SIGNUPFORM]:
    "/components/features/auth/signup/SignupForm/SignupForm",
  [COMPONENT.AUTH.GOOGLEAUTHBUTTON]:
    "/components/features/auth/GoogleAuthButton/GoogleAuthButton",
  [COMPONENT.AUTH.VALIDATION]:
    "/components/features/auth/Validation/Validation",
};
