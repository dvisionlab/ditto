<template>
  <div class="text-center">
    <h3 class="text-uppercase ma-auto" :style="{ width: 'fit-content' }">
      <template v-if="step.status.loading">
        Uploading <b>{{ selectedSeries.length }}</b> exam{{
          selectedSeries.length == 1 ? "" : "s"
        }}
        <v-progress-linear color="warning" indeterminate />

        <!-- TODO force stop upload -> clearSeriesData -->
      </template>

      <div
        v-else-if="step.status.completed"
        :class="[hasErrors ? 'warning--text' : 'success--text']"
      >
        <template v-if="step.status.errors.post">
          upload failed
        </template>
        <template v-else>
          upload completed {{ hasErrors ? "with errors" : "" }}
        </template>

        <v-progress-linear
          :color="hasErrors ? 'warning' : 'success'"
          :value="100"
        />

        <v-tooltip v-if="step.status.errors.post" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="warning" icon v-bind="attrs" v-on="on">
              <v-icon>mdi-alert</v-icon>
            </v-btn>
          </template>
          {{ step.status.errors.post }}
        </v-tooltip>

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
        v-for="s in selectedSeries"
        :key="s.larvitarSeriesInstanceUID"
        class="ma-1"
      >
        <dicom-canvas
          :canvas-id="s.larvitarSeriesInstanceUID"
          :get-progress-fn="getProgressFn"
          :get-viewport-fn="getViewportFn"
          :series-id="s.larvitarSeriesInstanceUID"
          :show-progress="false"
          :stack="
            series.find(
              _s => _s.larvitarSeriesInstanceUID == s.larvitarSeriesInstanceUID
            )
          "
          :style="{ width: '10em', height: '10em' }"
          :tools="tools"
        />

        <div v-if="getProgressPercentage(s.larvitarSeriesInstanceUID) !== null">
          <v-progress-linear
            color="warning"
            :value="getProgressPercentage(s.larvitarSeriesInstanceUID)"
          />
        </div>

        <v-tooltip
          v-if="step.status.errors[s.larvitarSeriesInstanceUID]"
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="warning" icon v-bind="attrs" v-on="on">
              <v-icon>mdi-alert</v-icon>
            </v-btn>
          </template>
          <div
            v-for="(text, i) in step.status.errors[s.larvitarSeriesInstanceUID]"
            :key="i"
          >
            {{ text }}
          </div>
        </v-tooltip>
      </div>
    </div>

    <slot name="step-3" />
  </div>
</template>

<script>
const DicomCanvas = () => import("../../render/Canvas");
import metadataDictionary from "../../metadata";

export default {
  name: "DicomImportStep3",
  components: { DicomCanvas },
  props: {
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
    hasErrors() {
      return Object.keys(this.step.status.errors).length;
    }
  },
  methods: {
    getProgressPercentage(id) {
      const progress = this.step.status.progress[id];
      if (!progress) {
        return null;
      }

      const value = ((100 * progress[0]) / progress[1]).toFixed(0);
      return value == 100 ? null : value;
    }
  }
};
</script>
