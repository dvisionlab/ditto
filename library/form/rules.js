// Customizable settings
let emailValidationRegex = /.+@.+\..+/;
let passwordMinLength = 8;
let passwordValidationRegex = () =>
  new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{${passwordMinLength},})`);

// Return rules, eventually with customizazions
const getRules = () => ({
  email: [v => emailValidationRegex.test(v) || "E-mail must be valid"],
  password: [
    v =>
      passwordValidationRegex().test(v) ||
      `Min. ${passwordMinLength} characters with at least one capital letter and a number.`
  ],
  required: [v => !!v || "This field is required"]
});

export const customizeRules = settings => {
  if (settings.emailValidationRegex)
    emailValidationRegex = settings.emailValidationRegex;
  if (settings.passwordMinLength)
    passwordMinLength = settings.passwordMinLength;
  if (settings.passwordValidationRegex)
    passwordValidationRegex = () => settings.passwordValidationRegex;
};
export const rules = getRules();
