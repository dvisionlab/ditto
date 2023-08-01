<template>
  <v-text-field
    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
    :type="showPass ? 'text' : 'password'"
    :autofocus="autofocus"
    :disabled="disabled"
    :required="required"
    :rules="rules"
    :value="value"
    :dark="dark"
    :label="label"
    @click:append="showPass = !showPass"
    @input="event => $emit('input', event)"
  >
    <!--<template v-slot:label>
      <span class="text-capitalize">{{ label }}</span>
    </template>-->
  </v-text-field>
</template>

<script>
export default {
  name: "PasswordField",
  props: {
    appendIcon: { required: false, type: String },
    autofocus: { default: false, type: Boolean },
    disabled: { default: false, type: Boolean },
    label: { required: true, type: String },
    required: { default: false, type: Boolean },
    rules: { required: false, type: Array },
    type: { required: true, type: String },
    dark: { required: false, default: false, type: Boolean },
    value: { required: false, type: String }
  },
  data: function() {
    return {
        showPass: false,
      };
  }
};
</script>
