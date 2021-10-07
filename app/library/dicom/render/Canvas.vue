<template>
  <div
    class="d-flex w-100 h-100 black"
    :style="{ position: 'relative' }"
    @contextmenu.prevent
  >
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
    <div
      :style="{
        height: '85%',
        width: '20px',
        position: 'absolute',
        right: '0'
      }"
    >
      <v-slider
        v-if="showSlider"
        class="full-height-slider"
        vertical
        v-model="sliderSliceId"
        min="1"
        :max="viewport.maxSliceId"
      ></v-slider>
    </div>

    <div v-if="!error && !isReady" class="ready-status">
      <v-progress-circular class="ma-auto" color="white" indeterminate />
    </div>

    <v-progress-linear
      v-if="showProgress && progress !== 100"
      absolute
      bottom
      :height="5"
      :value="progress"
    />

    <v-avatar
      v-if="
        showMultiframeIcon &&
          stackMetadata &&
          (stackMetadata.series || {}).isMultiframe
      "
      color="black"
      :size="20"
      :style="{ bottom: 0, position: 'absolute', margin: '5px' }"
    >
      <v-icon color="white" small>mdi-layers-triple-outline</v-icon>
    </v-avatar>

    <slot name="stack-metadata" v-bind="stackMetadata"></slot>
    <slot name="viewport-data" v-bind="viewport"></slot>
    <slot
      name="viewport-slider"
      v-bind:i="viewport.sliceId"
      v-bind:n="viewport.maxSliceId"
    ></slot>
  </div>
</template>

<script>
import resize from "vue-resize-directive";

import { stackMetadata as stackMetadataDict, stackTools } from "../defaults";
import {
  addTools,
  clearSeriesData,
  clearSeriesCache,
  deleteViewport,
  disableCanvas,
  getSeriesStack,
  renderSeries,
  resizeViewport,
  seriesIdToElementId,
  updateSeriesSlice
} from "../utils";

const defaultGetProgressFn = (store, seriesId) =>
  (store.state.larvitar.series[seriesId] || {}).progress;
const defaultGetViewportFn = (store, seriesId, canvasId) =>
  store.getters["larvitar/viewport"](canvasId) || {};
const defaultgetCanvasTypeFn = store => store.state.viewer.currentCanvasType;

export default {
  name: "DicomCanvas",
  directives: { resize },
  props: {
    clearCacheOnDestroy: { default: false, type: Boolean },
    clearOnDestroy: { default: false, type: Boolean },
    canvasId: { required: true, type: String },
    getProgressFn: { default: defaultGetProgressFn, type: Function },
    getViewportFn: { default: defaultGetViewportFn, type: Function },
    getCanvasTypeFn: { default: defaultgetCanvasTypeFn, type: Function },
    seriesId: { required: true, type: [String, Number] },
    showMultiframeIcon: { default: false, type: Boolean },
    showProgress: { default: false, type: Boolean },
    stack: { required: false, type: Object },
    tools: { default: () => stackTools.default, type: Array },
    toolsHandlers: { required: false, type: Object },
    showSlider: { default: false, type: Boolean }
  },
  data: () => ({
    error: false,
    stackMetadata: null,
    validCanvasId: null
  }),
  beforeDestroy() {
    this.destroy();
  },
  computed: {
    isReady() {
      return this.viewport.ready;
    },
    progress() {
      return this.getProgressFn(this.$store, this.seriesId, this.validCanvasId);
    },
    viewport() {
      return this.getViewportFn(this.$store, this.seriesId, this.validCanvasId);
    },
    canvasType() {
      return this.getCanvasTypeFn(this.$store);
    },
    sliderSliceId: {
      get() {
        return (
          this.getViewportFn(this.$store, this.seriesId, this.validCanvasId)
            .sliceId + 1
        );
      },
      set(index) {
        let sliceId = index - 1;
        if (
          this.getViewportFn(this.$store, this.seriesId, this.validCanvasId)
            .sliceId !== undefined &&
          sliceId >= 0
        ) {
          updateSeriesSlice(this.validCanvasId, this.seriesId, sliceId);
        }
      }
    }
  },
  methods: {
    destroy() {
      // disable larvitar canvas
      disableCanvas(this.$refs.canvas);
      deleteViewport(this.$refs.canvas);

      // clear cache (!!! NOTE: cornerstone should not cache images if not required)
      clearSeriesCache(this.seriesId);
      // check for canvas type, only remove data if current canvas type is 2D
      if (this.clearOnDestroy && this.canvasType == 0) {
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
            // fill stack metadata
            this.stackMetadata = Object.keys(stackMetadataDict).reduce(
              (result, category) => {
                result[category] = stackMetadataDict[category].reduce(
                  (o, key) => ({ ...o, [key]: stack[key] }),
                  {}
                );
                return result;
              },
              {}
            );

            // render
            let self = this;
            renderSeries(this.validCanvasId, stack).then(function() {
              // await render series
              addTools(self.tools, self.validCanvasId, self.toolsHandlers);
              self.$emit("ready");
            });
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

<style scoped>
.ready-status {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
}
.full-height-slider >>> .v-slider {
  height: 85%;
}
.v-input {
  height: 100% !important;
}
.v-input >>> .v-input__slot {
  height: 100% !important;
}
</style>
