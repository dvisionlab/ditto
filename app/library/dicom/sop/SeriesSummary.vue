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

    <div class="d-flex">
      <!-- TODO all metadata -->
      <div class="flex-grow-1 lh-small pa-1">
        <div>{{ data.seriesDescription }}</div>
        <div>
          <series-modality-string tag="span" :value="data.seriesModality" />
          <span v-if="data.x00080022 && data.seriesModality"> | </span>
          <series-acquisition-date-string tag="span" :value="data.x00080022" />
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>

<script>
import { stackTools } from "../defaults";
import dicomDataTypes from "../../data-types/dicom";
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
      canvasTools: this.tools || stackTools.preview
    };
  }
};
</script>
