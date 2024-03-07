<template>
  <div
    class="d-flex w-100 h-100 black"
    :style="{ position: 'relative' }"
    @click.middle="onMidClick"
    @contextmenu.prevent
  >
    <v-icon v-if="error" class="ma-auto" dark> mdi-alert-decagram </v-icon>
    <div
      v-else
      class="w-100 h-100"
      ref="canvas"
      :id="validCanvasId"
      v-resize:debounce="onResize"
    />

    <slot
      v-if="showProgress && progress !== 100"
      name="progress"
      v-bind:i="viewport.sliceId"
      v-bind:n="viewport.maxSliceId"
    >
      <!-- default progress -->
      <v-progress-linear absolute bottom :height="5" :value="progress" />
    </slot>

    <v-avatar
      v-if="showMultiframeIcon && viewport.isMultiframe"
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
      name="multiframe"
      v-bind:canvas-id="validCanvasId"
      v-bind:value="viewport.isMultiframe || viewport.maxTimeId > 0"
      v-bind:alternativeScrollActive="alternativeScrollActive"
    ></slot>

    <slot
      v-if="showSlider"
      name="viewport-slider"
      v-bind:i="
        viewport.maxTimeId > 0
          ? viewport.sliceId / viewport.numberOfTemporalPositions
          : viewport.sliceId
      "
      v-bind:n="
        viewport.maxTimeId > 0
          ? (viewport.maxSliceId + 1) / viewport.numberOfTemporalPositions - 1
          : viewport.maxSliceId
      "
    >
      <!-- default slider -->
      <div
        :style="{
          height: '97%',
          width: '20px',
          position: 'absolute',
          down: '0px',
          top: '10px',
          right: '0'
        }"
      >
        <vue-slider
          contained
          direction="btt"
          :duration="duration"
          height="100%"
          :min="viewport.minSliceId"
          :max="
            viewport.maxTimeId
              ? (viewport.maxSliceId + 1) / viewport.numberOfTemporalPositions -
                1
              : viewport.maxSliceId
          "
          :processStyle="{
            backgroundColor: 'var(--v-accent-base)',
            borderRadius: '1px'
          }"
          tooltip="active"
          :tooltip-formatter="val => val + 1"
          :tooltip-style="{
            backgroundColor: 'var(--v-accent-base)',
            borderColor: 'var(--v-accent-base)',
            color: 'black'
          }"
          width="5px"
          ref="slider"
          v-model="sliderSliceId"
        >
          <template v-slot:dot="{ /* eslint-disable */ value, focus }">
            <div :class="['custom-dot-v', { focus }]"></div>
          </template>
        </vue-slider>
      </div>
    </slot>
    <!--time frame slider for 4D exam -->
    <slot
      v-if="showSlider && stackMetadata?.series.is4D"
      name="viewport-frame-slider"
      v-bind:i="viewport.timeId"
      v-bind:n="viewport.maxTimeId"
    >
      <div
        :style="{
          height: '20px',
          width: '75%',
          position: 'absolute',
          bottom: '0',
          margin: '0 12.5%'
        }"
      >
        <vue-slider
          contained
          :duration="0.25"
          height="5px"
          :min="viewport.minTimeId || 0"
          :max="viewport.maxTimeId ? viewport.maxTimeId : 1"
          :processStyle="{
            backgroundColor: 'var(--v-accent-base)',
            borderRadius: '1px'
          }"
          tooltip="active"
          :tooltip-formatter="val => val + 1"
          :tooltip-style="{
            backgroundColor: 'var(--v-accent-base)',
            borderColor: 'var(--v-accent-base)',
            color: 'black'
          }"
          width="100%"
          v-model="sliderFrameId"
        >
          <template v-slot:dot="{ /* eslint-disable */ value, focus }">
            <div :class="['custom-dot-h', { focus }]"></div>
          </template>
        </vue-slider>
      </div>
    </slot>

    <slot name="plot-container"></slot>
  </div>
</template>

<script>
import resize from "vue-resize-directive";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

import { stackMetadata as stackMetadataDict, stackTools } from "../defaults";
import {
  addMouseKeyHandlers,
  addTools,
  clearSeriesData,
  clearSeriesCache,
  deleteViewport,
  disableCanvas,
  getSeries,
  getSeriesStack,
  getViewport,
  renderSeries,
  resizeViewport,
  seriesIdToElementId,
  updateSeriesSlice,
  watchViewportStore,
  unwatchViewportStore,
  // setTimeFrame,
  setWheelScrollModality,
  get4DSliceIndex
} from "../utils";

const defaultGetProgressFn = (store, seriesId) =>
  (getSeries(seriesId) || {}).progress;

