<template>
  <div class="text-center" :class="{ 'dark-bckg': dark }">
    <h3 class="text-uppercase ma-auto" :style="{ width: 'fit-content' }">
      <template v-if="step.status.loading">
        Uploading <b>{{ selectedSeries.length }}</b> exam{{
          selectedSeries.length == 1 ? "" : "s"
        }}
        <v-progress-linear color="warning" indeterminate />

        <!-- TODO force stop upload -> clearSeriesData -->
      </template>

      <div v-else-if="step.status.completed">
        <template v-if="allErrors">upload failed</template>
        <template v-else>upload completed</template>
        <v-progress-linear
          :color="!hasErrors ? 'success' : 'black'"
          :value="100"
        />

        <div class="text-lowercase pt-2">
          <div v-if="getProgressCounters().success">
            {{ getProgressCounters().success }} exams loaded
          </div>
          <div v-if="getProgressCounters().partial">
            {{ getProgressCounters().partial }} exams loaded with errors
          </div>
          <div v-if="getProgressCounters().error">
            {{ getProgressCounters().error }} exams upload failed
          </div>
        </div>

        <!-- generic error message -->
        <div v-if="step.status.errors.generic">
          {{ step.status.errors.generic }}
        </div>

        <!-- TODO clearSeriesData? -->
        <!-- TODO need to reset imported series -->
        <!-- <div>
          <v-btn
            class="mt-1"
            @click="$emit('restart')"
          >
            Import other exams
          </v-btn>
        </div> -->
      </div>
    </h3>

    <div class="d-flex flex-wrap justify-center mt-3">
      <div
        v-for="(s, i) in selectedSeries"
        :key="s.larvitarSeriesInstanceUID"
        class="ma-1"
      >
        <dicom-canvas
          :canvas-id="s.larvitarSeriesInstanceUID"
          :get-progress-fn="getProgressFn"
          :get-viewport-fn="getViewportFn"
          :series-id="s.larvitarSeriesInstanceUID"
          :show-progress="false"
          show-multiframe-icon
          :stack="
            series.find(
              _s => _s.larvitarSeriesInstanceUID == s.larvitarSeriesInstanceUID
            )
          "
          :style="{ width: '10em', height: '10em' }"
          :tools="tools"
        />

        <v-progress-linear
          :color="
            step.status.errors[s.larvitarSeriesInstanceUID] ||
            step.status.errors[i]
              ? 'error'
              : getProgressPercentage(s.larvitarSeriesInstanceUID) == null
              ? 'black'
              : 'success'
          "
          :value="
            step.status.errors[s.larvitarSeriesInstanceUID] ||
            step.status.errors[i]
              ? 100
              : getProgressPercentage(s.larvitarSeriesInstanceUID)
          "
        />

        <v-tooltip
          v-if="
            step.status.errors[i] ||
              step.status.errors[s.larvitarSeriesInstanceUID]
          "
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="error" icon v-bind="attrs" v-on="on">
              <v-icon>mdi-alert</v-icon>
            </v-btn>
          </template>
          <div
            v-for="(text, idx) in getErrorsStrings(
              s.larvitarSeriesInstanceUID,
              i
            )"
            :key="idx"
          >
            {{ getErrorText(text) }}
          </div>
        </v-tooltip>
        <v-icon
          v-else-if="getProgressPercentage(s.larvitarSeriesInstanceUID) == 100"
          class="py-2"
          color="success"
        >
          mdi-check
        </v-icon>
        <div
          v-else-if="getProgressPercentage(s.larvitarSeriesInstanceUID) == null"
          class="py-2"
        >
          pending
        </div>
        <div v-else class="py-2">
          {{ getProgressPercentage(s.larvitarSeriesInstanceUID) }} %
        </div>
      </div>
    </div>

    <div v-if="$route.name === 'upload'">
      <v-btn
        :dark="dark"
        color="primary"
        class="mx-3"
        :disabled="isUploading"
        @click="$emit('restart')"
      >
        <v-icon :dark="dark">mdi-folder-multiple-plus</v-icon>
        <span class="pl-2">new upload</span>
      </v-btn>
    </div>
    <div v-else class="mt-5">
      <v-btn
        :dark="dark"
        color="primary"
        class="mx-3"
        :disabled="isUploading"
        @click="$emit('restart')"
      >
        <v-icon :dark="dark">mdi-folder-multiple-plus</v-icon>
        <span class="pl-2">new upload</span>
      </v-btn>
      <v-btn
        :dark="dark"
        color="primary"
        class="mx-3"
        :disabled="isUploading || isRefreshing"
        @click="openViewer"
      >
        <v-progress-circular v-if="isRefreshing" indeterminate :size="20" />
        <v-icon v-else :dark="dark">mdi-image-filter-black-white</v-icon>

        <span class="pl-2">open viewer</span>
      </v-btn>
      <v-btn :dark="dark" color="primary" class="mx-3" @click="$emit('cancel')">
        <v-icon :dark="dark">mdi-view-list-outline</v-icon>
        <span class="pl-2">back to exams</span>
      </v-btn>
    </div>

    <slot name="step-3" />
  </div>
</template>

<script>
const DicomCanvas = () => import("../../render/Canvas");
import metadataDictionary from "../../metadata";
import { mapGetters } from "vuex";

export default {
  name: "DicomImportStep3",
  components: { DicomCanvas },
  props: {
    dark: { default: false, type: Boolean },
    getProgressFn: { required: false, type: Function },
    getViewportFn: { required: false, type: Function },
    series: { required: true, type: Array },
    selectedSeries: { required: true, type: Array },
    step: { required: true, type: Object },
    tools: { required: false, type: Array }
  },
  data: () => ({
    metadata: metadataDictionary
  }),
  computed: {
    ...mapGetters("dashboard", ["isUploading", "isRefreshing"]),

    allErrors() {
      const p = this.step.status.progress;
      return Object.keys(p).filter(k => !p[k]).length == Object.keys(p).length;
    },
    hasErrors() {
      return !!Object.keys(this.step.status.errors).length;
    }
  },
  methods: {
    getProgressCounters() {
      const p = this.step.status.progress;
      const keys = Object.keys(p);
      return {
        error: keys.filter(k => !p[k]).length,
        partial: keys.filter(k => p[k] && p[k][0] !== p[k][1]).length,
        success: keys.filter(k => p[k] && p[k][0] == p[k][1]).length
      };
    },
    getErrorsStrings(id, index) {
      return this.step.status.errors[id] || this.step.status.errors[index];
    },
    getProgressPercentage(id) {
      const progress = this.step.status.progress[id];
      if (!progress) {
        return null;
      }

      return ((100 * progress[0]) / progress[1]).toFixed(0);
    },
    getErrorText(text) {
      if (text) {
        /*
        if (text !== "") {
          return text;
        }
        */
        return "failure: No valid series found";
      }
      return null;
    },
    openViewer() {
      this.$emit("open-viewer-uploaded");
      this.$emit("cancel");
    }
  }
};
</script>
<style>
.dark-bckg {
  background-color: #1e1e1e;
  color: white;
}
</style>
