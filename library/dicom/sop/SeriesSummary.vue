<template>
  <div>
    <!-- thumbnail or dicom canvas -->
    <series-thumbnail v-if="showThumbnail" :value="data.thumbnail" />
    <dicom-canvas
      v-else-if="showCanvas"
      :canvas-id="canvasId || data.seriesUID"
      :clear-cache-on-destroy="clearCacheOnDestroy"
      :clear-on-destroy="clearOnDestroy"
      :series-id="data.seriesUID"
      :show-progress="showProgress"
      :style="{ height: '10em', width: '100%' }"
      :tools="canvasTools"
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
    canvasId: { required: false, type: String },
    clearCacheOnDestroy: { default: true, type: Boolean },
    clearOnDestroy: { default: true, type: Boolean },
    data: { required: true, type: Object },
    showCanvas: { default: true, type: Boolean },
    showProgress: { default: false, type: Boolean },
    showThumbnail: { default: false, type: Boolean },
    tools: { required: false, type: Array }
  },
  data() {
    return {
      canvasTools: this.tools || stackTools.preview,
      fields: stackMetadata.series
    };
  },
  methods: {
    getComponentName(field) {
      return field.charAt(0).toUpperCase() + field.slice(1) + "String";
    }
  }
};
</script>
