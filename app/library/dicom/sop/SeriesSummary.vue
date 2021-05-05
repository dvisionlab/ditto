<template>
  <div>
    <!-- thumbnail or dicom canvas -->
    <thumbnail-string v-if="showThumbnail" :value="data.thumbnail" />
    <dicom-canvas
      v-else-if="showCanvas"
      :canvas-id="canvasId || data.larvitarSeriesInstanceUID"
      :clear-cache-on-destroy="clearCacheOnDestroy"
      :clear-on-destroy="clearOnDestroy"
      :series-id="data.larvitarSeriesInstanceUID"
      :show-progress="showProgress"
      :style="{ height: '10em', width: '100%' }"
      :tools="canvasTools"
    />

    <div class="d-flex">
      <div class="flex-grow-1 ma-auto lh-small pa-1">
        <template v-for="key in metadata">
          <component
            v-if="getComponentName(metadataDictionary[key])"
            :key="key"
            :is="getComponentName(metadataDictionary[key])"
            :value="data[metadataDictionary[key]]"
          />
          <div v-else :key="key">{{ data[metadataDictionary[key]] }}</div>
        </template>
      </div>

      <slot />
    </div>
  </div>
</template>

<script>
import { stackTools } from "../defaults";
import metadataDictionary from "../metadata";
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
      // TODO allow to customize this
      metadata: ["SeriesDescription"],
      metadataDictionary
    };
  },
  methods: {
    getComponentName(field) {
      const name = `${field}-string`;
      return this.$options.components[name] ? name : null;
    }
  }
};
</script>
