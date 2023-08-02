<template>
  <div class="mx-auto">
    {{ dark }}
    <ditto-form
      :dark="dark"
      :fields="fields"
      :fields-style="{ 'flex-basis': '100%' }"
      :loading="loading"
      :submit-label="$t('auth.reset-password')"
      :footer-style="{ 'flex-direction': 'row-reverse' }"
      v-model="form"
      @submit="submit"
    >
      <template v-slot:header>
        <h2 class="text-uppercase primary--text my-4">
          {{ $t("auth.reset-password") }}
        </h2>
        <p class="ma-0 mb-4">
          Please enter your email address. You will receive a link to create a
          new password via email.
        </p>

        <div>
          <v-alert v-if="error" dense outlined type="error">
            <span v-html="error" />
          </v-alert>

          <!-- <div v-else class="error-placeholder" /> -->
        </div>
      </template>

      <template v-slot:footer>
        <div class="flex-grow-1">
          <b>
            <a
              :disabled="loading"
              @click="
                $router.replace({ name: 'login', query: { email: form.email } })
              "
            >
              <v-icon color="anchor">mdi-chevron-left</v-icon>
              Back to login
            </a>
          </b>
        </div>
      </template>
    </ditto-form>
  </div>
</template>

<script>
import Vue from "vue";
import Form from "../../form/Form";
import { customizeRules } from "../../form/rules";

// skip email default validation
customizeRules({
  emailValidationRegex: new RegExp(".*")
});

export default {
  name: "ForgotPassword",
  props: {
    dark: { default: false, type: Boolean }
  },
  components: { DittoForm: Form },
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
      }
    ],
    form: {
      email: null
    }
  }),
  created() {
    this.form.email = this.$route.query.email || null;
  },
  methods: {
    submit() {
      this.loading = true;

      Vue.$http.auth
        .requestPasswordReset(this.form.email)
        .then(() => {
          this.$router.replace({
            name: "login",
            query: {
              // TODO translation: An email with password reset instructions has been sent to your email address.
              alertMessage: "send-forgot-password-email-success",
              email: this.form.email
            }
          });
        })
        .catch(error => {
          this.error = !error.body
            ? `ERROR ${error.status} - ${error.statusText}`
            : Array.isArray(error.body)
            ? error.body.join(", ")
            : error.body.email
            ? error.body.email.join(", ")
            : error.body;
        })
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style scoped src="./style.css"></style>
