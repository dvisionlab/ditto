<template>
  <component v-if="value" :is="tag">{{ dateString }}</component>
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
  },
  computed: {
    dateString() {
      if (isNaN(Date.parse(this.value))) {
        return null;
      }
      return new Date(this.value).toLocaleDateString();
    }
  }
};
</script>
