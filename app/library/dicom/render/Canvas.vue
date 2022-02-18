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

    <div v-if="!error && !downloaded && showPercentage">
      <v-progress-circular
        class="text-center mt-8 mr-8"
        color="accent"
        :size="50"
        :value="lastPercentageStep"
        :indeterminate="serieDownloadPercentage == 100"
      >
        {{
          serieDownloadPercentage == 100
            ? "loading masks"
            : serieDownloadPercentage
        }}
      </v-progress-circular>
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

    <!-- slots -->
    <slot name="stack-metadata" v-bind="stackMetadata"></slot>

    <slot name="viewport-data" v-bind="viewport"></slot>

    <slot
      v-if="stackMetadata"
      name="multiframe"
      v-bind:canvas-id="validCanvasId"
      v-bind:value="
        stackMetadata.series ? stackMetadata.series.isMultiframe : false
      "
    ></slot>

    <slot
      v-if="showSlider"
      name="viewport-slider"
      v-bind:i="viewport.sliceId"
      v-bind:n="viewport.maxSliceId"
    >
      <!-- default slider -->
      <div
        :style="{
          height: '85%',
          width: '30px',
          position: 'absolute',
          top: '30px',
          right: '0'
        }"
      >
        <v-slider
          class="full-height-slider"
          min="1"
          :max="viewport.maxSliceId"
          vertical
          v-model="sliderSliceId"
        />
      </div>
    </slot>
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
const defaultGetImageIdsFn = (store, seriesId) =>
  (store.state.larvitar.series[seriesId] || {}).imageIds;

export default {
  name: "DicomCanvas",
  directives: { resize },
  props: {
    clearCacheOnDestroy: { default: false, type: Boolean },
    clearOnDestroy: { default: false, type: Boolean },
    canvasId: { required: true, type: String },
    getImageIdsFn: { default: defaultGetImageIdsFn, type: Function },
    getProgressFn: { default: defaultGetProgressFn, type: Function },
    getViewportFn: { default: defaultGetViewportFn, type: Function },
    seriesId: { required: true, type: [String, Number] },
    showMultiframeIcon: { default: false, type: Boolean },
    showProgress: { default: false, type: Boolean },
    stack: { required: false, type: Object },
    tools: { default: () => stackTools.default, type: Array },
    toolsHandlers: { required: false, type: Object },
    showSlider: { default: false, type: Boolean },
    showPercentage: { default: false, type: Boolean },
    downloaded: { default: true, type: Boolean }
  },
  data: () => ({
    error: false,
    stackMetadata: null,
    validCanvasId: null,
    lastPercentageStep: 0 // this trick is needed to bypass this vuetify bug: https://github.com/vuetifyjs/vuetify/issues/3268
  }),
  beforeDestroy() {
    this.destroy();
  },
  computed: {
    serieDownloadPercentage() {
      let imageIds = this.getImageIdsFn(this.$store, this.seriesId);
      let total = this.viewport.maxSliceId;

      if (!imageIds || !imageIds.length || !total || total < imageIds.length) {
        return 0;
      } else {
        return Math.round((100 * imageIds.length) / total);
      }
    },
    progress() {
      return this.getProgressFn(this.$store, this.seriesId, this.validCanvasId);
    },
    viewport() {
      return this.getViewportFn(this.$store, this.seriesId, this.validCanvasId);
    },
    sliderSliceId: {
      get() {
        return this.viewport.sliceId + 1;
      },
      set(index) {
        let sliceId = index - 1;
        if (this.viewport.sliceId !== undefined && sliceId >= 0) {
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
    download: {
      handler() {
        // when switching serie on a viewport download is 100 at first
        if (this.lastPercentageStep === 0 && this.download === 100) {
          return;
        }
        if (this.download - this.lastPercentageStep >= 5) {
          this.lastPercentageStep = this.download;
        }
      }
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

            renderSeries(this.validCanvasId, stack)
              .then(() => {
                // series rendered
                addTools(this.tools, this.validCanvasId, this.toolsHandlers);
                this.$emit("ready");
              })
              .catch(error => {
                console.error(error);
                this.error = true;
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
    },
    serieDownloadPercentage: {
      handler() {
        // when switching serie on a viewport serieDownloadPercentage is 100 at first
        if (
          this.lastPercentageStep === 0 &&
          this.serieDownloadPercentage === 100
        ) {
          return;
        }
        if (this.serieDownloadPercentage - this.lastPercentageStep >= 5) {
          this.lastPercentageStep = this.serieDownloadPercentage;
        }
      }
    }
  }
};
</script>

<style scoped>
/* .ready-status {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
} */
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
