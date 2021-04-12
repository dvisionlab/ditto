<template>
  <v-text-field
    :autofocus="autofocus"
    :disabled="disabled"
    :required="required"
    :rules="rules"
    :type="type"
    :value="value"
    @input="event => $emit('input', event)"
  >
    <template slot="append">
      <v-icon v-if="appendIcon" small @click="$emit('icon-click')">{{
        appendIcon
      }}</v-icon>
    </template>

    <template v-slot:label>
      <span class="text-capitalize">{{ label }}</span>
    </template>
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
    value: { required: false, type: String }
  }
};
</script>
