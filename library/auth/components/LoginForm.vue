<template>
  <v-card class="mx-auto" flat max-width="500px" width="80%">
    <v-card-text>
      <span>{{ $t("login-email") }}</span>
      <v-form v-model="validForm">
        <v-text-field
          prepend-icon="mdi-email"
          required
          :rules="emailRules"
          v-model="email"
          name="email"
          label="e-mail"
        ></v-text-field>
        <v-text-field
          prepend-icon="mdi-lock"
          required
          :rules="passwordRules"
          v-model="password"
          name="password"
          label="Password"
          type="password"
        ></v-text-field>
      </v-form>
      <v-card-actions>
        <v-row>
          <v-col cols="6">
            <v-btn primary block large @click="resetForm">{{
              $t("reset-password")
            }}</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn primary block large @click="login" :disabled="!validForm">{{
              $t("login")
            }}</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
      <v-alert v-if="autoLoggedOut || error" normal :icon="false" type="error">
        {{ autoLoggedOut || error }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import { emailRules, passwordRules } from "../utils";

export default {
  name: "LoginForm",
  props: {
    autoLoggedOut: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      loading: false,
      email: null,
      emailRules,
      error: null,
      password: null,
      passwordRules:
        process.env.NODE_ENV === "production" ? passwordRules : [() => true],
      validForm: false
    };
  },
  methods: {
    login() {
      this.error = null;
      this.loading = true;

      this.$store
        .dispatch("auth/login", { email: this.email, password: this.password })
        .then(() => this.$router.replace("/"))
        .catch(error => (this.error = error))
        .finally(() => (this.loading = false)); // TODO show loader
    },
    resetPassword() {
      console.log(this.email);
      this.$router.replace({
        name: "forgot-password",
        query: { email: this.email }
      });
    }
  }
};
</script>
