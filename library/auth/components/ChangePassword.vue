<template>
  <v-main>
    <div class="w-50 mx-auto">
      <h2 class="text-uppercase text-center my-4">
        {{ $t("change-password") }}
      </h2>
      <p>
        Please enter a new password. You will receive a confirmation via email.
      </p>

      <v-form lazy-validation v-model="validForm">
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

      <div v-if="error">
        <v-alert
          icon="mdi-alert-circle"
          outlined
          type="warning"
          prominent
          border="left"
        >
          <b class="pl-1">{{ error }}</b>
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
          @click="submit"
        >
          {{ $t("reset-password") }}
        </v-btn>
      </div>
    </div>

    <!-- TODO @simone -->
    <!-- <p>
        The password reset link was invalid, possibly because it has already
        been used. Please request a new password reset.
      </p> -->
  </v-main>
</template>

<script>
import Vue from "vue";
import { passwordRules } from "../utils";

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
    passwordRules:
      process.env.NODE_ENV === "production" ? passwordRules : [() => true],
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
    // TODO test
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
            query: { resetPasswordEmailSent: true } // TODO customize message
          });
        })
        .catch(({ body }) => {
          this.error = body.detail || body.toString();
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>
