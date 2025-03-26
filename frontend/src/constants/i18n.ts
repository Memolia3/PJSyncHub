/**
 * i18nを使用するコンポーネント, フックのキー
 */

export const COMPONENT = {
  LAYOUT: {
    LOCALE: "LocaleLayout",
    SIGNUP: "SignupLayout",
    DASHBOARD: "DashboardLayout",
  },
  HEADER: "Header",
  FOOTER: "Footer",
  HERO: "Hero",
  AUTH: {
    SIGNUPCARD: "SignupCard",
    SIGNUPFORM: "SignupForm",
    GOOGLEAUTHBUTTON: "GoogleAuthButton",
    GITHUBAUTHBUTTON: "GithubAuthButton",
  },
};

export const HOOK = {
  AUTH: {
    FORM_VALIDATION: "FormValidation",
  },
};

export const COMPONENT_PATH = {
  [COMPONENT.LAYOUT.LOCALE]: "/app/[locale]/layout",
  [COMPONENT.LAYOUT.SIGNUP]: "/app/[locale]/signup/layout",
  [COMPONENT.LAYOUT.DASHBOARD]: "/app/[locale]/dashboard/layout",
  [COMPONENT.HEADER]: "/components/layouts/Header/Header",
  [COMPONENT.FOOTER]: "/components/layouts/Footer/Footer",
  [COMPONENT.HERO]: "/components/features/home/Hero/Hero",
  [COMPONENT.AUTH.SIGNUPCARD]:
    "/components/features/auth/signup/SignupCard/SignupCard",
  [COMPONENT.AUTH.SIGNUPFORM]:
    "/components/features/auth/signup/SignupForm/SignupForm",
  [COMPONENT.AUTH.GOOGLEAUTHBUTTON]:
    "/components/features/auth/GoogleAuthButton/GoogleAuthButton",
  [COMPONENT.AUTH.GITHUBAUTHBUTTON]:
    "/components/features/auth/GithubAuthButton/GithubAuthButton",
};

export const HOOK_PATH = {
  [HOOK.AUTH.FORM_VALIDATION]: "/hooks/auth/useFormValidation",
};
