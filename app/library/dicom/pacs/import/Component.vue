<template>
  <div class="step-wrapper">
    <div
      class="step-header d-flex"
      :class="{ 'dark-header': dark }"
      v-relative-height="'contentHeight'"
    >
      <div
        class="d-flex flex-wrap flex-grow-1 align-center"
        :class="{
          'py-2': $vuetify.breakpoint.smAndDown,
          'dark-header': dark
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
          <v-icon class="pl-3" :color="dark ? 'white' : 'black'">{{
            icon
          }}</v-icon>
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
            :dark="dark"
            class="d-none d-sm-flex"
            :disabled="!steps[currentStep].back(steps[currentStep].status)"
            text
            @click="currentStep--"
          >
            <v-icon>mdi-chevron-left</v-icon>
            <span class="pr-2">back</span>
          </v-btn>

          <v-btn
            v-if="steps[currentStep].action"
            color="primary"
            :dark="dark"
            :disabled="
              steps[currentStep].action.disabled(
                selectedData,
                steps[currentStep].status
              )
            "
            @click="onAction()"
          >
            {{ steps[currentStep].action.text }}
            <v-icon :dark="dark" v-if="steps[currentStep].next(data)">
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </div>
      </div>

      <v-divider
        :dark="dark"
        :class="{ 'px-2': !$vuetify.breakpoint.smAndDown }"
        vertical
      />

      <modal-controllers
        :dark="dark"
        class="flex-shrink-0 align-self-center"
        @cancel="onCancel"
        @minimize="$emit('minimize')"
      />
    </div>

    <div
      :class="['step-content', `step-${currentStep + 1}`]"
      :style="{ height: contentHeight, backgroundColor: dark ? '#1e1e1e' : '' }"
    >
      <component
        :is="`import-step-${currentStep + 1}`"
        class="h-100"
        :headers="getFields()"
        :disclaimer="disclaimer"
        :data="data"
        :dark="dark"
        :form="queryParametersForm"
        :modalities="options.modalities"
        :query-results-key="queryResultsKey"
        ref="step"
        :selected-data="selectedData"
        :step="steps[currentStep]"
        v-model="selectedModality"
        @select-data="onSelectData"
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
import { getHeaders, getQueryResultsKey, getSteps } from "./options";
import { getDisclaimer } from "../../import/options";
import RelativeHeight from "../../../relative-height";
import ModalControllers from "../../import/ModalControllers";

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
    label: { default: "pacs-import.query-retrieve", type: String },
    options: { default: () => ({}), type: Object },
    dark: { default: false, type: Boolean }
  },
  data() {
    const headers = getHeaders().map(h => ({
      ...h,
      text: h.text ? this.$t(`pacs-import.${h.text}`) : h.text
    }));

    return {
      contentHeight: "100%",
      currentStep: 0,
      headers: headers,
      disclaimer: getDisclaimer(this.options),
      data: [],
      queryParametersForm: {},
      queryResultsKey: getQueryResultsKey(this.options),
      retrievedData: [],
      selectedData: [],
      selectedModality: null,
      steps: getSteps()
    };
  },
  methods: {
    onAction() {
      switch (this.currentStep) {
        case 0: {
          this.selectedData = [];

          const aetForm = this.$refs.step && this.$refs.step.$refs.aetForm;
          const isValid = aetForm && aetForm.validate();
          if (isValid) {
            this.query();
          }
          break;
        }

        case 1: {
          this.currentStep++;
          this.startRetrieve();
          break;
        }

        case 2: {
          this.$emit("pacs-retrieve-open", this.retrievedData);
          this.$emit("cancel");
          break;
        }

        default:
          break;
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
        this.$emit("cancel");
      }
    },
    onSelectData(event) {
      if (event.items) {
        event.items.forEach(item =>
          this.onSelectData({ item, value: event.value })
        );
        return;
      }

      if (event.value) {
        const found = this.selectedData.find(
          v => v[this.queryResultsKey] === event.item[this.queryResultsKey]
        );
        if (!found) {
          this.selectedData.push(event.item);
        }
      } else {
        this.selectedData = this.selectedData.filter(
          v => v[this.queryResultsKey] !== event.item[this.queryResultsKey]
        );
      }
    },
    onQueryResults(data) {
      this.data = data;
      this.currentStep++;
    },
    async startRetrieve() {
      // init status
      const step = this.steps[this.currentStep];
      step.status.completed = false;
      step.status.loading = true;
      step.status.errors = {};
      step.status.progress = {};

      // init queue
      const queue = [...this.selectedData];

      const next = async () => {
        if (!queue.length) {
          step.status.completed = true;
          step.status.loading = false;
          this.$emit("pacs-retrieve-complete", this.retrievedData);
          return;
        }
        const retrieveItem = queue.shift();
        this.$set(step.status.progress, retrieveItem[this.queryResultsKey], 0);
        try {
          const retrieveFn = this.options.api.retrieve;
          const retrievedStudy = await retrieveFn(
            this.selectedModality,
            retrieveItem
          );
          this.retrievedData.push(retrievedStudy);
          this.$set(
            step.status.progress,
            retrieveItem[this.queryResultsKey],
            100
          );
        } catch (errorResponse) {
          this.$set(
            step.status.errors,
            retrieveItem[this.queryResultsKey],
            `Retrieve failed: ${errorResponse.statusText} (${errorResponse.status}): ${errorResponse.bodyText}`
          );
        } finally {
          next();
        }
      };

      next();
    },
    async query() {
      this.steps[this.currentStep].status.loading = true;
      this.steps[this.currentStep].status.error = null;

      try {
        const echoFn = this.options.api.echo;
        await echoFn(this.selectedModality);
      } catch (error) {
        this.steps[this.currentStep].status.loading = false;
        this.steps[this.currentStep].status.error = `Echo failed: ${error}.`;
        return;
      }

      let qData, qError;
      try {
        const queryFn = this.options.api.query;
        qData = await queryFn(this.selectedModality, this.queryParametersForm);
      } catch (error) {
        qError = `Query failed: ${error}.`;
        this.steps[this.currentStep].status.error = qError;
      } finally {
        this.steps[this.currentStep].status.loading = false;
      }

      if (!qError) {
        if (qData && qData.length) {
          this.onQueryResults(qData);
        } else {
          this.steps[this.currentStep].status.error = "No query results";
        }
      }
    },
    getFields() {
      // Second step on result table
      if (this.currentStep === 1) {
        const fieldsStep2 = getHeaders().map(h => ({
          ...h,
          text: h.text ? this.$t(`pacs-import.${h.text}`) : h.text
        }));
        // Removes query level from table headers
        const queryLevelIdx = fieldsStep2.findIndex(
          h => h.text == "Query Level"
        );
        if (queryLevelIdx >= 0) {
          fieldsStep2.splice(queryLevelIdx, 1);
        }
        // Removes series description table header if Pacs Query is by study
        if (this.queryParametersForm.QueryLevel !== "Series") {
          const seriesDescrIdx = fieldsStep2.findIndex(
            h => h.text == "series description"
          );
          if (seriesDescrIdx >= 0) {
            fieldsStep2.splice(seriesDescrIdx, 1);
          }
        }
        return fieldsStep2;
      }
      return this.headers;
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
}

::v-deep th {
  white-space: nowrap;
}

::v-deep td.cell-PatientName {
  // width: 200px;
}
</style>
