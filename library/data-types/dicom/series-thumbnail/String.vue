<template>
  <img
    alt="Missing series preview"
    class="d-flex"
    :src="value"
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
    width: {
      default: "6em",
      type: String
    }
  }
};
</script>
