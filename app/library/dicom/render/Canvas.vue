<template>
  <div class="d-flex w-100 h-100 black" :style="{ position: 'relative' }">
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
      :height="5"
      :value="progress"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import resize from "vue-resize-directive";

import { stackTools } from "../defaults";
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
    tools: { default: () => stackTools.default, type: Array }
  },
  data: () => ({
    error: false,
    validCanvasId: null
  }),
  beforeDestroy() {
    this.destroy();
  },
  computed: {
    ...mapState("larvitar", {
      progress(state) {
        return (state.series[this.seriesId] || {}).progress;
      }
    }),
    // TODO LT show a loader if viewport not ready
    viewport() {
      return this.getViewportFn(this.$store, this.seriesId, this.validCanvasId);
    }
  },
  methods: {
    destroy() {
      // disable larvitar canvas
      disableCanvas(this.$refs.canvas);
      deleteViewport(this.$refs.canvas);

      if (this.clearOnDestroy) {
        clearSeriesData(this.seriesId, this.clearCacheOnDestroy);
      }
    },
    onResize() {
      resizeViewport(this.validCanvasId);
    }
  },
  watch: {
    canvasId: {
      handler() {
        // Compute valid element id (dots not allowed)
        this.validCanvasId = seriesIdToElementId(this.canvasId);
      },
      immediate: true
    },
    seriesId: {
      handler() {
        if (this.$refs.canvas) {
          this.destroy();
        }

        // !!! setTimeout needed to have a canvas div with the correct height
        setTimeout(() => {
          const stack = this.stack || getSeriesStack(this.seriesId);

          if (stack) {
            renderSeries(this.validCanvasId, stack);
            addTools(this.validCanvasId, this.tools);
          } else {
            console.warn(
              "Series stack not available for canvas",
              this.validCanvasId
            );
            this.error = true;
          }
        }, 0);
      },
      immediate: true
    }
  }
};
</script>
