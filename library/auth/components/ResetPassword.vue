<template>
  <v-main>
    <v-card>
      <v-toolbar color="primary" flat>
        <v-toolbar-title>Password reset</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p>Choose a new password below</p>

        <v-form
          ref="form"
          @submit.prevent="submit"
          lazy-validation
          v-model="valid"
        >
          <v-text-field
            :label="labels.password"
            v-model="form.password"
            :append-icon="passwordHidden ? 'visibility_off' : 'visibility'"
            @click:append="() => (passwordHidden = !passwordHidden)"
            :type="passwordHidden ? 'password' : 'text'"
            :error-messages="errors.password"
            :disabled="loading"
            :rules="[rules.required('password')]"
            hint="At least 6 characters"
            @input="clearErrors('password')"
          ></v-text-field>

          <v-text-field
            :label="labels.password_confirmation"
            v-model="form.password_confirmation"
            :type="passwordHidden ? 'password' : 'text'"
            :error-messages="errors.password_confirmation"
            :disabled="loading"
            :rules="[rules.required('password_confirmation')]"
            @input="clearErrors('password')"
          ></v-text-field>

          <v-layout class="mt-4 mx-0">
            <v-spacer></v-spacer>

            <v-btn
              type="submit"
              :loading="loading"
              :disabled="loading || !valid"
              color="primary"
            >
              Set new password
            </v-btn>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>
import Form from "../mixins/form";

export default {
  name: "ResetPassword",
  mixins: [Form],
  data: () => ({
    passwordHidden: true,
    labels: {
      password: "New Password",
      password_confirmation: "Confirm New Password"
    },
    form: {
      token: null,
      email: null,
      password: null,
      password_confirmation: null
    }
  }),
  created() {
    this.form.email = this.$route.query.email;
    this.form.token = this.$route.params.token;
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        // axios
        //   .post(api.path("password.reset"), this.form)
        //   .then(res => {
        //     this.$toast.success("Your password has been reset.");
        //     this.$router.push({
        //       name: "login",
        //       query: { email: this.form.email }
        //     });
        //   })
        //   .catch(err => {
        //     this.handleErrors(err.response.data.errors);
        //   })
        //   .then(() => {
        //     this.loading = false;
        //   });
      }
    }
  }
};
</script>

<style></style>
