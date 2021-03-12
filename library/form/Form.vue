<template>
  <v-form
    :lazy-validation="lazyValidation"
    ref="form"
    v-model="valid"
    @submit.prevent="submit"
  >
    <slot name="header" v-bind:value="value" />

    <div v-for="(field, i) in fields" :key="i">
      <component
        :autofocus="i == firstEditableFieldIndex"
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

    <div class="mt-4">
      <v-btn
        :disabled="loading || !valid"
        :elevation="0"
        :loading="loading"
        primary
        x-large
        type="submit"
      >
        submit
      </v-btn>

      <slot name="footer" v-bind:value="value" />
    </div>
  </v-form>
</template>

<script>
import { VTextField } from "vuetify/lib";
import { rules } from "./rules";

// Example field structure
// let fields = [
//   {
//     component: null, // custom input component
//     disabled: () => false,
//     label: "",
//     required: () => false,
//     rules: [],
//     slot: null, // custom slot
//     type: "text" // set default components per type
//   }
// ];

export default {
  name: "Form",
  props: {
    fields: { required: true, type: Array },
    lazyValidation: { default: true, type: Boolean },
    value: { default: () => ({}), type: Object }
  },
  components: { VTextField },
  data: () => ({
    dirty: false,
    loading: false,
    valid: true
  }),
  computed: {
    firstEditableFieldIndex() {
      return this.fields.findIndex(f => !(f.disabled ? f.disabled() : false));
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
    },
    submit() {
      // activate rules
      this.dirty = true;

      this.$nextTick(() => {
        const isValid = this.validate();
        if (isValid) {
          this.$emit("submit");
        }
      });
    },
    // validate will validate all inputs and return if they are all valid or not
    validate() {
      return this.$refs.form.validate();
    },
    // resetValidation will only reset input validation and not alter their state
    resetValidation() {
      this.$refs.form.resetValidation();
    }
  }
};
</script>
