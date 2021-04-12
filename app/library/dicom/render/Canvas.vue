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

const defaultGetViewportFn = (store, seriesId, canvasId) =>
  store.getters["larvitar/viewport"](canvasId) || {};

export default {
  name: "DicomCanvas",
  directives: { resize },
  props: {
    clearCacheOnDestroy: { default: false, type: Boolean },
    clearOnDestroy: { default: false, type: Boolean },
    canvasId: { required: true, type: String },
    getViewportFn: { default: defaultGetViewportFn, type: Function },
    seriesId: { required: true, type: [String, Number] },
    showProgress: { default: true, type: Boolean },
    stack: { required: false, type: Object },
    tools: { default: () => [], type: Array }
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
    progress() {
      return this.getViewportFn(this.$store, this.seriesId, this.validCanvasId)
        .loading;
    }
  },
  methods: {
    onResize() {
      resizeViewport(this.validCanvasId);
    }
  }
};
</script>
