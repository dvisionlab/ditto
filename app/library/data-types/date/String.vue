<template>
  <component v-if="value" :is="tag">{{ dateString }}</component>
</template>

<script>
export default {
  props: {
    dicom: { default: false, type: Boolean },
    tag: { default: "div", type: String },
    value: { required: false, type: String }
  },
  computed: {
    dateString() {
      let date;

      if (this.dicom) {
        // dicom date format: YYYYMMDD
        const pattern = /(\d{4})(\d{2})(\d{2})/;
        date = new Date(this.value.replace(pattern, "$2-$3-$1"));
      } else {
        date = new Date(this.value);
      }

      if (isNaN(Date.parse(date))) {
        return this.value;
      }

      return date.toLocaleDateString();
    }
  }
};
</script>
