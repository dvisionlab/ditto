<template>
  <div>
    <v-tooltip bottom :nudge-bottom="-5">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ma-0"
          dark
          min-width="auto"
          plain
          small
          @click="onClick(tool.action)"
        >
          <v-icon
            v-if="tool.icon"
            :color="tool.action == 'pause' ? 'accent' : null"
            v-bind="attrs"
            v-on="on"
          >
            {{ tool.icon }}
          </v-icon>
          <span v-else>{{ tool.action }}</span>
        </v-btn>
      </template>
      <span class="text-caption text-uppercase">{{ tool.action }}</span>
    </v-tooltip>

    <!-- frame time selector -->
    <v-menu :nudge-bottom="3" open-on-hover offset-y bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="ma-0 px-2 text-lowercase"
          dark
          min-width="auto"
          plain
          small
          v-bind="attrs"
          v-on="on"
        >
          {{ frameTime.toFixed(0) }} ms
        </v-btn>
      </template>

      <v-card dark outlined>
        <v-card-text>
          <cinematic-slider
            :options="sliderOptions"
            :value="frameTime"
            @change="value => updateFrameTime(value)"
            @restart="restart"
          />
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import CinematicSlider from "./CinematicSlider";
import { getViewport } from "../utils";

const DEFAULT_FRAME_TIME = 100;

const defaultGetViewportFn = (store, seriesId, canvasId) =>
  getViewport(canvasId) || {};

export default {
  name: "CinematicTool",
  components: { CinematicSlider },
  props: {
    canvasId: { required: true, type: String },
    seriesId: { required: true, type: String },
    getViewportFn: { default: defaultGetViewportFn, type: Function }
  },
  data() {
    return {
      intervalId: null,
      frameTime: DEFAULT_FRAME_TIME,
      sliderOptions: {
        min: 25,
        max: 1000,
        step: 5
      }
    };
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  computed: {
    tool() {
      return {
        name: "Cinematic",
        action: this.intervalId ? "pause" : "play",
        icon: this.intervalId ? "mdi-pause" : "mdi-play"
      };
    }
  },
  methods: {
    onClick(action) {
      switch (action) {
        case "pause": {
          clearInterval(this.intervalId);
          this.intervalId = null;
          break;
        }

        case "play": {
          const viewport = this.getViewportFn(
            this.$store,
            this.seriesId,
            this.canvasId
          );

          this.intervalId = setInterval(() => {
            // sliceId between min and max
            viewport.sliceId =
              viewport.sliceId == viewport.maxSliceId
                ? viewport.minSliceId
                : viewport.sliceId + 1;

            this.$ditto.dicom.updateSeriesSlice(
              this.canvasId,
              this.seriesId,
              viewport.sliceId
            );
          }, this.frameTime);
          break;
        }
      }
    },
    restart() {
      if (this.intervalId) {
        this.onClick("pause");
        this.onClick("play");
      }
    },
    updateFrameTime(value, restart = true) {
      if (this.sliderOptions.min <= value && value <= this.sliderOptions.max) {
        this.frameTime = value;
        this.$emit("frame-time-update", value);
        if (restart) {
          this.restart();
        }
      }
    }
  },
  watch: {
    seriesId: {
      handler(id) {
        const cinematic = this.$ditto.dicom.getCinematicData(id) || {};
        this.updateFrameTime(cinematic.frameTime || DEFAULT_FRAME_TIME, false);
      },
      immediate: true
    }
  }
};
</script>
