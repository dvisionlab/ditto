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
          <div class="pb-2">
            <v-alert
              v-if="alertMessage"
              dismissible
              :icon="false"
              :type="alertType"
            >
              {{ $t(alertMessage) }}
            </v-alert>

            <v-alert
              v-if="error"
              dense
              icon="mdi-alert-circle"
              outlined
              type="error"
            >
              <b v-html="error" />
            </v-alert>
          </div>
        </template>

        <template v-slot:footer>
          <div class="mt-4 text-right" :style="{ 'flex-basis': '100%' }">
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
    </div>
  </v-main>
</template>

<script>
import form from "../../../form";
if (process.env.NODE_ENV !== "production") {
  form.customizeRules({ passwordValidationRegex: new RegExp(".*") });
}

export default {
  name: "LoginForm",
  components: { DittoForm: form.component },
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
    error: null,
    fields: [
      {
        appendIcon: "mdi-email",
        autofocus: true,
        label: "email",
        key: "email",
        required: () => true,
        type: "email"
      },
      {
        appendIcon: "mdi-lock",
        label: "password",
        key: "password",
        required: () => true,
        type: "password"
      }
    ],
    form: {}
  }),
  methods: {
    submit() {
      this.error = null;
      this.loading = true;

      this.$store
        .dispatch("auth/login", this.form)
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
