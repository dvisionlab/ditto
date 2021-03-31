<template>
  <div class="w-50 mx-auto">
    <ditto-form
      :fields="fields"
      :fields-style="{ 'flex-basis': '100%' }"
      :loading="loading"
      submit-label="login"
      v-model="form"
      @submit="submit"
    >
      <template v-slot:header>
        <h2 class="text-uppercase primary--text my-4">
          {{ $t("login") }}
        </h2>

        <div>
          <template v-if="alertMessage || error">
            <v-alert
              v-if="alertMessage"
              close-icon="mdi-close"
              dense
              dismissible
              outlined
              :type="alertType"
              @input="dismissAlert"
            >
              {{ $t(alertMessage) }}
            </v-alert>

            <v-alert v-if="error" dense outlined type="error">
              <span v-html="error" />
            </v-alert>
          </template>

          <!-- <div v-else class="error-placeholder" /> -->
        </div>
      </template>

      <template v-slot:footer>
        <div class="mt-6 text-right" :style="{ 'flex-basis': '100%' }">
          <div v-if="allowPasswordReset">
            <a @click="resetPassword"><b>Forgot Password?</b></a>
          </div>
          <div v-if="allowUserRegistration">
            New here?
            <a @click="register">Sign up</a>.
          </div>
        </div>
      </template>
    </ditto-form>
  </div>
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
    },
    authRoot: {
      required: true,
      type: String
    }
  },
  data: () => ({
    loading: false,
    error: null,
    fields: [
      {
        // appendIcon: "mdi-email",
        autofocus: true,
        label: "email",
        key: "email",
        required: () => true,
        type: "email"
      },
      {
        // appendIcon: "mdi-lock",
        label: "password",
        key: "password",
        required: () => true,
        type: "password"
      }
    ],
    form: {}
  }),
  created() {
    this.form.email = this.$route.query.email || null;
  },
  methods: {
    dismissAlert() {
      // eslint-disable-next-line no-unused-vars
      var { alertMessage, alertType, ...query } = this.$route.query;
      this.$router.replace({ query });
    },
    submit() {
      this.error = null;
      this.loading = true;

      this.$store
        .dispatch("auth/login", this.form)
        .then(() => this.$router.replace(`${this.authRoot}/`))
        .catch(error => {
          let details = "";
          if (error.body) {
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
          } else {
            details = error;
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
        query: { email: this.form.email }
      });
    }
  }
};
</script>

<style scoped src="./style.css"></style>
