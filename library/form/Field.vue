<template>
  <div>
    <component
      :autofocus="field.autofocus"
      :is="getComponentName(field)"
      :disabled="
        loading || field.disabled ? field.disabled(field, value) : false
      "
      :label="field.label"
      :required="field.required ? field.required(field, value) : false"
      :rules="dirty ? getRules(field) : undefined"
      :type="field.type"
      v-model="value[field.key]"
    />

    <component v-if="field.slot" :is="field.slot" />
  </div>
</template>

<script>
import { rules } from "./rules";
import { VTextField } from "vuetify/lib";

export default {
  name: "Field",
  components: { VTextField },
  props: {
    dirty: { default: false, type: Boolean },
    field: { required: true, type: Object },
    loading: { default: false, type: Boolean },
    value: { default: () => ({}), type: Object }
  },
  methods: {
    getComponentName(field) {
      if (field.component) {
        return field.component;
      }

      let name;
      switch (field.type) {
        case "boolean": {
          name = "v-checkbox";
          break;
        }

        case "text": {
          name = "v-text-field";
          break;
        }

        default:
          name = "v-text-field";
          break;
      }

      return name;
    },
    getRules(field) {
      // Default rules
      let result = [];
      if (field.required) {
        result.push(...rules.required);
      }

      if (rules[field.type]) {
        result.push(...rules[field.type]);
      }

      // Add custom rules
      return [...result, ...(field.rules || [])];
    }
  }
};
</script>
