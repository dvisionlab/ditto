export const emailRules = [
  v => !!v || "E-mail is required",
  v => /.+@.+\..+/.test(v) || "E-mail must be valid"
];

export const passwordRulesMessage =
  "Min. 8 characters with at least one capital letter and a number.";

export const passwordRules = [
  v => !!v || "Password is required",
  v =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(v) ||
    passwordRulesMessage
];

export const skipAuthorizationInterceptorUrls = [
  "auth/jwt",
  "auth/users/activation",
  "auth/users/resend_activation",
  "auth/users/reset_email",
  "auth/users/reset_email_confirm",
  "auth/users/reset_password",
  "auth/users/reset_password_confirm"
];
