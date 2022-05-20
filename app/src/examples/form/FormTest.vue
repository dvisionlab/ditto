<template>
  <v-app>
    <ditto-form class="pa-4" :fields="fields" v-model="form" @submit="submit">
      <template v-slot:header>Custom header slot</template>
      <template v-slot:footer="data">Custom footer slot {{ data }}</template>
    </ditto-form>
  </v-app>
</template>

<script>
import Form from "@/../library/form/Form.vue";
import { customizeRules } from "@/../library/form/rules";
import fieldsProps from "@/../library/form/fieldsProps";

// this is the result of the default module import (import form from "@/../ditto/form")
const form = {
  component: Form,
  customizeRules,
  fieldsProps
};

// Customize rules
form.customizeRules({ passwordMinLength: 4 });

const CustomField = {
  props: form.fieldsProps,
  template: `<div class="pa-4 secondary white--text">I'm a custom field COMPONENT! {{ $props }}</div>`
};

const CustomSlot = {
  props: form.fieldsProps,
  template: `<div class="pa-4 secondary white--text">I'm a custom field SLOT! {{ $props }}</div>`
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
      },
      {
        group: "login group",
        list: [
          {
            appendIcon: "mdi-email",
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
        ]
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
