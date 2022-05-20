<template>
  <component v-if="value !== undefined && value !== null" :is="tag"
    >{{ value.toFixed(2) }} mm</component
  >
</template>

<script>
export default {
  props: {
    tag: {
      default: "div",
      type: String
    },
    value: {
      required: false,
      type: Number
    }
  }
};
</script>
