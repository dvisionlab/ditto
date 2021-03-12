<template>
  <div class="pa-2">
    <ditto-form :fields="fields" v-model="form" @submit="submit">
      <template v-slot:header>Header slot</template>
      <template v-slot:footer="data">Footer slot {{ data }}</template>
    </ditto-form>
  </div>
</template>

<script>
import form from "@/../ditto/form";

const CustomField = {
  props: form.fieldsProps,
  template: `<div class="pa-4 accent white--text">custom COMPONENT! {{ $props }}</div>`
};

const CustomSlot = {
  props: form.fieldsProps,
  template: `<div class="pa-4 primary white--text">custom SLOT! {{ $props }}</div>`
};

export default {
  components: { DittoForm: form.component },
  data: () => ({
    fields: [
      {
        disabled: () => true,
        label: "text",
        key: "text",
        required: false,
        type: "text"
      },
      {
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
      },
      {
        label: "number",
        key: "number",
        rules: [v => v > 10 || "> 10"],
        type: "number"
      },
      {
        component: CustomField,
        label: "custom field",
        key: "component"
      },
      {
        slot: CustomSlot,
        label: "field with slot",
        key: "slot"
      }
    ],
    form: { text: "precompiled text", component: "custom value" }
  }),
  methods: {
    submit() {
      console.log("Form submit", this.form);
    }
  }
};
</script>

<style></style>
