<template>
  <div>
    <component
      :append-icon="field.appendIcon"
      :autofocus="field.autofocus"
      :class="{ 'mt-1': field.component }"
      :is="getComponentName(field)"
      :disabled="
        loading || (field.disabled ? field.disabled(field, value) : false)
      "
      :hint="field.hint"
      :label="field.label"
      :required="required"
      :rules="dirty ? getRules(field) : undefined"
      :type="field.type"
      v-model="value[field.key]"
      @icon-click="() => $emit('icon-click', field)"
    >
      <template slot="append">
        <v-icon v-if="field.appendIcon" small>{{ field.appendIcon }}</v-icon>
      </template>

      <template v-slot:label>
        <span class="text-capitalize">{{ field.label }}</span>
      </template>
    </component>

    <component v-if="field.slot" :is="field.slot" v-bind="{ field, value }" />
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
