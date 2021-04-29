<template>
  <div>
    <!-- thumbnail or dicom canvas -->
    <series-thumbnail v-if="showThumbnail" :value="data.thumbnail" />
    <dicom-canvas
      v-else-if="showCanvas"
      :canvas-id="canvasId || data[metadata.SeriesInstanceUID]"
      :clear-cache-on-destroy="clearCacheOnDestroy"
      :clear-on-destroy="clearOnDestroy"
      :series-id="data[metadata.SeriesInstanceUID]"
      :show-progress="showProgress"
      :style="{ height: '10em', width: '100%' }"
      :tools="canvasTools"
    />

    <div class="d-flex">
      <!-- TODO all metadata -->
      <div class="flex-grow-1 lh-small pa-1">
        <div>{{ data[metadata.SeriesDescription] }}</div>
        <div>
          <series-modality-string tag="span" :value="data[metadata.Modality]" />
          <span v-if="data[metadata.SeriesDate] && data[metadata.Modality]">
            |
          </span>
          <!-- TODO rename component + show datetime? -->
          <series-acquisition-date-string
            tag="span"
            :value="data[metadata.SeriesDate]"
          />
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>

<script>
import { stackTools } from "../defaults";
import metadata from "../metadata";
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
      canvasTools: this.tools || stackTools.preview,
      metadata
    };
  }
};
</script>
