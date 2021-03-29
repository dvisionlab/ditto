<template>
  <div class="p-relative d-flex w-100 h-100 black">
    <v-icon v-if="error" class="ma-auto" dark>
      mdi-alert-decagram-outline
    </v-icon>
    <div
      v-else
      class="w-100 h-100"
      ref="canvas"
      :id="validCanvasId"
      v-resize:debounce="onResize"
    />

    <v-progress-linear
      v-if="showProgress && progress !== 100"
      absolute
      bottom
      :height="10"
      :value="progress"
    />
  </div>
</template>

<script>
import {
  addTools,
  clearSeriesData,
  deleteViewport,
  disableCanvas,
  getSeriesStack,
  renderSeries,
  resizeViewport,
  seriesIdToElementId
} from "../utils";
import resize from "vue-resize-directive";

export default {
  name: "DicomCanvas",
  directives: { resize },
  props: {
    clearCacheOnDestroy: { default: false, type: Boolean },
    clearOnDestroy: { default: false, type: Boolean },
    canvasId: { required: true, type: String },
    seriesId: { required: true, type: [String, Number] },
    showProgress: { default: true, type: Boolean },
    stack: { required: false, type: Object },
    tools: { required: false, type: Array }
  },
  data: () => ({
    error: false,
    validCanvasId: null
  }),
  beforeMount() {
    // Compute valid element id (dots not allowed)
    this.validCanvasId = seriesIdToElementId(this.canvasId);
  },
  mounted() {
    const stack = this.stack || getSeriesStack(this.seriesId);
    if (stack) {
      renderSeries(this.validCanvasId, stack);
      // TODO pass tools directly
      addTools(this.validCanvasId, this.tools);
    } else {
      console.warn("Series stack not available for canvas", this.validCanvasId);
      this.error = true;
    }
  },
  beforeDestroy() {
    // disable larvitar canvas
    // TODO LT not working, pass this.$refs.canvas?
    disableCanvas(this.validCanvasId);
    // TODO LT preserve previous viewport settings?
    deleteViewport(this.validCanvasId);

    if (this.clearOnDestroy) {
      clearSeriesData(this.seriesId, this.clearCacheOnDestroy);
    }
  },
  computed: {
    // TODO access larvitar store?
    larvitarViewport() {
      return {};
      //   return this.$store.getters["larvitar/viewport"](this.validCanvasId) || {};
    },
    progress() {
      return this.larvitarViewport.loading;
    }
  },
  methods: {
    onResize() {
      resizeViewport(this.validCanvasId);
    }
  }
};
</script>
