<template>
  <div class="step-wrapper">
    <div class="step-header d-flex" v-relative-height="'contentHeight'">
      <div
        class="d-flex flex-wrap flex-grow-1 align-center"
        :class="{
          'py-2': $vuetify.breakpoint.smAndDown
        }"
        :style="{ overflow: 'auto' }"
      >
        <!-- title -->
        <div
          class="d-flex align-center"
          :class="{
            'py-2': $vuetify.breakpoint.smAndDown
          }"
        >
          <v-icon class="pl-3" color="black">{{ icon }}</v-icon>
          <h3 class="text-uppercase lh-small px-3">{{ label }}</h3>
        </div>

        <v-spacer />

        <!-- buttons -->
        <div
          class="d-flex"
          :class="{
            'px-2': $vuetify.breakpoint.smAndDown
          }"
        >
          <v-btn
            class="d-none d-sm-flex"
            :disabled="!steps[currentStep].back()"
            text
            @click="currentStep--"
          >
            <v-icon>mdi-chevron-left</v-icon>
            <span class="pr-2">back</span>
          </v-btn>

          <div v-if="steps[currentStep].actions" class="d-flex">
            <v-menu max-width="295px" offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="primary--text"
                  :elevation="0"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon v-if="$vuetify.breakpoint.smAndDown">
                    mdi-dots-horizontal
                  </v-icon>
                  <span v-else>{{
                    selectedAction ? selectedAction.text : "---"
                  }}</span>
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
              <span class="pl-2">confirm</span>
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

      <v-divider :class="{ 'px-2': !$vuetify.breakpoint.smAndDown }" vertical />

      <modal-controllers
        class="flex-shrink-0 align-self-center"
        @cancel="$emit('cancel')"
        @minimize="$emit('minimize')"
      />
    </div>

    <div
      :class="['step-content', `step-${currentStep + 1}`]"
      :style="{ height: contentHeight }"
    >
      <component
        :is="`import-step-${currentStep + 1}`"
        class="h-100"
        :get-progress-fn="getProgressFn"
        :get-viewport-fn="getViewportFn"
        :headers="headers"
        :import-errors="errors"
        :metadata="metadata"
        :series="series"
        :selected-series="selectedSeries"
        :step="steps[currentStep]"
        :tools="tools"
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
import { getCanvasTools, getHeaders, getMetadata, getSteps } from "./options";
import { mergeSeries, storeSeriesStack } from "../utils";
import RelativeHeight from "../../relative-height";
import ModalControllers from "./ModalControllers";

const ImportStep1 = () => import("./steps/Step1");
const ImportStep2 = () => import("./steps/Step2");
const ImportStep3 = () => import("./steps/Step3");

export default {
  name: "DicomImportSteps",
  components: {
    ImportStep1,
    ImportStep2,
    ImportStep3,
    ModalControllers
  },
  directives: { RelativeHeight },
  props: {
    icon: { default: "mdi-upload-multiple", type: String },
    label: { default: "import-exams", type: String },
    options: { default: () => ({}), type: Object }
  },
  data() {
    return {
      contentHeight: "100%",
      currentStep: 0,
      errors: [],
      getProgressFn: this.options.getProgressFn,
      getViewportFn: this.options.getViewportFn,
      headers: getHeaders(this.options),
      metadata: getMetadata(this.options),
      series: [],
      selectedSeries: [],
      steps: getSteps(this.options),
      tools: getCanvasTools(this.options)
    };
  },
  computed: {
    actions() {
      return this.steps[this.currentStep].actions;
    }
  },
  methods: {
    async onAction() {
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
      this.$emit("cancel");
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
          this.selectedSeries.push({ seriesUID: s.seriesUID });
        }
      });

      this.currentStep++;
    },
    onSelectSeries(event) {
      if (event.items) {
        event.items.forEach(item =>
          this.onSelectSeries({ item, value: event.value })
        );
        return;
      }

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
$min-header-height: 5.5em;

.step-wrapper {
  height: 80vh; /* Fallback for browsers that do not support Custom Properties */
  height: calc(var(--vh, 1vh) * 80);

  max-height: 100%;
  background: white;
}

.step-header {
  min-height: $min-header-height;
  border-bottom: 1px solid var(--v-grey-base);
}

.step-content {
  background: var(--v-grey-base);
  height: calc(100% - #{$min-header-height});
  overflow: auto;

  &.step-3 > div {
    padding: 1em;
  }
}
</style>
