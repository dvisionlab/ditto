<template>
  <component v-if="value" :is="tag">
    AN <b>{{ value }}</b>
  </component>
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
      type: String
    }
  }
};
</script>
