<template>
  <img
    v-if="value"
    alt="Missing series preview"
    class="d-flex"
    :src="base64 ? 'data:image/png;base64,' + value : value"
    :style="{ width }"
  />
</template>

<script>
export default {
  props: {
    value: {
      required: false,
      type: String
    },
    base64: {
      required: false,
      type: Boolean,
      default: false
    },
    width: {
      default: "6em",
      type: String
    }
  }
};
</script>
