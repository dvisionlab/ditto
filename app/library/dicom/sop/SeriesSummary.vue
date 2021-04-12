<template>
  <div>
    <!-- thumbnail or dicom canvas -->
    <series-thumbnail v-if="showThumbnail" :value="data.thumbnail" />
    <dicom-canvas
      v-else-if="showCanvas"
      :canvas-id="`nav-${data.seriesUID}`"
      clear-cache-on-destroy
      clear-on-destroy
      :series-id="data.seriesUID"
      :style="{ minHeight: '6em' }"
      :tools="tools"
    />

    <div class="lh-small pa-1">
      <div>{{ data.seriesDescription }}</div>
      <div>
        <series-acquisition-date-string tag="span" :value="data.x00080022" />
        <span v-if="data.x00080022 && data.seriesModality"> | </span>
        <series-modality-string tag="span" :value="data.seriesModality" />
      </div>
    </div>

    <slot />
  </div>
</template>

<script>
import { stackMetadata, stackTools } from "../defaults";
import dicomDataTypes from "../../../dicomDataTypes";
import DicomCanvas from "../render/Canvas";

export default {
  name: "SeriesSummary",
  components: {
    ...dicomDataTypes,
    DicomCanvas
  },
  props: {
    data: { required: true, type: Object },
    showCanvas: { default: true, type: Boolean },
    showThumbnail: { default: false, type: Boolean }
  },
  data: () => ({
    fields: stackMetadata.series,
    tools: stackTools.preview
  }),
  methods: {
    getComponentName(field) {
      return field.charAt(0).toUpperCase() + field.slice(1) + "String";
    }
  }
};
</script>
