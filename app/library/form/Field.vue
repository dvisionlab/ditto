<template>
  <div>
    <component
      :is="getComponentName(field)"
      :append-icon="field.appendIcon"
      :autofocus="field.autofocus"
      :clearable="field.clearable"
      :disabled="
        loading || (field.disabled ? field.disabled(field, value) : false)
      "
      :hint="field.hint"
      :items="field.items"
      :label="field.label"
      :placeholder="field.placeholder"
      :required="required"
      :rules="dirty ? getRules(field) : undefined"
      :type="field.type"
      v-model="value[field.key]"
      @icon-click="() => $emit('icon-click', field)"
    >
      <template slot="append">
        <v-icon v-if="field.appendIcon" small>{{ field.appendIcon }}</v-icon>
      </template>
    </component>

    <component v-if="field.slot" :is="field.slot" v-bind="{ field, value }" />
  </div>
</template>

<script>
import { rules } from "./rules";
import { VTextField, VSelect } from "vuetify/lib";

export default {
  name: "Field",
  components: { VTextField, VSelect },
  props: {
    dirty: { default: false, type: Boolean },
    field: { required: true, type: Object },
    loading: { default: false, type: Boolean },
    value: { default: () => ({}), type: Object }
  },
  computed: {
    required() {
      return this.field.required
        ? this.field.required(this.field, this.value)
        : false;
    }
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

        case "select": {
          name = "v-select";
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

<style scoped>
::v-deep .v-label {
  text-transform: capitalize;
}
</style>
