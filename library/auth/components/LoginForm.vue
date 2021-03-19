<template>
  <v-main>
    <div class="w-50 mx-auto">
      <ditto-form
        :fields="fields"
        :fields-style="{ 'flex-basis': '100%' }"
        submit-label="login"
        v-model="form"
        @submit="submit"
      >
        <template v-slot:header>
          <h2 class="text-uppercase text-center my-4">{{ $t("login") }}</h2>
        </template>
        <template v-slot:footer>
          <div class="mt-4 text-right">
            <div v-if="allowPasswordReset">
              <a @click="resetPassword">Forgot Password?</a>
            </div>
            <div v-if="allowUserRegistration">
              New here?
              <a @click="register">Sign up</a>.
            </div>
          </div>
        </template>
      </ditto-form>

      <h2 class="text-uppercase text-center my-4">{{ $t("login") }}</h2>

      <div class="pb-4">
        <v-alert
          v-if="alertMessage"
          dismissible
          :icon="false"
          :type="alertType"
        >
          {{ $t(alertMessage) }}
        </v-alert>
      </div>

      <v-form v-model="validForm" @submit.prevent="submit">
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
        <v-text-field
          append-icon="mdi-lock"
          :disabled="loading"
          label="Password"
          name="password"
          outlined
          required
          :rules="passwordRules"
          type="password"
          v-model="password"
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

        <v-btn
          block
          :disabled="loading || !validForm"
          :elevation="0"
          :loading="loading"
          primary
          x-large
          type="submit"
          >{{ $t("login") }}</v-btn
        >
      </v-form>

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
import Form from "../../form/Form";
console.log(Form);

export default {
  name: "LoginForm",
  components: { DittoForm: Form },
  props: {
    alertMessage: {
      required: false,
      type: String
    },
    alertType: {
      default: "success",
      type: String
    },
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
    fields: [
      {
        autofocus: true,
        label: "email",
        key: "email",
        required: () => true,
        type: "email"
      },
      {
        label: "password",
        key: "password",
        required: () => true,
        type: "password"
      }
    ],
    form: {},
    password: null,
    passwordRules:
      process.env.NODE_ENV === "production" ? passwordRules : [() => true],
    validForm: false
  }),
  methods: {
    submit() {
      this.error = null;
      this.loading = true;

      this.$store
        .dispatch("auth/login", { email: this.email, password: this.password })
        .then(() => this.$router.replace("/"))
        .catch(error => {
          let details = "";
          if (error.body.email || error.body.password) {
            if (error.body.email) {
              details += `${this.$t("email")}:<br />`;
              details += error.body.email.join("<br />");
            }

            if (error.body.password) {
              error.body.email ? (details += "<br /><br />") : null;
              details += `${this.$t("password")}:<br />`;
              details += error.body.password.join("<br />");
            }
          } else {
            details =
              error.body.detail ||
              `ERROR ${error.status} - ${error.statusText}`;
          }
          this.error = details;
        })
        .finally(() => (this.loading = false));
    },
    register() {
      this.$router.replace({
        name: "register"
      });
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
