<template>
  <!-- TODO manage exit modal before upload ends -->
  <div>
    <div>TODO: upload</div>
    <div>{{ selectedSeries.map(s => s.seriesUID) }}</div>

    <v-btn color="accent" @click="$emit('open-viewer')">Open viewer</v-btn>
  </div>
</template>

<script>
export default {
  name: "DicomImportStep3",
  props: {
    selectedSeries: { required: true, type: Array }
  }
};
</script>
