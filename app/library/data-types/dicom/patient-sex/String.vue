<template>
  <component class="text-capitalize" :is="tag">{{ string }}</component>
</template>

<script>
// Enumerated Values:
// M
// male
// F
// female
// O
// other

export default {
  props: {
    tag: {
      default: "div",
      type: String
    },
    value: {
      required: false,
      type: String
    }
  },
  computed: {
    string() {
      switch (this.value) {
        case "F": {
          return "female";
        }
        case "M": {
          return "male";
        }
        case "O": {
          return "other";
        }
        default: {
          return this.value;
        }
      }
    }
  }
};
</script>
