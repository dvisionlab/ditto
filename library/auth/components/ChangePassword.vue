<template>
  <div class="w-50 mx-auto">
    <ditto-form
      :fields="fields"
      :fields-style="{ 'flex-basis': '100%' }"
      :loading="loading"
      submit-label="change-password"
      :footer-style="{ 'flex-direction': 'row-reverse' }"
      v-model="form"
      @submit="submit"
    >
      <template v-slot:header>
        <h2 class="text-uppercase text-center primary--text my-4">
          {{ $t("change-password") }}
        </h2>
        <p>
          Please enter a new password.
        </p>

        <div :style="{ minHeight: '4em' }">
          <v-alert v-if="error" dense outlined type="error">
            <span v-html="error" />
          </v-alert>

          <div v-else class="error-placeholder" />
        </div>
      </template>

      <template v-slot:footer>
        <div class="flex-grow-1">
          <b>
            <a :disabled="loading" @click="$router.replace({ name: 'login' })">
              <v-icon color="anchor">mdi-chevron-left</v-icon>
              Back to login
            </a>
          </b>
        </div>
      </template>
    </ditto-form>

    <v-form @submit.prevent="submit">
      <v-text-field
        :append-icon="passwordHidden ? 'mdi-eye-off' : 'mdi-eye'"
        :disabled="loading"
        label="Password"
        name="password"
        outlined
        required
        :rules="passwordRules"
        :type="passwordHidden ? 'password' : 'text'"
        v-model="password"
        @click:append="() => (passwordHidden = !passwordHidden)"
      ></v-text-field>

      <v-text-field
        :disabled="loading"
        label="Password confirmation"
        name="password_confirmation"
        outlined
        required
        :rules="passwordConfirmationRules"
        type="password"
        v-model="passwordConfirmation"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script>
import Vue from "vue";
import form from "../../../form";
import { passwordRules } from "../utils";

const PasswordField = {
  props: {
    autofocus: { default: false, type: Boolean },
    disabled: { default: false, type: Boolean },
    label: { required: true, type: String },
    required: { default: false, type: Boolean },
    rules: { required: false, type: Array },
    type: { required: true, type: String },
    value: { required: false, type: String }
  },
  template: `<div>HERE{{ $props }}</div>`,
  template_: `
  <v-text-field
  :autofocus="autofocus"
        :append-icon="passwordHidden ? 'mdi-eye-off' : 'mdi-eye'"
        :disabled="loading"
        label="password"
        name="password"
        required
        :rules="passwordRules"
        :type="passwordHidden ? 'password' : 'text'"
        v-model="password"
        @click:append="() => (passwordHidden = !passwordHidden)"
      ></v-text-field>
  `
};

export default {
  name: "ChangePassword",
  components: { DittoForm: form.component },
  props: {
    token: {},
    uid: {}
  },
  data: () => {
    return {
      error: null,
      loading: false,
      form: {},
      // TODO
      passwordHidden: true,
      password: null,
      passwordConfirmation: null,
      passwordRules
    };
  },
  computed: {
    fields() {
      const passwordConfirmationRules = [
        () =>
          this.form.password == this.form.confirmPassword ||
          "Please make sure your passwords match."
      ];
      return [
        {
          appendIcon: this.passwordHidden ? "mdi-eye-off" : "mdi-eye",
          autofocus: true,
          component: PasswordField,
          label: "password",
          key: "password",
          required: () => true,
          type: this.passwordHidden ? "password" : "text"
        },
        {
          appendIcon: "mdi-lock",
          label: "confirm password",
          key: "confirmPassword",
          required: () => true,
          rules: passwordConfirmationRules,
          type: "password"
        }
      ];
    },
    passwordConfirmationRules() {
      return [
        this.password === this.passwordConfirmation ||
          "Please make sure your passwords match."
      ];
    }
  },
  methods: {
    submit() {
      this.loading = true;

      Vue.$http.auth
        .resetPassword(
          this.uid,
          this.token,
          this.form.password,
          this.form.confirmPassword
        )
        .then(() => {
          this.$router.replace({
            name: "login",
            query: { alertMessage: "change-password-success" }
          });
        })
        .catch(error => {
          let details = "";
          if (error.body.new_password || error.body.re_new_password) {
            if (error.body.new_password) {
              details += `${this.$t("new_password")}:<br />`;
              details += error.body.new_password.join("<br />");
            }

            if (error.body.re_new_password) {
              error.body.new_password ? (details += "<br /><br />") : null;
              details += `${this.$t("re_new_password")}:<br />`;
              details += error.body.re_new_password.join("<br />");
            }
          } else {
            details =
              error.body.detail ||
              `ERROR ${error.status} - ${error.statusText}`;
          }
          this.error = details;
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>
