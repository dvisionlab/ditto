<template>
  <component :is="tag" class="text-uppercase">{{ value }}</component>
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
