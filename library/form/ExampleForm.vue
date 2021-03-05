<template>
  <v-main>
    <ditto-form :fields="fields" v-model="form" />
  </v-main>
</template>

<script>
import Form from "./Form";

export default {
  name: "LoginForm",
  components: { DittoForm: Form },
  data: () => ({
    fields: [
      {
        label: "text",
        key: "text",
        required: true,
        type: "text"
      },
      {
        label: "email",
        key: "email",
        required: true,
        type: "email"
      },
      {
        label: "password",
        key: "password",
        required: true,
        type: "password"
      }
    ],
    form: {}
  })
};
</script>
