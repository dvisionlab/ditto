<template>
  <v-form
    :lazy-validation="lazyValidation"
    ref="form"
    v-model="valid"
    @submit.prevent="submit"
  >
    <slot name="header" v-bind:value="value" />

    <template v-for="(field, i) in fields">
      <v-card v-if="field.group" :key="`group-${i}`" outlined>
        <v-card-title>{{ field.group }}</v-card-title>
        <v-card-text>
          <form-field
            v-for="(field, ii) in field.list"
            :key="ii"
            :dirty="dirty"
            :field="field"
            :loading="loading"
            v-model="value"
          ></form-field>
        </v-card-text>
      </v-card>

      <form-field
        v-else
        :key="i"
        :dirty="dirty"
        :field="field"
        :loading="loading"
        v-model="value"
      ></form-field>
    </template>

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
import FormField from "./Field";

// Example field structure:
// let fields = [
//   {
//     autofocus: true,
//     component: null, // custom input component
//     disabled: () => false,
//     label: "",
//     required: () => false,
//     rules: [],
//     slot: null, // custom slot
//     type: "text" // set default components per type
//   }
// ];

// split in groups:
// let fields = [
//   group: "groupName",
//   list: [...]
// ]

// TODO support types: boolean, date

export default {
  name: "Form",
  components: { FormField },
  props: {
    fields: { required: true, type: Array },
    lazyValidation: { default: true, type: Boolean },
    value: { default: () => ({}), type: Object }
  },

  data: () => ({
    dirty: false,
    loading: false,
    valid: true
  }),
  methods: {
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
