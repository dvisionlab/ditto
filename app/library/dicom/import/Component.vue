<template>
  <div class="step-wrapper" :class="{ 'dark-header': dark }">
    <div
      v-if="steps[currentStep].actions || modal"
      :class="{ 'dark-header': dark }"
      class="step-header d-flex"
      v-relative-height="'contentHeight'"
    >
      <template>
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
            <v-icon
              :dark="dark"
              class="pl-3"
              :color="dark ? 'white' : 'black'"
              >{{ icon }}</v-icon
            >
            <h3 class="text-uppercase lh-small px-3">{{ $t(label) }}</h3>
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
              v-if="currentStep == 1"
              :dark="dark"
              class="d-none d-sm-flex"
              :disabled="!steps[currentStep].back()"
              text
              @click="currentStep--"
            >
              <v-icon :dark="dark">mdi-chevron-left</v-icon>
              <span class="pr-2">back</span>
            </v-btn>

            <div v-if="steps[currentStep].actions" class="d-flex">
              <!-- multiple actions -->
              <template v-if="steps[currentStep].actions.length > 1">
                <v-menu :dark="dark" max-width="295px" offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :dark="dark"
                      class="primary--text"
                      :elevation="0"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon :dark="dark" v-if="$vuetify.breakpoint.smAndDown">
                        mdi-dots-horizontal
                      </v-icon>
                      <span v-else>{{
                        selectedAction ? selectedAction.text : "---"
                      }}</span>
                      <v-icon :dark="dark">mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list :dark="dark">
                    <v-list-item
                      v-for="(item, i) in steps[currentStep].actions"
                      :key="i"
                      :class="{
                        'selected-action':
                          item.emitter == selectedAction.emitter
                      }"
                      :dark="dark"
                      :disabled="item.disabled"
                      link
                      @click="selectedAction = item"
                    >
                      <v-list-item-content :dark="dark">
                        <v-list-item-title :dark="dark" class="text-uppercase">
                          {{ item.text }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          :dark="dark"
                          :style="{ whiteSpace: 'normal' }"
                        >
                          {{ item.hint }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-btn
                  :dark="dark"
                  color="primary"
                  :disabled="selectedSeries.length <= 0 || !selectedAction"
                  :elevation="0"
                  @click="onAction"
                >
                  <span class="pl-2">confirm</span>
                  <v-icon :dark="dark">mdi-chevron-right</v-icon>
                </v-btn>
              </template>

              <!-- single action -->
              <v-btn
                v-else
                color="primary"
                :elevation="0"
                :disabled="steps[currentStep].actions[0].disabled"
                @click="onSelectAction(steps[currentStep].actions[0])"
              >
                <div class="d-block">
                  {{ steps[currentStep].actions[0].text }}
                  <div class="font-weight-light text-lowercase grey--text">
                    {{ steps[currentStep].actions[0].hint }}
                  </div>
                </div>
              </v-btn>
            </div>

            <v-btn
              v-if="currentStep == 0"
              color="primary"
              :disabled="!steps[currentStep].next(series)"
              @click="currentStep++"
            >
              {{ series.length }} exam{{ series.length == 1 ? "" : "s" }}
              detected
              <v-icon v-if="steps[currentStep].next(series)"
                >mdi-chevron-right</v-icon
              >
            </v-btn>
          </div>
        </div>
        <v-divider
          :class="{ 'px-2': !$vuetify.breakpoint.smAndDown }"
          vertical
        />
        <modal-controllers
          v-if="modal"
          class="flex-shrink-0 align-self-center"
          @cancel="onCancel"
          @minimize="$emit('minimize')"
        />
      </template>
    </div>

    <div
      :class="['step-content', `step-${currentStep + 1}`]"
      :style="{ height: contentHeight }"
    >
      <component
        :is="`import-step-${currentStep + 1}`"
        class="h-100"
        :dark="dark"
        :modal="modal"
        :allow-anonymization="options.allowAnonymization"
        :get-progress-fn="getProgressFn"
        :get-viewport-fn="getViewportFn"
        :headers="headers"
        :import-errors="errors"
        :disclaimer="disclaimer"
        :metadata="metadata"
        :series="series"
        :selected-series="selectedSeries"
        :step="steps[currentStep]"
        :tools="tools"
        @new-series="onNewSeries"
        @restart="onRestart"
        @select-action="onSelectAction"
        @select-series="onSelectSeries"
        @anonymize-all="onAnonimyzeAll"
        @cancel="onCancel"
        @open-viewer-uploaded="$emit('open-viewer-uploaded', selectedSeries)"
      >
        <!-- Add a slot for each header item that requires it (component customization) -->
        <template
          v-for="h in headers.filter(({ slot }) => slot)"
          v-slot:[h.value]="{ item }"
        >
          <slot v-bind:item="item" :name="h.value" />
        </template>

        <!-- Steps customization slots (actually only step-3 is supported) -->
        <template v-slot:step-3><slot name="step-3"/></template>
      </component>
    </div>
  </div>
</template>

<script>
import {
  getCanvasTools,
  getHeaders,
  getMetadata,
  getSteps,
  getDisclaimer
} from "./options";
import { mergeSeries, storeSeriesStack, clearSeriesStack } from "../utils";
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
    label: { default: "dicom-import.import-exams", type: String },
    options: { default: () => ({}), type: Object },
    modal: { default: false, type: Boolean },
    dark: { default: false, type: Boolean }
  },
  data() {
    const headers = getHeaders(this.options).map(h => ({
      ...h,
      text: h.text ? this.$t(`dicom-import.${h.text}`) : h.text
    }));

    return {
      contentHeight: "100%",
      currentStep: 0,
      errors: [],
      getProgressFn: this.options.getProgressFn,
      getViewportFn: this.options.getViewportFn,
      headers: headers,
      metadata: getMetadata(this.options),
      disclaimer: getDisclaimer(this.options),
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
    onAction() {
      // List of selected stacks
      let stacks = this.selectedSeries.map(v =>
        this.series.find(
          s => s.larvitarSeriesInstanceUID == v.larvitarSeriesInstanceUID
        )
      );
      // Store series stack in larvitar
      if (this.selectedAction.storeStacks) {
        stacks.forEach(stack =>
          storeSeriesStack(
            stack.larvitarSeriesInstanceUID,
            stack,
            this.selectedAction.cacheStacks
          )
        );
      }

      // Emit action with stacks data
      let emitData = stacks.map(stack => {
        return this.metadata.reduce((obj, value) => {
          obj[value] = stack[value];
          return obj;
        }, {});
      });
      emitData = emitData.map((data, index) => {
        data.seriesInstanceUIDs = Object.keys(stacks[index].instanceUIDs);
        return data;
      });
      this.$emit(this.selectedAction.emitter, emitData);

      // Clear not selected series stacks
      const unselectedSeries = this.series.filter(
        s =>
          !this.selectedSeries.find(
            v => v.larvitarSeriesInstanceUID == s.larvitarSeriesInstanceUID
          )
      );
      clearSeriesStack(unselectedSeries);

      if (this.selectedAction.closeOnEmit) {
        this.$emit("cancel");
      } else {
        this.currentStep++;
      }
    },
    onCancel() {
      const closeConfirmationFn = this.steps[this.currentStep]
        .closeConfirmation;

      if (
        closeConfirmationFn &&
        !closeConfirmationFn(this.steps[this.currentStep].status)
      ) {
        this.$emit("minimize");
      } else {
        clearSeriesStack(this.series);
        this.$emit("cancel");
      }
    },
    onNewSeries({ errors, series }) {
      this.errors = [...this.errors, ...errors];
      this.$emit("new-series-loaded");
      // Check if series are new or merge same series
      series.forEach(s => {
        const index = this.series.findIndex(
          _s => _s.larvitarSeriesInstanceUID == s.larvitarSeriesInstanceUID
        );
        if (index >= 0) {
          // merge information
          this.$set(this.series, index, mergeSeries(this.series[index], s));
        } else {
          this.$set(this.series, this.series.length, s);
          this.$set(this.selectedSeries, this.selectedSeries.length, {
            larvitarSeriesInstanceUID: s.larvitarSeriesInstanceUID
          });
        }
      });

      this.currentStep++;
    },
    onSelectAction(action) {
      this.selectedAction = action;
      this.onAction();
    },
    onSelectSeries(event) {
      if (event.items) {
        event.items.forEach(item =>
          this.onSelectSeries({ item, value: event.value })
        );
        return;
      }

      if (event.value) {
        const found = this.selectedSeries.find(
          v =>
            v.larvitarSeriesInstanceUID === event.item.larvitarSeriesInstanceUID
        );
        if (!found) {
          this.selectedSeries.push({
            larvitarSeriesInstanceUID: event.item.larvitarSeriesInstanceUID
          });
        }
      } else {
        this.selectedSeries = this.selectedSeries.filter(
          v =>
            v.larvitarSeriesInstanceUID !== event.item.larvitarSeriesInstanceUID
        );
      }
    },
    onRestart() {
      clearSeriesStack(this.series);
      this.series = [];
      this.selectedSeries = [];
      this.currentStep = 0;
    },
    onAnonimyzeAll(studyUID) {
      this.series = this.series.map(item => {
        if (item.studyUID === studyUID) {
          return {
            ...item,
            anonymized: true
          };
        }
        return item;
      });
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

.dark-header {
  background-color: #1e1e1e;
  color: white;
}
.selected-action {
  background: rgba(var(--v-primary-rgb), 0.12);
}

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
