<template>
  <v-main>
    <div class="w-50 mx-auto">
      <h2 class="text-uppercase text-center my-4">{{ $t("login") }}</h2>

      <div class="pb-4">
        <v-alert
          v-if="showResetPasswordAlert"
          dismissible
          :icon="false"
          type="success"
        >
          An email with password reset instructions has been sent to your email
          address.
        </v-alert>
      </div>

      <v-form lazy-validation v-model="validForm">
        <v-text-field
          append-icon="mdi-email"
          label="Email"
          name="email"
          outlined
          required
          :rules="emailRules"
          type="email"
          v-model="email"
        ></v-text-field>
        <v-text-field
          append-icon="mdi-lock"
          label="Password"
          name="password"
          outlined
          required
          :rules="passwordRules"
          type="password"
          v-model="password"
        ></v-text-field>
      </v-form>

      <v-btn
        block
        :disabled="loading || !validForm"
        :elevation="0"
        :loading="loading"
        primary
        x-large
        @click="submit"
        >{{ $t("login") }}</v-btn
      >

      <div v-if="error || $route.query.autoLoggedOut" class=" mt-4 pa-2">
        <v-alert
          icon="mdi-alert-circle"
          outlined
          type="warning"
          prominent
          border="left"
        >
          <b class="pl-1">{{ error || $route.query.autoLoggedOut }}</b>
        </v-alert>
      </div>

      <div class="mt-4 text-right">
        <div v-if="allowPasswordReset">
          <a @click="resetPassword">Forgot Password?</a>
        </div>
        <div v-if="allowUserRegistration">
          New here?
          <a is="router-link" :to="{ name: 'register' }">Sign up</a>.
        </div>
      </div>
    </div>
  </v-main>
</template>

<script>
import { emailRules, passwordRules } from "../utils";

export default {
  name: "LoginForm",
  props: {
    allowPasswordReset: {
      default: true,
      type: Boolean
    },
    allowUserRegistration: {
      default: true,
      type: Boolean
    }
  },
  data: () => ({
    loading: false,
    email: null,
    emailRules,
    error: null,
    password: null,
    passwordRules:
      process.env.NODE_ENV === "production" ? passwordRules : [() => true],
    showResetPasswordAlert: false,
    validForm: false
  }),
  created() {
    if (this.$route.query.resetPasswordEmailSent) {
      this.showResetPasswordAlert = true;
    }
  },
  methods: {
    submit() {
      this.error = null;
      this.loading = true;

      this.$store
        .dispatch("auth/login", { email: this.email, password: this.password })
        .then(() => this.$router.replace("/"))
        .catch(error => (this.error = error))
        .finally(() => (this.loading = false));
    },
    resetPassword() {
      this.$router.replace({
        name: "forgot-password",
        query: { email: this.email }
      });
    }
  }
};
</script>
