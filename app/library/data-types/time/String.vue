<template>
  <component v-if="value" :is="tag">{{ timeString }}</component>
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
    timeString() {
      if (!this.value) {
        return;
      }

      const timeString = this.value.split(".")[0];
      if (timeString.split(":").length == 3) {
        return new Date(
          new Date().setHours(...timeString.split(":"))
        ).toLocaleTimeString();
      } else if (timeString.length == 2 * 3) {
        // DICOM standard
        return new Date(
          new Date().setHours(...timeString.match(/.{2}/g))
        ).toLocaleTimeString();
      } else {
        // unformatted value
        return this.value;
      }
    }
  }
};
</script>
