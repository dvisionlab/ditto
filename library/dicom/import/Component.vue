<template>
  <div class="step-wrapper">
    <div class="step-header d-flex justify-space-between align-center">
      <div class="d-flex align-center">
        <v-btn icon @click="$emit('cancel')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <h3 class="text-uppercase">import exams</h3>
      </div>

      <div class="d-flex">
        <v-btn
          :disabled="!steps[currentStep].back()"
          text
          @click="currentStep--"
        >
          <v-icon>mdi-chevron-left</v-icon>
          back
        </v-btn>

        <div v-if="steps[currentStep].actions">
          <v-menu max-width="412px" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="primary--text"
                :elevation="0"
                v-bind="attrs"
                v-on="on"
              >
                {{ selectedAction ? selectedAction.text : "---" }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, i) in steps[currentStep].actions"
                :key="i"
                :disabled="item.disabled"
                link
                @click="selectedAction = item"
              >
                <v-list-item-content>
                  <v-list-item-title class="text-uppercase">{{
                    item.text
                  }}</v-list-item-title>
                  <v-list-item-subtitle :style="{ whiteSpace: 'normal' }">{{
                    item.hint
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            color="primary"
            :disabled="selectedSeries.length <= 0 || !selectedAction"
            :elevation="0"
            @click="onAction"
          >
            confirm
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <v-btn
          v-else
          color="primary"
          :disabled="!steps[currentStep].next(series)"
          @click="currentStep++"
        >
          {{ series.length }} series detected
          <v-icon v-if="steps[currentStep].next(series)"
            >mdi-chevron-right</v-icon
          >
        </v-btn>
      </div>
    </div>

    <div :class="['step-content', `step-${currentStep + 1}`]">
      <component
        :is="`import-step-${currentStep + 1}`"
        class="h-100"
        :headers="headers"
        :import-errors="errors"
        :metadata="metadata"
        :series="series"
        :selected-series="selectedSeries"
        :step="steps[currentStep]"
        @new-series="onNewSeries"
        @select-series="onSelectSeries"
      >
        <!-- Add a slot for each header item that requires it (component customization) -->
        <template
          v-for="h in headers.filter(({ slot }) => slot)"
          v-slot:[h.value]="{ item }"
        >
          <slot v-bind:item="item" :name="h.value" />
        </template>
      </component>
    </div>
  </div>
</template>

<script>
import { getHeaders, getMetadata, getSteps } from "./steps";
import { mergeSeries, storeSeriesStack } from "@/js/utils.dicoms";

const ImportStep1 = () => import("./steps/Step1");
const ImportStep2 = () => import("./steps/Step2");
const ImportStep3 = () => import("./steps/Step3");

export default {
  name: "DicomImportSteps",
  components: {
    ImportStep1,
    ImportStep2,
    ImportStep3
  },
  props: {
    options: { default: () => ({}), type: Object }
  },
  data() {
    return {
      currentStep: 0,
      errors: [],
      headers: getHeaders(this.options),
      metadata: getMetadata(this.options),
      series: [],
      selectedSeries: [],
      steps: getSteps(this.options)
    };
  },
  computed: {
    actions() {
      return this.steps[this.currentStep].actions;
    }
  },
  methods: {
    onAction() {
      // List of selected stacks
      const stacks = this.selectedSeries.map(({ seriesUID }) =>
        this.series.find(s => s.seriesUID == seriesUID)
      );

      // Store series stack in larvitar
      if (this.selectedAction.storeStacks) {
        stacks.forEach(stack => storeSeriesStack(stack.seriesUID, stack));
      }

      // Emit action with stacks data
      const emitData = stacks.map(stack => {
        return this.metadata.reduce((obj, value) => {
          obj[value] = stack[value];
          return obj;
        }, {});
      });

      this.$emit(this.selectedAction.emitter, emitData);
    },
    onNewSeries({ errors, series }) {
      this.errors = [...this.errors, ...errors];

      // Check if series are new or merge same series
      series.forEach(s => {
        const index = this.series.findIndex(_s => _s.seriesUID == s.seriesUID);
        if (index >= 0) {
          // merge information
          this.$set(this.series, index, mergeSeries(this.series[index], s));
        } else {
          this.series.push(s);
        }
      });

      this.series.forEach(s =>
        this.selectedSeries.push({ seriesUID: s.seriesUID })
      );

      this.currentStep++;
    },
    onSelectSeries(event) {
      if (event.value) {
        this.selectedSeries.push({ seriesUID: event.item.seriesUID });
      } else {
        this.selectedSeries = this.selectedSeries.filter(
          v => v.seriesUID !== event.item.seriesUID
        );
      }
    }
  },
  watch: {
    actions: {
      handler(actions) {
        this.selectedAction = actions ? actions.find(a => !a.disabled) : null;
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
$header-height: 6em;

.step-wrapper {
  height: 80vh;
  max-height: 100%;
  background: white;
}

.step-header {
  height: $header-height;

  & > div {
    padding: 1em;
  }
}

.step-content {
  background: var(--v-grey-base);
  height: calc(100% - #{$header-height});
  overflow: auto;

  &.step-3 > div {
    padding: 1em;
  }
}
</style>
