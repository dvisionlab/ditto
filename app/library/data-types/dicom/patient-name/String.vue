<template>
  <component class="text-capitalize" :is="tag">{{ string }}</component>
</template>

<script>
// prefix^LastName^FirstName^MiddleName^suffix

export default {
  props: {
    tag: {
      default: "div",
      type: String
    },
    value: {
      default: "",
      required: false
    }
  },
  computed: {
    string() {
      return this.value.split("^").join(" ");
    }
  }
};
</script>
