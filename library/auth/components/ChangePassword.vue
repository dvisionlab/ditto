<template>
  <v-main>
    <div class="w-50 mx-auto">
      <h2 class="text-uppercase text-center my-4">
        {{ $t("change-password") }}
      </h2>
      <p>
        Please enter a new password with the following rules:
        {{ passwordRulesMessage }}
      </p>

      <v-form v-model="validForm" @submit.prevent="submit">
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

        <div v-if="error">
          <v-alert
            icon="mdi-alert-circle"
            outlined
            type="warning"
            prominent
            border="left"
          >
            <b class="pl-1" v-html="error" />
          </v-alert>
        </div>

        <div class="d-flex align-center justify-space-between">
          <b>
            <a :disabled="loading" is="router-link" :to="{ name: 'login' }">
              Back to login
            </a>
          </b>

          <v-btn
            class="ml-4"
            :loading="loading"
            :disabled="loading || !validForm"
            :elevation="0"
            primary
            x-large
            type="submit"
          >
            {{ $t("reset-password") }}
          </v-btn>
        </div>
      </v-form>
    </div>
  </v-main>
</template>

<script>
import Vue from "vue";
import { passwordRules, passwordRulesMessage } from "../utils";

export default {
  name: "ChangePassword",
  props: {
    token: {},
    uid: {}
  },
  data: () => ({
    loading: false,
    passwordHidden: true,
    error: null,
    password: null,
    passwordConfirmation: null,
    passwordRules,
    passwordRulesMessage,
    validForm: false
  }),
  computed: {
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
          this.password,
          this.passwordConfirmation
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
