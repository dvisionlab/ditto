<template>
  <v-form
    :lazy-validation="lazyValidation"
    ref="form"
    :dark="dark"
    v-model="valid"
    @submit.prevent="submit"
  >
    <slot name="header" v-bind:value="value" />

    <div class="d-flex flex-wrap" :style="{ margin: '0 -1em' }">
      <template v-for="(field, i) in fields">
        <div v-if="field.group" :key="`group-${i}`" class="flex-item">
          <v-card :dark="dark" class="mt-1" outlined>
            <v-card-title class="text-uppercase">{{
              field.group
            }}</v-card-title>
            <v-card-text>
              <form-field
                v-for="(field, ii) in field.list"
                :key="ii"
                :dirty="dirty"
                :field="field"
                :loading="loading"
                :style="fieldsStyle"
                v-model="value"
                @icon-click="field => $emit('icon-click', field)"
              ></form-field>
            </v-card-text>
          </v-card>
        </div>

        <form-field
          v-else
          :key="i"
          class="flex-item"
          :dirty="dirty"
          :dark="dark"
          :field="field"
          :loading="loading"
          :style="fieldsStyle"
          v-model="value"
          @icon-click="field => $emit('icon-click', field)"
        ></form-field>
      </template>
    </div>

    <div class="d-flex flex-wrap align-center mt-4" :style="footerStyle">
      <v-btn
        :dark="dark"
        class="flex-grow-1"
        color="primary"
        :disabled="loading || !valid"
        :elevation="0"
        :loading="loading"
        x-large
        type="submit"
      >
        <span>{{ submitLabel }}</span>
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
//     hint: "",
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
    fieldsStyle: { required: false, type: Object },
    footerStyle: { required: false, type: Object },
    lazyValidation: { default: true, type: Boolean },
    loading: { default: false, type: Boolean },
    submitLabel: { default: "submit", type: String },
    value: { default: () => ({}), type: Object },
    dark: { default: false, type: Boolean }
  },

  data: () => ({
    dirty: false,
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

<style lang="scss" scoped>
.flex-item {
  flex-basis: 50%;
  flex-grow: 1;
  min-width: 200px;
  padding: 0 1em;
}
</style>
