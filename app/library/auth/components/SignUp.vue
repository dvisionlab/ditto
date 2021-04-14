<template>
  <div class="mx-auto">
    <ditto-form
      :fields="fields"
      :fields-style="{ 'flex-basis': '100%' }"
      :loading="loading"
      submit-label="register"
      :footer-style="{ 'flex-direction': 'row-reverse' }"
      v-model="form"
      @submit="submit"
    >
      <template v-slot:header>
        <h2 class="text-uppercase text-center primary--text my-4">
          {{ $t("register") }}
        </h2>
        <div>TODO</div>

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
            <a :disabled="loading" @click="$router.replace({ name: 'login' })">
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
import form from "../../../../form";

export default {
  name: "SignUp",
  components: { DittoForm: form.component },
  data: () => ({
    error: null,
    loading: false,
    fields: [],
    form: {}
  }),
  methods: {
    submit() {}
  }
};
</script>

<style scoped src="./style.css"></style>
