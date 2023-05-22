<template>
  <div
    class="d-flex w-100 h-100 black"
    :style="{ position: 'relative' }"
    @contextmenu.prevent
  >
    <v-icon v-if="error" class="ma-auto" dark>
      mdi-alert-decagram
    </v-icon>
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
      v-bind:value="viewport.isMultiframe"
    ></slot>

    <slot
      v-if="showSlider"
      name="viewport-slider"
      v-bind:i="( viewport.sliceId + 1 ) / (viewport.maxTimeId + 1)"
      v-bind:n="(( viewport.maxSliceId +1 )  / (viewport.maxTimeId + 1)) - 1"
    >
      <!-- default slider -->
      <div
        :style="{
          height: '75%',
          width: '30px',
          position: 'absolute',
          top: '12.5%',
          right: '0'
        }"
      >
        <vue-slider
          contained
          direction="btt"
          :duration="0.25"
          height="100%"
          :min="viewport.minSliceId"
          :max="((viewport.maxSliceId +1 )  / (viewport.maxTimeId + 1)) - 1"
          :processStyle="{
            backgroundColor: 'var(--v-accent-base)',
            borderRadius: '3px'
          }"
          tooltip="active"
          :tooltip-formatter="val => val + 1"
          :tooltip-style="{
            backgroundColor: 'var(--v-accent-base)',
            borderColor: 'var(--v-accent-base)',
            color: 'black'
          }"
          width="8px"
          v-model="sliderSliceId"
        />
      </div>
    </slot>
    <!--time frame slider for 4D exam -->>
    <slot
      v-if="showSlider && viewport.isTimeserie"
      name="viewport-frame-slider"
      v-bind:i="viewport.timeId"
      v-bind:n="viewport.maxTimeId"
    >
      <!-- default slider -->
      <div
        :style="{
          height: '30px',
          width: '75%',
          position: 'absolute',
          bottom: '2%',
          right: '0'
        }"
      >
        <vue-slider
          contained
          :duration="0.25"
          height="8px"
          :min="viewport.minTimeId"
          :max="viewport.maxTimeId"
          :processStyle="{
            backgroundColor: 'var(--v-accent-base)',
            borderRadius: '3px'
          }"
          tooltip="active"
          :tooltip-formatter="val => val + 1"
          :tooltip-style="{
            backgroundColor: 'var(--v-accent-base)',
            borderColor: 'var(--v-accent-base)',
            color: 'black'
          }"
          width="80%"
          v-model="sliderFrameId"
        />
      </div>
    </slot>
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
  getSeriesStack,
  renderSeries,
  resizeViewport,
  seriesIdToElementId,
  updateSeriesSlice,
  // setTimeFrame,
  get4DSliceIndex
} from "../utils";

const defaultGetProgressFn = (store, seriesId) =>
  (store.state.larvitar.series[seriesId] || {}).progress;
const defaultGetViewportFn = (store, seriesId, canvasId) =>
  store.getters["larvitar/viewport"](canvasId) || {};

export default {
  name: "DicomCanvas",
  directives: { resize },
  components: { VueSlider },
  props: {
    clearCacheOnDestroy: { default: false, type: Boolean },
    clearOnDestroy: { default: false, type: Boolean },
    canvasId: { required: true, type: String },
    getProgressFn: { default: defaultGetProgressFn, type: Function },
    getViewportFn: { default: defaultGetViewportFn, type: Function },
    seriesId: { required: true, type: [String, Number] },
    showMultiframeIcon: { default: false, type: Boolean },
    showProgress: { default: false, type: Boolean },
    showSlider: { default: false, type: Boolean },
    // showFrameSlider: { default: false, type: Boolean },
    stack: { required: false, type: Object },
    tools: { default: () => stackTools.default, type: Array },
    toolsHandlers: { required: false, type: Object }
  },
  data: () => ({
    isReady: false,
    error: false,
    stackMetadata: null,
    validCanvasId: null,
  }),
  beforeDestroy() {
    this.destroy();
  },
  computed: {
    progress() {
      return this.getProgressFn(this.$store, this.seriesId, this.validCanvasId);
    },
    viewport() {
      return this.getViewportFn(this.$store, this.seriesId, this.validCanvasId);
    },
    sliderSliceId: {
      get() {
        if (this.viewport.maxTimeId > 0 ) {
          console.log('getting sliceid', Math.floor((this.viewport.sliceId) / (this.viewport.maxTimeId + 1)));
          return Math.floor((this.viewport.sliceId) / (this.viewport.maxTimeId + 1));
        }
        return this.viewport.sliceId;
      },
      set(index) {
        if (this.isReady) {
          if (this.viewport.maxTimeId > 0 ) {
            const stackIndex = get4DSliceIndex(this.viewport.timeId, index, this.viewport.maxTimeId + 1);
            console.log('frame ', this.viewport.timeId )
            console.log('index ', index);
            console.log( 'calculate stack correct index = ', stackIndex);
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
          const sliceNumber = Math.floor((this.viewport.sliceId) / (this.viewport.maxTimeId + 1));
          const stackIndex = get4DSliceIndex( index,sliceNumber, this.viewport.maxTimeId + 1);
          console.log( 'calculate stack correct index = ', stackIndex);
          // setTimeFrame(this.validCanvasId,index);
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
    onResize() {
      if (this.isReady) {
        resizeViewport(this.validCanvasId);
      }
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

            renderSeries(this.validCanvasId, stack)
              .then(() => {
                // series rendered
                addTools(this.tools, this.validCanvasId, this.toolsHandlers);
                if (this.toolsHandlers) {
                  addMouseKeyHandlers(this.toolsHandlers);
                }

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
</style>
