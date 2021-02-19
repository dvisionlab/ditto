export const emailRules = [
  v => !!v || "E-mail is required",
  v => /.+@.+\..+/.test(v) || "E-mail must be valid"
];

export const passwordRules = [
  v => !!v || "Password is required",
  v =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(v) ||
    "Min. 8 characters with at least one capital letter and a number."
];
