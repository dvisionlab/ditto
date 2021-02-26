<template>
  <v-main>
    <div class="w-50 mx-auto">
      <h2 class="text-uppercase text-center my-4">
        {{ $t("register") }}
      </h2>

      <div>TODO</div>

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
          {{ $t("register") }}
        </v-btn>
      </div>
    </div>
  </v-main>
</template>

<script>
export default {
  name: "SignUp",
  data: () => ({
    error: null,
    loading: false,
    validForm: false
  }),
  methods: {
    submit() {}
  }
};
</script>
