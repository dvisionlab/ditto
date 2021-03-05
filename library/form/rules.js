// TODO allow to customize password regex?
export default {
  email: [v => /.+@.+\..+/.test(v) || "E-mail must be valid"],
  password: [
    v =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(v) ||
      "Min. 8 characters with at least one capital letter and a number."
  ],
  required: [v => !!v || "This field is required"]
};
