<template>
  <!-- TODO manage exit modal before upload ends (minimize) -->
  <div>
    <div>Upload:</div>
    <div>{{ selectedSeries.map(s => s.seriesUID) }}</div>

    <slot name="step-3" />

    <v-btn color="accent" disabled @click="$emit('open-viewer')">
      Open viewer
    </v-btn>
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
