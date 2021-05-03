<template>
  <!-- TODO manage exit modal before upload ends -->
  <div>
    <div>TODO: upload</div>
    <div>
      {{ selectedSeries.map(s => s[metadata.SeriesInstanceUID]) }}
    </div>

    <v-btn color="accent" @click="$emit('open-viewer')">Open viewer</v-btn>
  </div>
</template>

<script>
import metadataDictionary from "../../metadata";

export default {
  name: "DicomImportStep3",
  props: {
    selectedSeries: { required: true, type: Array }
  },
  data: () => ({
    metadata: metadataDictionary
  })
};
</script>