export default {
  name: "DicomCanvas",
  directives: { resize },
  components: { VueSlider },
  props: {
    clearCacheOnDestroy: { default: false, type: Boolean },
    clearOnDestroy: { default: false, type: Boolean },
    canvasId: { required: true, type: String },
    getProgressFn: { default: defaultGetProgressFn, type: Function },
    getViewportFn: { required: false, type: Function },
    seriesId: { required: true, type: [String, Number] },
    showMultiframeIcon: { default: false, type: Boolean },
    showProgress: { default: false, type: Boolean },
    showSlider: { default: false, type: Boolean },
    stack: { required: false, type: Object },
    tools: { default: () => stackTools.default, type: Array },
    toolsHandlers: { required: false, type: Object },
    timeFrame: { required: false, type: Number }
  },
  data: () => ({
    isReady: false,
    error: false,
    ltViewport: null,
    stackMetadata: null,
    validCanvasId: null,
    alternativeScrollActive: false
  }),
  beforeDestroy() {
    if (!this.getViewportFn) {
      unwatchViewportStore(this.validCanvasId);
    }
    this.destroy();
  },
  computed: {
    progress() {
      // TODO need store watcher
      return this.getProgressFn(this.$store, this.seriesId, this.validCanvasId);
    },
    viewport() {
      return (
        (this.getViewportFn
          ? this.getViewportFn(this.$store, this.seriesId, this.validCanvasId)
          : this.ltViewport) || {}
      );
    },
    duration() {
      // slider lag from input changes
      if (!this.viewport.isMultiframe) {
        return 0.25;
      } else if (!this.timeFrame) {
        return 0.1;
      } else if (this.timeFrame < 50) {
        return 0.01;
      }
      return 0.15;
    },
    sliderSliceId: {
      get() {
        if (this.viewport.maxTimeId > 0) {
          return Math.floor(
            this.viewport.sliceId / this.viewport.numberOfTemporalPositions
          );
        }
        return this.viewport.sliceId;
      },
      set(index) {
        if (this.isReady) {
          if (this.viewport.maxTimeId > 0) {
            const stackIndex = get4DSliceIndex(
              this.viewport.timeId,
              index,
              this.viewport.numberOfTemporalPositions
            );
            updateSeriesSlice(this.validCanvasId, this.seriesId, stackIndex);
          } else {
            updateSeriesSlice(this.validCanvasId, this.seriesId, index);
          }
        }
      }
    },
    sliderFrameId: {
      get() {
        return this.viewport.timeId;
      },
      set(index) {
        if (this.isReady) {
          const sliceNumber = Math.floor(
            this.viewport.sliceId / (this.viewport.maxTimeId + 1)
          );
          const stackIndex = get4DSliceIndex(
            index,
            sliceNumber,
            this.viewport.maxTimeId + 1
          );
          // setTimeFrame(this.validCanvasId, index);
          updateSeriesSlice(this.validCanvasId, this.seriesId, stackIndex);
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

      this.isReady = false;
    },
    onMidClick() {
      if (this.viewport && this.viewport.maxTimeId > 0) {
        this.alternativeScrollActive = !this.alternativeScrollActive;
        setWheelScrollModality(this.alternativeScrollActive);
      }
    },
    initViewportData(viewportId, prevViewportId) {
      // init viewport data and start listening
      if (!this.getViewportFn) {
        if (prevViewportId) {
          // TODO test this
          unwatchViewportStore(prevViewportId);
        }

        this.ltViewport = getViewport(viewportId);
        watchViewportStore(viewportId, data => {
          this.ltViewport = data;
        });
      }
    },
    onResize() {
      if (this.isReady) {
        resizeViewport(this.validCanvasId);
      }
    }
  },
  watch: {
    canvasId: {
      handler(canvasId, prevCanvasId) {
        // Compute valid element id (dots not allowed)
        this.validCanvasId = seriesIdToElementId(canvasId);
        // init viewport data and start listening for changes

        this.initViewportData(
          this.validCanvasId,
          prevCanvasId ? seriesIdToElementId(prevCanvasId) : undefined
        );
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

            renderSeries(this.validCanvasId, stack, { sliceNumber: 0 })
              .then(() => {
                // series rendered
                this.alternativeScrollActive = false;
                addTools(this.tools, this.validCanvasId, this.toolsHandlers);
                if (this.toolsHandlers) {
                  addMouseKeyHandlers(this.toolsHandlers);
                }
                setWheelScrollModality(this.alternativeScrollActive);
                this.isReady = true;
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

.v-input {
  height: 100% !important;
}
.v-input >>> .v-input__slot {
  height: 100% !important;
}
.custom-dot-h {
  width: 70%;
  height: 80%;
  border-radius: 0;
  background-color: white;
  transition: all 0.3s;
}
.custom-dot:hover {
  /*transform: rotateZ(45deg);*/
}
.custom-dot-h.focus {
  width: 70%;
  height: 100%;
  border-radius: 0%;
}
.custom-dot-v {
  width: 80%;
  height: 70%;
  border-radius: 0;
  background-color: white;
  transition: all 0.3s;
}
.custom-dot:hover {
  /*transform: rotateZ(45deg);*/
}
.custom-dot-v.focus {
  width: 100%;
  height: 70%;
  border-radius: 0%;
}
</style>
