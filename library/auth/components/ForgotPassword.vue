<template>
  <v-main>
    <div class="w-50 mx-auto">
      <h2 class="text-uppercase text-center my-4">
        {{ $t("reset-password") }}
      </h2>
      <p>
        Please enter your email address. You will receive a link to create a new
        password via email.
      </p>

      <v-form lazy-validation v-model="validForm">
        <v-text-field
          append-icon="mdi-email"
          :disabled="loading"
          label="Email"
          name="email"
          outlined
          required
          :rules="emailRules"
          type="email"
          v-model="email"
        ></v-text-field>
      </v-form>

      <div v-if="error" class="mt-4">
        <v-alert
          icon="mdi-alert-circle"
          outlined
          type="warning"
          prominent
          border="left"
        >
          <b>{{ error }}</b>
        </v-alert>
      </div>

      <div class="d-flex align-center justify-space-between">
        <b>
          <a
            :disabled="loading"
            is="router-link"
            :to="{ name: 'login', query: { email } }"
          >
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
  </v-main>
</template>

<script>
import Vue from "vue";
import { emailRules } from "../utils";

export default {
  name: "ForgotPassword",
  data: () => ({
    email: null,
    emailRules,
    error: null,
    loading: false,
    validForm: false
  }),
  created() {
    this.email = this.$route.query.email || null;
  },
  methods: {
    submit() {
      this.loading = true;

      Vue.$http.auth
        .requestPasswordReset(this.email)
        .then(() => {
          this.$router.replace({
            name: "login",
            query: { resetPasswordEmailSent: true }
          });
        })
        .catch(error => {
          this.error = `ERROR ${error.status} - ${error.body.detail ||
            error.statusText}`;
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style>
a[disabled] {
  pointer-events: none;
  opacity: 0.6;
}
</style>
