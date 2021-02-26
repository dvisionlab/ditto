<template
  ><v-main>
    <v-card>
      <v-toolbar color="primary" flat>
        <v-toolbar-title>Password reset</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p>
          Please enter your email address. You will receive a link to create a
          new password via email.
        </p>

        <v-form
          ref="form"
          @submit.prevent="submit"
          lazy-validation
          v-model="valid"
        >
          <v-text-field
            :label="labels.email"
            v-model="form.email"
            type="email"
            :error-messages="errors.email"
            :rules="[rules.required('email')]"
            :disabled="loading"
          ></v-text-field>

          <v-layout class="mt-4 mx-0">
            <v-spacer></v-spacer>

            <v-btn
              text
              :disabled="loading"
              :to="{ name: 'login', query: { email: form.email } }"
              color="grey darken-2"
              exact
            >
              Back to login
            </v-btn>

            <v-btn
              type="submit"
              :loading="loading"
              :disabled="loading || !valid"
              color="primary"
              class="ml-4"
            >
              Get password
            </v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import Vue from "vue";
import Form from "../mixins/form";

export default {
  name: "ForgotPassword",
  mixins: [Form],
  data: () => ({
    form: {
      email: null
    }
  }),
  created() {
    this.form.email = this.$route.query.email || null;
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        // axios
        //   .post(api.path("password.forgot"), this.form)
        //   .then(res => {
        //     this.$toast.info(
        //       "An email with password reset instructions has been sent to your email address."
        //     );
        //     this.$emit("success");
        //   })
        //   .catch(err => {
        //     this.handleErrors(err.response.data.errors);
        //   })
        //   .then(() => {
        //     this.loading = false;
        //   });

        console.log("HERE", Vue.$http.auth);

        Vue.$http.auth
          .resetPasswordWithEmail(this.form.email)
          .then(result => {
            console.log("THEN", result);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  }
};
</script>

<style></style>
